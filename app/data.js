// NusaStat data: every figure carries its source and year.
// Figures are the headline numbers published by Badan Pusat Statistik (BPS)
// in Statistik Indonesia and Berita Resmi Statistik. Where a figure is a
// rounded or approximate reading it is marked "~" and the note says so.
// Nothing here is fetched: the whole site runs from these files alone.

window.NUSA = (function () {
  // Year-keyed headline indicators. "v" is the value for that year; unit and
  // source are shared across years.
  var INDICATORS = [
    { id: 'penduduk', name: 'Jumlah Penduduk', cat: 'Kependudukan', unit: 'juta jiwa',
      src: 'BPS, Proyeksi Penduduk', v: { 2022: 275.8, 2023: 278.7, 2024: 281.6 },
      fmt: 1, note: 'Pertengahan tahun (30 Juni).' },
    { id: 'pdb-tumbuh', name: 'Pertumbuhan Ekonomi (PDB)', cat: 'Ekonomi', unit: '% (y-on-y)',
      src: 'BPS, Berita Resmi Statistik', v: { 2022: 5.31, 2023: 5.05, 2024: 5.03 },
      fmt: 2, note: 'Pertumbuhan PDB harga konstan terhadap tahun sebelumnya.' },
    { id: 'inflasi', name: 'Inflasi (IHK, Desember y-on-y)', cat: 'Ekonomi', unit: '%',
      src: 'BPS, Berita Resmi Statistik', v: { 2022: 5.51, 2023: 2.61, 2024: 1.57 },
      fmt: 2, note: 'Inflasi tahun kalender, Desember terhadap Desember tahun lalu.' },
    { id: 'pengangguran', name: 'Tingkat Pengangguran Terbuka', cat: 'Ketenagakerjaan', unit: '%',
      src: 'BPS, Sakernas Agustus', v: { 2022: 5.86, 2023: 5.32, 2024: 4.91 },
      fmt: 2, note: 'Survei Angkatan Kerja Nasional, keadaan Agustus.' },
    { id: 'kemiskinan', name: 'Penduduk Miskin', cat: 'Kemiskinan', unit: '%',
      src: 'BPS, Susenas September', v: { 2022: 9.57, 2023: 9.36, 2024: 8.57 },
      fmt: 2, note: 'Persentase penduduk di bawah garis kemiskinan, September.' },
    { id: 'garis-kemiskinan', name: 'Garis Kemiskinan', cat: 'Kemiskinan', unit: 'Rp/kapita/bulan',
      src: 'BPS, Susenas September', v: { 2022: 535547, 2023: 580705, 2024: 595242 },
      fmt: 0, note: 'Batas pengeluaran minimum untuk dikategorikan tidak miskin.' },
    { id: 'ipm', name: 'Indeks Pembangunan Manusia', cat: 'Pembangunan Manusia', unit: 'poin (0–100)',
      src: 'BPS, Statistik Indonesia', v: { 2022: 73.77, 2023: 74.39, 2024: 75.02 },
      fmt: 2, note: 'Komposit kesehatan, pendidikan, dan standar hidup layak.' },
    { id: 'gini', name: 'Rasio Gini', cat: 'Kemiskinan', unit: 'rasio (0–1)',
      src: 'BPS, Susenas Maret', v: { 2022: 0.381, 2023: 0.379, 2024: 0.379 },
      fmt: 3, note: 'Ketimpangan pengeluaran; 0 berarti merata sempurna.' },
    { id: 'pdb-kapita', name: 'PDB per Kapita', cat: 'Ekonomi', unit: 'Rp juta/tahun',
      src: 'BPS, Statistik Indonesia', v: { 2022: 71.0, 2023: 75.0, 2024: 78.6 },
      fmt: 1, note: 'Nilai dibulatkan ke ratusan ribu rupiah terdekat.' },
    { id: 'ekspor', name: 'Nilai Ekspor', cat: 'Ekonomi', unit: 'miliar USD',
      src: 'BPS, Statistik Perdagangan', v: { 2022: 291.9, 2023: 258.8, 2024: 264.7 },
      fmt: 1, note: 'Ekspor barang (migas dan nonmigas).' },
    { id: 'impor', name: 'Nilai Impor', cat: 'Ekonomi', unit: 'miliar USD',
      src: 'BPS, Statistik Perdagangan', v: { 2022: 237.4, 2023: 221.9, 2024: 233.7 },
      fmt: 1, note: 'Impor barang (migas dan nonmigas).' },
    { id: 'surplus', name: 'Surplus Neraca Perdagangan', cat: 'Ekonomi', unit: 'miliar USD',
      src: 'BPS, Statistik Perdagangan', v: { 2022: 54.5, 2023: 36.9, 2024: 31.0 },
      fmt: 1, note: 'Ekspor dikurangi impor barang.' },
    { id: 'upah', name: 'Upah Minimum Rata-rata (UMP)', cat: 'Ketenagakerjaan', unit: 'Rp/bulan',
      src: 'BPS / Kemenaker', v: { 2022: 2907909, 2023: 3100000, 2024: 3318000 },
      fmt: 0, approx: true, note: 'Rata-rata tertimbang UMP seluruh provinsi, dibulatkan.' },
    { id: 'partisipasi', name: 'Tingkat Partisipasi Angkatan Kerja', cat: 'Ketenagakerjaan', unit: '%',
      src: 'BPS, Sakernas Agustus', v: { 2022: 68.63, 2023: 69.48, 2024: 70.63 },
      fmt: 2, note: 'Angkatan kerja terhadap penduduk usia kerja (15+).' },
    { id: 'harapan-hidup', name: 'Angka Harapan Hidup', cat: 'Pembangunan Manusia', unit: 'tahun',
      src: 'BPS, Statistik Indonesia', v: { 2022: 71.85, 2023: 72.12, 2024: 72.42 },
      fmt: 2, approx: true, note: 'Perkiraan umur rata-rata bayi baru lahir.' },
    { id: 'rata-sekolah', name: 'Rata-rata Lama Sekolah', cat: 'Pendidikan', unit: 'tahun',
      src: 'BPS, Statistik Indonesia', v: { 2022: 8.69, 2023: 8.84, 2024: 9.04 },
      fmt: 2, approx: true, note: 'Penduduk usia 25 tahun ke atas.' },
    { id: 'harapan-sekolah', name: 'Harapan Lama Sekolah', cat: 'Pendidikan', unit: 'tahun',
      src: 'BPS, Statistik Indonesia', v: { 2022: 13.10, 2023: 13.17, 2024: 13.26 },
      fmt: 2, approx: true, note: 'Tahun sekolah yang diharapkan ditempuh anak usia 7 tahun.' },
    { id: 'melek-huruf', name: 'Angka Melek Huruf (15+)', cat: 'Pendidikan', unit: '%',
      src: 'BPS, Susenas', v: { 2022: 96.0, 2023: 96.4, 2024: 96.7 },
      fmt: 1, approx: true, note: 'Penduduk 15 tahun ke atas yang dapat membaca dan menulis.' },
    { id: 'aps-sd', name: 'Angka Partisipasi Sekolah 7–12 th', cat: 'Pendidikan', unit: '%',
      src: 'BPS, Susenas', v: { 2022: 99.2, 2023: 99.3, 2024: 99.4 },
      fmt: 1, approx: true, note: 'Anak usia sekolah dasar yang masih bersekolah.' },
    { id: 'kemiskinan-ekstrem', name: 'Kemiskinan Ekstrem', cat: 'Kemiskinan', unit: '%',
      src: 'BPS, Susenas', v: { 2022: 2.04, 2023: 1.12, 2024: 0.83 },
      fmt: 2, approx: true, note: 'Penduduk dengan pengeluaran di bawah garis kemiskinan ekstrem.' },
    { id: 'ketimpangan-desa', name: 'Gini Perdesaan', cat: 'Kemiskinan', unit: 'rasio (0–1)',
      src: 'BPS, Susenas Maret', v: { 2022: 0.314, 2023: 0.311, 2024: 0.310 },
      fmt: 3, note: 'Ketimpangan pengeluaran di daerah perdesaan.' },
    { id: 'ketimpangan-kota', name: 'Gini Perkotaan', cat: 'Kemiskinan', unit: 'rasio (0–1)',
      src: 'BPS, Susenas Maret', v: { 2022: 0.402, 2023: 0.396, 2024: 0.394 },
      fmt: 3, note: 'Ketimpangan pengeluaran di daerah perkotaan.' },
    { id: 'penduduk-miskin-jml', name: 'Jumlah Penduduk Miskin', cat: 'Kemiskinan', unit: 'juta jiwa',
      src: 'BPS, Susenas September', v: { 2022: 26.36, 2023: 25.90, 2024: 24.06 },
      fmt: 2, note: 'Jiwa yang hidup di bawah garis kemiskinan, September.' },
    { id: 'pekerja-informal', name: 'Pekerja Informal', cat: 'Ketenagakerjaan', unit: '% dari pekerja',
      src: 'BPS, Sakernas Agustus', v: { 2022: 60.2, 2023: 59.2, 2024: 58.3 },
      fmt: 1, approx: true, note: 'Pekerja tanpa perlindungan formal penuh.' },
    { id: 'pekerja-formal', name: 'Pekerja Formal', cat: 'Ketenagakerjaan', unit: '% dari pekerja',
      src: 'BPS, Sakernas Agustus', v: { 2022: 39.8, 2023: 40.8, 2024: 41.7 },
      fmt: 1, approx: true, note: 'Pekerja dengan status formal (berusaha dibantu buruh tetap, buruh/karyawan).' },
    { id: 'penduduk-kota', name: 'Penduduk Perkotaan', cat: 'Kependudukan', unit: '%',
      src: 'BPS, Proyeksi Penduduk', v: { 2022: 57.1, 2023: 57.9, 2024: 58.6 },
      fmt: 1, approx: true, note: 'Bagian penduduk yang tinggal di daerah perkotaan.' },
    { id: 'kepadatan', name: 'Kepadatan Penduduk', cat: 'Kependudukan', unit: 'jiwa/km²',
      src: 'BPS, Statistik Indonesia', v: { 2022: 144, 2023: 146, 2024: 147 },
      fmt: 0, note: 'Penduduk per kilometer persegi wilayah daratan.' },
    { id: 'usia-produktif', name: 'Penduduk Usia Produktif (15–64 th)', cat: 'Kependudukan', unit: '%',
      src: 'BPS, Proyeksi Penduduk', v: { 2022: 68.0, 2023: 68.2, 2024: 68.4 },
      fmt: 1, approx: true, note: 'Bagian penduduk usia 15 sampai 64 tahun.' },
    { id: 'rasio-ketergantungan', name: 'Rasio Ketergantungan', cat: 'Kependudukan', unit: 'per 100 produktif',
      src: 'BPS, Proyeksi Penduduk', v: { 2022: 46.8, 2023: 46.4, 2024: 45.9 },
      fmt: 1, approx: true, note: 'Penduduk usia tidak produktif per 100 penduduk usia produktif.' },
    { id: 'sektor-industri', name: 'PDB Sektor Industri Pengolahan', cat: 'Ekonomi', unit: '% dari PDB',
      src: 'BPS, Statistik Indonesia', v: { 2022: 18.4, 2023: 18.7, 2024: 18.9 },
      fmt: 1, approx: true, note: 'Kontribusi industri pengolahan terhadap PDB.' },
    { id: 'sektor-tani', name: 'PDB Sektor Pertanian', cat: 'Ekonomi', unit: '% dari PDB',
      src: 'BPS, Statistik Indonesia', v: { 2022: 12.4, 2023: 12.5, 2024: 12.5 },
      fmt: 1, approx: true, note: 'Kontribusi pertanian, kehutanan, dan perikanan terhadap PDB.' },
    { id: 'sektor-dagang', name: 'PDB Sektor Perdagangan', cat: 'Ekonomi', unit: '% dari PDB',
      src: 'BPS, Statistik Indonesia', v: { 2022: 12.9, 2023: 12.9, 2024: 12.9 },
      fmt: 1, approx: true, note: 'Kontribusi perdagangan besar dan eceran terhadap PDB.' },
    { id: 'wisatawan', name: 'Kunjungan Wisatawan Mancanegara', cat: 'Ekonomi', unit: 'juta kunjungan',
      src: 'BPS, Statistik Pariwisata', v: { 2022: 5.9, 2023: 11.7, 2024: 13.9 },
      fmt: 1, note: 'Kunjungan wisman melalui seluruh pintu masuk.' },
  ];

  // National series for charts (BPS, Berita Resmi Statistik).
  var GROWTH = [
    { y: 2015, v: 4.88 }, { y: 2016, v: 5.03 }, { y: 2017, v: 5.07 },
    { y: 2018, v: 5.17 }, { y: 2019, v: 5.02 }, { y: 2020, v: -2.07 },
    { y: 2021, v: 3.70 }, { y: 2022, v: 5.31 }, { y: 2023, v: 5.05 },
    { y: 2024, v: 5.03 },
  ];
  var INFLATION = [
    { y: 2015, v: 3.35 }, { y: 2016, v: 3.02 }, { y: 2017, v: 3.61 },
    { y: 2018, v: 3.13 }, { y: 2019, v: 2.72 }, { y: 2020, v: 1.68 },
    { y: 2021, v: 1.87 }, { y: 2022, v: 5.51 }, { y: 2023, v: 2.61 },
    { y: 2024, v: 1.57 },
  ];
  // Population by island, 2024 (BPS, approx. — rounded to whole millions).
  var ISLANDS = [
    { name: 'Jawa', pop: 152, share: 54.0 },
    { name: 'Sumatera', pop: 61, share: 21.6 },
    { name: 'Kalimantan', pop: 17, share: 6.2 },
    { name: 'Sulawesi', pop: 20, share: 7.2 },
    { name: 'Bali & Nusa Tenggara', pop: 15, share: 5.4 },
    { name: 'Maluku & Papua', pop: 11, share: 4.0 },
  ];
  // Age structure 2024 (BPS, approx. %).
  var AGE = [
    { group: '0–14 tahun', pct: 25.4 },
    { group: '15–24 tahun', pct: 16.6 },
    { group: '25–54 tahun', pct: 40.4 },
    { group: '55–64 tahun', pct: 9.7 },
    { group: '65+ tahun', pct: 7.9 },
  ];
  // Sector shares of GDP 2024 (BPS, approx. %).
  var SECTORS = [
    { name: 'Industri pengolahan', pct: 18.9 },
    { name: 'Perdagangan', pct: 12.9 },
    { name: 'Pertanian', pct: 12.5 },
    { name: 'Konstruksi', pct: 10.2 },
    { name: 'Pertambangan', pct: 8.3 },
    { name: 'Lainnya', pct: 37.2 },
  ];
  // News / updates strip — dated releases, all BPS.
  var NEWS = [
    { date: '5 Feb 2025', text: 'BPS: ekonomi Indonesia 2024 tumbuh 5,03% — konsumsi rumah tangga tumbuh 4,94%.' },
    { date: '15 Jan 2025', text: 'Tingkat kemiskinan September 2024 turun ke 8,57%, jumlah penduduk miskin 24,06 juta jiwa.' },
    { date: '5 Nov 2024', text: 'Ekonomi kuartal III-2024 tumbuh 4,95% (y-on-y); investasi tumbuh 5,15%.' },
    { date: '1 Nov 2024', text: 'Inflasi Oktober 2024 tercatat 1,71% (y-on-y); kelompok makanan jadi penyumbang terbesar.' },
  ];
  var CATEGORIES = ['Semua', 'Kependudukan', 'Ekonomi', 'Ketenagakerjaan', 'Kemiskinan', 'Pendidikan', 'Pembangunan Manusia'];

  function byId(id) {
    for (var i = 0; i < INDICATORS.length; i++) if (INDICATORS[i].id === id) return INDICATORS[i];
    return null;
  }
  function fmtNum(x, decimals) {
    return x.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  function fmtValue(ind, year) {
    var v = ind.v[year];
    if (v === undefined) return '—';
    if (ind.fmt === 0) return fmtNum(v, 0);
    return fmtNum(v, ind.fmt);
  }

  return {
    INDICATORS: INDICATORS, GROWTH: GROWTH, INFLATION: INFLATION,
    ISLANDS: ISLANDS, AGE: AGE, SECTORS: SECTORS, NEWS: NEWS,
    CATEGORIES: CATEGORIES, byId: byId, fmtValue: fmtValue, fmtNum: fmtNum,
  };
})();
