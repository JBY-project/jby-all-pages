#!/usr/bin/env python3
"""Two site-wide passes: section headings in the brand blue, and a blue header.

    python3 tools/blue-headings-and-header.py --headings --all
    python3 tools/blue-headings-and-header.py --header --all
    python3 tools/blue-headings-and-header.py --headings --header --all --dry-run

HEADINGS. Every section heading on a light ground goes to --navy. In practice
that means, in any rule whose selector names a heading, a dark colour becomes
var(--navy): var(--ink), #111, and --c0 on the model page, which is that page's
name for black. A heading already set in white is left alone — it is white
because it stands on a photograph or a dark band, and "headings should be blue"
cannot mean the ones nobody could then read. Headings with no colour of their
own are left alone for the same reason: they inherit, usually from a dark band.

HEADER. The blue header the locations page carries, on the pages whose hero has
no photograph, no video and no dark ground of its own. Measured in a browser
rather than read out of the CSS: nine pages qualify, and they are listed in
HEADER_PAGES below with what was measured.

The header goes in as a block appended after the page's own styles rather than
by rewriting each page's .nav rules, which are all slightly different. Same
specificity, later in the file, so it wins; and a page that later wants its own
header back only has to delete the block. The one rule that needs to outrank
something is the logo filter, where a couple of pages carry
`.nav:not(.scrolled) .logo img` — that is (0,2,1), the same as `.nav .logo img`,
so order settles it.
"""

import argparse
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK = "/* === JBY: the header is blue from the first frame ==="

# What counts as a section heading. Matched against the selector text.
#
# The first pass matched on the tag and on the classes that read as headings,
# and that missed the ones a page happens to name otherwise. "More client
# stories" on the home page is an <h3 class="voices-sub"> — a section heading by
# every measure except the two this was looking at. These are the ones found by
# going the other way: rules set in the display face, uppercase, 17-34px and a
# dark colour, then read one by one to see what they actually head.
#
# What that sweep turned up and what was deliberately NOT added: the titles of
# cards and list items (.event-card h4, .loc-card h3, .visit-item-l h5,
# .cert-word, .step .tag, .v9-name, .spec-block-title, .loc-modal-body h3), the
# name of an event (.ev-title), and the <h1> that titles a whole page
# (.nf h1, .faq-head h1, .pp-head h1, .team-head h1, .loc-head h1, .ci-head h1,
# .phead h1, .ob-title, .profile-info h1). A card title is not a section title,
# and a page title is a bigger decision than this one.
HEADING = re.compile(r"\b(h2|h-sm|h-xs|sec-title|cat-title|ax-h2|t-h2)\b")
EXTRA = {".voices-sub", ".section-title", ".ci-title", ".about-title",
         # Our Story on the about page is an .eyebrow and nothing else —
         # the section has no h2, so the eyebrow is the heading. The stat
         # cards beside it were called card titles here and left out on
         # that reasoning; the client reads them as section titles, and
         # they are the client's pages.
         ".story-copy .eyebrow", ".stat-card .k"}

# Dark colours that become the blue. Everything else in a heading rule — white,
# a variable that is not one of these — is left as it is.
DARK = {"var(--ink)", "#111", "#1d1d1b", "var(--c0)", "#000", "#000000"}

# The nine pages measured as: no video, no image, and a light ground behind the
# header. The note is what the probe read at the top of the page.
HEADER_PAGES = [
    ("Jeff Brown Yachts - 404 Page", "index.html"),                      # paper
    ("Jeff Brown Yachts - 404 Page", "404.html"),                        # twin
    ("Jeff Brown Yachts - FAQ Page", "index.html"),                      # paper
    ("Jeff Brown Yachts - Listing Page", "index.html"),                  # #e9eef2
    ("Jeff Brown Yachts - Office Page", "index.html"),                   # paper
    ("Jeff Brown Yachts - Office Page", "JBY-Office.html"),              # twin
    ("Jeff Brown Yachts - Privacy Policy Page", "index.html"),           # paper
    ("Jeff Brown Yachts - Statement of Information Page", "index.html"), # paper
    ("Jeff Brown Yachts - Team Page", "index.html"),                     # paper
    ("Jeff Brown Yachts - Team Member Page", "index.html"),              # paper
    ("Jeff Brown Yachts - Terms Page", "index.html"),                    # paper
]

# Copied from the locations page, which is where this treatment was settled.
HEADER_CSS = """<style>
""" + MARK + """ ===
   The hero on this page is light and carries no photograph and no video, so a
   transparent header would be dark type on paper and would then flip to white
   on blue the moment the page moved. It is the blue from the start instead,
   the way the locations page has been since it was built.

   Appended after the page's own styles rather than written into its .nav
   rules, which differ page by page.

   The class is doubled on every selector, and that is not decoration. Every
   one of these pages carries a `.nav:not(.scrolled){...}` rule — the office
   page carries eight of them — and :not() counts its argument, so those are
   (0,2,0) against a plain .nav's (0,1,0). Being later in the file does not
   help against higher specificity. `.nav.nav` is (0,2,0) and later, which
   does. Written the way this codebase already writes it, as in
   `footer .back-top.back-top:hover`.

   .scrolled is left holding the one thing that should still answer the scroll,
   the padding tightening, which each page already defines. */
.nav.nav{
  background:linear-gradient(180deg, rgba(65,100,123,0.82) 0%, rgba(65,100,123,0.92) 100%);
  backdrop-filter:blur(22px) saturate(140%);-webkit-backdrop-filter:blur(22px) saturate(140%);
  border-bottom:0.5px solid rgba(255,255,255,0.15);
  color:#fff;
}
.nav.nav .burger span{background:#fff}
.nav.nav .logo img{filter:brightness(0) invert(1)}
.nav.nav .icon{border-color:rgba(255,255,255,0.7);color:#fff;background:transparent}
.nav.nav .icon:hover{background:rgba(255,255,255,0.14)}
.nav.nav .cta{color:#fff;border-color:rgba(255,255,255,0.75);background:transparent}
.nav.nav .cta:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.75)}
</style>
"""


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def write(p, s):
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)


def live_pages():
    out = []
    for line in read(os.path.join(ROOT, "tools", "live-pages.txt")).splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        p = [x.strip() for x in line.split("|")]
        out.append((p[0], p[1], p[2] if len(p) > 2 else "index.html"))
    return out


def blue_headings(text):
    """Return (text, [(selector, old colour)]) for every heading turned blue."""
    changed = []

    def rule(m):
        sel, body = m.group(1), m.group(2)
        if not HEADING.search(sel) and sel.strip() not in EXTRA:
            return m.group(0)
        c = re.search(r"color:\s*([^;}]+)", body)
        if not c or c.group(1).strip() not in DARK:
            return m.group(0)
        changed.append((sel.strip(), c.group(1).strip()))
        return m.group(0).replace("color:" + c.group(1), "color:var(--navy)", 1)

    text = re.sub(r"(?m)^([^{\n@]*)\{([^{}]*)\}", lambda m: rule(m), text)
    return text, changed


def blue_header(text):
    """Add the block, or replace one this script put in earlier."""
    if MARK in text:
        i = text.rindex("<style>", 0, text.index(MARK))
        j = text.index("</style>", i) + len("</style>") + 1
        if text[i:j] == HEADER_CSS:
            return text, False
        return text[:i] + HEADER_CSS + text[j:], True
    if "</head>" not in text:
        return text, False
    at = text.index("</head>")
    return text[:at] + HEADER_CSS + text[at:], True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--headings", action="store_true")
    ap.add_argument("--header", action="store_true")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if not (a.headings or a.header):
        ap.error("give --headings, --header, or both")

    touched = 0

    if a.headings:
        print("== headings")
        for repo, folder, entry in live_pages():
            f = os.path.join(ROOT, "pages", folder, entry)
            if not os.path.exists(f):
                continue
            t = read(f)
            out, changed = blue_headings(t)
            if not changed:
                continue
            print("  %-30s %d rule(s)" % (repo, len(changed)))
            for sel, old in changed:
                print("      %-44s %s" % (sel[:44], old))
            if not a.dry_run:
                write(f, out)
            touched += 1

    if a.header:
        print("\n== blue header")
        for folder, entry in HEADER_PAGES:
            f = os.path.join(ROOT, "pages", folder, entry)
            if not os.path.exists(f):
                print("  missing: %s/%s" % (folder, entry), file=sys.stderr)
                continue
            t = read(f)
            out, did = blue_header(t)
            print("  %-52s %s" % (entry + " — " + folder[:34], "added" if did else "already there"))
            if did and not a.dry_run:
                write(f, out)
                touched += 1

    print("\n%d file write(s)%s" % (touched, " (dry run — nothing written)" if a.dry_run else ""))


if __name__ == "__main__":
    main()
