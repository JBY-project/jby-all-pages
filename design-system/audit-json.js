/* Same checks as audit.js, but returns JSON instead of printing. Load it
   from a page with:
     await eval(await (await fetch('/design-system/audit-json.js')).text())
   Reports, for one page: every button the system file governs and its
   height; any button whose hover fill equals the surface behind it; and
   any button-looking element the system file does not reach at all. */
(async () => {
  await document.fonts.ready;
  const splitTop = t => { const out = []; let d = 0, cur = '';
    for (const ch of t) { if (ch === '(') d++; else if (ch === ')') d--;
      if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; }
    return out.concat(cur).map(x => x.trim()).filter(Boolean); };
  
  // A page may also pull a stylesheet from a CDN; those throw on .cssRules.
  const readable = sh => { try { return sh.cssRules && sh; } catch { return null; } };
  const sys = [...document.styleSheets].filter(readable).find(s => (s.href || '').includes('jby-system'));
  if (!sys) return JSON.stringify({ page: document.title, error: 'jby-system.css not linked or not readable' });

  const all = [], hovers = [];
  for (const r of sys.cssRules) {
    if (!r.selectorText) continue;
    for (const one of splitTop(r.selectorText)) {
      const s = one.trim();
      all.push(s.replace(':hover', ''));
      if (s.includes(':hover')) hovers.push([s.replace(':hover', ''), r.style.background]);
    }
  }
  const matches = (el, s) => { try { return el.matches(s); } catch { return false; } };
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

  const winner = new Map();
  for (const [base, bg] of hovers) {
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
    if (fill === behind(el)) invisible.push({ selector: v.base, behind: behind(el), label: el.textContent.trim().slice(0, 22) });
  }

  const uncovered = {};
  for (const el of document.querySelectorAll('a,button,input[type=submit]')) {
    if (!el.offsetParent) continue;
    const c = getComputedStyle(el), r = el.getBoundingClientRect();
    const looksLikeAButton = (c.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(c.borderTopWidth) > 0)
      && r.width > 50 && r.height > 24 && r.height < 90;
    if (!looksLikeAButton || all.some(s => matches(el, s))) continue;
    const key = el.tagName.toLowerCase() + '.' + [...el.classList].join('.');
    uncovered[key] = uncovered[key] || { count: 0, height: Math.round(r.height), label: el.textContent.trim().slice(0, 22) };
    uncovered[key].count++;
  }

  return JSON.stringify({
    page: document.title.slice(0, 34),
    governed: Object.fromEntries(Object.entries(sizes).map(([k, v]) => [k, [...v].join('/')])),
    hoverInvisible: invisible,
    uncovered,
  });
})()
