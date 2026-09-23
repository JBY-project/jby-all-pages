#!/usr/bin/env python3
"""Push a page folder to the repository that serves it, so the live link moves.

Each page under pages/ has its own repository in the JBY-project organisation,
serving from main at the root; the link people hold is
https://jby-project.github.io/<repo>/. tools/live-pages.txt says which folder
goes to which repo, and how that mapping was established.

These are NOT the branch previews. .github/workflows/preview.yml publishes a
branch into jby-all-pages/previews/<branch>/ so work can be shown before it
lands; those links are temporary, share one 900MB budget, and are not what
anybody is given. The live link is the one this script moves.

    python3 tools/publish-live-pages.py --changed-since 77f163a   # what moved
    python3 tools/publish-live-pages.py jby-axopar jby-office     # named repos
    python3 tools/publish-live-pages.py --all
    python3 tools/publish-live-pages.py --dry-run --all           # say only

Each repo is cloned shallow, the page folder is laid over it, and the result is
committed and pushed. Files already in the repo that the folder does not have
are left alone rather than deleted: several of these repos carry a README or a
concepts page that was never in pages/, and this script has no business
deciding those are rubbish.
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, "pages")
MAP = os.path.join(ROOT, "tools", "live-pages.txt")
ORG = "JBY-project"

# The one page that is not simply its folder. Intro V3 Arc has no assets of its
# own: in this repo it reaches sideways into the Intro Animation folder with
# ../Jeff%20Brown%20Yachts%20-%20Home%20Page%20(Intro%20Animation)/, which is a
# path that only exists here. Standing on its own, it needs that folder beside
# it and the prefix taken out — which is exactly what the published repo has,
# confirmed by diffing the two.
SIBLING_ASSETS = {
    "jby-home-intro-v3": (
        "Jeff Brown Yachts - Home Page (Intro Animation)",
        "JBY-V3.3-assets",
    ),
}


def run(args, cwd=None, check=True):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode:
        raise RuntimeError("%s\n%s%s" % (" ".join(args), r.stdout, r.stderr))
    return r


def mapping():
    rows = []
    for line in open(MAP, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = [p.strip() for p in line.split("|")]
        rows.append((parts[0], parts[1], parts[2] if len(parts) > 2 else None))
    return rows


def changed_folders(since):
    out = run(["git", "diff", "--name-only", since, "HEAD", "--", "pages/"], cwd=ROOT).stdout
    return {p[len("pages/"):].split("/", 1)[0] for p in out.splitlines() if p.startswith("pages/")}


def lay_over(src, dst):
    """Copy every file in src onto dst, leaving what dst has and src has not."""
    for base, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d != ".git"]
        rel = os.path.relpath(base, src)
        target = dst if rel == "." else os.path.join(dst, rel)
        os.makedirs(target, exist_ok=True)
        for f in files:
            shutil.copy2(os.path.join(base, f), os.path.join(target, f))


def publish(repo, folder, entry, dry_run=False):
    src = os.path.join(PAGES, folder)
    if not os.path.isdir(src):
        return "no such folder: pages/%s" % folder
    if dry_run:
        return "would publish pages/%s" % folder

    tmp = tempfile.mkdtemp(prefix="jby-publish-")
    try:
        clone = os.path.join(tmp, repo)
        run(["git", "clone", "--depth", "1", "--quiet",
             "https://github.com/%s/%s.git" % (ORG, repo), clone])
        lay_over(src, clone)

        # The entry file doubles as index.html where the folder's is not the
        # page — the repo keeps both, as it already did.
        if entry:
            shutil.copy2(os.path.join(clone, entry), os.path.join(clone, "index.html"))

        if repo in SIBLING_ASSETS:
            _, assets = SIBLING_ASSETS[repo]
            shutil.copytree(os.path.join(PAGES, SIBLING_ASSETS[repo][0], assets),
                            os.path.join(clone, assets), dirs_exist_ok=True)
            # Matched rather than constructed. Building the prefix from the
            # folder name and urllib.parse.quote does not work: quote turns the
            # brackets in "(Intro Animation)" into %28 and %29, where the
            # markup has them literal, so the replace found nothing and said
            # nothing — and the page went live pointing at a folder that only
            # exists in this repository.
            index = os.path.join(clone, "index.html")
            with open(index, encoding="utf-8") as f:
                text = f.read()
            # The character class stops at a quote or a space and at nothing
            # else. An earlier version also excluded ")", which is the one
            # character the path is guaranteed to contain — "(Intro
            # Animation)" — so it matched nothing either.
            fixed, n = re.subn(r"\.\./[^\"'\s]*?/" + re.escape(assets) + "/",
                               "./" + assets + "/", text)
            if not n:
                raise RuntimeError(
                    "%s: found no ../<sibling>/%s/ to rewrite. Either the page "
                    "stopped borrowing its assets, in which case drop it from "
                    "SIBLING_ASSETS, or the path changed shape and this pattern "
                    "needs to change with it. Not pushing a page whose images "
                    "would 404." % (repo, assets))
            with open(index, "w", encoding="utf-8") as f:
                f.write(fixed)

        run(["git", "add", "-A"], cwd=clone)
        if not run(["git", "diff", "--cached", "--quiet"], cwd=clone, check=False).returncode:
            return "already current"
        run(["git", "-c", "user.name=dariadesigndaria",
             "-c", "user.email=daria@yachtway.com",
             "commit", "--quiet", "-m",
             "%s, published as its own site" % folder], cwd=clone)
        run(["git", "push", "--quiet", "origin", "HEAD:main"], cwd=clone)
        return "published"
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repos", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--changed-since", metavar="REF",
                    help="only the repos whose folder changed since REF")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    rows = mapping()
    if a.changed_since:
        changed = changed_folders(a.changed_since)
        rows = [r for r in rows if r[1] in changed]
    elif a.repos:
        want = set(a.repos)
        rows = [r for r in rows if r[0] in want]
        missing = want - {r[0] for r in rows}
        for m in sorted(missing):
            print("  not in tools/live-pages.txt: %s" % m, file=sys.stderr)
    elif not a.all:
        ap.error("give repo names, or --all, or --changed-since REF")

    if not rows:
        print("nothing to publish")
        return

    fails = 0
    for repo, folder, entry in rows:
        try:
            note = publish(repo, folder, entry, a.dry_run)
        except Exception as e:                      # noqa: BLE001 — report and go on
            note = "FAILED: %s" % str(e).splitlines()[0]
            fails += 1
        print("  %-30s %-12s https://jby-project.github.io/%s/" % (repo, note, repo))

    print("\n%d repo(s), %d failed" % (len(rows), fails))
    if fails:
        sys.exit(1)


if __name__ == "__main__":
    main()
