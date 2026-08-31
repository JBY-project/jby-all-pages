JEFF BROWN YACHTS — "ABOUT US" PAGE
====================================

Static, self-contained page. No build step, no dependencies, no package manager.

CONTENTS
--------
about.html          The full page (HTML + CSS + JS inline, fonts embedded).
assets/
  hero.mp4          Hero background video (H.264, 1920x1064, muted/loop).
  story.jpg         "Our Story" photo.
  team.jpg          "Our Team" banner photo.
  locations.jpg     "Locations" banner photo.
  jby_logo.svg      JBY roundel logo (used in header + footer).

HOW TO RUN / PREVIEW
--------------------
The video needs to be served over HTTP (opening the file directly with file://
can block video playback in some browsers). From this folder:

    python3 -m http.server 8000

then open  http://localhost:8000/about.html

Any static host works (GitHub Pages, Netlify, S3, nginx, etc.). Just deploy
about.html + the assets/ folder together, keeping the relative ./assets/ paths.

Currently live at:
    https://ywteamyw.github.io/jby-homepage.github.io/about.html
(there it is deployed as about.html with an "about-assets/" folder; paths are
the only difference from this package, which uses "assets/").

NOTES FOR THE DEVELOPER
-----------------------
- FONTS: Mesmerize (headings) and Myriad Pro (body) are embedded directly in
  about.html as base64 woff2 @font-face rules. No external font files or CDN
  requests — the page is fully offline-capable.

- HERO VIDEO: <video> is autoplay + muted + loop + playsinline. Browsers only
  autoplay muted video (by design). A small script keeps it playing and resumes
  it if the browser pauses it or the tab is backgrounded. No poster image.

- ANIMATIONS (all CSS/vanilla JS, no libraries):
    * Scroll reveal — sections/blocks rise + fade in as they enter the viewport
      (scroll-driven; nothing can get stuck hidden).
    * Hero text fades up in sequence on load.
    * "Our Team" and "Locations" banners: slow Ken Burns push-in while in view,
      plus a subtle image zoom on hover (media wrapper composes both transforms).
    * "Our Story" image zooms slightly on hover.
    * All motion is disabled under prefers-reduced-motion.

- STAT CARDS ("Built around…") intentionally have NO hover effect (not clickable).

- LINKS: header/footer nav, the "Meet the Team", "Find an Office",
  "View Team Members", "View Our Offices", "Contact us" buttons, footer
  Locations, and social icons are placeholders (href="#" / in-page anchors).
  Wire these to real destinations during integration.

- RESPONSIVE: breakpoints at 980px (nav/hero/layout) and 860px (footer).
  Verified at desktop (1440) and mobile (390) widths.

- BROWSER SUPPORT: modern evergreen browsers (Chrome, Safari, Firefox, Edge).
