Jeff Brown Yachts — Home Page with brand intro animation (V2, logo only)
========================================================================

Same intro as V1, with the "JEFF BROWN YACHTS" wordmark removed: only the
roundel emblem appears, fading from transparent to white, then flying up
into the header exactly as before.

index.html            full copy of the shipped home page (V3.31) plus the
                      logo-only intro loader
JBY-V3.3-assets/      images / videos / logo (same set as the home page)

Open index.html in a browser. The intro plays on every load.

URL switches (for review only):
  ?intro=slow   plays the whole sequence at 1/3 speed
  ?nointro=1    skips the intro entirely
In the browser console:  jbyReplayIntro()   replays it
                         jbyReplayIntro(4)  replays it 4x slower

Sequence (real speed, ~2.1s total)
  0.00s  navy field (#41647b) covers the screen, header logo hidden
  0.05s  the emblem fades in over 1.15s on a gentle ramp
         (5-10-20-45-65-100%) while settling from 92% to full size
  1.35s  navy field dissolves, the emblem flies up (0.75s) and lands
         exactly on the header logo slot (measured FLIP, so the handoff
         is pixel accurate at any window size)
  2.12s  overlay removed, page scroll released

Respects prefers-reduced-motion (short cross fade, no travel).
