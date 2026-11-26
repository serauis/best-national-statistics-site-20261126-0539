// NusaStat views: one render function per page. Each page is built from
// the numbers in data.js / provinces.js and the charts in charts.js, so a
// figure shown here always carries its source and year beside it.

window.NUSA_VIEWS = (function () {
  var D = window.NUSA, C = window.NUSA_CHARTS, P = window.NUSA_PROV;

  function esc(s) { return C.esc(s); }
  function year() { return window.NUSA_STATE.year; }
  function srcLine(src, y) {
    return '<p class="src">Sumber: ' + esc(src) + ', ' + y + '</p>';
  }
  function kpi(ind, big) {
    var v = D.fmtValue(ind, year());
    var prev = ind.v[year() - 1];
    var delta = (prev !== undefined && typeof ind.v[year()] === 'number')
      ? (ind.v[year()] - prev) : null;
    var dTxt = delta === null ? '' : '<span class="delta">' + (delta >= 0 ? '▲ ' : '▼ ')
      + D.fmtNum(Math.abs(delta), ind.fmt) + ' dari ' + (year() - 1) + '</span>';
    return '<article class="kpi' + (big ? ' kpi-big' : '') + '">'
      + '<h3>' + esc(ind.name) + '</h3>'
      + '<p class="kpi-val">' + (ind.approx ? '~' : '') + esc(v)
      + ' <span class="kpi-unit">' + esc(ind.unit) + '</span></p>'
      + '<p class="kpi-sub">' + dTxt + ' <span class="kpi-src">' + esc(ind.src) + ', ' + year() + '</span></p>'
      + '</article>';
  }
  function sectionHead(title, sub, link) {
    return '<div class="sec-head"><div><h2>' + esc(title) + '</h2>'
      + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>'
      + (link ? '<a class="btn ghost" href="' + link.href + '">' + esc(link.text) + ' →</a>' : '')
      + '</div>';
  }

  // ---- Home ----
  function homeHeroKpis() {
    return ['penduduk', 'pdb-tumbuh', 'inflasi', 'kemiskinan']
      .map(function (id) { return kpi(D.byId(id)); }).join('');
  }
  function familyStrip() {
    var gk = D.byId('garis-kemiskinan');
    var line = D.fmtValue(gk, 2024);
    return '<section class="family" aria-label="Apa arti angka ini bagi keluarga">'
      + '<h2>Apa arti angka ini bagi satu keluarga?</h2>'
      + '<p class="family-lede">Statistik bukan sekadar angka — ia menentukan berapa yang harus '
      + 'disiapkan sebuah keluarga untuk hidup layak.</p>'
      + '<div class="family-grid">'
      + '<div class="family-item"><strong>Rp' + line + '</strong><span>garis kemiskinan per orang per bulan (BPS, Sep 2024)</span></div>'
      + '<div class="family-item"><strong>~Rp2,38 juta</strong><span>garis kemiskinan untuk keluarga 4 orang per bulan</span></div>'
      + '<div class="family-item"><strong>24,06 juta</strong><span>jiwa masih di bawah garis itu (BPS, Sep 2024)</span></div>'
      + '</div>'
      + '<p class="family-note">Turun dari 25,90 juta jiwa pada 2023 — sekitar 1,84 juta orang keluar dari kemiskinan dalam setahun.</p>'
      + '</section>';
  }
  function growthCard() {
    return '<section class="card chart-card"><h3>Pertumbuhan ekonomi, 2015–2024</h3>'
      + C.lineChart(D.GROWTH, { label: 'Pertumbuhan PDB Indonesia 2015 sampai 2024' })
      + srcLine('BPS, Berita Resmi Statistik', '2015–2024')
      + '<p class="card-note">Pandemi 2020 menarik pertumbuhan ke −2,07%; sejak 2022 ekonomi kembali tumbuh di atas 5%.</p>'
      + '</section>';
  }
  function islandCard() {
    var rows = D.ISLANDS.map(function (is, i) {
      return { name: is.name, v: is.pop, label: is.pop + ' jt (' + is.share.toFixed(1).replace('.', ',') + '%)',
        color: ['#0f766e', '#c2410c', '#b45309', '#0369a1', '#7c3aed', '#475569'][i] };
    });
    return '<section class="card chart-card"><h3>Penduduk menurut pulau, 2024</h3>'
      + C.barChart(rows, { label: 'Penduduk menurut pulau tahun 2024' })
      + srcLine('BPS, Proyeksi Penduduk', '2024')
      + '<p class="card-note">Lebih dari separuh penduduk Indonesia tinggal di Jawa — 152 dari 281,6 juta jiwa.</p>'
      + '</section>';
  }
  function topProvTable() {
    var rows = P.LIST.slice().sort(function (a, b) { return b.pop[2024] - a.pop[2024]; }).slice(0, 5)
      .map(function (p) {
        return '<tr><td><a href="#/provinsi/' + p.slug + '">' + esc(p.name) + '</a></td>'
          + '<td class="num">' + D.fmtNum(p.pop[2024], 1) + ' jt</td>'
          + '<td class="num">' + P.density(p).toLocaleString('id-ID') + '</td>'
          + '<td class="num">' + D.fmtNum(P.share(p), 1) + '%</td></tr>';
      }).join('');
    return '<section class="card"><h3>Provinsi terpadat, 2024</h3>'
      + '<table class="tbl"><thead><tr><th>Provinsi</th><th class="num">Penduduk</th><th class="num">Jiwa/km²</th><th class="num">% nasional</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table>'
      + srcLine('BPS, Proyeksi Penduduk', '2024')
      + '<p><a class="btn" href="#/provinsi">Lihat semua provinsi →</a></p></section>';
  }
  function newsStrip() {
    var items = D.NEWS.map(function (n) {
      return '<li><time>' + esc(n.date) + '</time><span>' + esc(n.text) + '</span></li>';
    }).join('');
    return '<section class="card news"><h3>Kabar terbaru dari BPS</h3><ul>' + items + '</ul>'
      + '<p class="src">Sumber: Badan Pusat Statistik — Berita Resmi Statistik.</p></section>';
  }
  function exploreGrid() {
    var tiles = [
      ['#/indikator', 'Indikator', '30 indikator kunci — cari, urutkan, dan bandingkan per tahun.'],
      ['#/provinsi', 'Provinsi', 'Penduduk, kepadatan, dan tren tiap provinsi.'],
      ['#/ekonomi', 'Ekonomi', 'Pertumbuhan, inflasi, perdagangan, dan sektor.'],
      ['#/penduduk', 'Penduduk', 'Struktur umur, kepadatan, dan urbanisasi.'],
    ].map(function (t) {
      return '<a class="tile" href="' + t[0] + '"><strong>' + t[1] + '</strong><span>' + t[2] + '</span></a>';
    }).join('');
    return '<section class="explore">' + sectionHead('Jelajahi statistik', 'Empat pintu masuk ke angka-Indonesia.') + '<div class="tiles">' + tiles + '</div></section>';
  }

  function renderHome(hero) {
    hero = hero || 'a';
    var kpis = '<section class="kpis">' + homeHeroKpis() + '</section>';
    var charts = '<div class="duo">' + growthCard() + islandCard() + '</div>';
    var fam = familyStrip();
    var table = topProvTable();
    var news = newsStrip();
    var head = '<section class="hero"><p class="eyebrow">Portal Statistik Nasional · Indonesia</p>'
      + '<h1>Indonesia dalam angka — jelas, bersumber, dan bisa dicek.</h1>'
      + '<p class="lede">281,6 juta jiwa, 38 provinsi, satu portal. Setiap angka di halaman ini '
      + 'mencantumkan sumber dan tahunnya, supaya Anda tidak perlu percaya begitu saja.</p>'
      + '<p class="hero-cta"><a class="btn primary" href="#/indikator">Cari indikator →</a> '
      + '<a class="btn ghost" href="#/provinsi">Lihat provinsi</a></p></section>';
    var body = '';
    if (hero === 'b') {          // chart-first
      body = head + charts + kpis + fam + '<div class="duo">' + table + news + '</div>' + exploreGrid();
    } else if (hero === 'c') {   // story-first, compact KPIs after
      body = head + fam + kpis + charts + '<div class="duo">' + table + news + '</div>' + exploreGrid();
    } else if (hero === 'd') {   // table-first
      body = head + kpis + '<div class="duo">' + table + news + '</div>' + fam + charts + exploreGrid();
    } else {                     // a: balanced (default)
      body = head + kpis + fam + charts + '<div class="duo">' + table + news + '</div>' + exploreGrid();
    }
    return body;
  }

  // ---- Indicator explorer ----
  var indState = { q: '', cat: 'Semua', sort: 'name' };
  function renderIndikator() {
    var q = indState.q.toLowerCase();
    var list = D.INDICATORS.filter(function (ind) {
      var okCat = indState.cat === 'Semua' || ind.cat === indState.cat;
      var okQ = !q || ind.name.toLowerCase().indexOf(q) !== -1 || ind.cat.toLowerCase().indexOf(q) !== -1;
      return okCat && okQ;
    });
    list.sort(function (a, b) {
      if (indState.sort === 'val-desc') return (b.v[year()] || 0) - (a.v[year()] || 0);
      if (indState.sort === 'val-asc') return (a.v[year()] || 0) - (b.v[year()] || 0);
      return a.name.localeCompare(b.name, 'id');
    });
    var chips = D.CATEGORIES.map(function (c) {
      return '<button class="chip' + (indState.cat === c ? ' on' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
    var rows = list.map(function (ind) {
      var v = D.fmtValue(ind, year());
      var prev = ind.v[year() - 1];
      var d = (prev !== undefined) ? (ind.v[year()] - prev) : null;
      return '<tr><td><strong>' + esc(ind.name) + '</strong><br><span class="muted">' + esc(ind.note) + '</span></td>'
        + '<td>' + esc(ind.cat) + '</td>'
        + '<td class="num"><strong>' + (ind.approx ? '~' : '') + esc(v) + '</strong> <span class="muted">' + esc(ind.unit) + '</span></td>'
        + '<td class="num">' + (d === null ? '—' : (d >= 0 ? '+' : '') + D.fmtNum(d, ind.fmt)) + '</td>'
        + '<td>' + esc(ind.src) + ', ' + year() + '</td></tr>';
    }).join('');
    return '<section class="page-head"><h1>Penjelajah Indikator</h1>'
      + '<p>' + D.INDICATORS.length + ' indikator kunci Indonesia, tahun ' + year()
      + '. Ketik untuk mencari, saring per kategori, atau urutkan. Setiap baris mencantumkan sumbernya.</p></section>'
      + '<div class="controls"><input id="indSearch" type="search" placeholder="Cari indikator… mis. kemiskinan, inflasi" value="' + esc(indState.q) + '" aria-label="Cari indikator">'
      + '<select id="indSort" aria-label="Urutkan"><option value="name"' + (indState.sort === 'name' ? ' selected' : '') + '>Nama (A–Z)</option>'
      + '<option value="val-desc"' + (indState.sort === 'val-desc' ? ' selected' : '') + '>Nilai tertinggi</option>'
      + '<option value="val-asc"' + (indState.sort === 'val-asc' ? ' selected' : '') + '>Nilai terendah</option></select></div>'
      + '<div class="chips" role="group" aria-label="Kategori">' + chips + '</div>'
      + '<p class="count">' + list.length + ' indikator ditampilkan · tahun ' + year() + '</p>'
      + '<div class="tbl-wrap"><table class="tbl wide"><thead><tr><th>Indikator</th><th>Kategori</th><th class="num">Nilai ' + year() + '</th><th class="num">Perubahan</th><th>Sumber</th></tr></thead>'
      + '<tbody>' + (rows || '<tr><td colspan="5">Tidak ada indikator yang cocok. Coba kata kunci lain.</td></tr>') + '</tbody></table></div>'
      + '<p class="src">Sumber: Badan Pusat Statistik (BPS) — Statistik Indonesia, Berita Resmi Statistik, Susenas, Sakernas. Angka bertanda ~ adalah pembulatan.</p>';
  }
  function bindIndikator(root) {
    var s = root.querySelector('#indSearch'), so = root.querySelector('#indSort');
    if (s) s.addEventListener('input', function () { indState.q = s.value; window.NUSA_ROUTER.rerender(); keepFocus('indSearch'); });
    if (so) so.addEventListener('change', function () { indState.sort = so.value; window.NUSA_ROUTER.rerender(); });
    root.querySelectorAll('.chip').forEach(function (ch) {
      ch.addEventListener('click', function () { indState.cat = ch.getAttribute('data-cat'); window.NUSA_ROUTER.rerender(); });
    });
  }
  function keepFocus(id) {
    var el = document.getElementById(id);
    if (el) { el.focus(); var v = el.value; el.value = ''; el.value = v; }
  }

  // ---- Provinces ----
  function renderProvinsi() {
    var rows = P.LIST.slice().sort(function (a, b) { return b.pop[2024] - a.pop[2024]; })
      .map(function (p, i) {
        return '<tr><td class="num">' + (i + 1) + '</td><td><a href="#/provinsi/' + p.slug + '"><strong>' + esc(p.name) + '</strong></a><br><span class="muted">Ibu kota: ' + esc(p.capital) + ' · ' + esc(p.island) + '</span></td>'
          + '<td class="num">' + D.fmtNum(p.pop[2024], 1) + ' jt</td>'
          + '<td class="num">' + D.fmtNum(p.pop[2023], 1) + ' jt</td>'
          + '<td class="num">' + D.fmtNum(P.share(p), 1) + '%</td>'
          + '<td class="num">' + P.density(p).toLocaleString('id-ID') + '</td></tr>';
      }).join('');
    return '<section class="page-head"><h1>Provinsi</h1>'
      + '<p>12 provinsi terpadat — rumah bagi sekitar 80% penduduk Indonesia. Klik nama provinsi untuk melihat detail dan tren penduduknya.</p></section>'
      + '<div class="tbl-wrap"><table class="tbl wide"><thead><tr><th class="num">#</th><th>Provinsi</th><th class="num">Penduduk 2024</th><th class="num">Penduduk 2023</th><th class="num">% nasional</th><th class="num">Jiwa/km²</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table></div>'
      + srcLine('BPS, Proyeksi Penduduk', '2024')
      + '<p class="card-note">Indonesia memiliki 38 provinsi. Halaman ini menampilkan 12 provinsi terpadat; daftar lengkap menyusul pada pembaruan berikutnya.</p>';
  }
  function renderProvinsiDetail(slug) {
    var p = P.bySlug(slug);
    if (!p) return '<section class="page-head"><h1>Provinsi tidak ditemukan</h1><p>Provinsi “' + esc(slug) + '” belum ada di portal ini.</p><p><a class="btn" href="#/provinsi">← Kembali ke daftar provinsi</a></p></section>';
    var pts = [2022, 2023, 2024].map(function (y) { return { y: y, v: p.pop[y] }; });
    var growth = ((p.pop[2024] - p.pop[2022]) / p.pop[2022] * 100);
    return '<p class="crumb"><a href="#/provinsi">← Semua provinsi</a></p>'
      + '<section class="page-head"><h1>' + esc(p.name) + '</h1>'
      + '<p>Ibu kota ' + esc(p.capital) + ' · Pulau ' + esc(p.island) + ' · Luas ' + p.area.toLocaleString('id-ID') + ' km²</p></section>'
      + '<section class="kpis">'
      + '<article class="kpi"><h3>Penduduk 2024</h3><p class="kpi-val">' + D.fmtNum(p.pop[2024], 1) + ' <span class="kpi-unit">juta jiwa</span></p><p class="kpi-sub"><span class="kpi-src">BPS, Proyeksi Penduduk, 2024</span></p></article>'
      + '<article class="kpi"><h3>Bagian dari Indonesia</h3><p class="kpi-val">' + D.fmtNum(P.share(p), 1) + ' <span class="kpi-unit">%</span></p><p class="kpi-sub"><span class="kpi-src">dari 281,6 juta jiwa</span></p></article>'
      + '<article class="kpi"><h3>Kepadatan</h3><p class="kpi-val">' + P.density(p).toLocaleString('id-ID') + ' <span class="kpi-unit">jiwa/km²</span></p><p class="kpi-sub"><span class="kpi-src">BPS, 2024</span></p></article>'
      + '<article class="kpi"><h3>Pertumbuhan 2022–2024</h3><p class="kpi-val">+' + D.fmtNum(growth, 1) + ' <span class="kpi-unit">%</span></p><p class="kpi-sub"><span class="kpi-src">dua tahun, BPS</span></p></article>'
      + '</section>'
      + '<div class="duo"><section class="card chart-card"><h3>Tren penduduk ' + esc(p.name) + ', 2022–2024</h3>'
      + C.lineChart(pts, { label: 'Tren penduduk ' + p.name })
      + srcLine('BPS, Proyeksi Penduduk', '2022–2024') + '</section>'
      + '<section class="card"><h3>Sekilas ' + esc(p.name) + '</h3>'
      + '<p>' + esc(p.name) + ' adalah salah satu provinsi terpadat di Indonesia, dengan '
      + D.fmtNum(p.pop[2024], 1) + ' juta jiwa pada 2024 — sekitar ' + D.fmtNum(P.share(p), 1)
      + '% dari seluruh penduduk Indonesia. Dengan kepadatan ' + P.density(p).toLocaleString('id-ID')
      + ' jiwa per km², provinsi ini ' + (P.density(p) > 1000 ? 'termasuk yang terpadat di Indonesia' : 'lebih longgar dibanding provinsi-provinsi di Jawa bagian barat')
      + '.</p>'
      + '<p>Untuk perbandingan nasional, lihat <a href="#/penduduk">halaman penduduk</a> dan '
      + '<a href="#/indikator">penjelajah indikator</a>.</p></section></div>'
      + '<p><a class="btn ghost" href="#/provinsi">← Kembali ke daftar provinsi</a></p>';
  }

  // ---- Economy ----
  var econTab = 'tumbuh';
  function renderEkonomi() {
    var tab = econTab;
    var chart = '', title = '', note = '';
    if (tab === 'tumbuh') {
      title = 'Pertumbuhan ekonomi (PDB), 2015–2024';
      chart = C.lineChart(D.GROWTH, { label: 'Pertumbuhan PDB 2015 sampai 2024' });
      note = 'Ekonomi tumbuh 5,03% pada 2024. Kontraksi 2020 (−2,07%) adalah dampak pandemi COVID-19.';
    } else if (tab === 'inflasi') {
      title = 'Inflasi tahunan (IHK), 2015–2024';
      chart = C.lineChart(D.INFLATION, { color: '#c2410c', label: 'Inflasi tahunan 2015 sampai 2024' });
      note = 'Inflasi 2024 tercatat 1,57% — terendah dalam satu dekade, setelah lonjakan 5,51% pada 2022.';
    } else {
      title = 'Perdagangan luar negeri, 2022–2024 (miliar USD)';
      var rows = [2022, 2023, 2024].map(function (y) {
        return { name: String(y), v: D.byId('ekspor').v[y], label: 'Ekspor ' + D.byId('ekspor').v[y] };
      });
      chart = C.barChart(rows, { label: 'Nilai ekspor 2022 sampai 2024' });
      note = 'Ekspor 2024: 264,7 miliar USD; impor 233,7 miliar USD; surplus perdagangan 31,0 miliar USD (BPS).';
    }
    var tabs = [['tumbuh', 'Pertumbuhan'], ['inflasi', 'Inflasi'], ['dagang', 'Perdagangan']]
      .map(function (t) {
        return '<button class="tab' + (tab === t[0] ? ' on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
      }).join('');
    var sectorRows = D.SECTORS.map(function (s, i) {
      return { name: s.name, v: s.pct, label: s.pct.toFixed(1).replace('.', ',') + '%',
        color: ['#0f766e', '#c2410c', '#b45309', '#0369a1', '#7c3aed', '#94a3b8'][i] };
    });
    return '<section class="page-head"><h1>Ekonomi</h1>'
      + '<p>Pertumbuhan, harga, dan perdagangan Indonesia — tiga sisi yang sama dari satu perekonomian.</p></section>'
      + '<section class="kpis">' + kpi(D.byId('pdb-tumbuh')) + kpi(D.byId('inflasi')) + kpi(D.byId('ekspor')) + kpi(D.byId('surplus')) + '</section>'
      + '<div class="tabs" role="tablist" aria-label="Grafik ekonomi">' + tabs + '</div>'
      + '<section class="card chart-card"><h3>' + esc(title) + '</h3>' + chart
      + srcLine('BPS, Berita Resmi Statistik & Statistik Perdagangan', tab === 'dagang' ? '2022–2024' : '2015–2024')
      + '<p class="card-note">' + esc(note) + '</p></section>'
      + '<div class="duo"><section class="card chart-card"><h3>Struktur PDB menurut sektor, 2024</h3>'
      + C.barChart(sectorRows, { label: 'Kontribusi sektor terhadap PDB 2024' })
      + srcLine('BPS, Statistik Indonesia', '2024')
      + '<p class="card-note">Industri pengolahan tetap penyumbang terbesar, sekitar 18,9% dari PDB.</p></section>'
      + '<section class="card"><h3>Membaca angka ekonomi</h3>'
      + '<p><strong>Pertumbuhan 5%</strong> berarti nilai barang dan jasa yang dihasilkan naik 5% dari tahun sebelumnya, setelah memperhitungkan harga.</p>'
      + '<p><strong>Inflasi 1,57%</strong> berarti harga-harga rata-rata naik 1,57% dalam setahun — daya beli relatif terjaga.</p>'
      + '<p><strong>Surplus dagang</strong> berarti Indonesia menjual lebih banyak ke luar negeri daripada membeli — 31 miliar USD pada 2024.</p>'
      + '<p><a class="btn" href="#/indikator">Semua indikator ekonomi →</a></p></section></div>';
  }
  function bindEkonomi(root) {
    root.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () { econTab = t.getAttribute('data-tab'); window.NUSA_ROUTER.rerender(); });
    });
  }

  // ---- Population ----
  function renderPenduduk() {
    var ageRows = D.AGE.map(function (a, i) {
      return { name: a.group, v: a.pct, label: a.pct.toFixed(1).replace('.', ',') + '%',
        color: ['#0f766e', '#15803d', '#b45309', '#c2410c', '#475569'][i] };
    });
    return '<section class="page-head"><h1>Penduduk</h1>'
      + '<p>Siapa tinggal di Indonesia, di mana, dan berapa usianya — gambaran penduduk 281,6 juta jiwa pada 2024.</p></section>'
      + '<section class="kpis">' + kpi(D.byId('penduduk')) + kpi(D.byId('kepadatan')) + kpi(D.byId('penduduk-kota')) + kpi(D.byId('usia-produktif')) + '</section>'
      + '<div class="duo"><section class="card chart-card"><h3>Struktur umur penduduk, 2024</h3>'
      + C.columnChart(ageRows, { label: 'Struktur umur penduduk 2024' })
      + srcLine('BPS, Proyeksi Penduduk', '2024')
      + '<p class="card-note">Indonesia masih menikmati bonus demografi: 68,4% penduduk berada pada usia produktif (15–64 tahun).</p></section>'
      + '<section class="card chart-card"><h3>Penduduk menurut pulau, 2024</h3>'
      + C.barChart(D.ISLANDS.map(function (is, i) {
        return { name: is.name, v: is.pop, label: is.pop + ' jt', color: ['#0f766e', '#c2410c', '#b45309', '#0369a1', '#7c3aed', '#475569'][i] };
      }), { label: 'Penduduk menurut pulau 2024' })
      + srcLine('BPS, Proyeksi Penduduk', '2024')
      + '<p class="card-note">Jawa menampung 152 juta jiwa di lahan seluas 6,6% wilayah Indonesia.</p></section></div>'
      + '<section class="card"><h3>Bonus demografi — apa artinya?</h3>'
      + '<p>Dengan 68,4% penduduk berusia produktif dan rasio ketergantungan 45,9 per 100 penduduk produktif (BPS, 2024), '
      + 'Indonesia punya jendela peluang: setiap 100 orang usia kerja menanggung sekitar 46 orang usia tidak produktif. '
      + 'Jendela ini diperkirakan mencapai puncaknya pada 2030-an — pendidikan dan lapangan kerja formal yang memadai '
      + 'menentukan apakah bonus ini menjadi pertumbuhan atau justru beban.</p>'
      + '<p><a class="btn" href="#/provinsi">Lihat per provinsi →</a></p></section>';
  }

  // ---- Methodology ----
  function renderMetodologi() {
    var sources = [
      ['Statistik Indonesia 2025', 'BPS', 'Publikasi tahunan: penduduk, ekonomi, sosial, dan pembangunan manusia.'],
      ['Berita Resmi Statistik', 'BPS', 'Rilis resmi pertumbuhan ekonomi, inflasi, perdagangan, dan kemiskinan.'],
      ['Survei Sosial Ekonomi Nasional (Susenas)', 'BPS', 'Kemiskinan, garis kemiskinan, gini, pendidikan, dan melek huruf.'],
      ['Survei Angkatan Kerja Nasional (Sakernas)', 'BPS', 'Pengangguran, partisipasi angkatan kerja, dan status pekerjaan.'],
      ['Statistik Perdagangan Luar Negeri', 'BPS', 'Nilai ekspor, impor, dan neraca perdagangan barang.'],
      ['Proyeksi Penduduk Indonesia', 'BPS', 'Jumlah penduduk per provinsi dan struktur umur.'],
    ].map(function (s) {
      return '<tr><td><strong>' + esc(s[0]) + '</strong></td><td>' + esc(s[1]) + '</td><td>' + esc(s[2]) + '</td></tr>';
    }).join('');
    return '<section class="page-head"><h1>Sumber &amp; Metodologi</h1>'
      + '<p>Setiap angka di NusaStat bisa dilacak ke publikasi asalnya. Halaman ini menjelaskan dari mana angka-angka itu datang dan bagaimana membacanya.</p></section>'
      + '<section class="card"><h3>Sumber data</h3>'
      + '<div class="tbl-wrap"><table class="tbl wide"><thead><tr><th>Publikasi</th><th>Penerbit</th><th>Yang diukur</th></tr></thead><tbody>' + sources + '</tbody></table></div>'
      + '<p class="card-note">Seluruh sumber adalah publikasi Badan Pusat Statistik (BPS). NusaStat bukan situs resmi BPS dan tidak berafiliasi dengannya.</p></section>'
      + '<div class="duo"><section class="card"><h3>Cara membaca angka</h3>'
      + '<p><strong>Tahun.</strong> Pemilih tahun di kanan atas mengubah angka ke tahun yang dipilih bila datanya tersedia (2022–2024).</p>'
      + '<p><strong>Tanda ~.</strong> Angka bertanda ~ adalah pembulatan dari sumbernya, bukan angka pasti.</p>'
      + '<p><strong>y-on-y.</strong> Perbandingan terhadap periode yang sama tahun sebelumnya.</p>'
      + '<p><strong>Garis kemiskinan.</strong> Batas pengeluaran per kapita per bulan; di bawahnya seseorang dikategorikan miskin.</p></section>'
      + '<section class="card"><h3>Keterbatasan</h3>'
      + '<p>Angka provinsi adalah proyeksi penduduk BPS, bukan hasil sensus. Angka 2024 untuk beberapa indikator memakai rilis terakhir yang tersedia saat portal ini disusun.</p>'
      + '<p>Portal ini bekerja sepenuhnya luring: tidak ada data yang diambil dari jaringan, sehingga angka di sini adalah potret per November 2026.</p>'
      + '<p>Menemukan angka yang keliru? Periksa publikasi BPS yang tercantum sebagai sumber — itulah rujukan akhirnya.</p></section></div>';
  }

  return {
    renderHome: renderHome, renderIndikator: renderIndikator, bindIndikator: bindIndikator,
    renderProvinsi: renderProvinsi, renderProvinsiDetail: renderProvinsiDetail,
    renderEkonomi: renderEkonomi, bindEkonomi: bindEkonomi,
    renderPenduduk: renderPenduduk, renderMetodologi: renderMetodologi,
  };
})();
