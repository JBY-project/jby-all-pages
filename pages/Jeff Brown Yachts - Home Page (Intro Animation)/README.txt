Jeff Brown Yachts — Home Page with brand intro animation
========================================================

index.html            full copy of the shipped home page (V3.31) plus an
                      Aston Martin style brand intro loader
JBY-V3.3-assets/      images / videos / logo (same set as the home page)

Open index.html in a browser. The intro plays on every load.

URL switches (for review only, remove before handoff if not wanted):
  ?intro=slow   plays the whole sequence at 1/3 speed
  ?nointro=1    skips the intro entirely
In the browser console:  jbyReplayIntro()   replays it
                         jbyReplayIntro(4)  replays it 4x slower

Sequence (real speed, ~2.5s total)
  0.00s  navy field (#41647b) covers the screen, header logo hidden
  0.03s  "JEFF BROWN YACHTS" letters slide in from a wide spread and
         converge over 1.15s, fading up on a gentle ramp
         (5-10-20-45-65-100%)
  0.95s  the roundel emblem fades in above the wordmark on the same ramp
  1.75s  navy field dissolves, wordmark fades, the emblem flies up (0.75s)
         and lands exactly on the header logo slot (measured FLIP, so the
         handoff is pixel accurate at any window size)
  2.52s  overlay removed, page scroll released

Respects prefers-reduced-motion (short cross fade, no travel).
