/* Rule 5: the type scale.

   The client asked for smaller headers and named 20 for a section header.
   The scale the home page was taken to by hand, and this rolls it out:

       26/38  page or hero title
       20/30  section header
       18/28  card title, sub-head

   and inside a narrow @media block, one step quieter again:

       20/30  page or hero title
       18/26  section header
       16/24  card title, sub-head

   Usage:
     node design-system/type-scale.mjs --dry            every published page
     node design-system/type-scale.mjs "pages/<folder>" one page
     node design-system/type-scale.mjs --dry "pages/<folder>"

   WHY THIS IS NOT A STYLESHEET RULE. The other four rules live in
   jby-system.css, which is linked after each page's inline style and wins on
   order. A size rule cannot: the pages spell their headings out in @media
   blocks as well, and one flat rule in a later file would flatten every
   phone size onto the desktop one. So this is a pass over the page's own
   CSS, the way rule 1 is.

   THREE THINGS IT HAS TO GET RIGHT, each of which broke a draft of it:

   1. Not by size. The largest type on this site is not headings.
      `.builders .mark .word` is the brand wordmark at 96px, `.qm` and `.mk`
      are the giant quote marks in the testimonials, `.step .num`,
      `.loan-out .amt` and `.reach-stat .rs-v` are figures. A rule is only
      touched when its SELECTOR says heading, and DECOR names the ones that
      look like headings and are not.

   2. Desktop is decided by position, not size. Pages do not share a hero
      size: the home page's is 40px, several others are 32px. Reading 32 as
      "small, so it must be a phone override" gave those pages a 20px desktop
      hero. A rule is the desktop one when it sits outside any max-width
      @media block, and that is the only test.

   3. A selector keeps the tier its base rule had. `.hero-title` is a hero at
      24px on one page; a bare class inside a media query carries no tag to
      read. So each selector's tier is worked out once, from its base rule,
      and reused for its overrides.
*/
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* ---- the scale -------------------------------------------------------- */
const TIER = {
  hero:    { base: [26, 38], narrow: [20, 30] },
  section: { base: [20, 30], narrow: [18, 26] },
  card:    { base: [18, 28], narrow: [16, 24] },
};

/* ---- what counts as a heading ----------------------------------------- */
const HEADINGISH = /(^|[\s,>.+~])h[1-5]\b|title|head|heading/i;
/* Looks like a heading by name, is not one: figures, wordmarks, quote marks,
   icon glyphs. */
const DECOR = /\.(qm|mk|num|amt|word|rs-v|d|t-mono|datebig)\b|\bi$|icon|arr\b/i;
/* Bare classes whose tier cannot be read off a tag. Names beat sizes here:
   `.s-title` is a section title at 32px on eight pages, and reading 32 as
   "big, therefore a hero" promoted every one of them. */
/* `-card\b` and not plain `card`, so that `.cards-head h2` stays a section
   header instead of being read as something inside a card. */
const CARD_NAMED    = /-card\b|\bcard\b|pe-title|lv-title/i;
const HERO_NAMED    = /hero|page-?head|phead|profile-info|listing-title|sr-title/i;
const SECTION_NAMED = /s-title|section-title|sec-title|cat-title|about-title|ov-title|asplit-title|m-title|ag-title|ob-title/i;

function tierFromSelector(selector, px) {
  /* Being inside a card beats the tag. `.article-card h1` is a card title
     that happens to be marked up as an h1, and the tag alone made it a hero
     the size of a page title. */
  if (CARD_NAMED.test(selector)) return 'card';
  if (/(^|[\s,>.+~])h1\b/i.test(selector)) return 'hero';
  if (/(^|[\s,>.+~])h2\b/i.test(selector)) return 'section';
  if (/(^|[\s,>.+~])h[345]\b/i.test(selector)) return 'card';
  if (HERO_NAMED.test(selector)) return 'hero';
  if (SECTION_NAMED.test(selector)) return 'section';
  /* a bare class nothing above recognises: the only thing left to read is
     how big the page made it */
  if (px >= 32) return 'hero';
  if (px >= 24) return 'section';
  return 'card';
}

/* ---- where the max-width blocks are ----------------------------------- */
function narrowRegions(css) {
  const out = [];
  const rx = /@media[^{]*max-width[^{]*\{/gi;
  let m;
  while ((m = rx.exec(css))) {
    let depth = 1, i = m.index + m[0].length;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    out.push([m.index, i]);
  }
  return out;
}

/* ---- the pass --------------------------------------------------------- */
const RULE = /([^{}@]+)\{([^{}]*)\}/g;

/* A rule's selector capture starts after the previous rule's closing brace,
   so it picks up any comment written above it. `/* Section titles *​/ .s-title`
   read as a bare class, and the size fallback called a 32px one a hero.
   Strip the comments before anything looks at the selector. */
const cleanSelector = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();

/* A page whose CSS lives in its own file rather than an inline <style>: the
   four Knowledge Centre pages keep theirs in assets/styles.css, and the first
   run of this pass skipped all four without a word. Treat the whole file as
   one style block. */
function rewriteCssFile(css) {
  const fake = `<style>${css}</style>`;
  const { out, changes } = rewrite(fake);
  return { out: out.slice('<style>'.length, out.length - '</style>'.length), changes };
}

function rewrite(html) {
  const changes = [];
  const styles = [...html.matchAll(/<style[^>]*>(.*?)<\/style>/gs)];
  let out = html;
  const tierOfSelector = new Map();   /* decided once, from the base rule */

  /* First pass over every block, base rules only, to fix each selector's
     tier before any override is read. */
  for (const sm of styles) {
    const block = sm[1];
    const narrow = narrowRegions(block);
    RULE.lastIndex = 0;
    let m;
    while ((m = RULE.exec(block))) {
      const selector = cleanSelector(m[1]);
      const fs = /font-size:\s*(\d+)px/.exec(m[2]);
      if (!fs) continue;
      const px = Number(fs[1]);
      if (px < 22 || !HEADINGISH.test(selector) || DECOR.test(selector)) continue;
      const isNarrow = narrow.some(([a, b]) => m.index >= a && m.index < b);
      if (isNarrow || tierOfSelector.has(selector)) continue;
      tierOfSelector.set(selector, tierFromSelector(selector, px));
    }
  }

  /* Second pass rewrites. Blocks back to front so offsets stay valid. */
  for (const sm of [...styles].reverse()) {
    const block = sm[1];
    const blockStart = sm.index + sm[0].indexOf(block);
    const narrow = narrowRegions(block);
    const edits = [];

    RULE.lastIndex = 0;
    let m;
    while ((m = RULE.exec(block))) {
      const selector = cleanSelector(m[1]);
      const decls = m[2];
      const fs = /font-size:\s*(\d+)px/.exec(decls);
      if (!fs) continue;
      const px = Number(fs[1]);
      if (px < 22 || !HEADINGISH.test(selector) || DECOR.test(selector)) continue;

      const isNarrow = narrow.some(([a, b]) => m.index >= a && m.index < b);
      const tier = TIER[tierOfSelector.get(selector) ?? tierFromSelector(selector, px)];
      const [size, leading] = isNarrow ? tier.narrow : tier.base;

      /* This pass only ever makes a heading smaller. A few pages already sit
         under their tier — a 24px listing title, a 22px search-results title —
         and the tier size would have grown them, which is the opposite of
         what was asked for. */
      if (size >= px) continue;

      const lh = /line-height:\s*(\d+)px/.exec(decls);

      let next = decls.replace(/font-size:\s*\d+px/, `font-size:${size}px`);
      if (lh) next = next.replace(/line-height:\s*\d+px/, `line-height:${leading}px`);

      const declStart = blockStart + m.index + m[0].indexOf(decls, m[1].length);
      edits.push({ start: declStart, end: declStart + decls.length, next });
      changes.push({
        selector: selector.slice(0, 60),
        where: isNarrow ? 'phone ' : 'base  ',
        from: `${px}${lh ? '/' + lh[1] : ''}`,
        to: `${size}${lh ? '/' + leading : ''}`,
      });
    }

    for (const e of edits.reverse()) out = out.slice(0, e.start) + e.next + out.slice(e.end);
  }
  return { out, changes };
}

/* ---- which pages ------------------------------------------------------ */
/* The published list, read off the README's checklist so the two cannot
   drift. Unchecked pages are excluded on purpose. */
function publishedFolders() {
  const readme = readFileSync('design-system/README.md', 'utf8');
  return [...readme.matchAll(/^- \[x\] `([^`]+)`/gm)].map(m => m[1]);
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const only = args.find(a => !a.startsWith('--'));

/* The home page was taken to this scale by hand. Its hero is already 26,
   which this pass would read as a base rule and leave alone, but its modal
   heading was judged a section header rather than a card one. Leave it. */
const DONE = 'Jeff Brown Yachts - Home Page';

let folders = only ? [only.replace(/^pages\//, '').replace(/\/$/, '')] : publishedFolders();
if (!only) folders = folders.filter(f => f !== DONE);

let files = 0, ruleCount = 0;
for (const folder of folders) {
  const dir = join('pages', folder);
  if (!existsSync(dir)) { console.error(`  ! missing: ${dir}`); continue; }
  /* the page's own stylesheets, if it keeps any. jby-system.css is the design
     system itself and fonts.css carries only @font-face. */
  const targets = [];
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.html')) targets.push([join(dir, name), 'html']);
  }
  const assets = join(dir, 'assets');
  if (existsSync(assets)) {
    for (const name of readdirSync(assets)) {
      if (!name.endsWith('.css')) continue;
      if (name === 'jby-system.css' || name === 'fonts.css') continue;
      targets.push([join(assets, name), 'css']);
    }
  }

  for (const [path, kind] of targets) {
    if (!statSync(path).isFile()) continue;
    const source = readFileSync(path, 'utf8');
    const { out, changes } = kind === 'css' ? rewriteCssFile(source) : rewrite(source);
    if (!changes.length) continue;
    files++; ruleCount += changes.length;
    console.log(`\n${path}  (${changes.length})`);
    for (const c of changes) console.log(`   ${c.where} ${c.from.padStart(7)} -> ${c.to.padEnd(7)} ${c.selector}`);
    if (!dry) writeFileSync(path, out);
  }
}
console.log(`\n${dry ? 'would change' : 'changed'} ${ruleCount} rule(s) in ${files} file(s) across ${folders.length} page(s)`);
