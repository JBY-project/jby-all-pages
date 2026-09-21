# Jeff Brown Yachts — Site Search

A copy of the JBY home page with a site-wide search added, plus the search
results page it opens.

- **Live:** https://ywteamyw.github.io/jby-search/
- **Results page:** https://ywteamyw.github.io/jby-search/search.html?q=riva
- **Repo:** https://github.com/ywteamyw/jby-search
- **Commit in this archive:** `f52b6cae316b5666a054380d14419307532b75a7`

Nothing on the home page itself was redesigned. The only change to it is the
search: the magnifier in the header used to do nothing, and now it opens the
panel.

---

## Run it

**It needs a web server — double-clicking `index.html` is not enough.**

```bash
cd jby-search
python3 -m http.server 8777
```

Then open http://localhost:8777/

The home page alone would work off the filesystem, but `search.html` fetches
`index.html` to read the vessel and event cards out of it (see *How the index
is built*), and browsers block `fetch` on `file://`. On any real server —
GitHub Pages included — this is a non-issue.

---

## What is in here

```
index.html        the home page, with the search panel in its header
search.html       the search results page
jby.css           one stylesheet for both pages
search.js         the search index + the header panel, shared by both pages
search-page.js    drives search.html only
JBY-V3.3-assets/  images, video, logos
```

### Why the CSS sits at the root

`jby.css` used to be an inline `<style>` block inside `index.html`. It was
pulled out so both pages could share one stylesheet. **It has to stay next to
the HTML files.** There are two `url()` references inside it that point at
`./JBY-V3.3-assets/…`, and those resolve relative to the stylesheet, not the
page — move it into a subfolder and those two images break silently.

### Cache busting

The `<link>` and `<script>` tags carry `?v=20260819a`. Bump that string
whenever you change `jby.css`, `search.js` or `search-page.js`, otherwise
browsers keep serving the old file and your change appears not to have
happened. Editing the HTML alone is not enough — the query string is what the
browser keys on.

---

## Fonts

Both faces are embedded in `jby.css` as base64 `@font-face` rules — six of
them, about 190 KB of the file. Nothing is fetched from a font CDN and there
is no licence server call.

- **Mesmerize** — headings, buttons, uppercase UI
- **Myriad Pro** — body text, and all of the search panel's own text

The two are not interchangeable. See *Conventions* below.

---

## External dependencies

Loaded from CDNs by `index.html`:

| What | Version | Used for |
|---|---|---|
| Tabler Icons | 3.30.0 | every icon on both pages |
| Leaflet | 1.9.4 | the Locations map on the home page |
| Mapbox GL | 3.9.0 | loaded by the home page, map tiles |

`search.html` only needs Tabler Icons; it does not load the map libraries.

If the site has to work offline or behind a firewall, Tabler Icons is the one
to vendor first — without it every chevron and the magnifier disappear.

---

## How the search works

### Two steps

**1. Suggestions** — the panel that drops out of the header while you type.
Opens from the magnifier, `Cmd/Ctrl+K`, `/`, `index.html#search`, or
`index.html?q=axopar`.

The panel lands on exactly the search icon's own box — same distance from the
top of the page, same height — measured live when it opens, because the header
shrinks once the page is scrolled. The header fades out while the panel is up,
since JBY's centred logo would otherwise be sliced by the panel's top edge.

Every row reads the same way: a thumbnail, the name, and plainly what it is —
Brand, Yachts for sale, Event, Article, Location, Team member, Service, Page.
Six rows at most, and no more than three of any one kind, so a broad word like
"service" cannot fill the list with offices.

**2. Results page** — press Enter or click *See all results* and you land on
`search.html?q=…`. A real page with the site header and footer, not a modal.
Sections in this order, three cards each with a *See more*:

```
Yachts for sale · Brands · Events · Articles · Locations · Team · Services · Pages
```

Listings and events are **not redrawn** on that page. It re-uses the home
page's own `.vessel-card` and `.event-card` markup verbatim — brand logo, Open
House label, location chip, price, View / Request to attend — so the two can
never drift apart.

### Picking a builder

Brand rows in the suggestions list do not navigate. Clicking one selects it —
the row shows the picked state with an × — and narrows everything to that
builder. One at a time; picking another replaces it. Clear the search box with
a builder still picked and you get everything of theirs. Picks reset when the
panel is reopened.

### Matching rules

- A query has to hit the **start of a word**. Loose mid-word matching was
  removed after it made "riva" match the offices (their addresses contain
  "D**riv**e") and the Events page ("p**riva**te sea trials"). Titles are the
  one exception, so a model name like "Aquariva" stays findable.
- Plural tolerance only fires on real plurals — the query must end in "s"
  before the last letter is dropped.
- Filler words are ignored, so "sell my yacht" and "how do I insure my yacht"
  both work.
- An **exact name match leads**, otherwise "Jeff Brown" the person loses to the
  three articles titled after him.
- When the query names a builder the order becomes brand → listings → events →
  articles. Any other query is plain relevance.
- Matched words are **not** highlighted. The list is only relevant hits already.

---

## How the index is built

Two halves, both at the top of `search.js`.

**Written by hand** — things that live on other pages:

| List | Holds |
|---|---|
| `PAGES` | site pages and their live URLs |
| `SERVICES` | the seven service pages |
| `BRANDS` | the seven builders, with a photo and a wordmark |
| `TEAM` | 37 people, scraped from the live Our Team page |
| `ARTICLES` | 8 pieces, scraped from the live News & Media page |
| `LISTINGS` | vessels that have their own detail page |
| `QUICK` | the four quick links on the empty panel |

**Read from the page itself at load** — listings, events and offices are pulled
straight out of `index.html`'s markup (`.vessel-card`, `.event-card`,
`.visit-item`). Edit a vessel card or add an office in the HTML and search
picks it up on its own. There is no second list to keep in sync.

`search-page.js` does the same by fetching `index.html`, which is why the
results page needs a server.

### The `k` field

Every hand-written entry has a `k:` of words that should match but never
appear on screen — model numbers, synonyms, misspellings. "Sell Your Yacht"
carries *brokerage, valuation, appraisal, trade, consign*, so all of those
find it. **This is where to put what people actually type.**

### Keeping it current

The scraped lists go stale when their source pages change:

- **Team** — re-read the `TEAM` array on https://ywteamyw.github.io/jby-team/
- **Articles** — re-read the cards on https://ywteamyw.github.io/jby-news-media/

---

## Assets

70 files in `JBY-V3.3-assets/`, 66 referenced. The four unreferenced ones are
`brand_fourwinns.webp`, `brand_fourwinns_logo.svg`, `brand_jeanneau.jpg` and
`brand_jeanneau_logo.svg` — builders that are not currently represented. They
were left in place rather than deleted, since they came with the original
home page.

### Brand wordmarks

All seven brand logos are **white artwork**, drawn for dark backgrounds. Dark
copies sit beside them as `*_dark.png` / `*_dark.svg` and are what the search
uses on light UI.

They were recoloured pixel by pixel, not filtered: only the white and grey ink
was darkened, genuinely coloured pixels were left alone, so the red accent in
the Axopar mark survives. **Do not `invert()` them** — that turns the red
cyan. To regenerate after a logo changes: any pixel whose R/G/B spread is
under 40 becomes `#2f2f39` at its existing alpha, anything more saturated is
kept.

The white originals are still in use by the home page's builders slider, which
is dark. Both sets are needed.

---

## Conventions this site follows

Devs break these first. They are not preferences, they are site-wide rules.

**Gutters.** One system everywhere: `max-width` 1440, 40px each side on
desktop, 24px under 980px. The search panel and the results page deliberately
use the nav's own full-width 40px gutters so their edges line up with the
header. Do not add padding shorthands that clobber this — on the results page
the section heads, card grid, footer columns and legal strip all measure
40 / 1240 at 1280px wide, and they should stay that way.

**Buttons never move on hover.** No lift, no scale, no shift — colour change
only. Card *images* may zoom; that is the one exception and it is already
implemented at `scale(1.06)` with the same easing the home page uses.

**Buttons are Mesmerize, uppercase.** The panel's own text is Myriad Pro, but
every button follows the page's button system: `.btn-solid` (48px solid navy),
`.s-link` (40px outlined), and 14px Mesmerize with `0.04em` tracking for small
controls.

**Chevrons, not arrows.** Directional glyphs are `ti-chevron-*`. Right to
leave the page, down to jump within it.

**Corner radius is 2px** where a radius is used at all.

**The close × is a bare black glyph** — no box, no border. It clears the field
first and only closes the panel when there is nothing left to clear.

**Footer.** Same on every page: toll-free `+1 (888) 693-8099` (the `+1` is
required), `info@jeffbrownyachts.com`, the uppercase list of offices, 28px
social icons, no street address. `search.html` carries the Statement of
Information page's footer, legal strip and all — those rules are inlined in
`search.html` and load after `jby.css` so they win on that page only.

**No em-dashes in copy.**

---

## Known placeholders and open items

- **Listings are demo data.** The home page carousel has four boats, all at
  `$349,000` and all in Seattle. The two Riva vessels in `LISTINGS` are real,
  read off their own pages. There is no inventory feed — when one exists, the
  index should point at it instead of at the carousel.
- **Article links** all go to News & Media's shared `article.html` stub,
  because that site has no per-article pages yet.
- **Article cards have no standfirst.** The News & Media cards carry only a
  photo, category, headline and date, so there was nothing to show and none was
  invented. The slot is built — fill `excerpt:` in `ARTICLES` when the hub
  publishes them.
- **Two content hubs exist** and the search points at both: quick links go to
  Knowledge Center, articles go to News & Media. Someone has to decide which is
  canonical.
- **Footer location and social links are `#`** — the same placeholders every
  JBY page carries. Office detail pages do not exist yet.
- **The footer logo path was fixed here.** It pointed at `./assets/jby_logo.svg`
  and 404'd; the folder is `JBY-V3.3-assets`. The same bug is still live on the
  original home page.
- **No analytics.** There is deliberately no "popular searches" row: nothing
  logs queries, so any such list would be hand-written and would go stale. Real
  popularity needs site-search events in analytics first.
