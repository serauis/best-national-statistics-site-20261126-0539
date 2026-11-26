// NusaStat router: hash routes, year selector, and the design-variant
// switches the local design ladder uses (?pal=1..4, ?hero=a..d). Defaults
// (no parameters) are the ladder winner. Every route renders synchronously
// and sets window.__shotReady so screenshots can wait for a finished page.

(function () {
  var V = window.NUSA_VIEWS;
  var app = document.getElementById('app');
  var yearSelect = document.getElementById('yearSelect');

  window.NUSA_STATE = { year: 2024 };

  // Design variants (local ladder): palette and hero layout from the URL.
  var params = new URLSearchParams(location.search);
  var pal = params.get('pal');
  if (pal && ['1', '2', '3', '4'].indexOf(pal) !== -1) document.documentElement.setAttribute('data-pal', pal);
  var hero = params.get('hero') || 'a';

  function route() {
    var hash = location.hash || '#/';
    var parts = hash.replace(/^#\//, '').split('/').filter(Boolean);
    var name = parts[0] || '';
    var html = '';
    var bind = null;
    if (name === '') { html = V.renderHome(hero); }
    else if (name === 'indikator') { html = V.renderIndikator(); bind = V.bindIndikator; }
    else if (name === 'provinsi' && parts[1]) { html = V.renderProvinsiDetail(parts[1]); }
    else if (name === 'provinsi') { html = V.renderProvinsi(); }
    else if (name === 'ekonomi') { html = V.renderEkonomi(); bind = V.bindEkonomi; }
    else if (name === 'penduduk') { html = V.renderPenduduk(); }
    else if (name === 'metodologi') { html = V.renderMetodologi(); }
    else {
      html = '<section class="page-head"><h1>Halaman tidak ditemukan</h1>'
        + '<p>Rute “' + name + '” tidak ada di portal ini.</p>'
        + '<p><a class="btn" href="#/">← Kembali ke Beranda</a></p></section>';
    }
    app.innerHTML = html;
    if (bind) bind(app);
    markNav(name);
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }

  function markNav(name) {
    document.querySelectorAll('#mainnav a').forEach(function (a) {
      var r = a.getAttribute('data-route') || '';
      a.classList.toggle('active', r === name);
    });
  }

  window.NUSA_ROUTER = {
    rerender: function () { window.__shotReady = false; route(); },
  };

  yearSelect.addEventListener('change', function () {
    window.NUSA_STATE.year = parseInt(yearSelect.value, 10);
    window.NUSA_ROUTER.rerender();
  });

  window.addEventListener('hashchange', function () {
    window.__shotReady = false;
    route();
  });

  route();
})();
