/* GK Academy demo · pradžios puslapis
   Greitoji paieška, sričių juosta, tvarkaraštis, katalogo filtrai, teiginio žodžiai, kelio linija.
   Perkeliant į XStore: filtrus ir tvarkaraštį pakeičia WooCommerce užklausos (Ajax filtrai, prekių variantai su datomis);
   iš šio failo lieka tik judesys (hero linija, sričių juostos eiga, teiginio žodžiai, kelio linija). */
(function () {
  'use strict';
  var U = window.GKU;
  if (!U) return;
  var d = document, $ = U.$, $$ = U.$$, GK = window.GK;
  var STATIC = U.STATIC;
  var today = U.todayIso();

  function plural(n, one, few, many) {
    if (n % 10 === 1 && n % 100 !== 11) return one;
    if (n % 10 >= 2 && n % 10 <= 9 && !(n % 100 >= 11 && n % 100 <= 19)) return few;
    return many;
  }
  function onFrame(fn) {
    var busy = false;
    return function () {
      if (busy) return;
      busy = true;
      requestAnimationFrame(function () { busy = false; fn(); });
    };
  }

  /* ------------------------------------------------------------ hero: antraštė, auksinė linija nuo žodžio „čia“ */
  var hero = $('[data-hero]');
  if (hero) {
    var grid = $('.hero__grid', hero), svg = $('[data-hero-path]', hero), dot = $('[data-path-start]', hero);
    var main = $('.hero__ph--main', hero), detail = $('.hero__ph--detail', hero);
    var drawPath = function (animate) {
      if (!svg || !dot || STATIC || window.innerWidth < 1000) return;
      var g = grid.getBoundingClientRect(), a = dot.getBoundingClientRect(), m = main.getBoundingClientRect(), dt = detail.getBoundingClientRect();
      var ax = a.left + a.width / 2 - g.left, ay = a.top + a.height / 2 - g.top;
      var bx = dt.left + dt.width * 0.5 - g.left, by = dt.top + dt.height * 0.45 - g.top;        /* už mažosios nuotraukos */
      var cx = m.left + m.width * 0.62 - g.left, cy = m.bottom + (g.bottom - m.bottom) * 0.55 - g.top; /* tarpe po didžiąja nuotrauka */
      var ex = g.width - 46, ey = g.height + 26;                                                  /* link mygtuko „Rasti mokymus“ */
      var w = bx - ax;
      var p = 'M' + ax.toFixed(1) + ' ' + ay.toFixed(1) +
        ' C' + (ax + w * 0.72).toFixed(1) + ' ' + ay.toFixed(1) + ' ' + (bx - w * 0.16).toFixed(1) + ' ' + (ay + (by - ay) * 0.1).toFixed(1) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) +
        ' S' + (cx - (cx - bx) * 0.5).toFixed(1) + ' ' + (cy + 4).toFixed(1) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) +
        ' S' + ex.toFixed(1) + ' ' + (cy + (ey - cy) * 0.2).toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      var path = svg.firstElementChild;
      path.setAttribute('d', p);
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      if (animate) {
        path.style.transition = 'none';
        path.style.strokeDashoffset = len;
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.65,0,.2,1)';
        path.style.strokeDashoffset = 0;
      } else {
        path.style.transition = 'none';
        path.style.strokeDashoffset = 0;
      }
    };
    /* linija matuojama tik tada, kai antraštės eilutės jau iškilusios (kitaip taško vieta būtų išmatuota su poslinkiu) */
    var drawn = false;
    var start = function () {
      hero.classList.add('is-in');
      $$('[data-reveal]', hero).forEach(function (el) { el.classList.add('is-in'); });
      setTimeout(function () { drawn = true; drawPath(true); }, STATIC ? 0 : 1500);
    };
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { requestAnimationFrame(start); }); else setTimeout(start, 120);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (drawn) drawPath(false); }, 160); });
    window.addEventListener('load', function () { if (drawn) drawPath(false); });

    /* „Artimiausi mokymai“ eilutė: pirma būsima data, kurioje dar yra vietų */
    var next = $('[data-hero-next]', hero);
    if (next) {
      var s = GK.sessions.filter(function (x) { return x.end >= today && x.left > 0; })[0];
      if (s) $('a', next).textContent = U.courseById[s.course].short + ', ' + U.dateLabel(s.start, s.end);
      else next.hidden = true;
    }
  }

  /* ------------------------------------------------------------ sritys: tempimas pele, rodyklės, eigos linija, vidinis paralaksas */
  var areas = $('[data-areas]');
  if (areas) {
    var prev = $('[data-areas-prev]'), nextB = $('[data-areas-next]'), bar = $('[data-areas-progress]');
    var imgs = $$('.area__ph img', areas);
    var update = onFrame(function () {
      var max = areas.scrollWidth - areas.clientWidth;
      var x = areas.scrollLeft;
      if (bar) bar.style.setProperty('--p', Math.min(1, (x + areas.clientWidth) / areas.scrollWidth).toFixed(4));
      if (prev) prev.disabled = x <= 2;
      if (nextB) nextB.disabled = x >= max - 2;
      if (!STATIC && U.FINE) {
        var mid = window.innerWidth / 2;
        imgs.forEach(function (img) {
          var r = img.parentNode.getBoundingClientRect();
          var k = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / mid));
          img.style.translate = (k * -4).toFixed(2) + '% 0';
          img.style.scale = '1.09';
        });
      }
    });
    areas.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    var step = function (dir) {
      var card = $('.area', areas);
      var w = card ? card.getBoundingClientRect().width + 24 : 320;
      areas.scrollBy({ left: dir * w * (window.innerWidth > 1100 ? 2 : 1), behavior: STATIC ? 'auto' : 'smooth' });
    };
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (nextB) nextB.addEventListener('click', function () { step(1); });
    areas.addEventListener('keydown', function (e) {
      if (e.target !== areas) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    /* tempimas pele (jutikliniuose ekranuose veikia įprastas slinkimas) */
    var down = false, sx = 0, sl = 0, moved = 0;
    areas.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; sx = e.clientX; sl = areas.scrollLeft; moved = 0;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) { areas.classList.add('is-drag'); areas.scrollLeft = sl - dx; }
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      setTimeout(function () { areas.classList.remove('is-drag'); }, 0);
    });
    areas.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    areas.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* ------------------------------------------------------------ tvarkaraštis: praėjusios datos slepiamos, mėnesio skirtukai, „rodyti daugiau“ */
  var datesList = $('[data-dates]');
  var PAGE_DATES = window.innerWidth < 720 ? 5 : 8;
  if (datesList) {
    var rows = $$('.date', datesList), tabs = $$('[data-dates-tab]'), moreD = $('[data-dates-more]'), emptyD = $('[data-dates-empty]');
    var month = '', all = false;
    var paintDates = function (animate) {
      var shown = 0, total = 0;
      rows.forEach(function (r) {
        var ok = r.getAttribute('data-end') >= today && (!month || r.getAttribute('data-month') === month);
        if (ok) total++;
        var vis = ok && (all || shown < PAGE_DATES);
        r.classList.toggle('is-out', !vis);
        r.classList.remove('is-enter');
        if (vis) {
          if (animate) { r.style.setProperty('--n', shown); void r.offsetWidth; r.classList.add('is-enter'); }
          shown++;
        }
      });
      if (moreD) { moreD.hidden = all || total <= PAGE_DATES; moreD.textContent = 'Rodyti visas datas (' + total + ')'; }
      if (emptyD) emptyD.hidden = total > 0;
    };
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        month = t.getAttribute('data-dates-tab'); all = false;
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        paintDates(true);
      });
    });
    if (moreD) moreD.addEventListener('click', function () { all = true; paintDates(false); });
    paintDates(false);
  }

  /* ------------------------------------------------------------ katalogas: filtrai, rikiavimas, „rodyti daugiau“, srities nuotrauka */
  var gridEl = $('[data-grid]');
  var PAGE_CARDS = window.innerWidth < 640 ? 6 : 12;
  if (gridEl) {
    var cards = $$('.card', gridEl);
    var original = cards.slice();
    var chips = $$('[data-chip]'), selects = $$('[data-f]'), clears = $$('[data-f-clear]');
    var countEl = $('[data-count]'), countWord = $('[data-count-word]'), emptyEl = $('[data-empty]'), moreEl = $('[data-more]');
    var sideName = $('[data-side-name]'), sideImgs = $$('[data-side-img]');
    var state = { cat: '', dur: '', fmt: '', aud: '', month: '', sort: '', wished: false };
    var limit = PAGE_CARDS;
    var catById = {};
    GK.cats.forEach(function (c) { catById[c.id] = c; });

    var sideCurrent = '', sideIdx = 0;
    var setSide = function (img, pos) {
      if (!sideImgs.length || img === sideCurrent) return;
      sideCurrent = img;
      var nextImg = sideImgs[1 - sideIdx], cur = sideImgs[sideIdx];
      var swap = function () {
        if (sideCurrent !== img) return;
        nextImg.style.objectPosition = pos || '50% 50%';
        nextImg.classList.add('is-on'); cur.classList.remove('is-on');
        sideIdx = 1 - sideIdx;
      };
      nextImg.onload = swap;
      nextImg.src = 'assets/img/photos/' + img + '.webp';
      if (nextImg.complete) swap();
    };
    var restoreSide = function () {
      var c = state.cat ? catById[state.cat] : GK.cats[0];
      setSide(c.img, c.pos);
    };
    if (sideImgs.length) { sideImgs[0].classList.add('is-on'); sideCurrent = GK.cats[0].img; sideImgs[0].style.objectPosition = GK.cats[0].pos; }

    var match = function (card) {
      if (state.cat && card.getAttribute('data-cat') !== state.cat) return false;
      if (state.aud && card.getAttribute('data-aud') !== state.aud) return false;
      if (state.fmt && card.getAttribute('data-fmt').split(' ').indexOf(state.fmt) < 0) return false;
      if (state.month && card.getAttribute('data-months').split(' ').indexOf(state.month) < 0) return false;
      if (state.wished && U.wishList().indexOf(card.getAttribute('data-course')) < 0) return false;
      if (state.dur) {
        var a = +card.getAttribute('data-dmin'), b = +card.getAttribute('data-dmax');
        if (state.dur === 's' && a > 1) return false;
        if (state.dur === 'm' && (b < 2 || a > 3)) return false;
        if (state.dur === 'l' && b < 4) return false;
      }
      return true;
    };
    var apply = function (animate) {
      var order = original.slice();
      if (state.sort === 'asc' || state.sort === 'desc') {
        order.sort(function (x, y) { var k = +x.getAttribute('data-price') - +y.getAttribute('data-price'); return state.sort === 'asc' ? k : -k; });
      } else if (state.sort === 'date') {
        order.sort(function (x, y) {
          var a = x.getAttribute('data-next') || '9999', b = y.getAttribute('data-next') || '9999';
          return a < b ? -1 : a > b ? 1 : 0;
        });
      }
      var total = 0, shown = 0;
      order.forEach(function (card) {
        gridEl.appendChild(card);
        var ok = match(card);
        if (ok) total++;
        var vis = ok && shown < limit;
        card.classList.toggle('is-out', !vis);
        card.classList.remove('is-enter');
        if (vis) {
          if (animate) { card.style.setProperty('--n', Math.min(shown, 11)); void card.offsetWidth; card.classList.add('is-enter'); }
          shown++;
        }
      });
      if (countEl) countEl.textContent = total;
      if (countWord) countWord.textContent = plural(total, 'programa', 'programos', 'programų');
      if (emptyEl) emptyEl.hidden = total > 0;
      if (moreEl) { moreEl.hidden = total <= limit; moreEl.textContent = 'Rodyti daugiau programų (' + (total - shown) + ')'; }
      var dirty = !!(state.cat || state.dur || state.fmt || state.aud || state.month || state.sort || state.wished);
      clears.forEach(function (b) { if (b.parentNode !== emptyEl) b.hidden = !dirty; });
      chips.forEach(function (c) {
        var on = c.getAttribute('data-chip') === state.cat && !state.wished;
        c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      selects.forEach(function (s) { s.value = state[s.getAttribute('data-f')]; });
      if (sideName) sideName.textContent = state.wished ? 'Įsimintos programos' : state.cat ? catById[state.cat].name : 'Visos sritys';
      restoreSide();
    };
    var set = function (patch, animate) {
      for (var k in patch) state[k] = patch[k];
      limit = PAGE_CARDS;
      apply(animate !== false);
    };

    chips.forEach(function (c) { c.addEventListener('click', function () { set({ cat: c.getAttribute('data-chip'), wished: false }); }); });
    selects.forEach(function (s) { s.addEventListener('change', function () { var p = {}; p[s.getAttribute('data-f')] = s.value; set(p); }); });
    clears.forEach(function (b) { b.addEventListener('click', function () { set({ cat: '', dur: '', fmt: '', aud: '', month: '', sort: '', wished: false }); }); });
    if (moreEl) moreEl.addEventListener('click', function () { limit += PAGE_CARDS; apply(false); });
    d.addEventListener('gk:wish', function () { if (state.wished) apply(false); });

    /* užvedus kortelę kairėje rodoma tos programos nuotrauka */
    if (U.FINE) {
      gridEl.addEventListener('pointerover', function (e) {
        var card = e.target.closest('.card');
        if (card && !card.contains(e.relatedTarget)) setSide(card.getAttribute('data-img'));
      });
      gridEl.addEventListener('pointerleave', restoreSide);
    }
    gridEl.addEventListener('focusin', function (e) { var card = e.target.closest('.card'); if (card) setSide(card.getAttribute('data-img')); });

    /* greitoji paieška po hero perduoda pasirinkimus filtrams */
    var finder = $('[data-finder]');
    if (finder) {
      finder.addEventListener('submit', function (e) {
        e.preventDefault();
        set({ cat: finder.elements.cat.value, month: finder.elements.month.value, fmt: finder.elements.fmt.value, wished: false });
        U.scrollToId('katalogas');
      });
    }

    window.GKHome = {
      setCat: function (id) { set({ cat: id || '', wished: false }); },
      showWished: function () { set({ cat: '', dur: '', fmt: '', aud: '', month: '', sort: '', wished: true }); }
    };

    /* nuorodos iš kitų puslapių: index.html?sritis=pmu#katalogas, ?isimintos=1 */
    var q = new URLSearchParams(location.search);
    if (q.get('isimintos')) window.GKHome.showWished();
    else if (q.get('sritis') && catById[q.get('sritis')]) set({ cat: q.get('sritis') }, false);
    else apply(false);
  }

  /* ------------------------------------------------------------ teiginys: žodžiai „nusidažo“ slenkant */
  var st = $('[data-words]');
  if (st && !STATIC) {
    var words = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = words.map(function (w) { return '<span class="sw" aria-hidden="true">' + U.esc(w) + '</span>'; }).join(' ');
    var sw = $$('.sw', st);
    var paintWords = onFrame(function () {
      var r = st.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.86 - r.top) / (vh * 0.5 + r.height * 0.4);
      var n = Math.round(Math.max(0, Math.min(1, p)) * sw.length);
      sw.forEach(function (el, i) { el.classList.toggle('is-on', i < n); });
    });
    window.addEventListener('scroll', paintWords, { passive: true });
    window.addEventListener('resize', paintWords);
    paintWords();
  }

  /* ------------------------------------------------------------ kelias: linija brėžiasi slenkant, žingsnio taškas užsipildo, kai linija jį pasiekia */
  var pathEl = $('[data-path]');
  if (pathEl) {
    var steps = $$('.path__step', pathEl);
    if (STATIC) {
      steps.forEach(function (s) { s.classList.add('is-on'); });
    } else {
      var paintPath = onFrame(function () {
        var r = pathEl.getBoundingClientRect(), vh = window.innerHeight;
        var vertical = window.innerWidth < 900;
        var p = vertical ? (vh * 0.7 - r.top) / r.height : (vh * 0.9 - r.top) / (vh * 0.5);
        p = Math.max(0, Math.min(1, p));
        pathEl.style.setProperty('--p', p.toFixed(4));
        steps.forEach(function (s, i) { s.classList.toggle('is-on', p > 0.01 && p >= i / steps.length + 0.005); });
      });
      window.addEventListener('scroll', paintPath, { passive: true });
      window.addEventListener('resize', paintPath);
      paintPath();
    }
  }
})();
