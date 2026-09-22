#!/usr/bin/env python3
"""Put the home page's listing card, How can we help? band and footer on a page.

Thirty-odd pages in this repository each grew their own copy of these three
things, and they had drifted apart: sand chips against glass ones, a flat navy
band against the photograph, a paper footer against the blue one. This script
carries the home page's version of each and lays it over whatever a page has.

    python3 tools/apply-site-blocks.py "pages/Jeff Brown Yachts - Office Page/index.html"
    python3 tools/apply-site-blocks.py --all

Three passes, each independent — a page gets the ones it has something to
replace for:

  cards   the .vessel-card rules, swapped one selector at a time so a page
          keeps its own sizing and strip layout and only the look changes.
  band    the <section> that says How can we help? (or Get expert guidance),
          replaced by the photograph band, with its image copied in beside it.
  footer  the <footer>, replaced by the blue one.

The band and footer markup is prefixed — .jby-band/.jb-*, .jby-footer/.jf-* —
so none of a page's own .help, .expert, .foot-grid or .foot-col rules can
reach into it. What the page had is left in its stylesheet, unused; removing
it would mean understanding thirty stylesheets rather than one block of markup.
"""

import argparse
import os
import re
import shutil
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOCKS = os.path.join(ROOT, "tools", "site-blocks")
PAGES = os.path.join(ROOT, "pages")

MARK_CSS = "/* === JBY SITE BLOCKS: band + footer ==="
MARK_JS = "/* The photograph band's drift and the rise"


def read(p):
    with open(p, encoding="utf-8", errors="strict") as f:
        return f.read()


def write(p, s):
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)


# ---------------------------------------------------------------- cards ----

def rule_span(css, selector, start=0):
    """Where `selector{...}` sits in `css`, or None.

    The selector has to begin a rule, so `.v-cta` does not match inside
    `.vessel-card:hover .v-cta` and `.vessel-card` does not match inside
    `.vstrip .vessel-card`. Everything in these files is one level deep except
    the @media blocks, which this deliberately does not touch: a page's phone
    layout is its own.
    """
    pat = re.compile(r"(?m)^" + re.escape(selector) + r"\s*\{")
    m = pat.search(css, start)
    if not m:
        return None
    # The comment block sitting directly above goes with the rule, both ways:
    # the canonical rule brings its own, and a second run has to see the one it
    # left behind as part of what it is replacing, or it stacks up a new copy
    # of the comment every time it is run.
    head = m.start()
    line_end = css.rfind("\n", 0, head)
    if line_end > 0 and css[:line_end].rstrip().endswith("*/"):
        opener = css.rfind("/*", 0, line_end)
        if opener >= 0 and "}" not in css[opener:line_end]:
            bol = css.rfind("\n", 0, opener) + 1
            if css[bol:opener].strip() == "":
                head = bol
    i = css.index("{", m.start())
    depth = 0
    for j in range(i, len(css)):
        if css[j] == "{":
            depth += 1
        elif css[j] == "}":
            depth -= 1
            if depth == 0:
                return (head, j + 1)
    return None


def parse_rules(css):
    """The canonical sheet as [(selector, whole rule text incl. its comment)].

    Walked a line at a time rather than matched by one regex: a rule carries
    the comment block directly above it, and "directly" has to mean the line
    before, with no blank line between. Left to a regex with an optional
    leading comment, the sheet's own header would attach itself to the first
    rule and swallow everything in between.
    """
    lines = css.splitlines(keepends=True)
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not re.match(r"[.\w][^{]*\{", line):
            i += 1
            continue
        sel = line.split("{", 1)[0].strip()
        # Back up over the comment block sitting on the lines above, if any.
        head = i
        if head and lines[head - 1].rstrip().endswith("*/"):
            j = head - 1
            while j >= 0 and not lines[j].lstrip().startswith("/*"):
                j -= 1
            if j >= 0:
                head = j
        # Forward to the line that closes the rule.
        depth = 0
        end = i
        for k in range(i, len(lines)):
            depth += lines[k].count("{") - lines[k].count("}")
            if depth <= 0:
                end = k
                break
        out.append((sel, "".join(lines[head:end + 1]).rstrip("\n")))
        i = end + 1
    return out


# The same card exists three times over, under three sets of class names: the
# site's own .vessel-card, the Riva pages' .v-card, and the listing page's .ol
# rail. Each sheet carries the home page's values on that family's selectors,
# and is applied only where the page has that family to replace.
FAMILIES = [
    ("cards.css", ".vessel-card{"),
    ("cards-v-card.css", ".v-overlay{"),
    ("cards-ol.css", ".ol-in{"),
]


def apply_cards(text, report):
    canon = []
    for sheet, marker in FAMILIES:
        if marker in text:
            canon += parse_rules(read(os.path.join(BLOCKS, sheet)))
            if sheet == "cards.css" and "jby-system.css" not in text:
                canon += parse_rules(read(os.path.join(BLOCKS, "cards-fallback.css")))
    if not canon:
        return text, False
    changed = False
    tail = None          # where the last rule this touched ends
    for sel, rule in canon:
        span = rule_span(text, sel)
        if span is None:
            if tail is None:
                continue
            text = text[:tail] + "\n" + rule + text[tail:]
            tail += len(rule) + 1
            changed = True
            report.append("      card rule: " + sel + " (added)")
            continue
        old = text[span[0]:span[1]]
        if old == rule:
            tail = span[1]
            continue
        text = text[:span[0]] + rule + text[span[1]:]
        tail = span[0] + len(rule)
        changed = True
        report.append("      card rule: " + sel)

    # The office page and its copies hid the chevron outright. The home page
    # shows it, so the override goes.
    dead = "/* Card chevron removed — whole card is the click target (buggy white/scale on tap) */\n.v-cta{display:none!important}\n"
    if dead in text:
        text = text.replace(dead, "")
        changed = True
        report.append("      card rule: dropped the display:none on .v-cta")
    elif ".v-cta{display:none!important}" in text:
        text = text.replace(".v-cta{display:none!important}\n", "")
        text = text.replace(".v-cta{display:none!important}", "")
        changed = True
        report.append("      card rule: dropped the display:none on .v-cta")
    return text, changed


OL_CTA = ('<span class="ol-cta" aria-hidden="true"><span class="t">View</span>'
          '<span class="i"><i class="ti ti-chevron-right"></i></span></span>')


def apply_ol_markup(text, report):
    """Give the listing page's Other Listings cards the home card's chevron.

    The rest of that card is a matter of values, which the stylesheet handles;
    the chevron is the one part of it the markup has to carry. A span, not a
    button — the whole card is an <a>.
    """
    # The stylesheet has already gone in by this point and names .ol-cta in its
    # selectors, so what is tested for is the attribute, not the word.
    if 'class="ol"' not in text or 'class="ol-cta"' in text:
        return text, False
    out = re.sub(r'(<a class="ol"[\s\S]*?)</a>', lambda m: m.group(1) + OL_CTA + "</a>", text)
    if out == text:
        return text, False
    report.append("      card markup: the chevron on the Other Listings cards")
    return out, True


# ----------------------------------------------------------------- band ----

def sections(text):
    """Every top-level <section>…</section> as (start, end, body)."""
    out = []
    for m in re.finditer(r"<section\b[^>]*>", text):
        depth = 0
        end = None
        for t in re.finditer(r"<(/?)section\b[^>]*>", text[m.start():]):
            depth += 1 if not t.group(1) else -1
            if depth == 0:
                end = m.start() + t.end()
                break
        if end is not None:
            out.append((m.start(), end, text[m.start():end]))
    return out


def looks_like_band(body):
    """A title, a line under it and one button — the closing band's shape.

    The wording is not part of the test. The same band is captioned How can we
    help? on most pages, Get expert guidance on the home page and the listing,
    Still have a question? on the FAQ and Find the right starting point on
    Sell your yacht, and all four are the thing this replaces. What is tested
    is the shape, so a section of real content cannot be mistaken for it.
    """
    if len(body) > 2600:
        return False
    if len(re.findall(r"<h2\b", body)) != 1:
        return False
    if len(re.findall(r"<p\b", body)) > 2:
        return False
    if len(re.findall(r"<(?:img|picture|table|form|input|iframe)\b", body)):
        return False
    buttons = len(re.findall(r"<button\b", body)) + len(re.findall(r'<a\b[^>]*class="[^"]*\bbtn', body))
    return buttons == 1


def find_band(text):
    """The closing band — the last one standing between the page and its footer."""
    cut = text.find("<footer")
    if cut < 0:
        cut = len(text)
    best = None
    for start, end, body in sections(text):
        if start > cut:
            break
        if looks_like_band(body):
            best = (start, end, body)
    return best


def band_copy(body):
    """The title, the lead and the button label the page already had."""
    def strip(s):
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()

    h = re.search(r"<h2[^>]*>([\s\S]*?)</h2>", body)
    p = re.search(r"<p[^>]*>([\s\S]*?)</p>", body)
    b = re.search(r"<(?:button|a)[^>]*>([\s\S]*?)</(?:button|a)>", body)
    return (
        strip(h.group(1)) if h else "How can we help?",
        strip(p.group(1)) if p else "Connect with our yacht brokerage and sales team to find your perfect yacht.",
        strip(b.group(1)) if b else "Contact us",
    )


def asset_dir(page):
    """The folder this page keeps its pictures in, and the href prefix for it."""
    d = os.path.dirname(page)
    for name in ("JBY-V3.3-assets", "assets", "img", "images"):
        if os.path.isdir(os.path.join(d, name)):
            return os.path.join(d, name), "./" + name
    # A page can borrow a sibling's folder rather than carry one — the intro
    # variants do. Follow whatever its own <img> tags point at.
    for m in re.finditer(r'src="((?:\.\./)[^"]*?/(?:JBY-V3\.3-assets|assets))/', read(page)):
        href = m.group(1)
        real = os.path.normpath(os.path.join(d, urllib.parse.unquote(href)))
        if os.path.isdir(real):
            return real, href
    return None, None


def find_logo(page):
    """Whatever the page's own markup points at for the roundel."""
    text = read(page)
    m = re.search(r'src="([^"]*jby[_-]?logo\.svg)"', text, re.I)
    if m:
        return m.group(1)
    d, href = asset_dir(page)
    if d:
        for f in sorted(os.listdir(d)):
            if "logo" in f.lower() and f.lower().endswith(".svg"):
                return href + "/" + f
    return None


def apply_band(page, text, report):
    hit = find_band(text)
    if not hit:
        return text, False
    start, end, body = hit
    if 'class="jby-band"' in body:
        return text, False
    if "expert-photo" in body:
        # The home page and the locations page already carry this band, under
        # their own names. They are what this block was taken from; rewriting
        # them would be churn on the two pages in front of the client.
        report.append("      band: already the photograph, left alone")
        return text, False

    d, href = asset_dir(page)
    if not d:
        report.append("      band: skipped, no asset folder on this page")
        return text, False
    src = os.path.join(BLOCKS, "expert_bow_sunset.jpg")
    dst = os.path.join(d, "expert_bow_sunset.jpg")
    if not os.path.exists(dst):
        shutil.copy2(src, dst)

    title, lead, cta = band_copy(body)
    block = (read(os.path.join(BLOCKS, "band.html"))
             .replace("{ASSETS}", href)
             .replace("{TITLE}", title)
             .replace("{LEAD}", lead)
             .replace("{CTA}", cta))
    # Whatever id the page's own anchors point at stays on the section.
    m = re.search(r'id="([^"]+)"', text[start:end])
    if m:
        block = block.replace('id="contact"', 'id="%s"' % m.group(1))
    report.append("      band: %r on the photograph" % title)
    return text[:start] + block.rstrip("\n") + text[end:], True


# --------------------------------------------------------------- footer ----

def apply_footer(page, text, report):
    m = re.search(r"<footer\b[^>]*>[\s\S]*?</footer>", text)
    if not m:
        return text, False
    if 'class="jby-footer"' in m.group(0) or 'class="foot-inner"' in m.group(0):
        report.append("      footer: already the blue one, left alone")
        return text, False
    logo = find_logo(page)
    if not logo:
        report.append("      footer: skipped, no logo on this page")
        return text, False
    block = read(os.path.join(BLOCKS, "footer.html")).replace("{LOGO}", logo)
    report.append("      footer: the blue one")
    return text[:m.start()] + block.rstrip("\n") + text[m.end():], True


# -------------------------------------------------------------- plumbing ---

def ensure_css(text, report):
    if MARK_CSS in text:
        return text, False
    css = read(os.path.join(BLOCKS, "band-footer.css"))
    tag = "<style>\n" + MARK_CSS + " */\n" + css + "</style>\n"
    # After the last stylesheet the page links, so the page's own sheet — and
    # jby-system.css where it is carried — cannot be later than this one.
    links = list(re.finditer(r'<link[^>]+rel="stylesheet"[^>]*>\s*', text[:text.find("</head>") + 7]))
    at = links[-1].end() if links else text.find("</head>")
    report.append("      +css")
    return text[:at] + tag + text[at:], True


def ensure_js(text, report):
    if MARK_JS in text:
        return text, False
    js = read(os.path.join(BLOCKS, "band.js"))
    at = text.rfind("</body>")
    if at < 0:
        at = len(text)
    report.append("      +js")
    return text[:at] + js + text[at:], True


def apply_page(page, do_cards=True, do_band=True, do_footer=True):
    report = []
    text = read(page)
    before = text
    touched_band = touched_footer = False

    if do_cards:
        text, _ = apply_cards(text, report)
        text, _ = apply_ol_markup(text, report)
    if do_band:
        text, touched_band = apply_band(page, text, report)
    if do_footer:
        text, touched_footer = apply_footer(page, text, report)
    if touched_band or touched_footer:
        text, _ = ensure_css(text, report)
    if touched_band:
        text, _ = ensure_js(text, report)

    if text != before:
        write(page, text)
        return report
    return []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pages", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--no-cards", action="store_true")
    ap.add_argument("--no-band", action="store_true")
    ap.add_argument("--no-footer", action="store_true")
    a = ap.parse_args()

    targets = list(a.pages)
    if a.all:
        targets += [l.strip() for l in read(os.path.join(BLOCKS, "targets.txt")).splitlines()
                    if l.strip() and not l.startswith("#")]

    n = 0
    for t in targets:
        p = t if os.path.isabs(t) else os.path.join(ROOT, t)
        if not os.path.exists(p):
            print("  missing: " + t, file=sys.stderr)
            continue
        r = apply_page(p, not a.no_cards, not a.no_band, not a.no_footer)
        if r:
            n += 1
            print("  " + t)
            for line in r:
                print(line)
    print("\n%d file(s) changed" % n)


if __name__ == "__main__":
    main()
