# Jeff Brown Yachts — FAQ page (dev handoff)

Static page, no build step, no framework. Open it, serve it, ship it.

- **Live:** https://ywteamyw.github.io/jby-faq/
- **Also served inside the assembled site:** https://ywteamyw.github.io/jby-site/faq/
- **Repo:** https://github.com/ywteamyw/jby-faq
- **Commit in this archive:** `11cb4bd` (2026-08-25)

## What is inside

```
jby-faq/
  index.html      the whole page: markup, styles and script in one file
  README.md       this file
  assets/
    fonts.css     the two brand faces, base64 inlined (6 @font-face rules, ~190 KB)
    jby_logo.svg  the JBY emblem, used in the header and the footer
```

There is nothing else. No images, no video, no JSON, no dependencies.

## How to run

```
cd jby-faq
python3 -m http.server 8000
```

Then open http://localhost:8000/. Opening `index.html` straight from the file system also works, but serve it if you want the fonts and the search to behave exactly as in production.

## Dependencies

**None.** No CDN, no Google Fonts, no analytics, no jQuery. The page makes zero external requests, so it works offline and inside a corporate network. Keep it that way.

## Fonts

Both brand faces live in `assets/fonts.css` as base64 `@font-face` rules, so nothing is fetched over the network:

- **Mesmerize** — weights 300 / 400 / 500. Headings, the section headings, all uppercase labels and buttons.
- **Myriad Pro** — weights 300 / 400 / 600. Body copy, the questions, the answers, the filter tabs.

Rule of thumb on this site: **Mesmerize is uppercase and structural, Myriad Pro is everything a person reads as a sentence.** The FAQ questions are deliberately Myriad Pro 18/26 (they used to be Mesmerize and were changed on review).

## Page structure

1. **Header** — fixed, light. Turns navy with a blur when the page scrolls past 20px (`.nav.scrolled`), the logo inverts to white with it. Burger on the left, emblem centred, search icon and "Contact an expert" on the right. The burger has no menu attached in this repo: in the assembled site the shared script binds it to the site menu, so leave the markup as is and wire it to your own navigation.
2. **Page title** — `FREQUENTLY ASKED QUESTIONS`, Mesmerize 32/48 uppercase. No subtitle, by design.
3. **Search field** — filters the questions live as you type. Magnifier on the left, clear "×" on the right.
4. **Filter tabs** — All questions / Buying / Selling / Ownership and service / Working with us.
5. **The questions** — 4 groups, 17 questions, each an accordion.
6. **"Still have a question?"** — navy band, the button scrolls to itself for now (see placeholders).
7. **Footer** — the standard JBY footer: toll-free number, info@ address, three social icons at 28px, the uppercase list of locations, back-to-top button.

## The interactive parts

All of it is in the one `<script>` at the bottom of `index.html`, plain ES5-ish JavaScript, no libraries.

- **Accordion.** Each `.faq-item` opens independently (opening one does not close the others). Animated by setting `max-height` on `.faq-a` to the real `scrollHeight` of its content, and back to `0px`. On `resize` the open panels recalculate, so a reflow does not clip an answer. `aria-expanded` is kept in sync.
- **Category tabs.** `data-filter` on each button, `data-cat` on each `.faq-item`. **The counts next to the labels are computed from the DOM at load**, not hardcoded, so if you add or remove a question the numbers follow automatically.
- **Live search.** Case-insensitive substring match over the whole item text, question and answer. It combines with the active tab (tab AND search, not OR). A group whose questions are all filtered out hides its heading too. If nothing matches, `#faq-empty` appears.
- **Deep links.** `/faq/#buying`, `#selling`, `#ownership`, `#company` open that category on load.
- **Tabs on mobile.** Below 760px the tab row stops wrapping and becomes one horizontally scrolling row (`flex-wrap:nowrap; overflow-x:auto`, scrollbar hidden), the same pattern the Knowledge Center uses for its tabs and chips. Keep the two in sync if you change either.
- **Reveal on scroll.** `.reveal` elements fade and rise once; the page title is split into words with a staggered delay (`[data-split]`). Everything is disabled under `prefers-reduced-motion`.

### Adding a question

Copy one `.faq-item` block into the right `.faq-group`, keep `data-cat` matching the group, and that is it. The count, the filtering and the accordion pick it up with no further edits.

## Layout system, and the traps

**One grid for the whole page.** Header, content and footer all use `max-width: 1440px; margin: 0 auto; padding: 0 40px` (24px below 960px). The header is `position: fixed`, so it gets an inner `.nav-in` wrapper that carries the grid, and the footer carries its padding on `.foot-grid`, not on `<footer>`.

Three traps, all of which we already hit on this page:

- **Do not put a flat `padding: 40px` on the fixed header or the footer.** It looks right up to 1440px and then drifts: on a 1800px screen the burger, the title and the footer each end up on a different gutter. If you add a section, give it `.wrap`, do not invent a new container.
- **Do not cap a section with `max-width` plus `margin-left: 0` inside a centred wrapper.** That is what made the questions hug the left edge on wide screens. The column width lives on `.faq-list` (1040px) inside the normal centred `.wrap`.
- **Restate a `padding-top` inside every media query that touches `.wrap`.** In the `max-width: 960px` query, `.wrap{padding:0 24px}` sits after `.faq-head{padding-top:48px}` in the source, so the shorthand also zeroed the head's top padding and the title ended up flush against the fixed header. The query now restates `.faq-head{padding-top:40px}`.

Check any change at 1920, 1440 and 375. Everything must start on one vertical line.

## Site conventions this page follows

- **Buttons never move or scale on hover.** Colour change only. Ghost buttons on light backgrounds stay black on white with a faint `rgba(0,0,0,.05)` tint; they are never inverted to a dark fill with white text.
- **Section numbers** are plain, inline with the heading, with a full stop: `1. BUYING A YACHT`. Never `01`, never on a separate kicker line, same colour as the heading.
- **The tab row** carries a hairline under the full row, and the active tab's 2px stroke sits on that line, 7px under the label.
- **No em-dashes** anywhere in the copy.
- **The footer is identical on every page** of this site: toll-free (888) 693-8099, info@jeffbrownyachts.com, the uppercase list of locations, 28px social icons, no street address.

## Placeholders, and what still needs wiring

- **Every `href="#"` is a placeholder.** The footer navigation, the footer locations, the social icons. Point them at the real routes when you integrate.
- **The "Contact us" button** in the navy band and the header's "Contact an expert" both scroll to the band. Point them at the real contact page or open your contact modal.
- **The search icon in the header** is decorative here. The real site search lives elsewhere.
- **The burger** needs your navigation, as described above.
- **Content:** four answers describe process rather than fact and are still waiting for the client's confirmation: the deposit held in a client trust account, the survey-then-sea-trial order, lender prequalification, and servicing yachts that were not bought through JBY. No commission figures and no sale timelines are stated anywhere, deliberately.

## Browser support

Tested in current Chrome and Safari. The custom clear "×" in the search field uses `::-webkit-search-cancel-button`, so in Firefox the field simply has no clear button, which is the normal Firefox behaviour and not a bug to chase.
