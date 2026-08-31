# Jeff Brown Yachts - Yacht Management Page

Self-contained static page. No build step, no framework, no package install.

- **Live:** https://ywteamyw.github.io/jby-yacht-management/
- **Repo:** https://github.com/ywteamyw/jby-yacht-management (branch `main`, deployed by GitHub Pages)
- **This bundle matches commit:** `38a44af` (18 Aug 2026)

## Run it
Open `index.html` directly in a browser, or serve the folder statically
(recommended, so the video paths resolve cleanly):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## What's inside
```
index.html      the entire page: HTML + CSS + JS in one file
assets/         images, video, logo
```

- **Fonts are embedded** as base64 `@font-face` inside `index.html`
  (Mesmerize + Myriad Pro, 6 faces). Nothing to download or license-configure.
- **All CSS and JS are inline** in `index.html`. Find a section by its comment
  header, e.g. `/* ===== HERO ===== */`, `/* ===== TESTIMONIALS ===== */`.
- **Zero external / CDN dependencies.** The only outbound reference is a normal
  navigation link to the Service & Maintenance page.

## Assets
Used by the current markup:
`hero.mp4`, `hero-poster.jpg`, `aerial.mp4`, `aerial-poster.jpg`, `jby_logo.svg`,
and the cinematic scenes `s2-service-maintenance.jpg`, `s3-berthing.jpg`,
`s4-crew.jpg`, `s5-delivery.jpg`.

Kept in the bundle but **not referenced**, as spare brand photos in case a scene
is swapped: `s1-marine-boatyard.jpg`, `s6-warranty.jpg`, `s7-survey.jpg`,
`intro.jpg`, `handoff-bg.jpg`, `hero-fallback.jpg`.

## Page structure (in source order)
`HEADER` / `HERO` / `INTRO` / `CINEMATIC SCENES` / `AERIAL DIVIDER` /
`HANDOFF` (staggered steps) / `TESTIMONIALS` / `CTA` / `FOOTER`

## Key interactive pieces (all vanilla JS, bottom of `index.html`)
- **Scroll reveals** - sections and scene images animate in via IntersectionObserver,
  with a scroll-position fallback.
- **Hero entrance** - staged transition-delays on eyebrow / h1 / p / CTA, triggered
  by adding `.in` to `#hero` on load.
- **Aerial parallax** - the divider video translates on scroll.
- **Nav scrolled state** - transparent to navy blur, plus a scroll progress bar.
- **Handoff steps** - reveal in DOM order (1, 2, 3) via staged transition-delay.
- **Testimonials slider** - flex track with a cloned card set for a seamless
  infinite loop; arrows page by two cards (one on mobile). Cards are `<figure>`
  with `margin:0` so they hold exactly 50% and the divider stays centered.
- **Smooth-scroll buttons** - any element with `data-scroll="#target"`.

## Layout system - please preserve
Site-wide gutter rule shared by every JBY page:

```css
/* content container */
max-width: 1440px; margin: 0 auto; padding: 0 40px;   /* desktop */
@media (max-width:980px){ padding: 0 24px; }          /* mobile  */
```

So above 1440px the content centres and the gutters grow with the viewport
(at 1920px the content starts 280px from the edge). Applies to `.hero-inner`,
`.handoff`, `.tmon-wrap` and the footer grid.

Two traps that have already caused real misalignments:

1. **Never set a `padding` shorthand** on a capped container just to add vertical
   space - it resets left/right to 0 and kills the 40px gutters. Use
   `padding-top` / `padding-bottom` longhands.
2. **A mobile override placed above the base rule in source order silently loses**
   (same specificity, later wins). Keep `@media (max-width:980px)` overrides
   immediately after the rule they override, not in a shared block at the top.

The header/nav is intentionally **full-bleed** (40px from the viewport edge, not
capped at 1440), so on wide screens the burger sits further left than the hero
title. That is the agreed pattern, not a bug.

## Other conventions
- **Buttons never move or scale on hover** - colour change only. Card image zoom
  on hover is fine and intended.
- Hero title is 32px / 48px line-height on desktop, 26px / 38px under 560px.
- Footer is identical on every JBY page: toll-free (888) 693-8099, info@ email,
  uppercase Locations list, 28px social icons, no street address.

## Known placeholders
Marked with HTML comments in the footer markup: the toll-free number and the
address are placeholders until final values are supplied.

## Notes
- Fully responsive. Main breakpoints: 980px, 820px, 760px, 640px, 560px.
- Tested in current Chrome and Safari. Videos autoplay muted + inline, with a
  visibilitychange retry so they resume after tab switches.
