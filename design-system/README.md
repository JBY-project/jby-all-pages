# JBY design rules

Four rules the client asked for across the whole site. They are written once,
in `jby-system.css`, and copied into each page's folder — these pages are
standalone sites on separate GitHub Pages repositories, so there is no shared
origin to serve one stylesheet from.

```
node design-system/apply.mjs "pages/<page folder>"
```

The script copies the stylesheet in and links it before `</head>`, which is
after the page's own inline `<style>`. Last one in wins, so no `!important`.

## The rules

**1 · Sub-text is Myriad light.** Every `font-weight:400` that sits on
`'Myriad Pro'` becomes `300`. Weights 600 and 700 are headings and are left
alone. This one is a pass over the HTML, not a stylesheet rule — the weights
live in each page's own CSS:

```
node design-system/myriad-light.mjs "pages/<folder>/<file>.html"
```

Run the script rather than a find-and-replace. The pages embed their fonts as
`@font-face` blocks, and a plain replace rewrites those too: the Regular file
gets re-registered under weight 300, where it overrides the real Light cut and
every page comes out heavier instead of lighter. The script skips them.

**2 · One button.** Height `48px`, padding `0 28px`, square corners,
Mesmerize 300 at `16px/20px`, uppercase, no letter-spacing, `10px` gap.
Before this the home page alone carried heights of 40, 44 and 48 and four
different paddings.

**3 · Hover turns blue, never black.** The blue is `--navy` / `#41647b`, the
token already defined in 122 files.

| Button | Hover |
|---|---|
| Outlined on a light surface | fills `#41647b`, type goes white |
| Already filled blue | deepens to `--navy-d` `#365466` |
| On a photograph or video | `rgba(65,100,123,0.85)` — stays translucent |

**4 · White buttons over media are a veil.** `rgba(255,255,255,0.28)` with
white type, no border — the picture shows through. Not a white slab with dark
type.

**5 · The type scale.** The client asked for smaller headers and named `20`
for a section header. Three tiers, and one step quieter again inside a
`max-width` media query:

| | desktop | narrow |
|---|---|---|
| page or hero title | `26/38` | `20/30` |
| section header | `20/30` | `18/26` |
| card title, sub-head | `18/28` | `16/24` |

Body copy is not part of the rule, but on the home page it came down with the
headers — `16/26` for paragraphs and `14/22` for the small print in a card —
because a card title and its own paragraph had ended up the same size.

Like rule 1, this is a pass over the page's own CSS rather than a line in this
stylesheet. It has to be: the pages spell their headings out inside `@media`
blocks too, and one flat rule in a later file would flatten every phone size
onto the desktop one.

```
node design-system/type-scale.mjs --dry            # every published page
node design-system/type-scale.mjs "pages/<folder>" # one page
```

The script reads the published list off the checklist below, so the two cannot
drift. Read the header of `type-scale.mjs` before changing it: three drafts
broke on the same three things, and each one is written up there. The short
version is that the biggest type on this site is not headings — the brand
wordmark is 96px, the testimonial quote marks are 60 to 72 — that pages do not
share a hero size, so desktop has to be decided by whether a rule sits outside
a media query rather than by how big it is, and that the pass never grows a
heading that already sits under its tier.

## Checking a page

Open it and paste `audit.js` into the console. It prints the height of every
button the system file governs, and warns about any whose hover fill matches
the surface behind it — a button that would vanish on hover. Do this on each
page: the trap is invisible in the diff.

The brand-blue CTA band is the reason. It runs on 22 of the 34 published pages
under two names, `.expert` and `.help`, painted the same `#41647b` the hover
fills with. Buttons inside it hover to `--navy-d` instead; that rule is already
in the stylesheet.

## Where it is applied

- [x] `Jeff Brown Yachts - Home Page`
- [x] `Jeff Brown Yachts - 404 Page` — 2 files
- [x] `Jeff Brown Yachts - About Us Page` — 2 files
- [x] `Jeff Brown Yachts - All Services Page` — 2 files
- [x] `Jeff Brown Yachts - Brand Page (Axopar)` — 2 files
- [x] `Jeff Brown Yachts - Events Page` — 24 files
- [x] `Jeff Brown Yachts - FAQ Page`
- [x] `Jeff Brown Yachts - Home Page (Intro Animation)`
- [x] `Jeff Brown Yachts - Home Page (Intro V2 Logo Only)`
- [x] `Jeff Brown Yachts - Home Page V1`
- [x] `Jeff Brown Yachts - Home Search` — 2 files
- [x] `Jeff Brown Yachts - Knowledge Center` — 4 files
- [x] `Jeff Brown Yachts - Knowledge Center V2` — 5 files
- [x] `Jeff Brown Yachts - Knowledge Center V3` — 5 files
- [x] `Jeff Brown Yachts - Knowledge Center V4` — 5 files
- [x] `Jeff Brown Yachts - Listing Page`
- [x] `Jeff Brown Yachts - Locations Page`
- [x] `Jeff Brown Yachts - Marketing Section Variants`
- [ ] `Jeff Brown Yachts - Mega Menu`
- [x] `Jeff Brown Yachts - Office Page` — 2 files
- [x] `Jeff Brown Yachts - Privacy Policy Page`
- [x] `Jeff Brown Yachts - Sell Your Yacht Page`
- [x] `Jeff Brown Yachts - Sell Your Yacht Page V2`
- [x] `Jeff Brown Yachts - Sell Your Yacht Page V3`
- [x] `Jeff Brown Yachts - Service & Maintenance Page`
- [x] `Jeff Brown Yachts - Service & Maintenance Page V2`
- [x] `Jeff Brown Yachts - Site Hub` — 28 files
- [x] `Jeff Brown Yachts - Statement of Information Page`
- [x] `Jeff Brown Yachts - Team Member Page`
- [x] `Jeff Brown Yachts - Team Page` — 2 files
- [x] `Jeff Brown Yachts - Terms Page`
- [x] `Jeff Brown Yachts - Testimonials V2`
- [x] `Jeff Brown Yachts - Testimonials Variants`
- [x] `Jeff Brown Yachts - Yacht Management Page`
- [x] `riva-112-model-page` — 7 files

The one page left out is the mega menu: it is being reworked on
`feat/mega-menu-brand-models`, where its buttons already carry a 2px radius
against this file's square corners. The two need reconciling before the
system goes on it.

Pages outside the published list — drafts, superseded copies, the Crisp chat
variants — were left alone.

## Two traps this rollout walked into

**A plain find-and-replace on the font weight rewrites `@font-face` too.**
That re-registers the Regular file under weight 300, where it overrides the
real Light and makes the page heavier rather than lighter. `myriad-light.mjs`
skips those blocks; use it rather than sed.

**A relative stylesheet link cannot reach a page that carries a `<base
href>`.** The Site Hub's 26 pages point their base at the live origin, so
`./jby-system.css` resolved there and fetched nothing. `apply.mjs` detects a
base tag and inlines the rules in a `<style data-jby-system>` block instead;
`refresh.mjs` updates both kinds.
