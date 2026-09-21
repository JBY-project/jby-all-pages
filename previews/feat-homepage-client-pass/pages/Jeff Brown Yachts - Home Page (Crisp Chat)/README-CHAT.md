# Jeff Brown Yachts — Home page with the chat launcher

**Live:** https://ywteamyw.github.io/jby-home-chat/
**Widget on its own:** https://ywteamyw.github.io/jby-home-chat/chat-widget-preview.html
**Repo:** https://github.com/ywteamyw/jby-home-chat

This is a variant of the home page, not the live home page. The approved V3.31
home page stays at jby-homepage.github.io.

A copy of the live home page (V3.31) with one addition: an **Explore inventory**
button and a round chat launcher that appear on the second block, and a full
**Crisp style chat**, rebuilt from scratch in the JBY design system.

Nothing else on the page was touched. The chat is one self contained block at
the end of `JBY-Home.html` (search for `JBY CHAT`), around 1,150 lines of
scoped CSS, markup and JS. Every class is prefixed `jc-` so it cannot collide
with the page.

## Files

| File | What it is |
| --- | --- |
| `JBY-Home.html` | The home page with the chat. Open it directly. |
| `chat-widget-preview.html` | The same widget on a stripped page, with buttons to drive every state. Give this to the developer. |
| `JBY-V3.3-assets/` | Home page assets. The chat reuses `jby_logo.svg` and three vessel photos, and adds one file of its own: `operator_audrey.jpg`, a 240px square crop of the team page headshot. |

## The launcher

Fixed bottom right, `40px` / `32px` gutters on desktop, `24px` on mobile.

There is no white `CHAT WITH US` button, and no plate holding the two together.
The chat is a launcher again: the navy Explore inventory button, then the disc
`16px` to its right, both `56px` and `54px` tall so they sit on one line.

```
┌──────────────────────────────┐   ╭────╮
│  EXPLORE INVENTORY      ›    │   │ 💬 │
└──────────────────────────────┘   ╰────╯
     navy, scrolls to #yachts      opens the chat
                                   ↓ after 30s
                                   ╭────╮
                                   │ 🙂 │•  Audrey, dot while the desk is open
                                   ╰────╯
```

The disc is Crisp's own 54px launcher tile, colours inverted so it reads on a
near white page: a white disc carrying the navy speech bubble glyph, held by a
1.5px navy hairline and a drop shadow. It swaps to a close cross while the box
is open. Thirty seconds in, the glyph is dropped and Audrey's photo takes the
whole circle, edge to edge inside the hairline, with a green dot on the bottom
right corner while the desk is open. Opening the box still brings the cross back
over her. See **The face and the dot** below.

One CSS note for whoever edits this. The face is `position:absolute` scoped as
`.jc-launcher .jc-face`, not as `.jc-face`, because `.jc-mark` sets
`position:relative` further down the sheet and would win the tie. At equal
specificity the face drops back into the launcher's flex row beside the glyph,
and the two shrink each other to 46px and 5px: the photo stops filling the
circle and a sliver of speech bubble shows at its left.

* Hidden while the visitor is on the hero.
* Slides up once the second block ("Bespoke yacht sales and brokerage") is
  within 62% of the viewport, then stays for the rest of the page.
* Stays visible whenever the chat is open, wherever the visitor is.
* When a message lands while the box is closed, the teaser bubble opens above
  the disc and clears on open. **No unread badge**: the disc carries one dot and
  it is the green one, because a red counter next to her face turns an available
  person into an alarm. Unread is still counted in `S.unread`, so a badge can be
  drawn from there if that decision changes.
* Hover changes colour only, never position or scale, per the site wide rule.
  The disc takes Crisp's own hover ring, which is a shadow, not movement.
* On mobile the Explore button takes the width it is given and the disc keeps
  its 54px.

`Get expert guidance`, the outline button already in that block, also opens the
chat. `Explore inventory` in that block scrolls to the vessels section, same as
the button next to the launcher.

## The chat

472 × 730 on desktop, full screen below 640px. The height is Crisp's own large
view figure, measured off the live widget; the width, 472px, is ours.
Re-skinned from Crisp like this:

| Crisp | Here |
| --- | --- |
| White chatbox on a theme colour header | One sheet of translucent navy glass, `#41647b` at 78-90% over a 22px blur, the same glass the page header uses. The header is the top of that glass one shade lighter, not a separate colour |
| Theme colour header, `layout-colorized` | `--navy #41647b` carried by the glass, with inset highlights |
| Noto Sans | Mesmerize for labels and headings, Myriad Pro for message text |
| Rounded 16px shell | 2px radius on every surface, from one `--jc-r` token |
| Operator bubble `#f0f2f5`, text `#1c293b`, radius 12px, padding 8/14/9 | White at 12% on the glass, white text, radius 2px |
| Bubble text 12.6px, composer 13.6px | Both 16/24 Myriad Pro, which also stops iOS zooming on focus |
| Visitor bubble in theme colour | Solid white, `--ink` text. It is the only opaque surface in the box, which is what separates it from the operator now that both sit on blue |
| Messages / Search segmented tabs | Removed. Messages only, no helpdesk surface |
| Composer with focus ring, emoji, file, audio | Same, white border on focus, no glow |

### Implemented

**Header** — 84px, one centred line, `CHAT WITH OUR TEAM`. The close chevron is
absolutely positioned in the corner so it stays out of the flow and the type
block sits on even 30px padding top and bottom. No tabs, no avatar stack, no
availability line, and no brand name: the visitor already knows whose site this
is. Once the visitor writes, the block swaps to the compact bar, `OUR TEAM` plus
the options menu, on the same even padding. That initial vs ongoing switch is
Crisp's own behaviour.

**The face and the dot** — the brand answers first. For the first thirty
seconds on the page the sender is `OUR TEAM` on the JBY monogram, and the
launcher is Crisp's speech bubble glyph. At thirty seconds every mark changes at
once — the thread avatars, the teaser, the header bar and the launcher disc — to
Audrey's headshot, and the label becomes `AUDREY`. A green dot sits on the corner of the face while the
desk is open, 8am to 6pm Pacific, the same hours the script quotes. The hours
are read in the desk's timezone, not the visitor's, so a visitor in Monaco only
sees the dot while somebody is actually at a desk in California, and a box left
open across the boundary re-checks itself every minute.

Three rules hold that sequence together, and each one came out of a review:

* **The face is never beside itself.** The teaser carries her name and her
  message but no avatar, because her photo is already on the disc directly
  below it. Two copies of one face in one corner read as a mistake.
* **She arrives before she speaks.** The proactive nudge is held in
  `whenHuman()` until the swap has happened, so there is no state where the
  anonymous glyph is still on the disc and a message is already open next to
  it. If the visitor reaches the second block late, the face is there first and
  the nudge follows on its own timer.
* **The dot is always drawn in the mockup.** `OPERATOR.alwaysOnDuty` forces it
  on, because the prototype gets shown outside 8-to-6 Pacific at least as often
  as inside it, and a dot nobody can see is a dot nobody can sign off. Set it
  to `false` to watch the real hours work, and delete it once Crisp answers the
  question through `website:availability:changed`.

All of it lives in `OPERATOR` at the top of the script: the photo, the delay,
the timezone, the two hours and that one demo switch. Setting `OPERATOR` to
`null` returns the widget to one nameless brand identity, which is what it
shipped as.

**Messages** — operator message with the brand mark, visitor message with `Sent`
then `Seen` delivery state, typing indicator, timestamp on bubble hover, unread
count held in `S.unread` but not drawn, notification sound (generated, no audio
file), proactive teaser bubble above the disc. No date separator: the conversation is not
persisted across visits, so a day divider would be noise.

**Rich messages** — picker chips, guide cards, vessel cards with photo and
price, file attachment bubbles, inline image previews from drag or picker, audio
message placeholder, conversation rating with thumbs, pre chat form for name and
email.

**Guides, not search** — there is no search tab. The ten short answers live in
the `GUIDES` array and surface as cards inside the thread. Clicking a card posts
the visitor's question and the operator's full answer as messages, then offers a
hand off to a broker. Everything stays in one conversation.

**Menu** — email transcript, sound toggle, start a new conversation.

**Composer** — flat send glyph with no plate behind it, grey until there is
something to send and navy once there is, the way Crisp does it. Emoji, file and
audio to the left. No "powered by" or privacy line underneath: the composer is
the last element in the box.

**Keyboard and a11y** — `Esc` closes, `Enter` sends and `Shift Enter` inserts a
newline, `aria-live` on the message list, labels on every icon button,
`prefers-reduced-motion` respected.

**Tokens** — `--jc-w` is the chat window width, 472px.
`--jc-r` is the single radius, 2px, for every surface; only the mark discs stay
circular. `--jc-navy`, `--jc-ink`, `--jc-bubble` and `--jc-line` carry the
colour of the original white build. The glass adds `--jc-glass`, `--jc-blur`,
`--jc-on-line`, `--jc-on-fill` and `--jc-on-mute`, all of them in section 9 of
the stylesheet.

**The glass is one section** — every colour the blue skin changes lives in
`9. BLUE GLASS SKIN`, at the end of the widget's stylesheet. It only re-colours:
no measurement, radius or type rule is touched there, so deleting that section
returns the widget to the white build with nothing else to undo. Section 10,
`OPERATOR FACE`, is the same deal for the headshot and the dot.

### Conversation script

The replies are local so the page demos offline. Greeting, then four topics
(buying, selling, service, visiting), each with follow up cards and chips. Free text is keyword routed: brand names, price, sell, service,
locations, financing, events, hours, greetings, thanks, and a request for a
human. After two exchanges the rating block appears.

## Wiring the real Crisp

Replace the marked calls. The engine is deliberately thin so this is a small job.

| Here | Crisp Web SDK |
| --- | --- |
| `JC` `open()` / `close()` | `$crisp.push(["do","chat:open"])` / `chat:close` |
| `submit()` in the composer | `$crisp.push(["do","message:send",["text",v]])` |
| `say(...)` and the whole bot section | delete, messages arrive on `$crisp.push(["on","message:received",fn])` |
| `preChatForm` submit | `$crisp.push(["set","user:nickname",[nm]])`, `user:email` |
| `S.unread`, counted and not drawn | `$crisp.push(["on","message:received",...])` while `chat:closed`. Crisp's own launcher draws a red counter and has no setting to hide it, so keeping this markup as the front end is what keeps it off |
| `onDuty()`, the green dot on the operator face | `$crisp.push(["on","website:availability:changed",fn])`, which is the real answer once Crisp knows who is logged in |
| picker chips | already Crisp's `message:show` `picker` shape |

Two options for the visual layer once the back end is live:

1. Keep this markup as the front end and drive it from the SDK events above,
   with the Crisp chatbox itself hidden (`$crisp.push(["do","chat:hide"])`).
   Full control of the design, which is the point of this build.
2. Or use Crisp's own chatbox and push it as close to this as their theming
   allows: `color:theme` custom, `layout:theme colorized`, custom launcher tile.
   Faster, but the type scale, squared corners and rich cards are not reachable
   through their settings.

Option 1 is what this file is set up for.

## Content still to confirm

* The three vessel cards use real inventory photos with placeholder prices.
* The ten guide answers are written but need sign off, and could link out to
  the real News and Media pages once those are live.
* The office hours line in the script, currently 8am to 6pm Pacific. The same
  two numbers drive the green dot, so they have to move together.
* Audrey's headshot is the team page photo, re-cropped square. Whether she is
  the right face for the widget, and whether a second operator should ever
  take her place, is a client decision.
* `View listing` on a vessel card currently scrolls to the vessels section. It
  should deep link to the listing page.

## Copy register

The operator lines are written in the restrained register the rest of the site
uses: no exclamation marks, no service desk chirp, first person plural. "Welcome
to Jeff Brown Yachts. Tell us what you have in mind and we will take it from
there." All of it sits in the `route`, `freeText` and `GUIDES` blocks, so it is
easy to hand to a copywriter.

One trap for whoever edits it: the lines are single quoted JS strings, so an
apostrophe has to be escaped or the sentence reworded. "on terms the owner sets"
rather than "on the owner's terms".

## Known differences from stock Crisp

* No helpdesk or search surface, by decision.
* No operator avatar stack in the header, removed by decision. Worth knowing:
  stock Crisp has no dashboard toggle for that stack. There you can only change
  what the avatars show, by setting each operator's profile picture, and hide the
  operator count with `$crisp.push(["config","show:operator:count",[false]])`.
  Removing the stack outright would mean injecting CSS against Crisp's hashed
  class names, which break between their releases. One more reason to keep this
  markup as the front end and use Crisp only as the back end.
