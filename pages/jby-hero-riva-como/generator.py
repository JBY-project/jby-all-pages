import random, math
R = random.Random(90210)

W, H = 2560, 1440
HZ  = 782.0                 # horizon
SX, SY = 1836.0, 736.0      # sun

# ---------------- sun path on the water ----------------
def taper(t):               # half-width of the specular path at depth t (0..1)
    return 28 + (t ** 1.45) * 430

glitter = []
for i in range(260):
    t = (i / 259) ** 1.7
    y = HZ + 3 + t * (H - HZ + 30)
    sp = taper(t)
    x = SX + R.uniform(-1, 1) * sp * (R.random() ** 0.55)
    w = (10 + t * 120) * R.uniform(.3, 1.1)
    h = max(.9, (1.0 + t * 5.6) * R.uniform(.45, 1.15))
    o = (0.66 - t * 0.44) * R.uniform(.3, 1.0)
    col = R.choice(("#ffe9c2", "#ffd8a4", "#ffc98c", "#fff6e2", "#f6b97e"))
    glitter.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{w/2:.1f}" ry="{h/2:.2f}" fill="{col}" opacity="{max(o,.02):.3f}"/>')

col_pts_l, col_pts_r = [], []
for i in range(31):
    t = i / 30
    y = HZ + t * (H - HZ + 30)
    col_pts_l.append((SX - taper(t), y)); col_pts_r.append((SX + taper(t), y))
sunpath = "M " + " L ".join(f"{x:.0f} {y:.0f}" for x, y in col_pts_l) + " L " + \
          " L ".join(f"{x:.0f} {y:.0f}" for x, y in reversed(col_pts_r)) + " Z"

# ---------------- perspective ripples ----------------
ripples = []
y, step = HZ + 3, 2.2
while y < H:
    t = (y - HZ) / (H - HZ)
    for _ in range(2 if R.random() < .75 else 1):
        x0 = R.uniform(-200, W)
        ln = R.uniform(180, 1100) * (0.45 + t * 1.3)
        sag = (2 + t * 16) * R.choice((1, -1))
        th  = max(1.0, (0.9 + t * 3.4) * R.uniform(.6, 1.25))
        o   = (0.13 - t * 0.06) * R.uniform(.25, 1.0)
        near_sun = abs((x0 + ln / 2) - SX) < taper(t) * 1.1
        col = "#f2d5ab" if near_sun else R.choice(("#c3cfe0", "#aebbd0", "#e2c7a8"))
        if near_sun: o *= 2.1
        ripples.append(f'<path d="M {x0:.0f} {y:.1f} Q {x0+ln/2:.0f} {y+sag:.1f} {x0+ln:.0f} {y:.1f}" '
                       f'fill="none" stroke="{col}" stroke-width="{th:.1f}" opacity="{max(o,.012):.3f}" stroke-linecap="round"/>')
    step *= 1.048
    y += step

# ---------------- Como slopes ----------------
far   = ("M -20 %f L -20 716 C 130 700 240 672 400 662 C 540 654 640 690 780 700 "
         "C 900 708 990 668 1130 656 C 1270 644 1350 690 1490 700 "
         "C 1650 711 1770 664 1930 640 C 2130 610 2330 566 2580 512 L 2580 %f Z" % (HZ+4, HZ+4))
mid   = ("M -20 %f L -20 752 C 170 736 300 706 470 700 C 620 695 700 730 850 742 "
         "C 1000 754 1130 720 1300 716 C 1450 713 1560 742 1700 740 "
         "C 1850 738 1960 700 2110 672 C 2280 640 2400 596 2580 590 L 2580 %f Z" % (HZ+4, HZ+4))
head  = ("M 2580 %f L 2580 402 C 2430 452 2318 528 2214 620 C 2140 686 2058 742 1958 772 "
         "C 1930 780 1918 781 1904 782 L 2580 %f Z" % (HZ+4, HZ+4))
head2 = ("M 2580 %f L 2580 560 C 2470 586 2382 640 2300 706 C 2246 748 2190 772 2118 780 L 2580 %f Z"
         % (HZ+4, HZ+4))
leftridge = ("M -20 %f L -20 764 C 120 748 230 722 380 730 C 500 736 560 764 690 772 "
             "C 800 778 900 770 1010 774 C 1090 777 1140 779 1210 780 L 1210 %f Z" % (HZ+4, HZ+4))
farleft = ("M -20 %f L -20 690 C 90 668 180 640 300 636 C 420 632 470 682 590 706 "
           "C 700 728 790 756 900 772 L 900 %f Z" % (HZ+4, HZ+4))

# villas + cypress along the foot of the headland
shore = []
for i in range(5):
    t = i / 10
    x = 2060 + t * 250
    yb = 778 - t * 34
    hh, ww = R.uniform(8, 17), R.uniform(9, 19)
    shore.append(f'<rect x="{x:.0f}" y="{yb-hh:.1f}" width="{ww:.0f}" height="{hh:.1f}" fill="#33303c" opacity="{R.uniform(.26,.48):.2f}"/>')
    if R.random() < .55:
        shore.append(f'<rect x="{x+ww*0.15:.0f}" y="{yb-hh-3:.1f}" width="{ww*0.7:.0f}" height="3.4" fill="#413a44" opacity=".5"/>')
for i in range(6):
    t = i / 17
    x = 2040 + t * 300 + R.uniform(-10, 10)
    yb = 780 - t * 40
    hh = R.uniform(9, 21)
    shore.append(f'<path d="M {x:.0f} {yb:.0f} C {x-4.5:.0f} {yb-hh*.55:.0f} {x-3:.0f} {yb-hh:.0f} {x:.0f} {yb-hh-3:.0f} '
                 f'C {x+3:.0f} {yb-hh:.0f} {x+4.5:.0f} {yb-hh*.55:.0f} {x:.0f} {yb:.0f} Z" fill="#292830" opacity="{R.uniform(.28,.5):.2f}"/>')

# ---------------- the yacht (Riva Aquarama profile, bow left) ----------------
BX, BW, WL = 1470, 726, 1006
def X(u): return BX + u * BW
def Y(v): return WL + v * 1.18
hull = (f"M {X(0):.1f} {Y(-80):.1f} "
        f"C {X(.07):.1f} {Y(-90):.1f} {X(.18):.1f} {Y(-95):.1f} {X(.34):.1f} {Y(-94):.1f} "
        f"C {X(.56):.1f} {Y(-93):.1f} {X(.80):.1f} {Y(-89):.1f} {X(.985):.1f} {Y(-83):.1f} "
        f"C {X(1.002):.1f} {Y(-70):.1f} {X(1.004):.1f} {Y(-26):.1f} {X(.995):.1f} {Y(-9):.1f} "
        f"C {X(.74):.1f} {Y(2):.1f} {X(.34):.1f} {Y(3):.1f} {X(.11):.1f} {Y(-12):.1f} "
        f"C {X(.035):.1f} {Y(-24):.1f} {X(.004):.1f} {Y(-52):.1f} {X(0):.1f} {Y(-80):.1f} Z")
sheer = (f"M {X(0):.1f} {Y(-80):.1f} C {X(.07):.1f} {Y(-90):.1f} {X(.18):.1f} {Y(-95):.1f} {X(.34):.1f} {Y(-94):.1f} "
         f"C {X(.56):.1f} {Y(-93):.1f} {X(.80):.1f} {Y(-89):.1f} {X(.985):.1f} {Y(-83):.1f}")
deck  = (f"M {X(.06):.1f} {Y(-84):.1f} C {X(.24):.1f} {Y(-89):.1f} {X(.60):.1f} {Y(-87):.1f} {X(.97):.1f} {Y(-78):.1f}")
deckplane = (sheer + " L " + f"{X(.985):.1f} {Y(-79):.1f} " +
             f"C {X(.60):.1f} {Y(-83):.1f} {X(.24):.1f} {Y(-85):.1f} {X(.06):.1f} {Y(-80):.1f} Z")
wline = (f"M {X(.09):.1f} {Y(-22):.1f} C {X(.34):.1f} {Y(-16):.1f} {X(.72):.1f} {Y(-15):.1f} {X(.99):.1f} {Y(-19):.1f}")
glass = (f"M {X(.335):.1f} {Y(-94):.1f} C {X(.352):.1f} {Y(-124):.1f} {X(.378):.1f} {Y(-137):.1f} {X(.425):.1f} {Y(-139):.1f} "
         f"L {X(.545):.1f} {Y(-137):.1f} C {X(.566):.1f} {Y(-127):.1f} {X(.573):.1f} {Y(-105):.1f} {X(.573):.1f} {Y(-95):.1f} Z")
cockpit = (f"M {X(.575):.1f} {Y(-93):.1f} C {X(.60):.1f} {Y(-104):.1f} {X(.63):.1f} {Y(-107):.1f} {X(.66):.1f} {Y(-106):.1f} "
           f"L {X(.66):.1f} {Y(-92):.1f} Z")
sunpad = (f"M {X(.60):.1f} {Y(-93):.1f} C {X(.70):.1f} {Y(-101):.1f} {X(.84):.1f} {Y(-100):.1f} {X(.93):.1f} {Y(-90):.1f} "
          f"C {X(.84):.1f} {Y(-88):.1f} {X(.70):.1f} {Y(-89):.1f} {X(.60):.1f} {Y(-93):.1f} Z")

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#111e35"/><stop offset=".20" stop-color="#22304c"/>
    <stop offset=".42" stop-color="#465066"/><stop offset=".60" stop-color="#7d6c74"/>
    <stop offset=".76" stop-color="#c08d६9"/><stop offset=".88" stop-color="#e5ac77"/>
    <stop offset=".96" stop-color="#f2c793"/><stop offset="1" stop-color="#f8dcae"/>
  </linearGradient>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a2907f"/><stop offset=".05" stop-color="#7e7377"/>
    <stop offset=".18" stop-color="#57607a"/><stop offset=".42" stop-color="#313c55"/>
    <stop offset=".75" stop-color="#1c2436"/><stop offset="1" stop-color="#121927"/>
  </linearGradient>
  <radialGradient id="glowA" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#fff4d8" stop-opacity=".97"/>
    <stop offset=".32" stop-color="#ffdca6" stop-opacity=".5"/>
    <stop offset="1" stop-color="#ffb877" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowB" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffd9a4" stop-opacity=".42"/>
    <stop offset="1" stop-color="#e79a5c" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="sunlane" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe2b0" stop-opacity=".55"/>
    <stop offset=".35" stop-color="#f6c489" stop-opacity=".22"/>
    <stop offset="1" stop-color="#e8a86c" stop-opacity=".05"/>
  </linearGradient>
  <linearGradient id="leftfall" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#0b1a2d" stop-opacity=".42"/>
    <stop offset=".28" stop-color="#0b1a2d" stop-opacity=".24"/>
    <stop offset=".56" stop-color="#0b1a2d" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="vig" cx=".52" cy=".46" r=".8">
    <stop offset=".52" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".44"/>
  </radialGradient>
  <linearGradient id="hullg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4a3b30"/><stop offset=".30" stop-color="#2a2a2f"/>
    <stop offset=".70" stop-color="#1a2028"/><stop offset="1" stop-color="#10161f"/>
  </linearGradient>
  <linearGradient id="hulllight" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity=".38"/>
    <stop offset=".55" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#ffc98a" stop-opacity=".22"/>
  </linearGradient>
  <linearGradient id="fgfall" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#0c1220" stop-opacity=".72"/>
    <stop offset="1" stop-color="#0c1220" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="deckg" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#4a2f1e" stop-opacity=".3"/>
    <stop offset=".5" stop-color="#6b4527" stop-opacity=".42"/>
    <stop offset="1" stop-color="#a9723d" stop-opacity=".58"/>
  </linearGradient>
  <linearGradient id="glassg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2a3340" stop-opacity=".7"/>
    <stop offset=".55" stop-color="#7d7566" stop-opacity=".5"/>
    <stop offset="1" stop-color="#f6cd93" stop-opacity=".62"/>
  </linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffdcaa" stop-opacity=".10"/>
    <stop offset=".30" stop-color="#ffdcaa" stop-opacity=".30"/>
    <stop offset=".62" stop-color="#ffe6bd" stop-opacity=".6"/>
    <stop offset="1" stop-color="#ffeecf" stop-opacity=".8"/>
  </linearGradient>
  <filter id="b2"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="b4"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="b8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="b18"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="b30"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="refl"><feGaussianBlur stdDeviation="6 14"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="3" seed="19" result="n"/>
    <feColorMatrix in="n" type="matrix"
      values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .33 .33 .33 0 0"/>
  </filter>
  <clipPath id="seaclip"><rect x="0" y="{HZ}" width="{W}" height="{H-HZ}"/></clipPath>
</defs>

<rect width="{W}" height="{HZ+4}" fill="url(#sky)"/>
<ellipse cx="{SX}" cy="{SY}" rx="900" ry="470" fill="url(#glowB)"/>
<ellipse cx="{SX}" cy="{SY}" rx="360" ry="264" fill="url(#glowA)"/>
<circle cx="{SX}" cy="{SY}" r="49" fill="#fff6e0" opacity=".93" filter="url(#b4)"/>

<!-- wispy cloud bands, tilted and uneven -->
<g filter="url(#b30)">
  <path d="M -100 300 C 400 250 900 288 1500 236 C 1900 202 2200 224 2660 190" fill="none" stroke="#8b90ab" stroke-width="46" opacity=".34"/>
  <path d="M -100 430 C 500 402 1000 432 1600 392 C 2000 366 2300 380 2660 350" fill="none" stroke="#a6949c" stroke-width="30" opacity=".3"/>
  <path d="M 400 560 C 900 540 1400 566 1900 536 C 2200 518 2450 526 2660 512" fill="none" stroke="#dda478" stroke-width="34" opacity=".38"/>
  <path d="M -100 640 C 500 628 1100 648 1700 626 C 2100 612 2400 618 2660 606" fill="none" stroke="#eebb8b" stroke-width="24" opacity=".34"/>
</g>

<!-- slopes -->
<g filter="url(#b4)" opacity=".5"><path d="{far}" fill="#8b92b0"/></g>
<g filter="url(#b8)" opacity=".42"><path d="{farleft}" fill="#7d85a4"/></g>
<g filter="url(#b2)" opacity=".76"><path d="{leftridge}" fill="#4b5169"/></g>
<g filter="url(#b2)" opacity=".8"><path d="{mid}" fill="#545a72"/></g>
<g filter="url(#b2)" opacity=".88"><path d="{head2}" fill="#3f4457"/></g>
<g opacity=".93"><path d="{head}" fill="#2b3040"/></g>
<g>{''.join(shore)}</g>
<rect x="0" y="{HZ-100}" width="{W}" height="112" fill="#f5d3a6" opacity=".1" filter="url(#b30)"/>

<rect y="{HZ}" width="{W}" height="{H-HZ}" fill="url(#sea)"/>
<g clip-path="url(#seaclip)">
  <g filter="url(#b30)">
    <ellipse cx="{SX}" cy="{HZ+70}" rx="150" ry="72" fill="#ffdcab" opacity=".34"/>
    <ellipse cx="{SX}" cy="{HZ+230}" rx="290" ry="180" fill="#f3c48c" opacity=".2"/>
    <ellipse cx="{SX-30}" cy="{HZ+470}" rx="440" ry="230" fill="#e2ab74" opacity=".12"/>
  </g>
  <ellipse cx="{SX}" cy="{HZ+8}" rx="300" ry="26" fill="#ffe4b8" opacity=".5" filter="url(#b8)"/>
  {''.join(ripples)}
  <g filter="url(#b4)" opacity=".5">
    <path d="M -60 980 C 300 972 620 992 940 984" fill="none" stroke="#9fb0c8" stroke-width="3" opacity=".16"/>
    <path d="M -60 1130 C 260 1120 560 1146 900 1134" fill="none" stroke="#b6c2d6" stroke-width="4" opacity=".13"/>
    <path d="M -60 1310 C 220 1296 520 1330 860 1314" fill="none" stroke="#8fa0ba" stroke-width="5" opacity=".11"/>
    <path d="M 120 880 C 380 876 600 888 820 882" fill="none" stroke="#aebcd2" stroke-width="2.2" opacity=".14"/>
  </g>
  <g filter="url(#b2)">{''.join(glitter)}</g>

  <g transform="translate(0 {2*WL}) scale(1 -0.6)" filter="url(#refl)" opacity=".46">
    <path d="{hull}" fill="#131924"/><path d="{glass}" fill="#131924"/><path d="{sunpad}" fill="#131924"/>
  </g>
  <g opacity=".55">
    <rect x="{BX-60}" y="{WL+30}" width="{BW+180}" height="2.6" fill="#f0cda2" opacity=".3"/>
    <rect x="{BX+70}" y="{WL+66}" width="{BW-40}" height="3.2" fill="#e0c4a2" opacity=".2"/>
    <rect x="{BX-120}" y="{WL+118}" width="{BW+300}" height="4.2" fill="#cdb79d" opacity=".14"/>
  </g>

  <g>
    <ellipse cx="{BX+BW*0.5}" cy="{WL+6}" rx="{BW*0.55}" ry="11" fill="#0b111b" opacity=".6" filter="url(#b8)"/>
    <path d="{hull}" fill="url(#hullg)"/>
    <path d="{hull}" fill="url(#hulllight)"/>
    <path d="{deckplane}" fill="url(#deckg)"/>
    <path d="{deck}" fill="none" stroke="#f0c592" stroke-width="1.2" opacity=".3"/>
    <path d="{sunpad}" fill="#cdbba4" opacity=".28"/>
    <path d="{glass}" fill="#1d232e" opacity=".9"/>
    <path d="{glass}" fill="url(#glassg)" opacity=".72"/>
    <path d="{glass}" fill="none" stroke="url(#rim)" stroke-width="2.2"/>
    <path d="{cockpit}" fill="#0e131b" opacity=".82"/>
    <line x1="{X(.455):.0f}" y1="{Y(-138):.0f}" x2="{X(.455):.0f}" y2="{Y(-95):.0f}" stroke="#e9cfa8" stroke-width="1.5" opacity=".35"/>
    <path d="{wline}" fill="none" stroke="url(#rim)" stroke-width="2.6" opacity=".5"/>
    <path d="{sheer}" fill="none" stroke="url(#rim)" stroke-width="3.2"/>
    <path d="{sheer}" fill="none" stroke="url(#rim)" stroke-width="1.2" opacity=".8"/>
    <circle cx="{X(.02):.0f}" cy="{Y(-84):.0f}" r="2.6" fill="#fff2d4" opacity=".7"/>
    <path d="M {X(.985):.1f} {Y(-83):.1f} C {X(1.002):.1f} {Y(-60):.1f} {X(1.004):.1f} {Y(-28):.1f} {X(.995):.1f} {Y(-11):.1f}" fill="none" stroke="#ffe9c6" stroke-width="2.2" opacity=".5"/>
    <line x1="{X(.99):.0f}" y1="{Y(-83):.0f}" x2="{X(.995):.0f}" y2="{Y(-126):.0f}" stroke="#e8d6b8" stroke-width="1.6" opacity=".5"/>
    <path d="M {X(1.0):.0f} {Y(-2):.0f} C {X(1.24):.0f} {Y(6):.0f} {X(1.5):.0f} {Y(13):.0f} {X(1.68):.0f} {Y(22):.0f}"
          fill="none" stroke="#f0d8b6" stroke-width="3.4" opacity=".26" filter="url(#b2)"/>
    <path d="M {X(0):.0f} {Y(-6):.0f} C {X(-.2):.0f} {Y(2):.0f} {X(-.42):.0f} {Y(8):.0f} {X(-.62):.0f} {Y(16):.0f}"
          fill="none" stroke="#dcc7ab" stroke-width="2.6" opacity=".2" filter="url(#b2)"/>
  </g>

  <rect x="0" y="{H-360}" width="{W}" height="360" fill="url(#fgfall)"/>
</g>

<rect width="{W}" height="{H}" fill="url(#leftfall)"/>
<rect width="{W}" height="{H}" fill="url(#vig)"/>
<ellipse cx="{SX}" cy="{SY}" rx="1080" ry="620" fill="url(#glowB)" opacity=".45" style="mix-blend-mode:screen"/>
<rect width="{W}" height="{H}" filter="url(#grain)" opacity=".14" style="mix-blend-mode:overlay"/>
</svg>'''

svg = svg.replace("#c08d६9", "#c08d69")
p = '/private/tmp/claude-502/-Users-Ksenia/3661aacf-ca6a-4377-a0b5-349305b1510d/scratchpad/'
open(p + 'hero.svg', 'w').write(svg)
open(p + 'hero.html', 'w').write(f'<style>html,body{{margin:0;background:#000;overflow:hidden}}svg{{display:block}}</style>{svg}')
print("ok", len(svg))
