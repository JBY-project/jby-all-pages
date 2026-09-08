# Event page — mirror of the live site

A copy of `https://jb.apdstack.com/experiences/cannes-yachting-festival`, taken
2026-09-08, so the page can be worked on here and previewed like the rest of
the pages in this repository.

It is a mirror, not the source. Anything changed here has to be applied to the
real site by whoever owns that codebase — this folder is where the change gets
designed and shown, not where it ships from.

What was rewritten to make it stand on its own:

- every `/assets/…` the page names is downloaded under `assets/`, and the
  references in the HTML are relative
- stylesheets keep their own depth: `url(/assets/…)` became `url(../../assets/…)`
- `assets/js/jby-intro.js` asked for the intro logo by absolute path; that one
  is relative now too

Still pointing outward, deliberately: Font Awesome from cdnjs, the Crisp chat
widget, and every in-site link (`/about`, `/brands/…`, `/experiences`), which
resolve against whatever host serves the copy.
