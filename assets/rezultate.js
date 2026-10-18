/* ============================================================
   REZULTATE — pagina /rezultate/ (#page-rezultate) și blocul scurt de pe
   Home (#homeRez).

   Toate cifrele stau în obiectul REZULTATE de mai jos. În HTML aceleași
   cifre sunt scrise și ca text de rezervă (pentru cine n-are JS și pentru
   motoarele de căutare), dar la încărcare JS le rescrie din REZULTATE — deci
   când vin date noi, se schimbă doar aici.

   Legătura cu HTML:
   - data-rez="cale"      → textul elementului devine valoarea de la „cale”
                            (ex. "instagram.cont"; numerele ies cu punct: 14.344);
   - data-rez-num="cale"  → la fel, dar cifra urcă de la 0 când intră în ecran;
                            data-suffix="%" adaugă un sufix.
   Căile care încep cu „calc.” sunt valori calculate mai jos din REZULTATE.

   Reguli pentru date:
   - numerele se scriu simplu, fără puncte: 14344, nu 14.344;
   - tot ce e aici trebuie să vină din capturi reale (Instagram Insights,
     profilul TikTok). Ce nu avem, nu inventăm — se scoate din pagină.
   ============================================================ */
const REZULTATE = {
  client: 'La Paninoteca',
  descriere: 'sandwich shop, București',
  perioada: 'octombrie 2026',
  durata: '2 săptămâni',              // „Studiu de caz · primele …”, „Primele … ” pe Home
  start: '2 octombrie 2026',          // ziua primului clip postat
  startScurt: '2 oct',

  instagram: {
    cont: 'paninoteca_bucuresti',
    // Insights, „ultimele 30 de zile”, citit pe 18 oct. Înainte de 2 oct
    // graficul e plat pe 0, deci totalul e practic tot ce s-a strâns de la start.
    interval: '18 sep – 17 oct',
    vizualizari: 14344,
    conturiAtinse: 3816,              // „Viewers” în Insights
    interactiuni: 322,
    urmaritoriNoi: 8,
    // Defalcarea pe formate, aceeași perioadă. Reels apare în aplicație ca „14K”.
    formate: [
      { nume: 'Reels', vizualizari: 14000, rotunjit: true },
      { nume: 'Postări', vizualizari: 293 },
      { nume: 'Stories', vizualizari: 39 }
    ],
    // Totalul pe 30 de zile, citit la date diferite (capturi din Insights).
    // `rotunjit`: aplicația a arătat doar „9,6K”.
    evolutie: [
      { data: '5 oct', vizualizari: 5999 },
      { data: '7 oct', vizualizari: 7152 },
      { data: '8 oct', vizualizari: 9600, rotunjit: true },
      { data: '17 oct', vizualizari: 14344 }
    ],
    crestere: '×2 în 10 zile'         // 7 oct: 7.152 → 17 oct: 14.344
  },

  tiktok: {
    cont: 'lapaninotecauniversitate',
    // Vizualizările fiecărui clip de pe profil (toate cele 6), 18 oct.
    clipuri: [820, 381, 7322, 1509, 1118, 1038],
    aprecieri: 415,
    urmaritori: 36
  }
};

(function rezultate() {
  'use strict';

  var page = document.getElementById('page-rezultate');
  var home = document.getElementById('homeRez');
  if (!page && !home) return;

  // Versiune fixă, ca un update al bibliotecii să nu schimbe graficele pe ascuns.
  var CHART_JS = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.js';

  // Albastrul site-ului; barele mai vechi sunt mai stinse, ultima e starea de acum.
  var C_BAR = '#3B82F6';
  var C_BAR_OLD = 'rgba(59,130,246,0.55)';
  var C_BAR_HOVER = '#60A5FA';
  var C_TEXT = 'rgba(255,255,255,0.88)';
  var C_MUTED = '#93B8F0';
  var C_GRID = 'rgba(255,255,255,0.06)';

  var COUNT_MS = 1600;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isPhone = function () { return window.matchMedia('(max-width: 768px)').matches; };
  var fmt = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 });
  var fmtDec = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 1 });

  // ─── VALORI CALCULATE ───
  var ig = REZULTATE.instagram;
  var tt = REZULTATE.tiktok;
  var reels = ig.formate.filter(function (f) { return f.nume === 'Reels'; })[0];
  var rounded = ig.evolutie.filter(function (p) { return p.rotunjit; });
  var CALC = {
    reels: reels ? reels.vizualizari : 0,
    reelsProcent: reels ? Math.round(reels.vizualizari / ig.vizualizari * 100) : 0,
    masuratori: ig.evolutie.length,
    tiktokClipuri: tt.clipuri.length,
    tiktokVizualizari: tt.clipuri.reduce(function (s, v) { return s + v; }, 0),
    tiktokTop: Math.max.apply(null, tt.clipuri),
    notaRotunjire: rounded.length
      ? ' Pe ' + rounded.map(function (p) { return p.data; }).join(', ') +
        ' Instagram afișează valoarea rotunjită (' + rounded.map(function (p) { return fmtDec.format(p.vizualizari / 1000) + 'K'; }).join(', ') + ').'
      : ''
  };

  function lookup(path) {
    var parts = path.split('.');
    var v = parts[0] === 'calc' ? CALC : REZULTATE;
    for (var i = parts[0] === 'calc' ? 1 : 0; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function show(v) { return typeof v === 'number' ? fmt.format(v) : v; }

  function fillTexts(root) {
    root.querySelectorAll('[data-rez]').forEach(function (el) {
      var v = lookup(el.dataset.rez);
      if (v != null) el.textContent = show(v);
    });
  }

  // ─── CIFRE CARE URCĂ ───
  function prepCounters(root) {
    var els = [].slice.call(root.querySelectorAll('[data-rez-num]'));
    els.forEach(function (el) {
      el._to = +lookup(el.dataset.rezNum) || 0;
      el._suf = el.dataset.suffix || '';
      el.textContent = fmt.format(reduceMotion ? el._to : 0) + el._suf;
    });
    return els;
  }
  function countUp(els) {
    if (reduceMotion) return;
    var t0 = 0;
    (function step(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / COUNT_MS, 1), e = 1 - Math.pow(1 - p, 3);
      els.forEach(function (el) { el.textContent = fmt.format(Math.round(el._to * e)) + el._suf; });
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  // ─── GRAFICUL CU BARE (aceeași funcție pe pagină și pe Home) ───
  var chartLib = null;
  function loadChartJs() {
    if (window.Chart) return Promise.resolve(window.Chart);
    if (chartLib) return chartLib;
    chartLib = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = CHART_JS;
      s.async = true;
      s.onload = function () { window.Chart ? resolve(window.Chart) : reject(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return chartLib;
  }

  function pointLabel(p) { return (p.rotunjit ? '~' : '') + fmt.format(p.vizualizari); }

  function chartAria(canvas) {
    canvas.setAttribute('aria-label', 'Vizualizări Instagram pe 30 de zile: ' +
      ig.evolutie.map(function (p) { return p.data + ' ' + pointLabel(p); }).join(', ') + '.');
  }

  function barChart(Chart, canvas, withAxis) {
    var last = ig.evolutie.length - 1;
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ig.evolutie.map(function (p) { return p.data; }),
        datasets: [{
          data: ig.evolutie.map(function (p) { return p.vizualizari; }),
          backgroundColor: function (c) { return c.dataIndex === last ? C_BAR : C_BAR_OLD; },
          hoverBackgroundColor: C_BAR_HOVER,
          borderRadius: { topLeft: 8, topRight: 8 },
          borderSkipped: 'bottom',
          maxBarThickness: 56,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 26 } },
        animation: reduceMotion ? false : {
          duration: 900,
          easing: 'easeOutQuart',
          delay: function (c) { return c.type === 'data' && c.mode === 'default' ? c.dataIndex * 150 + 250 : 0; }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: C_GRID },
            ticks: { color: C_MUTED, font: { family: '"DM Sans", sans-serif', size: 12 }, maxRotation: 0, autoSkip: false }
          },
          y: withAxis ? {
            beginAtZero: true,
            grid: { color: C_GRID },
            border: { display: false },
            ticks: { color: C_MUTED, maxTicksLimit: 5, font: { family: '"DM Sans", sans-serif', size: 11 }, callback: function (v) { return fmt.format(v); } }
          } : { display: false, beginAtZero: true }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(8,9,14,0.96)',
            borderColor: 'rgba(37,99,235,0.45)',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: C_TEXT,
            titleFont: { family: '"Syne", sans-serif', weight: '700', size: 13 },
            bodyFont: { family: '"DM Sans", sans-serif', size: 13 },
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              title: function (it) { return 'Pe 30 de zile, la ' + it[0].label; },
              label: function (it) {
                var p = ig.evolutie[it.dataIndex];
                return pointLabel(p) + ' vizualizări' + (p.rotunjit ? ' (rotunjit de Instagram)' : '');
              }
            }
          }
        }
      },
      // Valorile scrise deasupra barelor — sunt doar patru, deci încap toate.
      plugins: [{
        id: 'rezBarLabels',
        afterDatasetsDraw: function (chart) {
          var ctx = chart.ctx;
          ctx.save();
          ctx.font = '700 13px "DM Sans", sans-serif';
          ctx.fillStyle = C_TEXT;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          chart.getDatasetMeta(0).data.forEach(function (bar, i) {
            ctx.fillText(pointLabel(ig.evolutie[i]), bar.x, bar.y - 6);
          });
          ctx.restore();
        }
      }]
    });
  }

  function drawChart(canvas, withAxis) {
    loadChartJs().then(function (Chart) { barChart(Chart, canvas, withAxis); }, function () {
      var box = canvas.parentNode;
      box.innerHTML = '<p class="rez-chart-error">Graficul nu s-a putut încărca. Reîncarcă pagina.</p>';
    });
  }

  // ─── PORNIREA LA SCROLL ───
  // Pe desktop secțiunile inactive stau suprapuse în același loc, deci
  // observerul le-ar vedea „în ecran” și animațiile s-ar consuma pe ascuns.
  // Pornim doar când pagina lor e cea activă (pe telefon e mereu vizibilă).
  // Când pagina devine activă, geometria nu se schimbă și observerul nu mai
  // raportează nimic, deci re-observăm după ce panoul de tranziție s-a ridicat.
  function whenShown(el, cb) {
    if (!el) return;
    var pg = el.closest('.page');
    var visible = function () { return isPhone() || !pg || pg.classList.contains('active'); };
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      if (done || !entries.some(function (e) { return e.isIntersecting; }) || !visible()) return;
      done = true;
      io.disconnect();
      cb();
    }, { threshold: 0.2 });
    io.observe(el);
    if (pg) new MutationObserver(function () {
      if (!done && pg.classList.contains('active')) setTimeout(function () { io.unobserve(el); io.observe(el); }, 600);
    }).observe(pg, { attributes: true, attributeFilter: ['class'] });
  }

  // ─── PAGINA /rezultate/ ───
  if (page) {
    fillTexts(page);

    var noteRound = page.querySelector('[data-rez-nota]');
    if (noteRound) noteRound.textContent = CALC.notaRotunjire;

    // Barele pe formate se construiesc din `formate`; lățimea pornește de la 0.
    var split = page.querySelector('.rez-split');
    if (split) {
      split.innerHTML = ig.formate.map(function (f, i) {
        var pct = f.vizualizari / ig.vizualizari * 100;
        var pctTxt = pct >= 10 ? fmtDec.format(pct) : pct >= 1 ? fmt.format(pct) : fmtDec.format(pct);
        return '<div class="rez-split-row">' +
          '<span class="rez-split-name">' + f.nume + '</span>' +
          '<span class="rez-split-val">' + (f.rotunjit ? '~' : '') + fmt.format(f.vizualizari) + '<span>' + pctTxt + '%</span></span>' +
          '<div class="rez-split-track"><div class="rez-split-fill' + (i ? ' dim' : '') + '" data-w="' + Math.max(pct, 0.8) + '"></div></div>' +
          '</div>';
      }).join('');
    }

    var pageCanvas = page.querySelector('#rezBarChart');
    if (pageCanvas) chartAria(pageCanvas);

    var kpiNums = prepCounters(page.querySelector('.rez-kpis') || page);
    whenShown(page.querySelector('.rez-kpis'), function () { countUp(kpiNums); });

    var bigNums = prepCounters(page.querySelector('.rez-chart-split') || document.createElement('div'));
    whenShown(page.querySelector('.rez-charts'), function () {
      if (pageCanvas) drawChart(pageCanvas, true);
      countUp(bigNums);
      if (split) split.querySelectorAll('.rez-split-fill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });
    });
  }

  // ─── BLOCUL DE PE HOME ───
  // Pe telefon graficul e ascuns din CSS (secțiunea completă vine oricum mai
  // jos în scroll), deci nici nu cerem Chart.js acolo.
  if (home) {
    fillTexts(home);
    var homeCanvas = home.querySelector('#homeRezChart');
    if (homeCanvas) chartAria(homeCanvas);
    var homeNums = prepCounters(home);
    whenShown(home, function () {
      countUp(homeNums);
      if (homeCanvas && !isPhone()) drawChart(homeCanvas, false);
    });
  }
})();
