# Jeff Brown Yachts - Sell Your Yacht (V2)

Self-contained static page. No build step, no framework, no package install.

- **Live:** https://ywteamyw.github.io/jby-sell-your-yacht-v2/
- **Repo:** https://github.com/ywteamyw/jby-sell-your-yacht-v2 (branch `main`, deployed by GitHub Pages)
- **This bundle matches commit:** `84c6249` (29 Aug 2026)

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

- **Fonts live in `assets/fonts.css`**, not inline. It is linked from `<head>` and
  everything is base64 embedded inside it, so there are no separate font files and
  nothing to license-configure. Keep the `assets/fonts.css` path intact or the page
  silently falls back to system sans-serif.
- **All CSS and JS are inline** in `index.html`. Find a section by its comment
  header, e.g. `/* HERO */`, `/* CINEMATIC BAND */`, `/* CONTACT / VALUATION */`.
- **Zero external / CDN dependencies.**

## Assets
Used by the current markup: `hero.mp4`, `hero-poster.jpg`, `cine.mp4`,
`cine-poster.jpg`, `jby_logo.svg`, `fonts.css`, and in `gallery/`:
`interior.jpg`, `tour-2.jpg`, `promo.jpg`, `riva-profile.jpg`, `riva-aerial.jpg`,
`tahoe-riva.jpg`, `riva-bow.jpg`.

Kept but **not referenced**: `gallery/aerial.jpg`, `gallery/riva-run.jpg`,
`gallery/tour-3.jpg`, `jby-consult-overlook.jpg`.

## Page structure (in source order)
`HEADER` (transparent to navy blur) / `HERO` (title + sub + metric row + CTA) /
`SECTION NAV` (sticky mini-menu with scroll spy) / `SUPPORT` (intro + feature cards) /
`CINEMATIC BAND` / `PROCESS` (staggered staircase) / `EXPOSURE` (heading + gallery +
Social Reach) / `TESTIMONIALS` / `CONTACT / VALUATION` / `FOOTER`

## Key interactive pieces (all vanilla JS, bottom of `index.html`)
- **Showcase gallery** - model-page style, tabs (3D Tour / Videos / Photos):
  - **Desktop:** a full-bleed 16:9 stage with a large hero, a thumbnail strip,
    prev/next arrows, and a `01 / NN` counter top-right. Labels sit on the image;
    the 3D Tour tab carries a centered "Take the tour" button.
  - **Mobile (<=760px):** the stage collapses into a 2-column editorial grid of
    tiles (varied aspect ratios, last-odd tile full-width); tapping a tile opens
    the lightbox. Tabs stay as the switcher.
  - The slide set is defined in the `GAL` object near the `/* Listing marketing */`
    comment, so swapping content means editing that object, not the markup.
- **Lightbox** - full-screen 16:9 viewer with prev/next, Escape, swipe, and a
  `01 / NN` counter (under the photo on desktop, top-left on mobile). Videos play
  with controls/sound; **3D Tour items show a "Take the tour" button on the photo**
  (placeholder until real 360 tour URLs are provided).
- **Parallax** - hero video and the cinematic band translate on scroll.
- **Testimonials** - "What our clients say", a 2-up editorial slider with a
  seamless infinite loop (cloned card set) and a divider that travels with each pair.
- **Section nav** - appears once the hero has scrolled past, highlights the current
  section, smooth-scrolls on click.
- **Valuation form** - front-end demo only (no submission wired).

## Placeholder data to confirm with JBY
- Hero metrics **$1B+** (sold) and **2,000+** (boats sold) are impressive
  placeholders.
- Social Reach: **Instagram 10.3K** and **YouTube 2.7K** are the stated figures;
  **Monthly reach 1.2M** and **Marketing channels 9** are placeholders.
- Testimonials are sample copy; replace with real client reviews.
- 3D Tour yacht names/images and the "Take the tour" links are placeholders.
