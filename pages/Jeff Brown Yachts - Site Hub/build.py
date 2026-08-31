#!/usr/bin/env python3
"""Assemble the Jeff Brown Yachts site.

Every page keeps living in the repo it was built in; here we take the deployed HTML,
give it a <base> so all of its own assets keep resolving, and inject the shared site
chrome (global menu + link rewiring). The result is one site: / is the home page and
every other page sits underneath it.
"""
import os, re, urllib.request, sys

BASE = "https://ywteamyw.github.io/"
OUT = os.path.dirname(os.path.abspath(__file__))

# slug in the assembled site  ->  source path on GitHub Pages
PAGES = [
    ("",                             "jby-homepage.github.io/"),
    ("about/",                       "jby-about/"),
    ("services/",                    "jby-all-services/"),
    ("services/maintenance/",        "jby-service-maintenance-2/"),
    ("services/yacht-management/",   "jby-yacht-management/"),
    ("services/sell-your-yacht/",    "jby-sell-your-yacht-v2/"),
    ("team/",                        "jby-team/"),
    ("team/will-de-jong/",           "jby-team-member/"),
    ("locations/",                   "jby-locations/"),
    ("locations/san-diego/",         "jby-office/"),
    ("contact/",                     "jby-contact/"),
    ("events/",                      "jby-events/"),
    ("listing/",                     "jby-listing/"),
    ("models/riva-112/",             "model-page/"),
    ("brands/axopar/",               "jby-axopar/"),
    ("news/",                        "jby-knowledge-center-v4/"),
    ("news/article/",                "jby-knowledge-center-v4/article.html"),
    ("news/video/",                  "jby-knowledge-center-v4/video.html"),
    ("news/event/",                  "jby-knowledge-center-v4/event.html"),
    ("news/search/",                 "jby-knowledge-center-v4/search.html"),
    ("privacy-policy/",              "jby-privacy-policy/"),
    ("terms/",                       "jby-terms-and-conditions/"),
    ("statement-of-information/",    "jby-statement-of-information/"),
    ("faq/",                         "jby-faq/"),
    ("404/",                         "jby-404/"),
]

VERSION = "6"   # bump when site.js / site.css change, so pages pick them up immediately
CHROME = ('<link rel="stylesheet" href="/jby-site/site.css?v=%s">\n'
          '<script defer src="/jby-site/site.js?v=%s"></script>\n' % (VERSION, VERSION))


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "jby-site-build"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


# small source-side bugs worth patching while assembling
FIXUPS = {
    "": [("./assets/jby_logo.svg", "./JBY-V3.3-assets/jby_logo.svg")],   # footer logo points at a folder the home repo does not have
}


def build(slug, src):
    url = BASE + src
    html = fetch(url)
    base_dir = url.rsplit("/", 1)[0] + "/" if src.endswith(".html") else url

    if "<base " in html.lower():
        raise SystemExit("unexpected <base> already in " + url)

    m = re.search(r"<head[^>]*>", html, re.I)
    if not m:
        raise SystemExit("no <head> in " + url)
    head_end = m.end()
    html = html[:head_end] + '\n<base href="%s">\n' % base_dir + html[head_end:]

    for old, new in FIXUPS.get(slug, []):
        html = html.replace(old, new)

    m = re.search(r"</head>", html, re.I)
    html = html[:m.start()] + CHROME + html[m.start():]

    path = os.path.join(OUT, slug, "index.html")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(html)
    return len(html)


if __name__ == "__main__":
    for slug, src in PAGES:
        size = build(slug, src)
        print("%-32s <- %-42s %6.1f KB" % ("/" + slug, src, size / 1024))

    # GitHub Pages serves /404.html for any unknown path under the site
    with open(os.path.join(OUT, "404", "index.html")) as f:
        not_found = f.read()
    with open(os.path.join(OUT, "404.html"), "w") as f:
        f.write(not_found)
    print("%-32s <- %-42s" % ("/404.html", "copy of /404/"))
