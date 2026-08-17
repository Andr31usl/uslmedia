/* ===== FLOATERS — INJECTOR =====
   Decorul se injectează din JS, nu din markup. Motivul e simplu: aceleași
   secțiuni sunt copiate în șase fișiere HTML (index + /despre, /servicii,
   /portofoliu, /pachete, /contact), iar zeci de <span>-uri decorative în
   fiecare ar însemna sute de linii duplicate, imposibil de ținut în sincron.
   Aici e o singură hartă: selector -> ce plutește în secțiunea aia.

   Decorul e pur ornamental, deci lipsa lui fără JS nu strică nimic. Stratul
   e aria-hidden și pointer-events: none, ca să nu ajungă nici la cititoarele
   de ecran, nici în calea clicurilor.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* Prescurtări, ca harta de mai jos să rămână citibilă:
     c = clasele formei, x/y = poziția, s = mărimea, d = durata animației,
     w = întârzierea, o = opacitatea. Al optulea argument, opțional, e un
     obiect cu restul variabilelor CSS (dx, dy, blur, glow, rot ...).
     `speed` e per secțiune, nu per formă — vezi parallax-ul de mai jos. */
  function f(c, x, y, s, d, w, o, extra) {
    var o2 = { c: c, x: x, y: y, s: s, d: d, w: w, o: o };
    if (extra) { for (var k in extra) { o2[k] = extra[k]; } }
    return o2;
  }

  /* Câte forme „mici" (nu pete difuze) rezistă pe secțiune înainte să devină
     zgomot. Pe telefon, zero — CSS-ul le ascunde oricum. */
  var MAX_SHAPES = isMobile ? 0 : 99;

  var PRESETS = [
    /* ── HOME ─────────────────────────────────────────────────────── */
    {
      sel: '.home-hero',
      speed: 0.1,
      items: [
        f('fl-glow', '-6%', '-8%', '380px', '22s', '0s', 1, { dx: '70px', dy: '45px' }),
        f('fl-glow fl-glow-deep', '104%', '108%', '320px', '27s', '0s', 1, { dx: '-55px', dy: '-40px' }),
        f('fl-ring', '95%', '18%', '118px', '19s', '0s', 1),
        f('fl-square', '5%', '78%', '72px', '23s', '0s', 1),
        f('fl-play', '7%', '26%', '46px', '26s', '0s', 1),
        f('fl-dot', '13%', '34%', '5px', '11s', '0s', 0.95),
        f('fl-dot', '86%', '70%', '5px', '14s', '1.5s', 0.95),
        f('fl-dot', '32%', '8%', '5px', '16s', '3s', 0.95)
      ]
    },
    {
      sel: '.home-stats',
      speed: 0.09,
      items: [
        f('fl-glow fl-glow-soft', '18%', '50%', '300px', '30s', '0s', 1, { dx: '50px', dy: '-30px', blur: '80px' }),
        f('fl-line', '78%', '22%', '180px', '9s', '0.4s', 0.5, { rot: '-12deg' }),
        f('fl-plus', '92%', '72%', '18px', '10s', '1s', 0.7)
      ]
    },
    {
      sel: '.testimoniale-section',
      speed: 0.08,
      items: [
        f('fl-glow', '90%', '10%', '340px', '25s', '0s', 1, { glow: 0.22, dx: '-60px', dy: '50px' }),
        f('fl-ring fl-ring-dashed', '6%', '20%', '150px', '58s', '0s', 0.55),
        f('fl-grid', '88%', '82%', '170px', '13s', '0.6s', 0.6),
        f('fl-dot', '50%', '4%', '5px', '12s', '0.8s', 0.8)
      ]
    },

    /* ── DESPRE ───────────────────────────────────────────────────── */
    {
      sel: '.despre-wrap',
      speed: 0.09,
      items: [
        f('fl-glow', '-4%', '6%', '360px', '24s', '0s', 1, { glow: 0.26, dx: '60px', dy: '60px' }),
        f('fl-glow fl-glow-deep', '102%', '40%', '300px', '29s', '0s', 1, { dx: '-45px', dy: '-55px' }),
        f('fl-corner', '92%', '9%', '54px', '21s', '0s', 0.75),
        f('fl-hex', '7%', '52%', '64px', '25s', '1s', 0.7),
        f('fl-dot', '95%', '62%', '5px', '13s', '0.5s', 0.85)
      ]
    },
    {
      sel: '.journey-section',
      speed: 0.08,
      items: [
        f('fl-glow fl-glow-soft', '8%', '30%', '280px', '31s', '0s', 1, { dx: '40px', dy: '70px' }),
        f('fl-line', '84%', '14%', '150px', '11s', '0.3s', 0.45, { rot: '18deg' }),
        f('fl-dot', '90%', '48%', '5px', '15s', '1.2s', 0.8)
      ]
    },
    {
      sel: '.cert-section',
      speed: 0.08,
      items: [
        f('fl-glow', '86%', '55%', '300px', '26s', '0s', 1, { glow: 0.2, dx: '-50px', dy: '-45px' }),
        f('fl-ring', '10%', '22%', '96px', '22s', '0s', 0.7),
        f('fl-plus', '78%', '12%', '18px', '9s', '0.6s', 0.7)
      ]
    },

    /* ── SERVICII ─────────────────────────────────────────────────── */
    {
      sel: '.servicii-wrap',
      speed: 0.09,
      items: [
        f('fl-glow', '-3%', '4%', '380px', '23s', '0s', 1, { glow: 0.28, dx: '65px', dy: '50px' }),
        f('fl-glow fl-glow-deep', '103%', '34%', '320px', '28s', '0s', 1, { dx: '-50px', dy: '-60px' }),
        f('fl-glow fl-glow-soft', '20%', '78%', '300px', '33s', '0s', 1, { dx: '55px', dy: '-40px' }),
        f('fl-play', '93%', '13%', '40px', '24s', '0s', 0.8),
        f('fl-square', '5%', '46%', '66px', '27s', '0.5s', 0.7),
        f('fl-ring fl-ring-dashed', '95%', '70%', '130px', '62s', '0s', 0.5),
        f('fl-dot', '12%', '22%', '5px', '12s', '0.4s', 0.85),
        f('fl-dot', '88%', '90%', '5px', '15s', '1.8s', 0.85)
      ]
    },

    /* ── PORTOFOLIU ───────────────────────────────────────────────── */
    {
      sel: '.porto-wrap',
      speed: 0.09,
      items: [
        f('fl-glow', '90%', '5%', '360px', '25s', '0s', 1, { glow: 0.26, dx: '-60px', dy: '55px' }),
        f('fl-glow fl-glow-deep', '-2%', '52%', '330px', '30s', '0s', 1, { dx: '55px', dy: '-45px' }),
        f('fl-corner', '6%', '10%', '58px', '20s', '0s', 0.75),
        f('fl-corner fl-corner-flip', '94%', '88%', '58px', '23s', '1s', 0.75),
        f('fl-play', '92%', '40%', '44px', '26s', '0.5s', 0.8),
        f('fl-dot', '8%', '72%', '5px', '13s', '0.7s', 0.85)
      ]
    },

    /* ── PACHETE ──────────────────────────────────────────────────── */
    {
      sel: '.preturi-wrap',
      speed: 0.09,
      items: [
        f('fl-glow', '-4%', '8%', '370px', '24s', '0s', 1, { glow: 0.3, dx: '60px', dy: '50px' }),
        f('fl-glow fl-glow-soft', '102%', '62%', '320px', '32s', '0s', 1, { dx: '-50px', dy: '-50px' }),
        f('fl-hex', '93%', '16%', '68px', '25s', '0s', 0.7),
        f('fl-square', '6%', '62%', '70px', '28s', '0.8s', 0.65),
        f('fl-grid', '12%', '20%', '160px', '14s', '0.5s', 0.55),
        f('fl-dot', '90%', '84%', '5px', '14s', '1.4s', 0.85)
      ]
    },

    /* ── FORMULARE ȘI CONTACT ─────────────────────────────────────── */
    {
      sel: '.contact-wrap',
      speed: 0.09,
      items: [
        f('fl-glow', '-5%', '10%', '340px', '26s', '0s', 1, { glow: 0.26, dx: '55px', dy: '45px' }),
        f('fl-glow fl-glow-deep', '104%', '58%', '300px', '31s', '0s', 1, { dx: '-45px', dy: '-50px' }),
        f('fl-ring', '92%', '12%', '104px', '21s', '0s', 0.65),
        f('fl-plus', '8%', '40%', '18px', '10s', '0.6s', 0.7),
        f('fl-dot', '95%', '76%', '5px', '13s', '1.1s', 0.8)
      ]
    },

    /* ── FOOTER ───────────────────────────────────────────────────── */
    {
      sel: '.page-footer',
      speed: 0.06,
      items: [
        f('fl-glow fl-glow-deep', '50%', '110%', '420px', '34s', '0s', 1, { glow: 0.45, dx: '40px', dy: '-30px', blur: '90px' }),
        f('fl-line', '20%', '8%', '200px', '12s', '0.2s', 0.4, { rot: '0deg' }),
        f('fl-dot', '80%', '18%', '5px', '15s', '0.9s', 0.7)
      ]
    }
  ];

  /* Un „glow" nu se numără la limita de forme mici: el e fundal, nu obiect. */
  function isGlow(item) { return item.c.indexOf('fl-glow') !== -1; }

  function buildLayer(spec) {
    var layer = document.createElement('div');
    layer.className = 'fl-layer';
    layer.setAttribute('aria-hidden', 'true');
    /* Inline, ca nicio regulă a secțiunii gazdă să nu poată readuce stratul în
       flux. z-index negativ = peste fundalul secțiunii, sub conținutul ei. */
    layer.style.cssText = 'position:absolute;inset:0;z-index:-1;';

    var shapes = 0;

    spec.items.forEach(function (item) {
      if (!isGlow(item)) {
        if (shapes >= MAX_SHAPES) { return; }
        shapes++;
      }
      var el = document.createElement('span');
      el.className = 'fl ' + item.c;
      var css = '--x:' + item.x + ';--y:' + item.y + ';--s:' + item.s +
                ';--dur:' + item.d + ';--delay:' + item.w + ';--op:' + item.o + ';';
      ['dx', 'dy', 'scale', 'blur', 'glow', 'stroke', 'fill', 'rot', 'turn', 'travel', 'gap'].forEach(function (k) {
        if (item[k] !== undefined) { css += '--' + k + ':' + item[k] + ';'; }
      });
      el.style.cssText = css;
      layer.appendChild(el);
    });

    return layer;
  }

  var layers = [];

  PRESETS.forEach(function (spec) {
    document.querySelectorAll(spec.sel).forEach(function (host) {
      if (host.querySelector(':scope > .fl-layer')) { return; }
      /* Hero-ul avea decorul scris de mână în markup (.hero-floaters). Îl scot
         aici, ca preview-ul și paginile încă nemigrate să nu arate două
         seturi de obiecte suprapuse. */
      host.querySelectorAll(':scope > .hero-floaters').forEach(function (old) { old.remove(); });
      if (getComputedStyle(host).position === 'static') { host.style.position = 'relative'; }
      host.classList.add('fl-host');
      var layer = buildLayer(spec);
      host.insertBefore(layer, host.firstChild);
      /* Parallax-ul stă pe strat, nu pe fiecare formă: o singură scriere de
         stil per secțiune la scroll, în loc de una per obiect. */
      layers.push({ el: layer, host: host, speed: spec.speed || 0, on: false });
    });
  });

  /* Fade-in după un frame, ca tranziția să aibă de unde porni. */
  requestAnimationFrame(function () {
    layers.forEach(function (l) { l.el.classList.add('fl-in'); });
  });

  if (reduced || !layers.length) { return; }

  /* Parallax. Mut doar straturile aflate în viewport — restul secțiunilor
     sunt oricum ascunse (site-ul ține toate paginile în DOM). */
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var rec = layers.find(function (l) { return l.host === entry.target; });
        if (rec) { rec.on = entry.isIntersecting; }
      });
      schedule();
    }, { rootMargin: '120px 0px' });
    layers.forEach(function (l) { io.observe(l.host); });
  } else {
    layers.forEach(function (l) { l.on = true; });
  }

  var ticking = false;
  function schedule() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(update);
  }
  function update() {
    ticking = false;
    var mid = window.innerHeight / 2;
    layers.forEach(function (l) {
      if (!l.on || !l.speed) { return; }
      var r = l.host.getBoundingClientRect();
      if (!r.height) { return; }
      /* Cât de departe e centrul secțiunii de centrul ecranului, înmulțit cu
         viteza. Rezultatul e mic (zeci de px) — decor, nu efect de carusel. */
      var delta = (mid - (r.top + r.height / 2)) * l.speed;
      l.el.style.setProperty('--fl-p', delta.toFixed(1) + 'px');
    });
  }

  /* Site-ul nu derulează fereastra: .page-wrapper e fixed, iar fiecare .page
     își are propriul overflow-y: auto. Un listener pe window nu s-ar declanșa
     niciodată, așa că urc din fiecare gazdă până la containerul care chiar
     derulează și mă abonez acolo. */
  function scrollParent(el) {
    var n = el.parentElement;
    while (n && n !== document.documentElement) {
      var oy = getComputedStyle(n).overflowY;
      if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') { return n; }
      n = n.parentElement;
    }
    return window;
  }

  var sources = [];
  layers.forEach(function (l) {
    var sp = scrollParent(l.host);
    if (sources.indexOf(sp) === -1) { sources.push(sp); }
  });
  sources.forEach(function (sp) {
    sp.addEventListener('scroll', schedule, { passive: true });
  });
  window.addEventListener('resize', schedule, { passive: true });
  update();
})();
