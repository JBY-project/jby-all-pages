/* Paste into the browser console on a page that links jby-system.css.
   Reports every button the system file governs: its rendered height, and
   — the one that matters — any button whose hover fill is the same colour
   as the surface behind it, which would make it vanish on hover. That is
   how the brand-blue CTA band was found. */
(async () => {
  await document.fonts.ready;
  const splitTop = t => { const out = []; let d = 0, cur = '';
    for (const ch of t) { if (ch === '(') d++; else if (ch === ')') d--;
      if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; }
    return out.concat(cur).map(x => x.trim()).filter(Boolean); };
  
  const sys = [...document.styleSheets].find(s => (s.href || '').includes('jby-system'));
  if (!sys) return console.warn('jby-system.css is not linked on this page');

  const hovers = [];
  for (const r of sys.cssRules)
    if (r.selectorText && r.selectorText.includes(':hover'))
      for (const one of splitTop(r.selectorText)) hovers.push([one.trim(), r.style.background]);

  const behind = el => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)') return bg;
    }
    return 'rgb(255, 255, 255)';
  };
  const resolve = v => {
    const d = document.createElement('div'); d.style.color = v; document.body.appendChild(d);
    const c = getComputedStyle(d).color; d.remove(); return c;
  };

  // One winner per element: the most specific hover rule that reaches it.
  const winner = new Map();
  for (const [sel, bg] of hovers) {
    const base = sel.replace(':hover', '');
    let els = []; try { els = [...document.querySelectorAll(base)]; } catch {}
    const spec = (base.match(/\./g) || []).length;
    for (const el of els) {
      if (!el.offsetParent) continue;
      const prev = winner.get(el);
      if (!prev || spec >= prev.spec) winner.set(el, { spec, bg, base });
    }
  }

  const sizes = {}, invisible = [];
  for (const [el, v] of winner) {
    (sizes[v.base] = sizes[v.base] || new Set()).add(Math.round(el.getBoundingClientRect().height));
    const fill = resolve(getComputedStyle(el).getPropertyValue(v.bg.replace(/var\(|\)/g, '').trim()) || v.bg);
    if (fill === behind(el)) invisible.push({ selector: v.base, fill, behind: behind(el), label: el.textContent.trim().slice(0, 24) });
  }

  console.table(Object.fromEntries(Object.entries(sizes).map(([k, v]) => [k, [...v].join(' / ')])));
  if (invisible.length) { console.warn('hover would be invisible:'); console.table(invisible); }
  else console.log('no button disappears on hover');
})();
