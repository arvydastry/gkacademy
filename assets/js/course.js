/* GK Academy demo · mokymų programos puslapis
   Galerija, registracijos blokas (formatas, programa, data, mokėjimas), programos skirtukai, lipni juosta.
   Perkeliant į XStore: registracijos bloką pakeičia WooCommerce variantų forma (XStore „Variation swatches“) ir avanso įskiepis,
   lipnią juostą – XStore „Sticky Cart“. Iš šio failo lieka galerijos ir skirtukų judesys. */
(function () {
  'use strict';
  var U = window.GKU;
  if (!U) return;
  var d = document, $ = U.$, $$ = U.$$, GK = window.GK;

  var pdp = $('[data-course-id]');
  if (!pdp) return;
  var id = pdp.getAttribute('data-course-id');
  var course = U.courseById[id];
  var detail = GK.details[id];

  /* ------------------------------------------------------------ galerija */
  var gallery = $('[data-gallery]');
  if (gallery) {
    var slides = $$('[data-slide]', gallery), thumbs = $$('[data-thumb]', gallery);
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        var i = t.getAttribute('data-thumb');
        slides.forEach(function (s) {
          var on = s.getAttribute('data-slide') === i;
          s.classList.toggle('is-on', on);
          if (on) { var ph = $('.ph', s); if (ph) ph.classList.add('is-in'); }
        });
        thumbs.forEach(function (x) { if (x === t) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
      });
    });
  }

  /* ------------------------------------------------------------ programos / technikų skirtukai tamsioje scenoje */
  var tabs = $$('[data-explore-tab]');
  if (tabs.length) {
    var panes = $$('[data-explore-pane]'), phs = $$('[data-explore-ph]');
    var select = function (i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panes.forEach(function (p, n) { p.hidden = n !== i; });
      phs.forEach(function (p, n) {
        p.classList.toggle('is-on', n === i);
        if (n === i) { var ph = $('.ph', p); if (ph) ph.classList.add('is-in'); }
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  }

  /* ------------------------------------------------------------ registracijos blokas */
  var form = $('[data-book]');
  if (!form || !detail) return;
  var steps = $$('.book__step', form);
  var groupDates = $('[data-dates-group]', form), indDates = $('[data-dates-ind]', form);
  var submit = $('[data-book-submit]', form);
  var submitLabel = submit.innerHTML;
  var bar = $('[data-buybar]');
  var reached = 0;                      /* iki kurio žingsnio lankytojas jau priėjo (linijos ilgis) */

  function val(name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function option(idOpt) { return detail.options.filter(function (o) { return o.id === idOpt; })[0] || detail.options[0]; }

  /* praėjusios datos slepiamos (demo gali būti peržiūrimas vėliau, nei surinktas) */
  var today = U.todayIso();
  $$('input[name="date"]', form).forEach(function (inp) {
    if (inp.value !== 'other' && (inp.getAttribute('data-end') || inp.value) < today) {
      inp.checked = false; inp.disabled = true; inp.closest('.opt').hidden = true;
    }
  });
  function firstOpenDate() {
    return $$('input[name="date"]', form).filter(function (i) { return !i.disabled && i.value !== 'other'; })[0];
  }
  if (!val('date')) { var f0 = firstOpenDate() || form.querySelector('input[name="date"][value="other"]'); if (f0) f0.checked = true; }

  /* nuoroda iš tvarkaraščio: mokymai-....html?data=2026-12-07 */
  var wanted = new URLSearchParams(location.search).get('data');
  if (wanted) {
    var w = form.querySelector('input[name="date"][value="' + wanted.replace(/[^0-9-]/g, '') + '"]');
    if (w && !w.disabled) { w.checked = true; reached = 2; }
  }

  function state() {
    var fmt = val('fmt') || (course.fmt.indexOf('g') > -1 ? 'g' : 'i');
    var opt = option(val('opt'));
    var price = fmt === 'g' ? opt.group : opt.ind;
    var date = fmt === 'g' ? val('date') : 'ind';
    var pay = val('pay') || 'dep';
    var now = pay === 'dep' ? Math.round(price * GK.deposit / 100) : price;
    return { fmt: fmt, opt: opt, price: price, date: date, pay: pay, now: now, rest: price - now };
  }
  function dateText(s) {
    if (s.fmt === 'i') return 'Data derinama individualiai';
    if (s.date === 'other' || !s.date) return 'Kita data: suderinsime individualiai';
    var inp = form.querySelector('input[name="date"][value="' + s.date + '"]');
    var multi = s.opt.days > 1 || (inp && inp.getAttribute('data-end') !== s.date);
    return (multi ? 'Pradžia ' : '') + U.dateLabel(s.date);
  }

  function paint() {
    var s = state();
    /* kainos prie programų priklauso nuo formato */
    detail.options.forEach(function (o) {
      var el = form.querySelector('[data-opt-price="' + o.id + '"]');
      if (el) el.textContent = U.eur(s.fmt === 'g' ? o.group : o.ind);
    });
    if (groupDates) groupDates.hidden = s.fmt !== 'g';
    if (indDates) indDates.hidden = s.fmt === 'g';
    $$('[data-date-prefix]', form).forEach(function (el) {
      var inp = el.closest('.opt').querySelector('input');
      el.textContent = (s.opt.days > 1 || inp.getAttribute('data-end') !== inp.value) ? 'Pradžia ' : '';
    });
    $('[data-pay-dep]', form).textContent = U.eur(Math.round(s.price * GK.deposit / 100));
    $('[data-pay-full]', form).textContent = U.eur(s.price);
    $('[data-total-now]', form).textContent = U.eur(s.now);
    $('[data-total-rest]', form).textContent = U.eur(s.rest);
    $('[data-total-rest-row]', form).hidden = s.pay !== 'dep';

    var needsInquiry = s.fmt === 'g' && s.date === 'other';
    submit.innerHTML = needsInquiry ? 'Paprašyti individualios datos' + U.icon('arrow-right') : submitLabel;

    /* linija: užpildyti taškai iki paskutinio pasiekto žingsnio */
    steps.forEach(function (st, i) { st.classList.toggle('is-done', i <= reached); });
    var line = $('.book__line', form), target = steps[Math.min(reached, steps.length - 1)];
    if (line && target) {
      var lr = line.getBoundingClientRect(), tr = target.getBoundingClientRect();
      var p = lr.height ? (tr.top - lr.top + 9) / lr.height : 1;
      $('[data-book-progress]', form).style.setProperty('--p', Math.max(0.02, Math.min(1, reached >= steps.length - 1 ? 1 : p)).toFixed(4));
    }

    if (bar) {
      $('[data-bar-sel]', bar).textContent = s.opt.label + ' · ' + (s.fmt === 'g' ? 'grupiniai' : 'individualūs') + ' · ' + dateText(s).toLowerCase();
      $('[data-bar-price]', bar).textContent = U.eur(s.now);
    }
  }

  form.addEventListener('change', function (e) {
    var st = e.target.closest('.book__step');
    if (st) reached = Math.max(reached, steps.indexOf(st));
    paint();
  });
  window.addEventListener('resize', paint);
  window.addEventListener('load', paint);
  paint();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = state();
    reached = steps.length - 1;
    paint();
    if (s.fmt === 'g' && s.date === 'other') {
      U.setInquiry(course.title + ' (' + s.opt.label.toLowerCase() + ', grupiniai mokymai): individuali data');
      U.openLayer('inquiry', submit);
      return;
    }
    window.GKCart.add({
      key: id + '|' + s.fmt + '|' + s.opt.id + '|' + s.date,
      course: id,
      title: course.title,
      fmt: s.fmt,
      fmtLabel: s.fmt === 'g' ? 'grupiniai mokymai' : 'individualūs mokymai',
      optLabel: s.opt.label + (s.opt.sub ? ' (' + s.opt.sub.charAt(0).toLowerCase() + s.opt.sub.slice(1) + ')' : ''),
      date: s.date,
      dateLabel: dateText(s),
      pay: s.pay,
      price: s.price,
      now: s.now
    });
    U.openLayer('cart', submit);
  });

  /* ------------------------------------------------------------ lipni juosta: rodoma, kai registracijos blokas lieka virš ekrano */
  if (bar && 'IntersectionObserver' in window) {
    bar.hidden = false;
    var past = false, nearEnd = false;
    var sync = function () { bar.classList.toggle('is-on', past && !nearEnd); };
    new IntersectionObserver(function (en) {
      var e = en[0];
      past = !e.isIntersecting && e.boundingClientRect.bottom < 0;
      sync();
    }, { threshold: 0 }).observe(form);
    var footer = $('.footer');
    if (footer) new IntersectionObserver(function (en) { nearEnd = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(footer);
  }
})();
