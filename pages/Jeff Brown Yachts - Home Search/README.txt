Jeff Brown Yachts — Home Page + SITE SEARCH
===========================================

A full copy of the live home page
(https://ywteamyw.github.io/jby-homepage.github.io/)
with a site-wide search added. Nothing else on the page
was changed.

QUICK START
-----------
Serve the folder and open index.html, e.g.

    python3 -m http.server 8777

The results page reads the home page's markup over fetch,
which browsers block on file:// - so opening index.html
by double-click still works, but search.html needs the
page to be served. On GitHub Pages that is automatic.


FILES
-----
  index.html       the home page, with the search panel
                   in its header
  search.html      the search results page
  jby.css          one stylesheet for both pages (this
                   used to be inline in index.html; it
                   sits at the folder root so the
                   ./JBY-V3.3-assets/ paths inside it
                   keep resolving)
  search.js        the index and the header panel, shared
                   by both pages
  search-page.js   drives search.html only
  JBY-V3.3-assets/ images, video, fonts

Nothing else about the home page was changed.

The original working copy is untouched next door in
"Jeff Brown Yachts - Home Page".


HOW IT LOOKS
------------
The search grows out of the header search icon. The card
starts at exactly the icon's distance from the top of the
page, so it does not run to the top edge of the window.
The bar is 88px tall (72px on narrow screens), which
leaves about 25px of air above and below the field. That
height is fixed rather than tied to the header, so the
spacing does not change once the page is scrolled.

The top offset is measured live when you open, because
the header does shrink on scroll and the icon rides up
with it.

The header itself steps aside while the panel is up. Its
logo is centred, so the top edge of the card would slice
it in half otherwise.

Set in Myriad Pro throughout, no icons anywhere in the
panel, hairline squares, colour-only hover. Chevrons, not
arrows - right to leave the page, down to jump to a
section further down this one.

Empty field shows, top to bottom:
  RECENT SEARCHES   what you searched before, each with
                    a small x to forget it
  QUICK LINKS       Yachts for sale / Our locations /
                    JBY news / Contact us

There is deliberately no "suggested" or "popular" row.
YachtWay's own search does not have one, and on a static
site there is no way to know what is actually popular -
nothing logs the queries - so any such list would be
hand-written and would go stale. If real popularity is
wanted later, it needs search events in analytics feeding
the list.

Start typing and those are replaced by results.

TWO STEPS
---------
1. SUGGESTIONS - the quick list in the header panel while
   you type, most relevant first, ending with the "See
   all results" button.

   Every row reads the same way: a thumbnail, the name,
   and plainly what it is - Brand, Yacht, Event, Article,
   Location, Team member, Service, Page - so it is always
   clear where the click goes.

   Nearly everything has a real picture: listings and
   events from the home page, brands as their wordmark,
   articles from News & Media, offices from the home
   page's data-photo, team members from the team site's
   headshots, services from the home page's own bento
   artwork. Pages have none; their column is left empty
   rather than boxed, so the titles still line up.

   Six rows at most, and no more than three of any one
   kind, so a broad word like "service" cannot fill the
   list with offices.

ORDER
-----
Name an actual thing and it leads: an exact name match
beats everything else, so "Jeff Brown" puts the person
above the three articles that start with his name.

Name a builder and the answer follows the shape of the
question - the brand, then its boats, then what is
happening, then the reading:

    Brabus -> Brabus (Brand)
              2023 Brabus Shadow 900 Sun-Top (Yacht)
              Brabus Shadow Sea Trial Weekend (Event)
              Showcasing the BRABUS Shadow 500 (Article)

Any other query is ordered by plain relevance, so
"Charleston" leads with the office, not with an article
that mentions it.

   Pages and services are ordinary rows in that list.
   There is no separate links block under it, and the
   home page's own section anchors are not indexed - they
   read as duplicates of the real pages ("Upcoming events
   & private experiences" sitting next to "Events &
   Experiences").

   Matched words are not underlined or highlighted: the
   list is only relevant hits already.

2. RESULTS PAGE - press Enter, or click "See all
   results", and you land on search.html?q=... This is a
   real page with the site header and footer, not a
   modal. Sections in this order, three cards each with a
   "See more":

     Yachts for sale
     Brands
     Events
     Articles
     Locations
     Team
     Services
     Pages

   Events sit above articles - they carry a date and stop
   being useful once it passes.

   Yachts and events are NOT redrawn - the page re-uses
   the home page's own vessel and event cards, markup and
   all, so they cannot drift apart. search-page.js
   fetches index.html and lifts them straight out of it.

   No breadcrumb. Headings are deliberately small here
   (22px for the page title, 19px for section names) -
   the page is a list, not a landing page. One hairline
   sits BETWEEN sections rather than under each heading.
   Every "See more" carries a chevron.

   The footer is the Statement of Information page's
   footer, rules and all - they were lifted from the live
   page rather than matched by eye, and they load after
   jby.css so they win here only. index.html keeps its
   own footer untouched.

   That is where the spacing comes from: 40px top and
   bottom (the legal strip pulls the bottom in from 80 to
   40), columns pushed down 112px so they start level
   with the nav under the logo, 56px to the legal rule
   and 40px below it. Back-to-top is the dark 2px square
   pinned to the footer's top right.

   The footer carries:
   the standard footer plus the legal strip (copyright,
   Privacy Policy, Terms and Conditions, Statement of
   Information). Those three link to their live pages.
   The location and social links are still "#" - the same
   placeholders every JBY page carries.

   Note: index.html's own footer was left as it was, so
   it does NOT yet have that legal strip. Say the word
   and it is one paste.


PICKING A BUILDER
-----------------
Brand rows in the suggestions list do not navigate.
Clicking one selects it - the row itself shows the picked
state with an x - and narrows everything to that builder.

Only one builder at a time: picking another replaces it.
Clicking the row again, or its x, clears it. Clear the
search box with a builder still picked and you get
everything of theirs, which is the quickest way to browse
one brand. Picks reset when the panel is reopened.

BRAND WORDMARKS
---------------
All seven brand logos in the assets folder are white
artwork, made for dark backgrounds, so they were unusable
on a light card.

Dark copies now sit beside them, named *_dark:

  riva_real_dark.png          brand_wally_logo_dark.svg
  brand_axopar_raw_dark.png   brand_sirena_logo_dark.svg
  brand_brabus_raw_dark.png   brand_everglades_logo_dark.png
  brand_pershing_raw_dark.png

They were recoloured pixel by pixel, not filtered: only
the white/grey ink was darkened, and genuinely coloured
pixels were left alone, so the red accent in the Axopar
mark survives. Transparency is untouched, so the edges
stay smooth. The originals are still there and still used
by the home page's builders slider, which is dark.

To regenerate after a logo changes, the rule is: any
pixel whose R/G/B spread is under 40 becomes #2f2f39 at
its existing alpha; anything more saturated is kept.


CARD DETAILS
------------
  - corners are 2px, the same radius the site already
    uses on its location modal
  - hover is a soft shadow plus a slow zoom on the photo
    (scale 1.06, the same move and easing the home page's
    vessel and event cards use). The card itself never
    darkens, never moves, never scales. Brand wordmarks
    do not zoom - a logo on white has nothing to zoom
    into.
  - section headings are black, not navy
  - headshots keep the same frame as every other card but
    anchor to the top of the photo, so the crop takes the
    feet rather than the face


ARTICLE CARDS
-------------
On the results page an article uses its own card shape:
the category over the photo, the headline, room for a
standfirst, then a foot rule carrying the date and the
reading time, with no icons.

The standfirst is empty and will stay empty until News &
Media publishes one - those cards carry only a photo, a
category, a headline and a date, so there is nothing to
show and none was invented. When the hub gains excerpts,
put them in the ARTICLES list as `excerpt:` and the slot
fills itself.


ARTICLES
--------
The eight articles come from the live News & Media page
(title, photo, category, date). They were read off that
page, so re-scrape when the hub gains new pieces - see
the ARTICLES list in the search script. Individual
article URLs all point at that site's shared article.html
stub, because it does not have per-article pages yet.


A full-screen version was built first and is kept in
.snapshots/index.fullscreen-overlay-2026-08-18.html
if that direction is ever wanted back.


HOW TO OPEN SEARCH
------------------
  - Click the magnifier in the header (it was decorative
    before, now it is wired up)
  - Cmd+K  / Ctrl+K   from anywhere on the page
  - "/"               from anywhere on the page
  - index.html#search        opens it empty
  - index.html?q=axopar      opens it pre-filled

Inside: type to search, arrow keys to move, Enter to open,
Esc or a click on the dimmed page to close. (Those hints
are not printed on screen - the strip along the bottom was
removed - but the keys all still work.)

The x at the right of the bar is a plain black glyph, no
box. It empties the field first - clearing the query and
any picked builder - and only closes the panel when there
is nothing left to clear.


WHAT IT SEARCHES
----------------
Results are grouped, and the group that matched best leads.

  Yachts       the 4 vessels in the "Our vessels" carousel
  Brands       Riva, Axopar, Brabus, Pershing, Wally,
               Sirena, Everglades
  Services     All Services, Service & Maintenance, Yacht
               Management, Sell Your Yacht, Co-ownership,
               Financing, Insurance
  Events       the 4 events in the events strip
  Locations    all 9 offices, marinas and boatyards
  Team         all 37 people, by name, role and office
  Pages        Home, About, Team, Locations, Events,
               News & Media, Contact
  On this page the 8 homepage sections (jumps + scrolls)

Two sources feed the index:

  1. A written list at the top of the search script, for
     things that live on OTHER pages (pages, brands,
     services, team).
  2. A read of THIS page's own markup at load, for vessels,
     events and offices. Edit a vessel card or add an
     office in the HTML and search picks it up on its own,
     with no second list to keep in sync.


EDITING THE INDEX
-----------------
Open index.html, search for "JBY SITE SEARCH". The lists
are right at the top of that block:

  PAGES      site pages and their live URLs
  SERVICES   service pages
  BRANDS     the 7 builders
  TEAM       the 37 people
  SECTIONS   anchors on this page
  QUICK      the four quick-link rows on the empty state

Each entry has  t: title,  d: the grey sub-line,
u: the URL,  k: extra words that should match but do not
need to be shown (model numbers, synonyms, misspellings).

The "k" field is where to put things people actually type.
"Sell Your Yacht" carries brokerage, valuation, appraisal,
trade and consign, so all of those find it.


MATCHING
--------
A query has to hit the START of a word. Loose
mid-word matching was pulled out after it produced
nonsense: "riva" was matching the offices, because their
addresses contain "D-riv-e", and the Events page,
because its copy says "p-riva-te". Titles are the one
exception - a substring still counts there, so a model
name like "Aquariva" stays findable.

Plural tolerance only applies to real plurals: a query
must actually end in "s" before the trailing letter is
dropped ("brands" finds "Brands"). It used to chop the
last letter off anything, which is where "riva" -> "riv"
came from.


NICE TO KNOW
------------
  - Filler words are ignored, so "sell my yacht" and "how
    do i insure my yacht" both work.
  - If nothing matches every word, it retries on any word
    rather than showing a dead end.
  - Recent searches are remembered in the browser only
    (localStorage). Nothing is sent anywhere. Each one can
    be removed with the small x.
  - Everything runs in the page. No search service, no
    backend, no build step, no new files.


KNOWN, PRE-EXISTING
-------------------
The footer logo points at ./assets/jby_logo.svg but the
folder is JBY-V3.3-assets, so it 404s. This is inherited
from the live site and was left as-is to keep the copy
faithful. One-line fix when wanted.
