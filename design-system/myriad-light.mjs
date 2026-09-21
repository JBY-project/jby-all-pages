/* Rule 1: sub-text is Myriad light.
   Rewrites `font-weight:400` to `300` wherever it sits on 'Myriad Pro' —
   but NEVER inside an @font-face block. Rewriting the face itself
   re-registers the Regular file under weight 300, where it overrides the
   real Light cut and makes every page heavier instead of lighter.
   Usage: node design-system/myriad-light.mjs "pages/<folder>/<file>.html" */
import { readFileSync, writeFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) { console.error('give an html file'); process.exit(1); }

const html = readFileSync(path, 'utf8');
const faces = [...html.matchAll(/@font-face\{[^}]*\}/g)].map(m => [m.index, m.index + m[0].length]);
const insideFace = i => faces.some(([a, b]) => i >= a && i < b);

let changed = 0;
const out = html.replace(/Myriad Pro'[^;{}]*;font-weight:400/g, (hit, i) => {
  if (insideFace(i)) return hit;
  changed++;
  return hit.replace('font-weight:400', 'font-weight:300');
});

writeFileSync(path, out);
console.log(`${path}: ${changed} declaration(s) to light, ${faces.length} @font-face block(s) left alone`);
