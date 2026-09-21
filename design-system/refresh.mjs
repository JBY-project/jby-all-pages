/* Push the current jby-system.css to every page that already carries it —
   both the copied-and-linked kind and the inlined kind (pages with a
   <base href>, where a relative link cannot work).
   Usage: node design-system/refresh.mjs */
import { readdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'jby-system.css');
const css = readFileSync(src, 'utf8');
const OPEN = '<style data-jby-system>';
let copies = 0, blocks = 0;

const walk = dir => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== '.snapshots') walk(p); continue; }
    if (entry.name === 'jby-system.css') { copyFileSync(src, p); copies++; continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = readFileSync(p, 'utf8');
    const i = html.indexOf(OPEN);
    if (i === -1) continue;
    const j = html.indexOf('</style>', i);
    writeFileSync(p, html.slice(0, i) + OPEN + '\n' + css + html.slice(j));
    blocks++;
  }
};
walk('pages');
console.log(`refreshed ${copies} copies and ${blocks} inlined blocks`);
