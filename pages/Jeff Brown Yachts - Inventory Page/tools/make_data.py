#!/usr/bin/env python3
"""listings.json -> assets/js/listings.js, the data the page renders from."""
import json, re, io, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets/js/listings.js")
d = json.load(open("listings.json"))

STATE_OF = {}   # city -> state, from "City, State"
rows = []
for i, x in enumerate(d):
    name = x["name"]
    m = re.match(r"^(\d{4})\s+(.*)$", name)
    year = int(m.group(1)) if m else None
    rest = m.group(2) if m else name
    make = (x.get("brandAlt") or "").replace(" logo", "").strip()
    if make == "Sirena Yachts":
        make = "Sirena"
    if not make:
        make = rest.split(" ")[0]
    model = rest[len(make):].strip() if rest.lower().startswith(make.lower()) else rest
    price = x["price"]
    pm = re.search(r"\$([\d,]+)", price)
    loc = x["location"]
    city, _, state = loc.partition(",")
    city, state = city.strip(), state.strip()
    STATE_OF[city] = state
    rows.append({
        "id": x["id"], "href": x["href"], "image": x["image"], "video": x["video"],
        "brand": x["brand"].replace("https://jb.apdstack.com/assets/", "assets/") if x["brand"] else "",
        "brandAlt": x["brandAlt"], "location": loc, "city": city, "state": state, "country": "US",
        "name": name, "year": year, "make": make, "model": model,
        "price": price, "priceValue": int(pm.group(1).replace(",", "")) if pm else None,
        "condition": x.get("condition", "new"), "length": x.get("length"),
        "added": len(d) - i,                      # the order the catalogue lists them in
    })

locations = [{"city": c, "country": "US", "state": s, "locationType": "city"}
             for c, s in sorted(STATE_OF.items())]
suggestions = [{"label": r["name"], "make": r["make"], "model": r["model"],
                "year": str(r["year"]), "listingId": r["id"],
                # The deployed catalogue has real ids for these; here the name is the id,
                # which is all the filtering below needs.
                "makeId": "make:" + r["make"],
                "modelId": "model:" + r["make"] + "|" + r["model"]} for r in rows]

js = io.StringIO()
js.write("/* The 65 listings the deployed catalogue had on 2026-09-24, harvested from\n"
         "   jb.apdstack.com/yachts. Lengths come from each listing's own page; the\n"
         "   condition from the catalogue's own vesselCondition filter. Static on purpose:\n"
         "   this is the prototype, and it has no server to ask. */\n")
js.write("window.JBY_LISTINGS = " + json.dumps(rows, indent=1) + ";\n")
js.write("window.JBY_LOCATIONS = " + json.dumps(locations, indent=1) + ";\n")
js.write("window.JBY_SUGGESTIONS = " + json.dumps(suggestions, indent=1) + ";\n")
io.open(OUT, "w", encoding="utf-8").write(js.getvalue())
print("wrote", OUT, len(js.getvalue()), "bytes;", len(rows), "listings,", len(locations), "locations")
