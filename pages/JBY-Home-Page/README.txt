JEFF BROWN YACHTS — HOME PAGE (v2)
===================================

STRUCTURE
---------
JBY-Home.html        The complete home page. Self-contained:
                     - All CSS is inline in a single <style> in <head>
                     - All JS is inline in <script> tags at the end of <body>
                     - Fonts (Mesmerize, Myriad Pro) are embedded as base64
                       @font-face — no external font files needed
JBY-V3.3-assets/     Images + videos (must stay next to the HTML)

HOW TO RUN
----------
Double-click JBY-Home.html, or serve locally:
    python3 -m http.server 8000
    → http://localhost:8000/JBY-Home.html
(A local server is recommended so the autoplay videos start reliably.)

EXTERNAL DEPENDENCIES (need internet)
-------------------------------------
- Leaflet 1.9.4 (the Locations map)  — unpkg.com CDN
- Tabler Icons (chevrons, UI icons)  — CDN
Everything else is local/embedded.

KEY SECTIONS (top to bottom)
----------------------------
Hero (3 autoplay brand videos) · Intro · Brands (video slider, 7 brands) ·
Events (region filter + card strip, some cards play video on hover) ·
Three decades (scroll-driven navy color) · Client stories (gradient hover) ·
Services (bento grid) · Locations (region filter + Leaflet map) · Footer

NOTES FOR REUSE
---------------
- Region filter (Events + Locations): see `.sec-filter` CSS + the small
  filter <script> near the end of <body>; map filtering is `window._jbyMapFilter`.
- Brand slider data is the `brands` array in JS; hero slides are `heroSlides`.
- Design tokens are CSS variables in :root (--ink, --navy, --sand, --paper...).
