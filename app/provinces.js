// NusaStat provinces: the ten most populous provinces plus the capital.
// Populations are BPS mid-year projections (juta jiwa), rounded to one
// decimal; densities are computed from those figures and each province's
// land area. Nothing here is fetched from a network.

window.NUSA_PROV = (function () {
  var LIST = [
    { slug: 'jawa-barat', name: 'Jawa Barat', capital: 'Bandung', island: 'Jawa',
      area: 35378, pop: { 2022: 48.8, 2023: 49.4, 2024: 49.9 } },
    { slug: 'jawa-timur', name: 'Jawa Timur', capital: 'Surabaya', island: 'Jawa',
      area: 47799, pop: { 2022: 41.2, 2023: 41.5, 2024: 41.8 } },
    { slug: 'jawa-tengah', name: 'Jawa Tengah', capital: 'Semarang', island: 'Jawa',
      area: 32801, pop: { 2022: 37.4, 2023: 37.7, 2024: 37.9 } },
    { slug: 'sumatera-utara', name: 'Sumatera Utara', capital: 'Medan', island: 'Sumatera',
      area: 72981, pop: { 2022: 15.6, 2023: 15.8, 2024: 16.0 } },
    { slug: 'banten', name: 'Banten', capital: 'Serang', island: 'Jawa',
      area: 9663, pop: { 2022: 12.1, 2023: 12.3, 2024: 12.4 } },
    { slug: 'dki-jakarta', name: 'DKI Jakarta', capital: 'Jakarta', island: 'Jawa',
      area: 664, pop: { 2022: 10.6, 2023: 10.6, 2024: 10.7 } },
    { slug: 'sulawesi-selatan', name: 'Sulawesi Selatan', capital: 'Makassar', island: 'Sulawesi',
      area: 46717, pop: { 2022: 9.2, 2023: 9.3, 2024: 9.4 } },
    { slug: 'lampung', name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatera',
      area: 34624, pop: { 2022: 9.2, 2023: 9.3, 2024: 9.4 } },
    { slug: 'sumatera-selatan', name: 'Sumatera Selatan', capital: 'Palembang', island: 'Sumatera',
      area: 91592, pop: { 2022: 8.8, 2023: 8.9, 2024: 9.0 } },
    { slug: 'riau', name: 'Riau', capital: 'Pekanbaru', island: 'Sumatera',
      area: 87024, pop: { 2022: 6.7, 2023: 6.8, 2024: 6.9 } },
    { slug: 'di-yogyakarta', name: 'DI Yogyakarta', capital: 'Yogyakarta', island: 'Jawa',
      area: 3133, pop: { 2022: 3.8, 2023: 3.8, 2024: 3.9 } },
    { slug: 'kalimantan-barat', name: 'Kalimantan Barat', capital: 'Pontianak', island: 'Kalimantan',
      area: 147307, pop: { 2022: 5.6, 2023: 5.7, 2024: 5.8 } },
  ];

  function bySlug(slug) {
    for (var i = 0; i < LIST.length; i++) if (LIST[i].slug === slug) return LIST[i];
    return null;
  }
  function density(p) { return Math.round((p.pop[2024] * 1e6) / p.area); }
  function share(p) { return (p.pop[2024] / 281.6 * 100); }

  return { LIST: LIST, bySlug: bySlug, density: density, share: share };
})();
