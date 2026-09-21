# Jeff Brown Yachts — Home page V1

Live HTML build of the Figma frame **"Home page - V1"**
(`MN091X2k7mLZfincVKVdjR`, node `62286-32369`).

Live: https://ywteamyw.github.io/jby-home-v1/

One self-contained `index.html` plus `assets/`. No build step. The only external
dependency is Leaflet (CDN) for the locations map.

## Sections

| # | Section | Notes |
|---|---------|-------|
| 1 | Hero | background video, 44/64 headline, two CTAs |
| 2 | Yachts for sale | card rail, "Open House" badge, price-reduced flag |
| 3 | Upcoming events & private experiences | card rail, navy "Request to attend" |
| 4 | Built around the owner | background video banner |
| 5 | Access to world-class brands | background video banner |
| 6 | The builders we represent | 4x2 grid, 8 brands |
| 7 | Support for every stage of ownership | 6 full-bleed bands |
| 8 | Locations, marinas & boatyards | region filter + list + map + preview modal |
| 9 | Get expert guidance + footer | navy CTA band, footer |

## Design tokens (from the Figma variables)

```
Mesmerize   44/64  headline lg      Myriad Pro  20/28  text xl
            32/48  headline md                  18/28  text lg
            28/40  headline sm                  16/24  text md
            20/28  headline 2xs                 14/20  text sm
            16/24  headline 4xs
navy #41647b   page #fcfcfd   section #f4f6f9   ink #2f2f39
mute #575760   line #eeeef0   success #119555   soft #dcdcde   sand #bdb19d
```

Gutters: `.wrap` = max-width 1440, 40px desktop / 24px mobile.
Header and hero are sized to match the live home page: 24/40 padding with a
72px logo on desktop, 16/24 with 56px on phones; the hero is `100vh` with a
620px floor.

## Video

| File | Used by |
|------|---------|
| `assets/hero_aerial.mp4` | hero, and the "Access to world-class brands" banner (offset 8s) |
| `assets/promo_riva.mp4` | "Built around the owner" banner |

Banner videos are lazily hydrated by an IntersectionObserver and paused
off-screen.

## Locations block

Ported from the live home page: region filter (All / West Coast / East Coast),
"Marinas & Boatyards" and "Sales Offices" groups, per-office address, phone,
hours and description, the Maritime pill on Newport Harbor, and a preview modal.

The map uses **Esri "World Light Gray"** tiles. CARTO's anonymous basemaps now
return tiles stamped "API KEY REQUIRED", so they can no longer be used unkeyed.

> The live home page also has a Mapbox branch carrying an access token
> restricted to that production domain. It is deliberately **not** copied here —
> that is a credential, and it would not work off that domain anyway. This page
> uses the same code's Leaflet fallback.

## Phone behaviour

* Card rails (yachts, events, brands) snap the card to the **centre** with an
  equal sliver of each neighbour. The first card rests on the page gutter,
  aligned with its heading; centring starts from card two.
* Cards are 300px wide with a 12px gap; 12px padding inside each card.
* Section headings share one size with the service-band headings at every
  breakpoint (20/28 phones, 24/34 tablets, 28/40 desktop).
* Three headings shorten on phones so they hold one line beside their button:
  "Yachts for sale" → "For sale", "Upcoming events & private experiences" →
  "Events", "Locations, marinas & boatyards" → "Locations".
* Every section runs 72 above the heading, 32 to its content, 72 below.

## Deviations from the Figma frame

* The hero is viewport-height rather than the Figma's fixed 920px band, to match
  the live home page.
* Brand wordmarks: Riva, Axopar, Pershing, BRABUS, Sirena, Wally and Jeanneau
  use the marks from the Figma file. Four Winns exists only as a light mark, so
  it is rendered through `brightness(0)`.
* The banners carry a stronger bottom scrim than the Figma still, because the
  live footage runs through bright frames the static comp never shows.
* Footer contact block follows this frame (`+1 619-222-9899`,
  `jeff@jeffbrownyachts.com`, street address) rather than the site-wide footer
  (toll-free number, `info@`, Locations column).
