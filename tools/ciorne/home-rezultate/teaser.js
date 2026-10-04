/* ===== REZULTATE PE HOME (#homeRez) =====
   Folosește același obiect REZULTATE ca pagina /rezultate/. Pe Home cifrele
   sunt adunate pe toate platformele (vizualizări, urmăritori, comenzi), ca
   să arate impactul total; engagement-ul nu se adună, deci lipsește aici. */
(function homeRezultate() {
  'use strict';
  var box = document.getElementById('homeRez');
  if (!box || typeof REZULTATE === 'undefined') return;

  var CHART_JS = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.js';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isPhone = function () { return window.matchMedia('(max-width: 768px)').matches; };
  var fmt = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 });
  var unit = REZULTATE.vanzari.unitate;

  var plat = Object.keys(REZULTATE.platforme).map(function (k) { return REZULTATE.platforme[k]; });
  function sumKpi(key, i) { return plat.reduce(function (s, p) { return s + p.kpi[key][i]; }, 0); }
  var months = REZULTATE.luni.map(function (_, i) {
    return plat.reduce(function (s, p) { return s + (p.vanzariLunare[i] || 0); }, 0);
  });
  function growth(a, b) { return a ? Math.round((b - a) / a * 100) : 0; }

  box.querySelector('[data-hr="client"]').textContent = REZULTATE.client;
  box.querySelector('[data-hr="perioada"]').textContent = REZULTATE.perioada;
  box.querySelector('[data-hr="vanzari-eticheta"]').textContent = REZULTATE.vanzari.eticheta.toLowerCase();
  box.querySelector('[data-hr-demo]').hidden = !REZULTATE.demonstrativ;
  var badge = box.querySelector('[data-hr="vanzari-crestere"]');
  badge.textContent = '▲ +' + fmt.format(growth(months[0], months[months.length - 1])) + '%';

  var stats = [].slice.call(box.querySelectorAll('.home-rez-stat')).map(function (el) {
    var key = el.dataset.kpi;
    var before = sumKpi(key, 0), now = sumKpi(key, 1);
    var u = key === 'vanzari' ? unit : '';
    el.querySelector('.home-rez-from').textContent = fmt.format(before) + u + ' → ' + fmt.format(now) + u;
    return { num: el.querySelector('.home-rez-num'), target: growth(before, now) };
  });

  function paintNum(s, v) { s.num.innerHTML = '<span class="up" aria-hidden="true">▲</span>+' + fmt.format(Math.round(v)) + '%'; }

  function countUp() {
    if (reduceMotion) { stats.forEach(function (s) { paintNum(s, s.target); }); return; }
    var t0 = 0;
    (function step(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / 1800, 1), e = 1 - Math.pow(1 - p, 3);
      stats.forEach(function (s) { paintNum(s, s.target * e); });
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  stats.forEach(function (s) { paintNum(s, reduceMotion ? s.target : 0); });

  function loadChartJs() {
    if (window.Chart) return Promise.resolve(window.Chart);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = CHART_JS; s.async = true;
      s.onload = function () { window.Chart ? resolve(window.Chart) : reject(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function drawChart(Chart) {
    new Chart(document.getElementById('homeRezChart'), {
      type: 'bar',
      data: {
        labels: REZULTATE.luni,
        datasets: [{
          label: REZULTATE.vanzari.eticheta,
          data: months,
          backgroundColor: function (c) { return c.dataIndex === 0 ? 'rgba(147,184,240,0.28)' : '#3B82F6'; },
          hoverBackgroundColor: function (c) { return c.dataIndex === 0 ? 'rgba(147,184,240,0.4)' : '#60A5FA'; },
          borderRadius: { topLeft: 8, topRight: 8 },
          borderSkipped: 'bottom',
          maxBarThickness: 54,
          categoryPercentage: 0.72
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 26 } },
        animation: reduceMotion ? false : {
          duration: 1000, easing: 'easeOutQuart',
          delay: function (c) { return c.type === 'data' && c.mode === 'default' ? c.dataIndex * 160 + 250 : 0; }
        },
        scales: {
          x: {
            grid: { display: false }, border: { color: 'rgba(255,255,255,0.06)' },
            ticks: {
              color: '#93B8F0', font: { family: '"DM Sans", sans-serif', size: 11 }, maxRotation: 0, autoSkip: false,
              callback: function (v) { var l = this.getLabelForValue(v), m = l.match(/^(.*?)\s+(\(.*\))$/); return m ? [m[1], m[2]] : l; }
            }
          },
          y: { display: false, beginAtZero: true }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(8,9,14,0.96)', borderColor: 'rgba(37,99,235,0.45)', borderWidth: 1,
            titleFont: { family: '"Syne", sans-serif', weight: '700', size: 13 },
            bodyFont: { family: '"DM Sans", sans-serif', size: 13 },
            padding: 12, cornerRadius: 10, displayColors: false,
            callbacks: {
              label: function (it) {
                var t = REZULTATE.vanzari.eticheta + ': ' + fmt.format(it.parsed.y) + unit;
                return it.dataIndex ? t + '  (+' + fmt.format(growth(months[0], it.parsed.y)) + '%)' : t;
              }
            }
          }
        }
      },
      plugins: [{
        id: 'homeRezLabels',
        afterDatasetsDraw: function (chart) {
          var ctx = chart.ctx;
          ctx.save();
          ctx.font = '700 14px "DM Sans", sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          chart.getDatasetMeta(0).data.forEach(function (bar, i) {
            ctx.fillText(fmt.format(months[i]), bar.x, bar.y - 6);
          });
          ctx.restore();
        }
      }]
    });
  }

  var started = false;
  function start() {
    if (started) return;
    started = true;
    countUp();
    if (!isPhone()) loadChartJs().then(drawChart, function () { box.querySelector('.home-rez-chart').hidden = true; });
  }

  // Home e pagina activă la intrare; pe desktop, dacă userul a plecat pe altă
  // secțiune, pornim doar când Home e din nou cea vizibilă.
  var page = box.closest('.page');
  function visible() { return isPhone() || !page || page.classList.contains('active'); }

  if (!('IntersectionObserver' in window)) { start(); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; }) && visible()) { start(); io.disconnect(); }
  }, { threshold: 0.25 });
  io.observe(box);
  if (page) new MutationObserver(function () {
    if (!started && page.classList.contains('active')) setTimeout(function () { io.unobserve(box); io.observe(box); }, 600);
  }).observe(page, { attributes: true, attributeFilter: ['class'] });
})();
