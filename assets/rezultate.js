/* ============================================================
   SECȚIUNEA „REZULTATE” (#page-rezultate)

   Toate cifrele stau în obiectul REZULTATE de mai jos. Ca să pui datele
   reale, schimbi doar valorile de aici — markup-ul, cardurile și graficele
   se construiesc singure din ele. Când cifrele sunt reale, pune
   `demonstrativ: false` și dispare eticheta „Date demonstrative”.

   Reguli pentru date:
   - numerele se scriu simplu, fără puncte: 12500, nu 12.500;
   - engagement-ul e în procente, cu zecimală cu punct: 4.8 (afișat „4,8%”);
   - `saptamanal` are câte o valoare pe săptămână, de la prima la ultima
     (13 valori pentru 3 luni; merge și cu 12);
   - `vanzariLunare` are 4 valori: luna dinainte de colaborare, apoi lunile 1–3;
   - o platformă se scoate ștergând-o din `platforme`; ordinea de aici e
     ordinea butoanelor.
   ============================================================ */
const REZULTATE = {
  demonstrativ: true,
  client: 'Cafenea de specialitate din București',
  perioada: 'Iulie – Septembrie 2026',

  // Etichetele de sub graficul cu bare (prima = luna dinainte de colaborare).
  luni: ['Iunie (înainte)', 'Iulie', 'August', 'Septembrie'],

  // Ce înseamnă „vânzări” în carduri și în graficul cu bare. Pentru venit:
  // { eticheta: 'Venit lunar', unitate: ' lei' }
  vanzari: { eticheta: 'Comenzi lunare', unitate: '' },

  platforme: {
    instagram: {
      nume: 'Instagram',
      kpi: {                       // [înainte, acum]
        vizualizari: [18500, 96400],   // vizualizări pe lună
        urmaritori:  [2340, 6870],
        engagement:  [1.9, 5.4],       // %
        vanzari:     [48, 152]         // pe lună
      },
      saptamanal: {
        urmaritori:  [2340, 2410, 2560, 2790, 3020, 3380, 3710, 4150, 4590, 5120, 5640, 6260, 6870],
        vizualizari: [4300, 4900, 6200, 7400, 8900, 10800, 12400, 14100, 15600, 17300, 19200, 20900, 22400]
      },
      vanzariLunare: [48, 79, 118, 152]
    },
    tiktok: {
      nume: 'TikTok',
      kpi: {
        vizualizari: [6200, 184000],
        urmaritori:  [410, 5320],
        engagement:  [3.1, 8.7],
        vanzari:     [9, 61]
      },
      saptamanal: {
        urmaritori:  [410, 520, 780, 1050, 1490, 1870, 2310, 2760, 3240, 3790, 4260, 4810, 5320],
        vizualizari: [1400, 3100, 6800, 11200, 15900, 19400, 24800, 28300, 31900, 35600, 38400, 41200, 42800]
      },
      vanzariLunare: [9, 22, 41, 61]
    },
    facebook: {
      nume: 'Facebook',
      kpi: {
        vizualizari: [9800, 31200],
        urmaritori:  [3150, 4080],
        engagement:  [0.9, 2.3],
        vanzari:     [21, 47]
      },
      saptamanal: {
        urmaritori:  [3150, 3180, 3240, 3300, 3390, 3460, 3550, 3630, 3720, 3810, 3890, 3990, 4080],
        vizualizari: [2300, 2500, 3000, 3400, 3900, 4500, 5000, 5500, 6000, 6400, 6800, 7000, 7300]
      },
      vanzariLunare: [21, 29, 38, 47]
    }
  }
};

(function rezultate() {
  'use strict';

  var section = document.getElementById('page-rezultate');
  if (!section) return;

  // Versiune fixă, ca un update al bibliotecii să nu schimbe graficele pe ascuns.
  var CHART_JS = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.js';

  // Culorile seriilor, verificate pentru contrast pe #08090E și pentru
  // daltonism: albastrul site-ului pentru vizualizări, teal pentru urmăritori
  // (plus linie întreruptă, ca seriile să nu se deosebească doar prin culoare).
  var C_VIEWS = '#3B82F6';
  var C_FOLLOW = '#0FA89A';
  var C_BEFORE = 'rgba(147,184,240,0.28)';
  var C_TEXT = 'rgba(255,255,255,0.85)';
  var C_MUTED = '#93B8F0';
  var C_GRID = 'rgba(255,255,255,0.06)';

  var COUNT_MS = 1600;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var fmtInt = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 });
  var fmtDec = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  var KPI_FORMAT = {
    vizualizari: function (v) { return fmtInt.format(v); },
    urmaritori:  function (v) { return fmtInt.format(v); },
    engagement:  function (v) { return fmtDec.format(v) + '%'; },
    vanzari:     function (v) { return fmtInt.format(v) + REZULTATE.vanzari.unitate; }
  };

  function growth(before, now) {
    return before ? Math.round((now - before) / before * 100) : 0;
  }
  function fmtGrowth(p) {
    return (p > 0 ? '+' : p < 0 ? '−' : '') + fmtInt.format(Math.abs(Math.round(p))) + '%';
  }

  var keys = Object.keys(REZULTATE.platforme);
  var current = keys[0];

  // ─── TEXTE FIXE ───
  section.querySelectorAll('[data-rez="client"]').forEach(function (el) { el.textContent = REZULTATE.client; });
  section.querySelectorAll('[data-rez="perioada"]').forEach(function (el) { el.textContent = REZULTATE.perioada; });
  section.querySelectorAll('[data-rez="vanzari-eticheta"]').forEach(function (el) { el.textContent = REZULTATE.vanzari.eticheta; });
  var demo = section.querySelector('[data-rez-demo]');
  if (demo) demo.hidden = !REZULTATE.demonstrativ;

  // ─── TABURI ───
  var tabs = section.querySelector('.rez-tabs');
  if (keys.length < 2) {
    tabs.hidden = true;
  } else {
    keys.forEach(function (key) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rez-tab';
      b.setAttribute('role', 'tab');
      b.dataset.platforma = key;
      b.textContent = REZULTATE.platforme[key].nume;
      b.addEventListener('click', function () { select(key); });
      tabs.appendChild(b);
    });
    // Săgețile stânga/dreapta mută selecția, ca la orice tablist.
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = keys.indexOf(current) + (e.key === 'ArrowRight' ? 1 : -1);
      var key = keys[(i + keys.length) % keys.length];
      select(key);
      tabs.querySelector('[data-platforma="' + key + '"]').focus();
      e.preventDefault();
    });
  }

  function syncTabs() {
    tabs.querySelectorAll('.rez-tab').forEach(function (b) {
      var on = b.dataset.platforma === current;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }

  // ─── CARDURI KPI ───
  // Fiecare număr își ține valoarea afișată, ca la schimbarea platformei să
  // urce/coboare de la cifra de acum, nu de la zero.
  var kpiCards = [].slice.call(section.querySelectorAll('.rez-kpi'));
  var shown = new Map();
  var kpisStarted = false;

  function tween(el, to, format) {
    var from = shown.has(el) ? shown.get(el) : 0;
    shown.set(el, to);
    if (el._raf) cancelAnimationFrame(el._raf);
    if (reduceMotion || from === to) { el.textContent = format(to); return; }
    var t0 = 0;
    (function step(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / COUNT_MS, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(from + (to - from) * eased);
      if (p < 1) el._raf = requestAnimationFrame(step);
    })(performance.now());
  }

  function paintKpis() {
    var data = REZULTATE.platforme[current].kpi;
    kpiCards.forEach(function (card) {
      var key = card.dataset.kpi;
      var pair = data[key];
      if (!pair) return;
      var format = KPI_FORMAT[key];
      var g = growth(pair[0], pair[1]);
      tween(card.querySelector('[data-val="inainte"]'), pair[0], format);
      tween(card.querySelector('[data-val="acum"]'), pair[1], format);
      tween(card.querySelector('[data-val="crestere"]'), g, fmtGrowth);
      var badge = card.querySelector('.rez-kpi-growth');
      badge.classList.toggle('down', g < 0);
      badge.querySelector('.rez-arrow').textContent = g < 0 ? '▼' : '▲';
    });
  }

  // ─── GRAFICE ───
  var lineChart = null;
  var barChart = null;
  var chartsStarted = false;
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

  function weekLabels(n) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push('Săpt. ' + i);
    return out;
  }

  // Urmăritorii și vizualizările au ordine de mărime diferite. În loc de
  // două axe Y (care se citesc greșit), ambele linii arată creșterea față de
  // prima săptămână; cifrele absolute apar în tooltip.
  function indexed(values) {
    var base = values[0] || 1;
    return values.map(function (v) { return Math.round((v / base - 1) * 1000) / 10; });
  }

  function lineData() {
    var w = REZULTATE.platforme[current].saptamanal;
    return { views: indexed(w.vizualizari), follow: indexed(w.urmaritori), raw: w };
  }

  function chartAria() {
    var p = REZULTATE.platforme[current];
    var w = p.saptamanal;
    lineCanvas.setAttribute('aria-label',
      p.nume + ': urmăritori de la ' + fmtInt.format(w.urmaritori[0]) + ' la ' + fmtInt.format(w.urmaritori[w.urmaritori.length - 1]) +
      ', vizualizări pe săptămână de la ' + fmtInt.format(w.vizualizari[0]) + ' la ' + fmtInt.format(w.vizualizari[w.vizualizari.length - 1]) + '.');
    barCanvas.setAttribute('aria-label',
      p.nume + ', ' + REZULTATE.vanzari.eticheta.toLowerCase() + ': ' + p.vanzariLunare.map(function (v, i) {
        return REZULTATE.luni[i] + ' ' + fmtInt.format(v) + REZULTATE.vanzari.unitate;
      }).join(', ') + '.');
  }

  var lineCanvas = section.querySelector('#rezLineChart');
  var barCanvas = section.querySelector('#rezBarChart');

  // Valorile scrise deasupra barelor — sunt doar patru, deci încap toate.
  var barLabels = {
    id: 'rezBarLabels',
    afterDatasetsDraw: function (chart) {
      var ctx = chart.ctx;
      var meta = chart.getDatasetMeta(0);
      ctx.save();
      ctx.font = '700 13px "DM Sans", sans-serif';
      ctx.fillStyle = C_TEXT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      meta.data.forEach(function (bar, i) {
        var v = chart.data.datasets[0].data[i];
        if (v == null) return;
        ctx.fillText(fmtInt.format(v), bar.x, bar.y - 6);
      });
      ctx.restore();
    }
  };

  function tooltipStyle() {
    return {
      backgroundColor: 'rgba(8,9,14,0.96)',
      borderColor: 'rgba(37,99,235,0.45)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: C_TEXT,
      titleFont: { family: '"Syne", sans-serif', weight: '700', size: 13 },
      bodyFont: { family: '"DM Sans", sans-serif', size: 13 },
      padding: 12,
      cornerRadius: 10,
      boxPadding: 4,
      usePointStyle: true
    };
  }

  function buildCharts(Chart) {
    Chart.defaults.font.family = '"DM Sans", sans-serif';
    Chart.defaults.color = C_MUTED;

    var d = lineData();
    var first = true;   // întârzierea pe puncte doar la prima desenare

    lineChart = new Chart(lineCanvas, {
      type: 'line',
      data: {
        labels: weekLabels(d.views.length),
        datasets: [
          {
            label: 'Vizualizări',
            data: d.views,
            borderColor: C_VIEWS,
            backgroundColor: 'rgba(59,130,246,0.12)',
            fill: 'origin',
            borderWidth: 2.5,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHitRadius: 18,
            pointBackgroundColor: C_VIEWS,
            pointBorderColor: '#08090E',
            pointBorderWidth: 2,
            pointStyle: 'circle'
          },
          {
            label: 'Urmăritori',
            data: d.follow,
            borderColor: C_FOLLOW,
            backgroundColor: C_FOLLOW,
            borderDash: [6, 4],
            borderWidth: 2.5,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHitRadius: 18,
            pointBackgroundColor: C_FOLLOW,
            pointBorderColor: '#08090E',
            pointBorderWidth: 2,
            pointStyle: 'rectRounded'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: reduceMotion ? false : {
          duration: 900,
          easing: 'easeOutQuart',
          // Punctele pornesc unul după altul, de la stânga la dreapta,
          // ca linia să pară că se desenează.
          delay: function (ctx) {
            return first && ctx.type === 'data' ? ctx.dataIndex * 90 + ctx.datasetIndex * 150 : 0;
          },
          onComplete: function () { first = false; }
        },
        animations: reduceMotion ? {} : {
          y: { from: function (ctx) { return ctx.chart.scales && ctx.chart.scales.y ? ctx.chart.scales.y.getPixelForValue(0) : undefined; } }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: C_GRID },
            ticks: { maxRotation: 0, autoSkip: true, autoSkipPadding: 14, font: { size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: C_GRID },
            border: { display: false },
            ticks: {
              maxTicksLimit: 5,
              font: { size: 11 },
              callback: function (v) { return (v > 0 ? '+' : '') + fmtInt.format(v) + '%'; }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 16, color: C_TEXT, font: { size: 12, weight: '600' } }
          },
          tooltip: Object.assign(tooltipStyle(), {
            callbacks: {
              label: function (item) {
                var raw = lineData().raw;
                var series = item.datasetIndex === 0 ? raw.vizualizari : raw.urmaritori;
                var name = item.datasetIndex === 0 ? 'Vizualizări' : 'Urmăritori';
                return ' ' + name + ': ' + fmtInt.format(series[item.dataIndex]) + '  (' + fmtGrowth(item.parsed.y) + ')';
              }
            }
          })
        }
      }
    });

    barChart = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: REZULTATE.luni,
        datasets: [{
          label: REZULTATE.vanzari.eticheta,
          data: REZULTATE.platforme[current].vanzariLunare.slice(),
          // Luna dinainte e mai stinsă: e punctul de plecare, nu un rezultat.
          backgroundColor: function (ctx) { return ctx.dataIndex === 0 ? C_BEFORE : C_VIEWS; },
          hoverBackgroundColor: function (ctx) { return ctx.dataIndex === 0 ? 'rgba(147,184,240,0.4)' : '#60A5FA'; },
          borderRadius: { topLeft: 8, topRight: 8 },
          borderSkipped: 'bottom',
          maxBarThickness: 56,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 24 } },
        animation: reduceMotion ? false : {
          duration: 900,
          easing: 'easeOutQuart',
          delay: function (ctx) { return ctx.type === 'data' && ctx.mode === 'default' ? ctx.dataIndex * 140 + 300 : 0; }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: C_GRID },
            ticks: {
              font: { size: 11 },
              maxRotation: 0,
              autoSkip: false,   // sunt doar patru luni; toate trebuie să se vadă
              // „Iunie (înainte)” se rupe pe două rânduri, ca să încapă pe telefon.
              callback: function (v) {
                var l = this.getLabelForValue(v);
                var m = l.match(/^(.*?)\s+(\(.*\))$/);
                return m ? [m[1], m[2]] : l;
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: C_GRID },
            border: { display: false },
            ticks: { maxTicksLimit: 5, font: { size: 11 }, callback: function (v) { return fmtInt.format(v); } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: Object.assign(tooltipStyle(), {
            displayColors: false,
            callbacks: {
              label: function (item) {
                var data = item.dataset.data;
                var txt = REZULTATE.vanzari.eticheta + ': ' + fmtInt.format(item.parsed.y) + REZULTATE.vanzari.unitate;
                if (item.dataIndex > 0) txt += '  (' + fmtGrowth(growth(data[0], item.parsed.y)) + ' față de început)';
                return txt;
              }
            }
          })
        }
      },
      plugins: [barLabels]
    });
  }

  function paintCharts() {
    chartAria();
    if (!lineChart) return;
    var d = lineData();
    lineChart.data.labels = weekLabels(d.views.length);
    lineChart.data.datasets[0].data = d.views;
    lineChart.data.datasets[1].data = d.follow;
    lineChart.update();
    barChart.data.datasets[0].data = REZULTATE.platforme[current].vanzariLunare.slice();
    barChart.update();
  }

  function startCharts() {
    if (chartsStarted) return;
    chartsStarted = true;
    loadChartJs().then(buildCharts, function () {
      section.querySelectorAll('.rez-chart-box').forEach(function (box) {
        box.innerHTML = '<p class="rez-chart-error">Graficul nu s-a putut încărca. Reîncarcă pagina.</p>';
      });
    });
  }

  function startKpis() {
    if (kpisStarted) return;
    kpisStarted = true;
    paintKpis();
  }

  function select(key) {
    if (key === current || !REZULTATE.platforme[key]) return;
    current = key;
    syncTabs();
    if (kpisStarted) paintKpis();
    paintCharts();
  }

  syncTabs();
  chartAria();

  // ─── PORNIREA LA SCROLL ───
  // Pe desktop secțiunile inactive stau suprapuse în același loc, deci
  // observerul le-ar vedea „în ecran” și animațiile s-ar consuma pe ascuns.
  // Pornim doar când secțiunea e cea activă (pe telefon e mereu vizibilă).
  function sectionVisible() {
    return window.matchMedia('(max-width: 768px)').matches || section.classList.contains('active');
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    startKpis();
    // Fără animații, dar tot nu cerem Chart.js până nu e nevoie de el.
    if (!('IntersectionObserver' in window)) { startCharts(); return; }
  }

  var targets = {
    kpis: section.querySelector('.rez-kpis'),
    charts: section.querySelector('.rez-charts')
  };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || !sectionVisible()) return;
      if (entry.target === targets.kpis) startKpis();
      if (entry.target === targets.charts) startCharts();
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  Object.keys(targets).forEach(function (k) { if (targets[k]) io.observe(targets[k]); });

  // Când secțiunea devine activă pe desktop, geometria nu se schimbă, deci
  // observerul nu mai raportează nimic. Re-observăm, după ce panoul de
  // tranziție s-a ridicat, ca animația să se vadă.
  new MutationObserver(function () {
    if (!section.classList.contains('active')) return;
    setTimeout(function () {
      if (!kpisStarted && targets.kpis) { io.unobserve(targets.kpis); io.observe(targets.kpis); }
      if (!chartsStarted && targets.charts) { io.unobserve(targets.charts); io.observe(targets.charts); }
    }, 600);
  }).observe(section, { attributes: true, attributeFilter: ['class'] });
})();
