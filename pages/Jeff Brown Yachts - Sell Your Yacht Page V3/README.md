# Jeff Brown Yachts - Sell Your Yacht (V3)

Full copy of V2 with a **Brokerage FAQ** section added before the contact/CTA.
Self-contained static page. No build step, no framework, no package install.

- **Live:** https://ywteamyw.github.io/jby-sell-your-yacht-v3/
- **Repo:** https://github.com/ywteamyw/jby-sell-your-yacht-v3 (branch `main`, deployed by GitHub Pages)
- **This bundle matches commit:** `3fdfb31` (29 Aug 2026)

## Run it
Serve the folder statically (required here, because the fonts load from a
separate CSS file):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## What's inside
```
index.html          the page: HTML + CSS + JS in one file
assets/fonts.css    Mesmerize + Myriad Pro, base64 embedded (~190KB)
assets/             images, video, logo
assets/gallery/     showcase gallery images
```

- **Fonts live in `assets/fonts.css`**, base64 embedded. Keep the path intact or the
  page falls back to system sans-serif.
- **All CSS and JS are inline** in `index.html`. Find a section by its comment
  header, e.g. `/* HERO */`, `/* BROKERAGE FAQ */`, `/* CONTACT / VALUATION */`.
- **Zero external / CDN dependencies.**

## Page structure (in source order)
`HEADER` / `HERO` (title + sub + metric row + CTA) / `SECTION NAV` (sticky mini-menu
with scroll spy, incl. a FAQ link) / `SUPPORT` (intro + feature cards) /
`CINEMATIC BAND` / `PROCESS` / `EXPOSURE` (gallery + Social Reach) / `TESTIMONIALS` /
**`BROKERAGE FAQ`** / `CONTACT / VALUATION` / `FOOTER`

## What differs from V2
- **Brokerage FAQ** accordion added **before the contact form** (10 Q&A). Styling is
  taken from the JBY FAQ page: question 20px (18px mobile), answer 17px, a +/- sign,
  hairline dividers, smooth max-height expand. Only one item's markup pattern to copy
  for more: `.faq-item > .faq-q + .faq-a > .faq-a-in`.
- A **FAQ** link was added to the sticky section nav.
- Everything else (gallery, lightbox, testimonials, hero, footer) is identical to V2.

## Key interactive pieces (all vanilla JS, bottom of `index.html`)
- **Showcase gallery** - tabs (3D Tour / Videos / Photos): desktop = full-bleed 16:9
  hero + thumbnail strip + arrows + `01 / NN` counter; mobile = 2-column editorial
  grid; tiles/hero open a **lightbox** (counter + "Take the tour" on 3D-tour items).
- **Testimonials** - "What our clients say", 2-up slider with a seamless infinite loop.
- **Brokerage FAQ** - single-open accordion; edit the Q&A directly in the markup.
- **Section nav / parallax / valuation form** (front-end demo only).

## Placeholder data to confirm with JBY
- Hero **$1B+** / **2,000+**; Social Reach **Instagram 10.3K**, **YouTube 2.7K**
  (Monthly reach 1.2M and Marketing channels 9 are placeholders).
- Testimonials are sample copy; 3D-tour names/images and the "Take the tour" links
  are placeholders.
- FAQ phone shown is (619) 222-9899.
