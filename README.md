[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/serauis/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/serauis/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

# NusaStat — Portal Statistik Indonesia

A national statistics portal for Indonesia that runs entirely offline
from static files: no network requests, no libraries, no build step.
Every figure carries its source and year (Badan Pusat Statistik).

## What is inside

- **Beranda** — headline KPIs (population, growth, inflation, poverty),
  a "what the numbers mean for one family" strip, GDP-growth and
  population-by-island charts, top provinces, and BPS news.
- **Penjelajah Indikator** — 33 key indicators with live search,
  category chips, sorting, and a 2022–2024 year selector.
- **Provinsi** — the 12 most populous provinces, with a detail page per
  province (population trend chart, density, national share).
- **Ekonomi** — growth, inflation, and trade charts behind working tabs.
- **Penduduk** — age structure, density, urban share, bonus demografi.
- **Metodologi** — every source publication listed, plus reading notes
  and limitations.

## Structure

- `app/index.html` — page shell, navigation, year selector
- `app/style.css` — original design (deep teal + terracotta)
- `app/main.js` — hash router and app state
- `app/views.js` — one render function per page
- `app/charts.js` — hand-rolled SVG line / bar / column charts
- `app/data.js` — national figures, each with source + year
- `app/provinces.js` — province figures
- `main.ts` — hand-in program: copies `app/` + `screenshots/` to
  `/output` and writes `dossier.json` (run with `MAKEFUN_OUTPUT_DIR=out`)

## Design ladder

16 design variants (4 palettes × 4 hero layouts) were rendered locally
and scored pairwise; the winner — palette 1, balanced hero — ships as
the default. See `LADDER.md` for the full table.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
