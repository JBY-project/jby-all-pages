Jeff Brown Yachts — News & Media
================================
Single-page hub (SPA-style) in Jeff Brown Yachts styling.
One constant hero + four tabs that switch content IN PLACE (no reload, no jump):
  All · News · Videos · Events.
Minimum font-size across the platform: 16px.

Pages
-----
  index.html    The hub: constant hero + tab panels (All / News / Videos / Events)
  article.html  Article / news detail
  video.html    Single video detail (player -> YouTube)
  event.html    Past-event RECAP (facts card, vessels, gallery, video; no RSVP)

How tabs work
-------------
  - assets/app.js injects the sub-nav (All/News/Videos/Events) and, on the hub,
    switches the .hub-panel sections in place via JS (no navigation, no scroll
    jump). Deep links work: index.html#news / #videos / #events open that tab.
  - Detail pages link back to index.html#<tab>. Cards open article/video/event.

Shared assets (edit once, applies everywhere)
---------------------------------------------
  assets/styles.css   Design system, components, responsive (16px min font)
  assets/app.js       Injects header + sub-nav + tab controller + CTA + footer
  assets/fonts.css    Self-contained Mesmerize + Myriad Pro (base64)
  assets/jby_logo.svg / assets/img/

Notes: standard JBY footer (toll-free +1 (888) 693-8099, info@, Locations list).
Videos link to youtube.com/@jeffbrownyachts. Content is placeholder (real JBY
headlines/topics). Deploy: any static host; GitHub Pages ready (.nojekyll).
