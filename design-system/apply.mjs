/* Put the shared rules on a page, after that page's own <style> so they
   land last.
   Usage: node design-system/apply.mjs "path/to/page.html" [more.html ...]

   Two ways in, chosen per file:
   - normally, jby-system.css is copied beside the page and linked, so the
     rules stay one editable file;
   - when the page carries a <base href> pointing at a live origin, a
     relative link would resolve against that origin and fetch nothing, so
     the rules are inlined in a marked <style> block instead. refresh.mjs
     updates both kinds. */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'jby-system.css');
const css = readFileSync(src, 'utf8');
const files = process.argv.slice(2);
if (!files.length) { console.error('give one or more html files'); process.exit(1); }

const LINK = '<link rel="stylesheet" href="./jby-system.css">';
export const OPEN = '<style data-jby-system>';
const CLOSE = '</style>';
const copied = new Set();
let linked = 0, inlined = 0;

for (const path of files) {
  let html = readFileSync(path, 'utf8');
  if (html.includes(OPEN) || html.includes(LINK)) { continue; }
  if (!html.includes('</head>')) { console.log(`- ${path} (no </head>)`); continue; }

  if (/<base\s+href=/i.test(html)) {
    html = html.replace('</head>', `${OPEN}\n${css}${CLOSE}\n</head>`);
    inlined++;
  } else {
    const dir = dirname(path);
    if (!copied.has(dir)) { copyFileSync(src, join(dir, 'jby-system.css')); copied.add(dir); }
    html = html.replace('</head>', `${LINK}\n</head>`);
    linked++;
  }
  writeFileSync(path, html);
}
console.log(`linked ${linked}, inlined ${inlined} (pages with a <base href>), css in ${copied.size} folder(s)`);
