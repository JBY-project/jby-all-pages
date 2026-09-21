/* Every hover on this page that does not land on the brand blue.

   For every visible clickable element it works out which :hover rule
   actually wins — by specificity first, then document order, the way the
   cascade does — and reports the ones that land on black or grey.

   An earlier version took the last rule in document order and called that
   the winner. It is not: `.ax-listings .cards-scroll-arr:hover` at 0,3,0
   beats a plain `.cards-scroll-arr:hover` no matter which file is read
   last, and that arrow stayed grey while the check called the page clean.

     await eval(await (await fetch('/design-system/blackhover-json.js')).text()) */
(async () => {
  await document.fonts.ready;
  // The dev server lets the browser cache jby-system.css, so a page can
  // still be showing a copy from before the last edit. Reload the sheet
  // before measuring anything, or the check reports on stale rules.
  const link = document.querySelector('link[href*="jby-system"]');
  if (link) {
    await new Promise(done => {
      const fresh = link.cloneNode();
      fresh.href = link.getAttribute('href').split('?')[0] + '?v=' + Date.now();
      fresh.onload = fresh.onerror = done;
      link.after(fresh);
      link.remove();
    });
  }

  const splitTop = t => { const out = []; let d = 0, cur = '';
    for (const ch of t) { if (ch === '(') d++; else if (ch === ')') d--;
      if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; }
    return out.concat(cur).map(x => x.trim()).filter(Boolean); };

  // (ids, classes+attributes+pseudo-classes, elements), as a single number.
  const specificity = sel => {
    let s = sel, a = 0, b = 0, c = 0;
    s = s.replace(/:where\([^)]*\)/g, ' ');
    s = s.replace(/:(is|not|has)\(([^)]*)\)/g, (_, fn, inner) => {
      const best = splitTop(inner).map(specificity).reduce((m, v) => Math.max(m, v), 0);
      a += Math.floor(best / 10000); b += Math.floor((best % 10000) / 100); c += best % 100;
      return ' ';
    });
    a += (s.match(/#[\w-]+/g) || []).length;
    b += (s.match(/\.[\w-]+|\[[^\]]+\]|:[\w-]+/g) || []).length;
    c += (s.match(/(^|[\s>+~])([a-z][\w-]*)/gi) || []).length;
    return a * 10000 + b * 100 + c;
  };

  const resolve = v => { const d = document.createElement('div'); d.style.color = v;
    document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
  const rgb = c => (c.match(/[\d.]+/g) || []).map(Number);
  // Anything that is not the brand blue. An earlier version only looked
  // for black and grey, so the knowledge centre's card, which hovers to
  // white, went unreported.
  const BRAND = [[65, 100, 123], [54, 84, 102], [44, 74, 92]];
  const offBrand = c => { const [r, g, b, al = 1] = rgb(c);
    if (al < 0.15) return false;
    return !BRAND.some(([R, G, B]) => Math.abs(r - R) + Math.abs(g - G) + Math.abs(b - B) <= 30); };

  let order = 0;
  const winner = new Map();
  const walk = list => { for (const r of list) {
    if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; }
    if (!r.selectorText || !r.selectorText.includes(':hover')) continue;
    const bg = r.style.background || r.style.backgroundColor;
    if (!bg) continue;
    order++;
    for (const one of splitTop(r.selectorText)) {
      if (!one.includes(':hover')) continue;
      const spec = specificity(one);
      let els = []; try { els = [...document.querySelectorAll(one.replace(/:hover/g, ''))]; } catch { continue; }
      for (const el of els) {
        if (!el.offsetParent) continue;
        const prev = winner.get(el);
        if (!prev || spec > prev.spec || (spec === prev.spec && order >= prev.order))
          winner.set(el, { spec, order, sel: one, bg });
      }
    }
  }};
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch {} }

  const found = {};
  for (const [el, v] of winner) {
    const fill = resolve(getComputedStyle(el).getPropertyValue(v.bg.replace(/var\(|\)/g, '').trim()) || v.bg);
    if (!offBrand(fill)) continue;
    found[v.sel] = found[v.sel] || { fill, count: 0, label: el.textContent.trim().slice(0, 20) || `${el.tagName.toLowerCase()} icon` };
    found[v.sel].count++;
  }
  return JSON.stringify({ page: document.title.slice(0, 34), notBrandBlue: found });
})()
