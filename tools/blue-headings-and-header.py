#!/usr/bin/env python3
"""Two site-wide passes: section headings in the brand blue, and a blue header.

    python3 tools/blue-headings-and-header.py --headings --all
    python3 tools/blue-headings-and-header.py --buttons --all
    python3 tools/blue-headings-and-header.py --header --all
    python3 tools/blue-headings-and-header.py --headings --header --all --dry-run

HEADINGS. Every section heading on a light ground goes to --navy. In practice
that means, in any rule whose selector names a heading, a dark colour becomes
var(--navy): var(--ink), #111, and --c0 on the model page, which is that page's
name for black. A heading already set in white is left alone — it is white
because it stands on a photograph or a dark band, and "headings should be blue"
cannot mean the ones nobody could then read. Headings with no colour of their
own are left alone for the same reason: they inherit, usually from a dark band.

HEADER. The blue header the locations page carries, on every page. It began as
the nine whose hero had no photograph, no video and no dark ground of its own,
on the reasoning that a blue bar would fight a photographic hero; the client
has since asked for it everywhere, so that exception is gone.

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
         ".story-copy .eyebrow", ".stat-card .k",
         # The service pages lay each service out as a full row with its
         # own heading, lead and list. The h3 on those is a section title
         # doing card-title duty, which is why the rule above missed it.
         ".card-body h3",
         # Yacht management: the scene captions and the numbered steps.
         # .step .no is not a heading at all — it is the 1, 2, 3 over each
         # step — but the client wants those in the blue with the titles
         # they belong to, and they read as part of the heading.
         ".scene-cap h3", ".step h4", ".step .no",
         # Sell your yacht, all three versions: the four assurance cards
         # and the numbered steps. .step .num and .step .tag are the same
         # shape as yacht management's .no and h4 — a big figure over the
         # word it belongs to — and go blue for the same reason.
         ".feat h3", ".step .num", ".step .tag",
         # The listing page's own title. A page <h1> is on the "not a
         # section title" list above and stays there; this one is named
         # rather than the tag, so only this page's title moves.
         "h1.listing-title", ".t-h1",
         # The model page's specification accordions. The chevron beside
         # them, .acc-ico, goes with the title it belongs to.
         ".acc-head .acc-t", ".acc-ico",
         # "Visit us in San Diego" on the model page. It is set in --c0,
         # that page's name for black, which is in DARK; it was missed only
         # because nothing in its selector reads as a heading.
         ".brand-title",
         # The event page keeps its rules in assets/css rather than in the
         # document, which is why these two section titles — Description and
         # RSVP — were out of reach until this walked stylesheets as well.
         "#jb_body.page-event .event-detail__section-title",
         "#jb_body.page-event .event-rsvp-form-block .contact-form__title",
         # The FAQ page's own title. A page <h1> is on the "not a section
         # title" list above and stays there; this one is named by the block
         # it sits in, so only this page's title moves. The plus beside each
         # question goes blue with it, but not from here: .faq-q .sign draws
         # itself in currentColor and has no colour of its own for this pass
         # to rewrite, so that rule is in the page.
         ".faq-head h1"}

# The title on a card. Everything above is a section title; these are the
# names on the things inside a section, and until now they were deliberately
# left dark — the note above says so. The client asked for them in the blue
# too, so the exception goes.
#
# Found by measurement, not by reading the sheets: every page was loaded and
# every h3/h4/h5 and name-ish element with a dark colour on a light ground was
# collected, then each element was matched back against the rules that set its
# colour. That is why the list is in this shape — these are the rules that
# actually paint a card title somewhere, rather than every selector that looks
# as though it might.
CARD_TITLES = {
    # Locations: the office cards, the list beside the map, and the modal.
    ".visit-item-l h5", ".visit-item h5", ".visit-list h4", ".loc-item h5",
    ".loc-card h3", ".loc-modal-body h3",
    # The general card families. .card/.ucard/.acard/.pillar carry the name
    # of a service, a value or an article depending on the page.
    ".card h3", ".ucard h3", ".acard h3", ".pillar h3", ".v6-txt h3",
    ".oi-cell h3", ".pp-card h3", ".ci-item-body h3", ".ci-social h3",
    # Events, on the pages that show them and on the event page itself.
    ".event-card .body h4", ".ev-copy .ev-title", ".ev h4", ".event-info h3",
    # Listing: the live-stream and in-person tour cards, the insurance and
    # warranty panels, the share sheet, the tour call to action.
    ".vf h4", ".ip-in h4", ".warr-card h4", ".waylo-body h4", ".insure h3",
    ".pdf h4", ".shr-panel h3", ".tour-cta h3", ".st-body h3", ".st-done h3",
    ".st-slots h4", ".cx-success h3",
    "#jb_body #jby-ce .jby-st-body h3", "#jb_body #jby-ce .jby-st-done h3",
    # A testimonial card is titled by the name of the person who said it, and
    # a team card by the name of the person on it.
    ".tmon-q .who .nm", ".nm", ".t1-q .nm", ".t3-slide .nm", ".e1-q .nm",
    ".e2-slide .nm", ".e3-slide .nm", ".e4-main .nm", ".t10 .nm",
    ".v9-name", ".t-name", ".team-card .t-name",
}

# The value half of a row inside a card. A card row is a pair — a grey label
# on the left, the answer in bold on the right — and the client asked for the
# bold half in the blue. The labels stay grey: it is the difference between
# the two that makes the pair read as a pair.
#
# Found the same way as the titles, by loading all forty pages and collecting
# every element at weight 500 or more whose colour is black or near it on a
# light ground, with the brand blue and the greys excluded so only what is
# actually black comes back. Across the whole site that is these four rules.
#
# Deliberately not included, because none of them is in a card: the listing
# page's own price in .price-row, and the two figures the finance calculator
# writes, .loan-out .amt and .ml-amt.
CARD_VALUES = {
    # Listing: the live-stream and in-person tour cards. The second rule is
    # the in-person card's own override of the first and has to move with it.
    ".ev-row b", ".ip .ev-row b",
    # Home V1: the value in an event card row, and the price on a vessel card.
    ".event-row dd", ".vessel-price",
}
EXTRA = EXTRA | CARD_TITLES | CARD_VALUES

# Dark colours that become the blue. Everything else in a heading rule — white,
# a variable that is not one of these — is left as it is.
#
# --text, --lm-text and --lm-ink joined the list when the card titles did.
# Every page that defines them defines them dark (#000, #000, #1d1d1b); it was
# checked across the whole of pages/ rather than assumed, because a token named
# --text is exactly the sort of thing that is white on a dark page somewhere.
# #2f2f39 joined with the card values: it is what --ink resolves to on most of
# these pages, written out longhand in one rule instead of through the token.
DARK = {"var(--ink)", "#111", "#1d1d1b", "var(--c0)", "#000", "#000000",
        "var(--text)", "var(--lm-text)", "var(--lm-ink)", "#14141b", "#23232a",
        "rgb(17, 17, 17)", "#111111", "#2f2f39"}

# Every page, not a chosen few.
#
# This started as the pages whose hero had no photograph, no video and no dark
# ground of its own — nine of them, measured in a browser — on the reasoning
# that a blue bar over a photographic hero would fight the picture. The client
# has since asked for the blue header everywhere, photograph and video heroes
# included, so the measuring is gone and the block goes on every file this
# script walks.
#
# It is CSS only and every selector begins .nav, so a page with no .nav header
# takes the block and nothing happens. Three of the variant pages have no fixed
# header at all and are in that position; the event page has a header of its
# own shape and is handled by EVENT_HEADER_CSS below.

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


# BUTTONS. An outline button drawn in black on white becomes an outline button
# drawn in the blue: the edge, the label, and the tint or fill it takes on
# hover. A white outline button on a photograph or a dark band is a different
# thing and is not touched — nothing here matches one, because the list was
# built from the rules whose border resolves to a dark colour.
#
# Built by reading the sheets for `border: … <dark>` inside a button-ish
# selector across all forty pages, then checking each candidate in a browser to
# see what it actually sits on. The header's own .nav .cta is deliberately
# absent: it is dark only on pages that now carry the blue header, where it is
# already white, and on a photographic hero it has to stay white.
BUTTONS = {
    ".btn-outline", ".btn.btn-outline",
    ".s-link", ".ports-head .s-link", ".sr-secline .s-link",
    ".loc-modal-cta-secondary", ".loc-modal-cta.secondary",
    ".btn-ghost", ".nf-actions a.ghost", ".ax-btn-ghost-dark",
    ".cat-cta", ".tmon-btn", ".tmon-btn:disabled",
    ".ev-btn", ".lv-btn", ".mc-btn", ".ed-btn", ".v9 .info .btn", ".card .cta",
    ".btn-sm", ".btn-out", ".jbs-chip", ".btn-line", ".scene-link", ".ov-btn",
    # The two filter chips that go dark when they are the chosen one.
    ".pill.on", ".wchip.on",
    # The listing page's icon buttons: the black squares that step the rails,
    # the bell beside Add to calendar, the lightbox controls, the gallery and
    # step arrows, and the send button in the chat panel.
    ".rail-nav", ".ev-bell", ".st-nav", ".rs-step",
    ".lbx-close", ".lbx-prev", ".lbx-next", ".waylo-send",
    # The listing page's finance term buttons have no class of their own.
    ".terms button", ".terms button.on",
    # The event page's header, in the state where it sits on white. Its other
    # state is white type on the hero photograph and is a separate rule, which
    # nothing here matches. Only the second line of each selector is named:
    # the rule is written with the pair split over two lines, and a rule is
    # found by the line its brace is on.
    "#jb_body header.header-v2.header-v2--flow .header-v2__search",
    "#jb_body header.header-v2.header-v2--flow .header-home__contact",
    "#searchToggle", "#jb_body header .btn-contact-us",
}

# Dark values, and what each becomes. A translucent black keeps its alpha and
# only changes hue, so a hairline stays a hairline.
BTN_TOKENS = ["var(--ink)", "var(--c0)", "var(--text)", "var(--lm-text)",
              "var(--lm-ink)", "#000000", "#000", "#111111", "#111", "#1d1d1b",
              "#2f2f39", "#14141b", "#23232a"]
BTN_RGBA = re.compile(r"rgba?\(\s*(0|47|17|29)\s*,\s*(0|47|17|29)\s*,"
                      r"\s*(0|57|17|27)\s*(,\s*([\d.]+))?\s*\)")
# Two the general rule cannot get right on its own.
#
# ADD_COLOR: a button that never declared a colour and simply inherited black.
# Turning only its edge blue would leave a black glyph inside a blue outline,
# so these gain the declaration they never had.
ADD_COLOR = {".ev-bell"}
# FORCE: where the hover state was the dark colour the button has just become,
# so that without this the hover would do nothing at all.
FORCE = {(".rail-nav:hover", "background"): "var(--navy-d)"}

DECLS = ("color", "border", "border-color", "border-top-color",
         "border-right-color", "border-bottom-color", "border-left-color",
         "background", "background-color", "outline-color")


def hex8(m):
    """#000000CC and the like: a dark hex carrying its alpha in the last pair."""
    r, g, b = (int(m.group(1)[i:i + 2], 16) for i in (0, 2, 4))
    if r * 0.299 + g * 0.587 + b * 0.114 >= 110:
        return m.group(0)
    a = int(m.group(2), 16) / 255
    return "rgba(65,100,123,%s)" % ("%.2f" % a).rstrip("0").rstrip(".")


def navy_value(val):
    """Return val with any dark colour turned into the brand blue."""
    out = re.sub(r"#([0-9a-fA-F]{6})([0-9a-fA-F]{2})(?![0-9a-fA-F])", hex8, val)
    out = BTN_RGBA.sub(
        lambda m: "rgba(65,100,123," + m.group(5) + ")" if m.group(5)
        else "var(--navy)", out)
    for tok in BTN_TOKENS:
        out = re.sub(r"(?<![\w-])" + re.escape(tok) + r"(?![\w-])",
                     "var(--navy)", out)
    return out


def base_selector(sel):
    """The selector without its state, so .ev-btn:hover finds .ev-btn."""
    return re.sub(r":(hover|focus|active|focus-visible|disabled)\b", "",
                  sel).strip()


def blue_buttons(text):
    """Return (text, [(selector, property, old, new)])."""
    changed = []

    def rule(m):
        sel, body = m.group(1), m.group(2)
        parts = [p.strip() for p in base_selector(sel).split(",")]
        if not any(p in BUTTONS for p in parts):
            return m.group(0)
        new_body = body
        # The matches are taken before anything is replaced: rewriting as we
        # walk would shift the offsets the iterator is still holding.
        todo = []
        for prop in DECLS:
            for d in re.finditer(r"(?<![\w-])" + prop + r"\s*:\s*([^;}]+)",
                                 body):
                todo.append((prop, d.group(0), d.group(1)))
        for prop, whole, old in todo:
            new = navy_value(old)
            if new == old:
                continue
            changed.append((sel.strip(), prop, old.strip(), new.strip()))
            new_body = new_body.replace(whole, whole.replace(old, new, 1), 1)
        for p in parts:
            # Only the resting rule. A :hover that inherits is inheriting from
            # the rule we have just given a colour to.
            if p in ADD_COLOR and sel.strip() == base_selector(sel) \
                    and not re.search(r"(?<![\w-])color\s*:", body):
                new_body = "color:var(--navy);" + new_body.lstrip()
                changed.append((sel.strip(), "color", "(inherited)",
                                "var(--navy)"))
        for (fsel, fprop), fval in FORCE.items():
            if sel.strip() != fsel:
                continue
            d = re.search(r"(?<![\w-])" + fprop + r"\s*:\s*([^;}]+)", new_body)
            if d and d.group(1).strip() != fval:
                changed.append((sel.strip(), fprop, d.group(1).strip(), fval))
                new_body = new_body.replace(d.group(0), fprop + ":" + fval, 1)
        if new_body == body:
            return m.group(0)
        return m.group(0).replace(body, new_body, 1)

    text = re.sub(r"(?m)^([^{\n@]*)\{([^{}]*)\}", lambda m: rule(m), text)
    return text, changed


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def write(p, s):
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)


def targets():
    """Every stylesheet-bearing file in a live page's folder, once each.

    Every .html, not just the entry: several folders keep a second copy under
    the page's own name — JBY-Office.html beside index.html — and they are
    meant to stay byte for byte the same. Running on the entry alone is what
    split them the first time.

    And every .css, which the first version of this did not do. Some pages
    keep their rules in assets/styles.css rather than in a <style> block, so
    those rules were never reachable and a heading there would be reported
    as "still not blue" however many times the script ran.
    """
    seen, out = set(), []
    for repo, folder, entry in live_pages():
        d = os.path.join(ROOT, "pages", folder)
        if not os.path.isdir(d):
            continue
        for base, dirs, files in os.walk(d):
            dirs[:] = [x for x in dirs if x not in (".git", ".snapshots")]
            for name in sorted(files):
                if not name.endswith((".html", ".css")):
                    continue
                f = os.path.join(base, name)
                if f in seen:
                    continue
                seen.add(f)
                rel = os.path.relpath(f, d)
                out.append((repo if rel == entry else repo + "/" + rel, f))
    return out


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
        c = re.search(r"(?<![\w-])color\s*:\s*([^;}]+)", body)
        if not c or c.group(1).strip() not in DARK:
            return m.group(0)
        changed.append((sel.strip(), c.group(1).strip()))
        # Replace the matched text, not a reconstruction of it. An earlier
        # version rebuilt the declaration as "color:" + the value, which does
        # not appear in a sheet written "color: var(--lm-ink)" with a space —
        # so the run reported the change and wrote nothing, every time.
        return m.group(0).replace(c.group(0),
                                  c.group(0).replace(c.group(1),
                                                     "var(--navy)", 1), 1)

    text = re.sub(r"(?m)^([^{\n@]*)\{([^{}]*)\}", lambda m: rule(m), text)
    return text, changed


# ---------------------------------------------------- header height ----
#
# The header stands at its full height until the page moves, then tightens.
# The client wants the tightened height from the start, so the resting state
# is given the page's own scrolled geometry.
#
# Read out of each page rather than written as a number: the pages do not
# agree. The home page goes 24px padding and a 72px mark to 16px and 60px;
# the listing page goes 20px and 64px to 14px and 52px. Mirroring what a page
# already says keeps each one's proportions.
#
# Only the vertical is mirrored. `padding:16px 40px` becomes padding-top and
# padding-bottom, because the horizontal is the same in both states anyway and
# the phone rules set their own.
#
# And it is wrapped in a min-width matching the page's own nav breakpoint.
# `.nav.nav` is (0,2,0) and would otherwise outrank the `.nav{padding:16px
# 24px}` a page keeps inside `@media (max-width:980px)`, and the phone header
# would grow instead of shrink.
HEIGHT_MARK = "/* === JBY: the header stands at its scrolled height ==="

GEOM = ("padding", "padding-top", "padding-bottom", "width", "height",
        "min-height", "max-height", "gap", "font-size")
# Rules are walked rather than matched. The regex that did this backtracked
# for minutes on the events page, which is 3.7MB in one document; and it had
# to be anchored to a line start, which missed every page that writes a whole
# @media block on one line. A scan from brace to brace is linear and does not
# care how the file is laid out.
def iter_rules(css):
    """(selector, body) for every `sel{...}` in css.

    Comments go first. A selector is whatever sits between the last brace and
    the next one, so a comment above a rule becomes part of it — which is how
    the contact page ended up emitting `marks flip to white */ .nav.nav{...}`
    and the browser threw the whole rule away."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    i = 0
    while True:
        o = css.find("{", i)
        if o < 0:
            return
        c = css.find("}", o + 1)
        if c < 0:
            return
        yield css[i:o].strip(), css[o + 1:c]
        i = c + 1


LINKED_CSS = re.compile(r'<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\':]+)["\']')


def css_source(path, text):
    """The page's own rules plus the stylesheets it links beside itself.

    The Knowledge Center keeps its header in assets/styles.css, so reading
    the document alone found no .nav.scrolled rule and its header was the
    one page left jumping."""
    out = [text]
    base = os.path.dirname(path)
    for href in LINKED_CSS.findall(text):
        f = os.path.normpath(os.path.join(base, href.split("?")[0]))
        if f.startswith(base) and os.path.isfile(f):
            try:
                out.append(read(f))
            except Exception:
                pass
    return "\n".join(out)


def media_blocks(css):
    """[(condition, body)] for every @media in css, and css with them removed."""
    blocks, out, i = [], [], 0
    for m in re.finditer(r"@media([^{]*)\{", css):
        if m.start() < i:
            continue
        out.append(css[i:m.start()])
        j, depth = m.end(), 1
        while j < len(css) and depth:
            depth += 1 if css[j] == "{" else -1 if css[j] == "}" else 0
            j += 1
        blocks.append((m.group(1).strip(), css[m.end():j - 1]))
        i = j
    out.append(css[i:])
    return blocks, "".join(out)


def mirror_rules(css):
    """`.nav.nav{...}` lines carrying the geometry of this sheet's scrolled header."""
    out = []
    for sel, body in iter_rules(css):
        if ".nav.scrolled" not in sel or ".nav.nav" in sel:
            continue
        parts = [s.strip() for s in sel.split(",") if ".nav.scrolled" in s]
        if not parts:
            continue
        decls = []
        for d in body.split(";"):
            k, _, v = d.partition(":")
            k, v = k.strip(), v.strip()
            if k not in GEOM or not v:
                continue
            if k == "padding":
                q = v.split()
                decls.append("padding-top:" + q[0])
                decls.append("padding-bottom:" + (q[2] if len(q) > 2 else q[0]))
            else:
                decls.append(k + ":" + v)
        if decls:
            out.append(", ".join(x.replace(".nav.scrolled", ".nav.nav") for x in parts)
                       + "{" + ";".join(decls) + "}")
    return out


def compact_header(text, css=None):
    """Give the resting header the geometry the page gives its scrolled one.

    `text` is the document the block is written into; `css` is where the rules
    are read from, which is the document plus whatever it links.

    Done twice: once from the rules outside any @media, wrapped above the
    page's own nav breakpoint, and once from the rules inside that breakpoint,
    wrapped below it. Harvesting them together was the first mistake here —
    the phone's 12px padding came out and was applied to the desktop header.
    """
    css = css if css is not None else text
    blocks, top = media_blocks(css)

    desktop = mirror_rules(top)
    # Every @media that restyles the scrolled header gets its own mirror under
    # the same condition. Picking only the widest breakpoint left six pages
    # still jumping on a phone, because they tighten at a narrower one too.
    narrow = []
    for cond, body in blocks:
        rules = mirror_rules(body)
        if rules:
            narrow.append((cond, rules))

    if not desktop and not narrow:
        return text, False

    block = "<style>\n" + HEIGHT_MARK + """ ===
   The page's own .nav.scrolled geometry, given to the header at rest, so it
   stands at the tightened height from the first frame instead of shrinking
   once the page moves. Read from this page's rules rather than written as a
   number, because the pages do not agree on either figure.

   Only the vertical. The horizontal padding is the same in both states, and
   writing it here would fix a desktop value onto the phone.

   The rules outside any @media come first and hold at every width; each of
   the page's own breakpoints then re-states whatever it tightens further.
   That order matters: .nav.nav is (0,2,0) and outranks the `.nav{padding}`
   a page keeps inside its @media, so without the second half the small
   header would grow instead of shrink. A page whose @media tightens the
   padding but not the mark — the team page — keeps the mark size from the
   first half, which is what it does when scrolled on a phone. */
"""
    if desktop:
        block += "\n".join(desktop) + "\n"
    for cond, rules in narrow:
        block += "@media %s{\n  " % cond.strip() + "\n  ".join(rules) + "\n}\n"
    block += "</style>\n"

    if HEIGHT_MARK in text:
        i = text.rindex("<style>", 0, text.index(HEIGHT_MARK))
        j = text.index("</style>", i) + len("</style>") + 1
        if text[i:j] == block:
            return text, False
        return text[:i] + block + text[j:], True
    if "</head>" not in text:
        return text, False
    at = text.index("</head>")
    return text[:at] + block + text[at:], True


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
    ap.add_argument("--buttons", action="store_true")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if not (a.headings or a.header or a.buttons):
        ap.error("give --headings, --buttons, --header, or any combination")

    touched = 0

    if a.headings:
        print("== headings")
        for repo, f in targets():
            t = read(f)
            out, changed = blue_headings(t)
            if not changed:
                continue
            print("  %-34s %d rule(s)" % (repo[:34], len(changed)))
            for sel, old in changed:
                print("      %-44s %s" % (sel[:44], old))
            if not a.dry_run:
                write(f, out)
            touched += 1

    if a.buttons:
        print("\n== outline buttons")
        for repo, f in targets():
            t = read(f)
            out, changed = blue_buttons(t)
            if not changed:
                continue
            print("  %-34s %d change(s)" % (repo[:34], len(changed)))
            for sel, prop, old, new in changed:
                print("      %-30s %-17s %-26s -> %s"
                      % (sel[:30], prop, old[:26], new[:30]))
            if not a.dry_run:
                write(f, out)
            touched += 1

    if a.header:
        print("\n== blue header")
        added = same = 0
        for repo, f in targets():
            if not f.endswith(".html"):
                continue
            t = read(f)
            out, did = blue_header(t)
            out, did2 = compact_header(out, css_source(f, out))
            if did or did2:
                added += 1
                print("  %-44s %s" % (repo[:44],
                                      ("colour " if did else "") + ("height" if did2 else "")))
                if not a.dry_run:
                    write(f, out)
                    touched += 1
            else:
                same += 1
        print("  %d added, %d already had it" % (added, same))

    print("\n%d file write(s)%s" % (touched, " (dry run — nothing written)" if a.dry_run else ""))


if __name__ == "__main__":
    main()
