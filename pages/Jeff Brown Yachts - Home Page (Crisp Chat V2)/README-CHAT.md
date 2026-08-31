# Jeff Brown Yachts — Home page + Crisp, variant 2 (stock)

**Live:** https://ywteamyw.github.io/jby-home-chat-v2/
**Widget on its own:** https://ywteamyw.github.io/jby-home-chat-v2/chat-widget-preview.html
**Repo:** https://github.com/ywteamyw/jby-home-chat-v2
**Variant 1 (custom rebuild):** https://ywteamyw.github.io/jby-home-chat/

The cheap answer to the same brief. Variant 1 rebuilds the chatbox in the JBY
design system and needs a developer. This one shows what the client actually
gets if they only pay for Crisp's **Essentials** plan: Crisp's own chatbox, with
the theme colour set to JBY navy and the JBY mark as the operator avatar.

## Files

| File | What it is |
| --- | --- |
| `JBY-Home.html` (`index.html` in the repo) | The home page with the stock Crisp widget. |
| `chat-widget-preview.html` | The same widget on a stripped page, with buttons to drive every state and a table of what is and is not brandable. |
| `JBY-V3.3-assets/` | Unchanged home page assets. The widget only borrows `jby_logo.svg`. |

## What the plan actually buys

Checked against Crisp's pricing page, August 2026.

| | Free / Mini | Essentials | Plus |
| --- | --- | --- | --- |
| Widget customization (colours, text, position) | no | **yes** | yes |
| Remove the "We run on Crisp" watermark | no | **no** | **yes** |
| Chatbot / no-code workflow builder, which is what sends the picker chips | no | yes | yes |
| Custom font in the chatbox | no | no | no |
| Custom layout, radii, type scale, rich cards | no | no | no |

So on Essentials there are exactly two levers, and this variant pulls both:

* **Theme colour** set to `#41647b`, the JBY navy. It drives the header, the
  Messages pill, the launcher disc, the operator avatar disc, the visitor
  bubble, the chip outlines, the composer focus border and the send arrow.
* **Operator avatar** set to the JBY monogram, in the header and beside every
  operator message.

Everything else below is Crisp as shipped, on purpose. Do not "fix" it.

## Left exactly as Crisp ships it

* **Type.** Roboto, from Google Fonts. That is the face spliiit.com actually
  renders, body and headings. Not Mesmerize and not Myriad Pro: no Crisp plan
  changes the chatbox font, so pretending otherwise would make the mockup lie.

  Note on the reference: spliiit.com also declares **Gilroy** for display, and
  the geometric look in the reference screenshots is Gilroy, not Roboto. Gilroy
  is a commercial licence, self hosted on their CDN, so it is not something to
  hotlink. If that exact look is wanted, JBY needs a Gilroy licence and it is a
  one line swap in `--cs-font`. Free geometric near-neighbours on Google Fonts
  are Poppins and Manrope.
* **Icons.** Flowbite Icons, outline set, on a 24 box rendered at 20px with the
  stroke thinned to 1.6 so they stop reading as heavy at that size. The exact paths
  from `themesberg/flowbite-icons`: `face-grin`, `paper-clip`, `chevron-down`,
  and the solid `messages` on the tab. Two are not Flowbite's, because the
  reference screenshots show something else: the audio waveform and the
  right-pointing send arrow, both of which are what Crisp actually draws.
* **Shape.** 16px shell, one Messages pill, 12px bubbles, 12px composer card,
  white body, 32px operator avatar beside each of their messages, 400 × 730,
  24px gutters. The header centres the logo above the title, one line, the way
  Crisp arranges it when there is no subtitle.
* **Launcher.** The 54px round tile with Crisp's speech bubble glyph, its hover
  ring. It swaps to a cross while open. Colours are inverted against the header:
  a white disc carrying the navy glyph, with a 1.5px navy stroke and a drop
  shadow to hold its edge on the near white page. Crisp's theme colour drives
  the glyph and the stroke rather than the disc. **No unread badge**, see below.
* **Wording.** "Chat with support", "Compose your message...", "Messages".
* **The watermark.** Removed here at the client's request. Read the warning
  below before showing this to them.

There is no email capture card and no Articles tab. Crisp offers both, and the
Articles tab is included from Essentials up, but neither is wanted here. One
Messages pill, and the composer is the only thing under the thread.

## Two things this mockup shows that Essentials will not give you

**1. No watermark.** The `We run on Crisp` line under the composer has been
removed because the client asked for it gone. Crisp only permits that on the
**Plus** plan. On Essentials it stays and no setting hides it.

**2. No unread badge on the launcher.** Removed at the client's request as well.
Crisp's own launcher draws a red counter when a message arrives while the box is
closed, and there is no documented setting or `$crisp` config to hide it. Unread
is still counted in `S.unread`, it is just not drawn, so a developer can render
a badge from there if the decision changes.

Both are cosmetic, but quote the price off the Plus plan, not Essentials, and
expect the counter to reappear on a stock install.

## The watermark warning

The `We run on Crisp` line under the composer has been **removed** from this
mockup because the client asked for it gone. Crisp only permits that on the
**Plus** plan. On Essentials it stays and cannot be hidden by any setting.

So this mockup shows Plus, not Essentials. Either budget for Plus, or expect one
extra line of grey text under the composer. Nothing else changes between the two
plans, and neither plan gets us the font, the radii or the layout.

## What is ours

The **Explore inventory** button next to the launcher. It lives on our page, not
inside their widget, so it keeps Mesmerize, squared corners and the JBY hover
rule (colour only, never movement). It is 54px tall to match the launcher disc,
16px apart, and it reveals on the same trigger.

Both appear bottom right once the second block ("Bespoke yacht sales and
brokerage") comes into view, and stay for the rest of the page. Same scroll
handler as variant 1: cached offset, `pageYOffset > storyTop - innerHeight *
0.62`, re-measured on load, resize and any body height change.

`Get expert guidance`, the outline button already in that block, opens the chat.

## Swapping in the real Crisp

Delete the whole `JBY CHAT — VARIANT 2` block, paste Crisp's snippet, then in
Crisp: Settings > Chatbox > Appearance, set the colour to `#41647b`, upload the
JBY mark as the operator avatar, and leave the help center switched off so the
chatbox keeps a single Messages tab.

The local engine mirrors the Crisp SDK closely enough that the mockup and the
real thing behave the same:

| Here | Crisp Web SDK |
| --- | --- |
| `JBYChatV2.open()` / `close()` | `$crisp.push(["do","chat:open"])` / `chat:close` |
| `submit()` | `$crisp.push(["do","message:send",["text",v]])` |
| `say(...)` and `route()` | a Crisp Bot scenario, delete them here |
| picker chips | already Crisp's `message:show` `picker` shape |
| unread count | `$crisp.push(["on","message:received",fn])` while closed |

## Choosing between the two variants

**Variant 1** if the chat should look like the rest of the site: our type scale,
squared corners, brand identity instead of named operators, vessel cards inside
the thread, no Crisp watermark at any price. Costs developer time, and the
Crisp back end still does the messaging.

**Variant 2** if the budget is a Crisp subscription and nothing else. Ships in an
afternoon, but it reads as a Crisp widget wearing our colour, and on Essentials
it carries their watermark.

Worth knowing for the conversation: Crisp's Plus plan removes the watermark but
still will not change the font, the radii or the layout. Variant 1 is the only
route to a chat that matches the site.

## Content still to confirm

* Header wording is Crisp's default. Essentials does allow changing text, so
  "Chat with support" could become anything the client prefers.
* The office hours and phone number are not in this variant's script yet.
* The four picker topics and their replies need sign off.
