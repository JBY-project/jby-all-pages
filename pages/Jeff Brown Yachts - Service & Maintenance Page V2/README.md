# Jeff Brown Yachts — Service & Maintenance (Variant 2)

Static, self-contained page. Live reference:
https://ywteamyw.github.io/jby-service-maintenance-2/

## Contents
- `index.html` — the full page (HTML + CSS + JS inline; Mesmerize & Myriad Pro fonts embedded as base64 @font-face).
- `assets/` — all images and videos used by the page (hero video, office photos, brand logos, etc.).
- `README.md` — this file.

## How to run / integrate
Open `index.html` directly in a browser, or drop the folder onto any static host.
All asset paths are relative (`./assets/...`), so keep `index.html` and `assets/` together.

## External dependencies (load from CDN — internet required)
- **Leaflet 1.9.4** — `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` and `.../leaflet.js` (Locations map).
- **CARTO light basemap tiles** — `https://{s}.basemaps.cartocdn.com/light_all/...`.
Everything else (fonts, styles, scripts) is inline; no build step, no npm.

## Locations — category model (map, filters, cards, modal, markers all in sync)
Filters: **All (9) · Sales (8) · Service (4) · Mobile Service (4) · Maritime (1)**. A location can belong to several categories (`data-types` on each `.loc-item`).
- **Sales (8):** San Diego, Newport Harbor, Marina del Rey, Sausalito, Seattle, Kona, Wrightsville Beach, Charleston.
- **Service (4):** San Diego Marina & Boatyard, Sausalito, Seattle, Wrightsville Beach.
- **Mobile Service (4):** San Diego, Newport Harbor, Sausalito, Seattle.
- **Maritime (1):** Newport Harbor (also Sales & Mobile).
Map markers reflect the primary category: service = wrench square, maritime = sand dot, sales = navy dot.

## Certifications section ("Factory-Certified Service")
Three brand tiles (white logo on dark tile) each with a checkmark list of the certifications held:
- **Mercury:** Outboard Certified Technician · Advanced EFI & Catalyst · Steering & Controls.
- **Webasto:** Thermo & Comfort North America Specialist.
- **ABYC:** Master Technician Certification · Marine Systems Technician.
6 unique certifications (deduplicated by brand from the 9 per-technician entries).
Logo assets: `mercury-marine-logo.svg`, `webasto-logo-white.svg` (sourced and recolored white),
`abyc-logo-white.png` (from client file, recolored white on transparent). Swap any for an official
vector by dropping a white-on-transparent file into `assets/` and updating the `src`.

## Placeholder content still pending from the client
- "Meet the Team" — real service/warranty/mobile-service tech headshots.
- Horizontal service video (post-shoot) — currently existing imagery.
- Replacement engine / lower-unit photo (new photoshoot).
- Customer Reviews — final testimonial copy (current text is placeholder).

## Notes
- No em-dash policy applies site-wide; a couple of legacy strings may still need a pass.
- Responsive/mobile is tuned: single-line scrollable filters, full-width CTAs, 2-line headings, footer back-to-top, hero sized with `svh`.
