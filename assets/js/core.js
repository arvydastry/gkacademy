/* GK Academy demo · bendras scenarijus (visi puslapiai)
   Judesys: GSAP 3 + ScrollTrigger (assets/js/vendor). Viskas išjungiama su prefers-reduced-motion arba ?static=1.
   Perkeliant į XStore: judesio dalis tampa vienu child-theme scenarijumi; krepšelį, meniu, paiešką ir antraštės slėpimą pakeičia temos funkcijos. */
(function () {
  'use strict';

  var d = document;
  var root = d.documentElement;
  var STATIC = root.classList.contains('is-static');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);

  var GK = window.GK || { courses: [], cats: [], sessions: [], details: {}, deposit: 20, months: [] };

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function eur(v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function fold(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayIso() { var n = new Date(); return n.getFullYear() + '-' + pad(n.getMonth() + 1) + '-' + pad(n.getDate()); }
  function dateLabel(start, end) {
    var a = start.split('-'), b = (end || start).split('-');
    var m1 = GK.months[+a[1] - 1], m2 = GK.months[+b[1] - 1];
    if (start === (end || start)) return m1 + ' ' + (+a[2]) + ' d.';
    if (a[1] === b[1]) return m1 + ' ' + (+a[2]) + '–' + (+b[2]) + ' d.';
    return m1 + ' ' + (+a[2]) + ' d. – ' + m2 + ' ' + (+b[2]) + ' d.';
  }
  function icon(name) { return '<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>'; }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { /* privatus režimas: demo veikia be atminties */ }
    return val;
  }
  var courseById = {};
  GK.courses.forEach(function (c) { courseById[c.id] = c; });

  /* ------------------------------------------------------------ atsiradimas slenkant ir nuotraukų „pigmentas“ */
  var revealEls = $$('[data-split], [data-reveal]');
  var viewPhotos = $$('.ph[data-pigment="view"]');
  var hoverPhotos = $$('.ph[data-pigment="hover"]');
  if (STATIC || !('IntersectionObserver' in window)) {
    revealEls.concat(viewPhotos, hoverPhotos).forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    var ioPh = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); ioPh.unobserve(e.target); }
      });
    }, { threshold: 0.32 });
    viewPhotos.forEach(function (el) { ioPh.observe(el); });
    /* jutikliniuose ekranuose pelės nėra: „užvedimo“ nuotraukos nusispalvina ekrano viduryje */
    if (!FINE) {
      var ioMid = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.target.classList.toggle('is-in', e.isIntersecting); });
      }, { rootMargin: '-30% 0px -30% 0px' });
      hoverPhotos.forEach(function (el) { ioMid.observe(el); });
    }
  }

  /* ------------------------------------------------------------ užpildas nuo pelės taško (mygtukai, kortelės) */
  function setOrigin(e) {
    var b = e.target.closest && e.target.closest('.btn, .card');
    if (!b || b.contains(e.relatedTarget)) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty('--x', (e.clientX - r.left) + 'px');
    b.style.setProperty('--y', (e.clientY - r.top) + 'px');
  }
  d.addEventListener('pointerover', setOrigin);
  d.addEventListener('pointerout', setOrigin);

  /* ------------------------------------------------------------ pranešimas (demo nuorodos) */
  var toastEl = $('[data-toast]'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.hidden = true;
    toastEl.textContent = msg;
    void toastEl.offsetWidth;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 5200);
  }

  /* ------------------------------------------------------------ sluoksniai: krepšelis, meniu, paieška, užklausa, vaizdo įrašas */
  var scrim = $('[data-scrim]');
  var layer = null, lastFocus = null;
  function focusables(el) {
    return $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null || n === d.activeElement; });
  }
  function openLayer(name, opener) {
    var el = $('[data-layer="' + name + '"]');
    if (!el) return;
    if (layer) closeLayer(true);
    closeMega();
    lastFocus = opener || d.activeElement;
    el.hidden = false;
    if (scrim) scrim.hidden = (name === 'menu' || name === 'video');
    layer = el;
    root.classList.add('has-layer');
    if (header) header.classList.remove('is-hidden');
    if (name === 'video') mountVideo(el);
    var first = $('[data-search-input]', el) || $('[data-close]', el) || focusables(el)[0];
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
  }
  function closeLayer(silent) {
    if (!layer) return;
    var el = layer;
    layer = null;
    el.hidden = true;
    if (scrim) scrim.hidden = true;
    root.classList.remove('has-layer');
    if (el.getAttribute('data-layer') === 'video') { var v = $('[data-video]', el); if (v) v.innerHTML = ''; }
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function mountVideo(el) {
    var box = $('[data-video]', el);
    if (!box || box.firstChild) return;
    var f = d.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(box.getAttribute('data-video')) + '?autoplay=1&rel=0';
    f.title = 'GK Academy vaizdo pristatymas';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    box.appendChild(f);
  }
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (layer) { closeLayer(); return; }
      if (megaOpen) { closeMega(); megaBtn.focus(); }
      return;
    }
    if (e.key !== 'Tab' || !layer) return;
    var f = focusables(layer);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  if (scrim) scrim.addEventListener('click', function () { closeLayer(); });

  /* ------------------------------------------------------------ antraštė: slepiasi slenkant žemyn, grįžta slenkant aukštyn */
  var header = $('[data-header]');
  var lastY = window.pageYOffset;
  window.addEventListener('scroll', function () {
    var y = window.pageYOffset;
    if (!header || megaOpen || layer) { lastY = y; return; }
    if (y > lastY + 6 && y > 260) header.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 260) header.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  /* ------------------------------------------------------------ mega meniu */
  var megaBtn = $('[data-mega-toggle]'), mega = $('#mega'), megaOpen = false, megaTimer;
  function openMega() {
    if (!mega || megaOpen) return;
    megaOpen = true; mega.hidden = false; megaBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMega() {
    if (!mega || !megaOpen) return;
    megaOpen = false; mega.hidden = true; megaBtn.setAttribute('aria-expanded', 'false');
  }
  if (megaBtn && mega) {
    megaBtn.addEventListener('click', function () { megaOpen ? closeMega() : openMega(); });
    if (FINE) {
      var li = megaBtn.parentNode;
      [li, mega].forEach(function (el) {
        el.addEventListener('pointerenter', function () { clearTimeout(megaTimer); megaTimer = setTimeout(openMega, el === li ? 90 : 0); });
        el.addEventListener('pointerleave', function () { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 220); });
      });
    }
    d.addEventListener('click', function (e) {
      if (megaOpen && !mega.contains(e.target) && !megaBtn.contains(e.target)) closeMega();
    });
  }

  /* ------------------------------------------------------------ paspaudimai: sluoksniai, demo nuorodos, srities nuorodos, vidinės nuorodos */
  var onHome = d.body.classList.contains('page-home');
  if (!onHome) {
    $$('a[data-cat-link]').forEach(function (a) {
      var id = a.getAttribute('data-cat-link');
      a.setAttribute('href', 'index.html' + (id ? '?sritis=' + encodeURIComponent(id) : '') + '#katalogas');
    });
  }
  d.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;

    var demo = t.closest('[data-demo]');
    if (demo) { e.preventDefault(); toast(demo.getAttribute('data-demo')); return; }

    var opener = t.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      var name = opener.getAttribute('data-open');
      if (name === 'inquiry') setInquiry(opener.getAttribute('data-inquiry') || '');
      openLayer(name, opener);
      return;
    }

    if (t.closest('[data-close]')) {
      var keep = t.closest('a[href]');
      closeLayer(!!keep);
      if (!keep) { e.preventDefault(); return; }
    }

    var wish = t.closest('[data-wish]');
    if (wish) { e.preventDefault(); toggleWish(wish.getAttribute('data-wish')); return; }

    var del = t.closest('[data-cart-del]');
    if (del) { e.preventDefault(); cartRemove(del.getAttribute('data-cart-del')); return; }

    var catLink = t.closest('a[data-cat-link]');
    if (catLink && onHome && window.GKHome) {
      e.preventDefault();
      if (layer) closeLayer(true);
      closeMega();
      window.GKHome.setCat(catLink.getAttribute('data-cat-link'));
      scrollToId('katalogas');
      return;
    }

    var wishOpen = t.closest('[data-wish-open]');
    if (wishOpen) {
      var list = store('gk-wish') || [];
      if (!list.length) { e.preventDefault(); toast('Dar neįsiminėte nė vienos programos. Spauskite širdelę programos kortelėje.'); return; }
      if (onHome && window.GKHome) { e.preventDefault(); window.GKHome.showWished(); scrollToId('katalogas'); return; }
      wishOpen.setAttribute('href', 'index.html?isimintos=1#katalogas');
      return;
    }

    var a = t.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id || !d.getElementById(id)) return;
      e.preventDefault();
      if (layer) closeLayer(true);
      closeMega();
      scrollToId(id);
    }
  });
  function scrollToId(id) {
    var target = d.getElementById(id);
    if (!target) return;
    if (header) header.classList.remove('is-hidden');
    target.scrollIntoView({ behavior: STATIC ? 'auto' : 'smooth', block: 'start' });
    if (window.history && history.replaceState) history.replaceState(null, '', '#' + id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------ užklausos langas */
  var inquiryDefault = '';
  function setInquiry(topic) {
    var p = $('[data-inquiry-topic]'), f = $('[data-inquiry-field]');
    if (!p) return;
    if (!inquiryDefault) inquiryDefault = p.textContent;
    if (topic) p.innerHTML = 'Tema: <b>' + esc(topic) + '</b>. Parašykite, kokia data jums tiktų arba ko norėtumėte paklausti, ir mes atsakysime.';
    else p.textContent = inquiryDefault;
    if (f) f.value = topic;
    var form = p.parentNode.querySelector('form');
    if (form) { var ok = $('.form__ok', form); if (ok) ok.hidden = true; }
  }

  /* ------------------------------------------------------------ formos (demo: nieko nesiunčia) */
  $$('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      $$('.field, .check', form).forEach(function (wrap) {
        var input = $('input, textarea, select', wrap);
        var old = $('.field__err', wrap);
        if (old) old.remove();
        var msg = '';
        if (input.required && (input.type === 'checkbox' ? !input.checked : !input.value.trim())) msg = input.type === 'checkbox' ? 'Pažymėkite sutikimą.' : 'Užpildykite šį lauką.';
        else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) msg = 'Patikrinkite el. pašto adresą.';
        else if (input.type === 'tel' && input.value && input.value.replace(/\D/g, '').length < 8) msg = 'Patikrinkite telefono numerį.';
        wrap.classList.toggle('is-bad', !!msg);
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg) {
          if (input.type !== 'checkbox') {
            var s = d.createElement('span'); s.className = 'field__err'; s.textContent = msg; wrap.appendChild(s);
          }
          if (!bad) bad = input;
        }
      });
      var ok = $('.form__ok', form);
      if (bad) { bad.focus(); if (ok) ok.hidden = true; return; }
      form.reset();
      if (ok) { ok.hidden = false; ok.scrollIntoView({ block: 'nearest', behavior: STATIC ? 'auto' : 'smooth' }); }
    });
  });

  /* ------------------------------------------------------------ įsimintos programos */
  function wishList() { return store('gk-wish') || []; }
  function paintWish() {
    var list = wishList();
    $$('[data-wish]').forEach(function (b) {
      var on = list.indexOf(b.getAttribute('data-wish')) > -1;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var use = $('use', b);
      if (use) use.setAttribute('href', on ? '#i-heart-fill' : '#i-heart');
    });
    $$('[data-wish-count]').forEach(function (n) { n.textContent = list.length; n.hidden = !list.length; });
  }
  function toggleWish(id) {
    var list = wishList(), i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    store('gk-wish', list);
    paintWish();
    d.dispatchEvent(new CustomEvent('gk:wish'));
  }
  paintWish();

  /* ------------------------------------------------------------ krepšelis (demo maketas: naršyklės atmintis) */
  function cartItems() { return store('gk-cart') || []; }
  function cartRender() {
    var items = cartItems();
    var body = $('[data-cart-body]'), foot = $('[data-cart-foot]');
    $$('[data-cart-count]').forEach(function (n) { n.textContent = items.length; n.hidden = !items.length; });
    if (!body) return;
    if (!items.length) {
      body.innerHTML = '<div class="cart-empty"><p>Rezervacijų dar nėra. Pasirinkite programą, datą ir mokėjimo būdą.</p><a class="btn" href="' + (onHome ? '' : 'index.html') + '#katalogas" data-close>Rinktis mokymus' + icon('arrow-right') + '</a></div>';
      if (foot) foot.hidden = true;
      return;
    }
    var now = 0, rest = 0;
    body.innerHTML = items.map(function (it) {
      now += it.now; rest += it.price - it.now;
      return '<div class="cart-item"><h3>' + esc(it.title) + '</h3><ul><li>' + esc(it.optLabel) + ' · ' + esc(it.fmtLabel) + '</li><li>' + esc(it.dateLabel) + '</li><li>' +
        (it.pay === 'dep' ? 'Avansas ' + GK.deposit + ' %, likusi suma iki mokymų pradžios' : 'Mokama visa suma') + '</li></ul>' +
        '<p class="cart-item__p"><span>Mokymų kaina</span><span>' + eur(it.price) + '</span></p>' +
        '<button class="cart-item__x" type="button" data-cart-del="' + esc(it.key) + '" aria-label="Pašalinti rezervaciją: ' + esc(it.title) + '">' + icon('trash') + '</button></div>';
    }).join('');
    if (foot) {
      foot.hidden = false;
      $('[data-cart-now]', foot).textContent = eur(now);
      $('[data-cart-rest]', foot).textContent = eur(rest);
      $('[data-cart-rest]', foot).parentNode.hidden = rest <= 0;
    }
  }
  function cartAdd(item) {
    var items = cartItems().filter(function (i) { return i.key !== item.key; });
    items.push(item);
    store('gk-cart', items);
    cartRender();
  }
  function cartRemove(key) {
    store('gk-cart', cartItems().filter(function (i) { return i.key !== key; }));
    cartRender();
  }
  cartRender();

  /* ------------------------------------------------------------ paieška */
  var searchInput = $('[data-search-input]'), searchList = $('[data-search-list]'), searchHint = $('[data-search-hint]');
  if (searchInput && searchList) {
    var hint0 = searchHint ? searchHint.textContent : '';
    var run = function () {
      var q = fold(searchInput.value.trim());
      if (q.length < 2) { searchList.innerHTML = ''; if (searchHint) searchHint.textContent = hint0; return; }
      var hits = GK.courses.filter(function (c) { return fold(c.title + ' ' + c.catName).indexOf(q) > -1; }).slice(0, 8);
      if (searchHint) searchHint.textContent = hits.length ? 'Rasta programų: ' + hits.length + (hits.length === 8 ? ' (rodomos pirmos aštuonios)' : '') : 'Nieko neradome. Pabandykite kitą žodį arba parašykite mums.';
      searchList.innerHTML = hits.map(function (c) {
        var link = c.page ? ' href="' + c.page + '"' : ' href="#" data-demo="Šios programos puslapis bus sukurtas patvirtinus projektą."';
        return '<li><a' + link + '><b>' + esc(c.title) + '</b><small>' + esc(c.catName) + ' · ' + esc(c.dur) + '</small><span>' + (c.single ? '' : 'nuo ') + eur(c.price) + '</span></a></li>';
      }).join('');
    };
    searchInput.addEventListener('input', run);
    $('[data-search-form]').addEventListener('submit', function (e) { e.preventDefault(); var a = $('a', searchList); if (a) a.focus(); });
  }

  /* ------------------------------------------------------------ paralaksas: [data-speed] (procentais nuo elemento aukščio) */
  if (hasGsap && !STATIC) {
    $$('[data-speed]').forEach(function (el) {
      var s = parseFloat(el.getAttribute('data-speed')) || 0;
      if (!s) return;
      window.gsap.fromTo(el, { yPercent: s }, {
        yPercent: -s, ease: 'none',
        scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* tamsi scena: įslenka su paraštėmis ir išsiplečia iki ekrano kraštų */
    $$('[data-scene]').forEach(function (sec) {
      var panel = $('[data-scene-panel]', sec);
      if (!panel) return;
      var inset = Math.max(16, Math.min(72, window.innerWidth * 0.045));
      window.gsap.fromTo(panel, { '--inset': inset + 'px' }, {
        '--inset': '0px', ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top 96%', end: 'top 30%', scrub: true }
      });
    });

    /* po nuotraukų įkėlimo perskaičiuoti slinkimo taškus */
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }

  /* ------------------------------------------------------------ faktų juosta: greitėja slenkant */
  var track = $('.marquee__track');
  if (track && !STATIC && track.getAnimations) {
    var rate = 1, target = 1, lastScroll = window.pageYOffset, anim = null, ticking = false;
    var tick = function () {
      rate += (target - rate) * 0.12;
      target += (1 - target) * 0.08;
      if (!anim) anim = track.getAnimations()[0];
      if (anim) anim.playbackRate = rate;
      if (Math.abs(rate - 1) > 0.02 || Math.abs(target - 1) > 0.02) requestAnimationFrame(tick); else { ticking = false; if (anim) anim.playbackRate = 1; }
    };
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset, v = Math.abs(y - lastScroll);
      lastScroll = y;
      target = Math.min(6, 1 + v / 14);
      if (!ticking) { ticking = true; requestAnimationFrame(tick); }
    }, { passive: true });
  }

  window.GKU = {
    $: $, $$: $$, eur: eur, esc: esc, fold: fold, icon: icon, store: store, STATIC: STATIC, FINE: FINE, hasGsap: hasGsap,
    todayIso: todayIso, dateLabel: dateLabel, toast: toast, openLayer: openLayer, closeLayer: closeLayer, scrollToId: scrollToId,
    setInquiry: setInquiry, courseById: courseById, wishList: wishList
  };
  window.GKCart = { add: cartAdd, items: cartItems };
  window.GKReady = true;
})();
