# Jeff Brown Yachts — Home page with the chat plate

**Live:** https://ywteamyw.github.io/jby-home-chat/
**Widget on its own:** https://ywteamyw.github.io/jby-home-chat/chat-widget-preview.html
**Repo:** https://github.com/ywteamyw/jby-home-chat

This is a variant of the home page, not the live home page. The approved V3.31
home page stays at jby-homepage.github.io.

A copy of the live home page (V3.31) with one addition: a floating plate that
appears on the second block and carries **Explore inventory** plus a full
**Crisp style chat**, rebuilt from scratch in the JBY design system.

Nothing else on the page was touched. The chat is one self contained block at
the end of `JBY-Home.html` (search for `JBY CHAT`), around 1,150 lines of
scoped CSS, markup and JS. Every class is prefixed `jc-` so it cannot collide
with the page.

## Files

| File | What it is |
| --- | --- |
| `JBY-Home.html` | The home page with the chat plate. Open it directly. |
| `chat-widget-preview.html` | The same widget on a stripped page, with buttons to drive every state. Give this to the developer. |
| `JBY-V3.3-assets/` | Unchanged home page assets. The chat reuses `jby_logo.svg` and three vessel photos, nothing new. |

## The plate

Fixed bottom right, `40px` / `32px` gutters on desktop, full width minus `24px`
on mobile. `56px` tall, soft shadow, 2px radius, no border.

The plate and the chat window share one width token, `--jc-w: 472px`, so their
edges always line up as a single column. The navy half flexes to absorb any
slack, so changing the label copy cannot break that alignment.

```
┌──────────────────────────────┬───────────────────────────┐
│  EXPLORE INVENTORY      ›    │  CHAT WITH US             │
└──────────────────────────────┴───────────────────────────┘
     navy, scrolls to #yachts       opens the chat
```

472 × 56 on desktop. Purely typographic, no launcher icon and no availability
dot. On mobile the two halves split 50/50 and both keep their label.

* Hidden while the visitor is on the hero.
* Slides up once the second block ("Bespoke yacht sales and brokerage") is
  within 62% of the viewport, then stays for the rest of the page.
* Stays visible whenever the chat is open, wherever the visitor is.
* No icon and no availability dot. The plate has no resting chrome: two labels,
  a hairline divider, nothing else.
* When a message lands while the box is closed, a small red count appears after
  the `CHAT WITH US` label and the teaser bubble opens above the plate. Both
  clear on open.
* Hover changes colour only, never position or scale, per the site wide rule.

`Get expert guidance`, the outline button already in that block, also opens the
chat. `Explore inventory` in that block scrolls to the vessels section, same as
the plate button.

## The chat

472 × 730 on desktop, full screen below 640px. The height is Crisp's own large
view figure, measured off the live widget; the width is ours, matched to the
plate. Re-skinned from Crisp like this:

| Crisp | Here |
| --- | --- |
| Theme colour header, `layout-colorized` | `--navy #41647b` with a vertical gradient and inset highlights |
| Noto Sans | Mesmerize for labels and headings, Myriad Pro for message text |
| Rounded 16px shell | 2px radius on every surface, from one `--jc-r` token |
| Operator bubble `#f0f2f5`, text `#1c293b`, radius 12px, padding 8/14/9 | Same bubble grey, text `--ink #2f2f39`, radius 2px |
| Bubble text 12.6px, composer 13.6px | Both 16/24 Myriad Pro, which also stops iOS zooming on focus |
| Visitor bubble in theme colour | Navy bubble, white text |
| Messages / Search segmented tabs | Removed. Messages only, no helpdesk surface |
| Composer with focus ring, emoji, file, audio | Same, navy border on focus, no glow |

### Implemented

**Header** — 84px, one centred line, `CHAT WITH OUR TEAM`. The close chevron is
absolutely positioned in the corner so it stays out of the flow and the type
block sits on even 30px padding top and bottom. No tabs, no avatar stack, no
availability line, and no brand name: the visitor already knows whose site this
is. Once the visitor writes, the block swaps to the compact bar, `OUR TEAM` plus
the options menu, on the same even padding. That initial vs ongoing switch is
Crisp's own behaviour.

**One identity, no names** — the sender is the brand, not a person. Every
operator message carries the JBY monogram on a navy disc instead of a headshot,
and there is no name label above the bubble. Support staffing can change without
touching the design. If named operators are ever wanted, `MARK` and `markEl()`
near the top of the script are the only places to change.

**Messages** — operator message with the brand mark, visitor message with `Sent`
then `Seen` delivery state, typing indicator, timestamp on bubble hover, unread
count on the plate, notification sound (generated, no audio file), proactive
teaser bubble above the plate. No date separator: the conversation is not
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

**Tokens** — `--jc-w` is the shared width (472px) for the plate and the window.
`--jc-r` is the single radius, 2px, for every surface; only the brand mark discs
stay circular. `--jc-navy`, `--jc-ink`, `--jc-bubble` and `--jc-line` carry the
colour.

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
| unread badge | `$crisp.push(["on","message:received",...])` while `chat:closed` |
| there is no availability indicator any more, but if one is ever wanted | `$crisp.push(["on","website:availability:changed",fn])` |
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
* The office hours line in the script, currently 8am to 6pm Pacific.
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
