/* Lists the page's own hover rules for button-looking elements the system
   file does not yet reach, so the next batch knows what to add.
     await eval(await (await fetch('/design-system/probe-json.js')).text()) */
(async () => {
  await document.fonts.ready;
  const splitTop = t => { const out = []; let d = 0, cur = '';
    for (const ch of t) { if (ch === '(') d++; else if (ch === ')') d--;
      if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; }
    return out.concat(cur).map(x => x.trim()).filter(Boolean); };
  
  const sys = [...document.styleSheets].find(s => (s.href || '').includes('jby-system'));
  const owned = [];
  if (sys) for (const r of sys.cssRules) if (r.selectorText)
    for (const o of splitTop(r.selectorText)) owned.push(o.trim().replace(':hover', ''));
  const matches = (el, s) => { try { return el.matches(s); } catch { return false; } };

  const targets = new Set();
  for (const el of document.querySelectorAll('a,button,input[type=submit]')) {
    if (!el.offsetParent) continue;
    const c = getComputedStyle(el), r = el.getBoundingClientRect();
    if ((c.backgroundColor === 'rgba(0, 0, 0, 0)' && parseFloat(c.borderTopWidth) === 0) || r.width < 50 || r.height < 24 || r.height > 90) continue;
    if (owned.some(s => matches(el, s))) continue;
    targets.add(el);
  }

  const out = {};
  const walk = list => { for (const r of list) {
    if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; }
    if (!r.selectorText || !r.selectorText.includes(':hover')) continue;
    const bg = r.style.background || r.style.backgroundColor;
    if (!bg) continue;
    for (const one of splitTop(r.selectorText)) {
      const s = one.trim(), base = s.replace(/:hover.*$/, '');
      for (const el of targets) if (matches(el, base)) {
        (out[base] = out[base] || { hover: new Set(), height: new Set() });
        out[base].hover.add(bg);
        out[base].height.add(Math.round(el.getBoundingClientRect().height));
      }
    }
  }};
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch {} }

  return JSON.stringify({
    page: document.title.slice(0, 30),
    needs: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { hover: [...v.hover].join(' | '), h: [...v.height].join('/') }])),
  });
})()
