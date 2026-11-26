// NusaStat entry hand-in (Node 22, standard library only).
// The site lives in app/ as plain static files — index.html plus its own
// CSS and JavaScript, no build step, no network. This program copies app/
// and screenshots/ beside it into /output (or MAKEFUN_OUTPUT_DIR) and
// writes /output/dossier.json with the vendored make.fun library, which is
// the summary the judge reads: screenshots, first-load bytes, and source.
// vendor/makefun-frontend.ts is the kit's copy, unchanged.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps mirror the gate so a local run refuses what the scorer would refuse:
// at most 4 screenshots, each at most 256 KiB; app/ at most 993 files and
// directories and 16 MiB; dossier text capped at 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
