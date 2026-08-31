import { writeFileSync } from "node:fs";

const W = 1360;
const H = 900;
const GAP = 120;
const M = 48;
const ink = "#111315";
const text = "#364047";
const muted = "#6b757b";
const line = "#e1e6e7";
const soft = "#f4f7f7";
const sea = "#006f78";
const red = "#e23d35";
const gold = "#b9975b";

const frames = [
  { id: "about", title: "About JBY", x: 60, y: 60 },
  { id: "team", title: "Team & Brokers", x: 60 + W + GAP, y: 60 },
  { id: "profile", title: "Broker Profile", x: 60 + (W + GAP) * 2, y: 60 },
  { id: "locations", title: "Locations", x: 60, y: 60 + H + GAP },
  { id: "office", title: "Office Page", x: 60 + W + GAP, y: 60 + H + GAP },
  { id: "contact", title: "General Contact", x: 60 + (W + GAP) * 2, y: 60 + H + GAP }
];

function esc(value) {
  return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function textBlock(lines, x, y, opts = {}) {
  const size = opts.size || 18;
  const fill = opts.fill || text;
  const weight = opts.weight || 400;
  const leading = opts.leading || size * 1.38;
  const family = opts.family || "Inter, Arial, sans-serif";
  const anchor = opts.anchor ? ` text-anchor="${opts.anchor}"` : "";
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}"${anchor}>${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : leading}">${esc(line)}</tspan>`).join("")}</text>`;
}

function button(label, x, y, w, style = "dark") {
  const fill = style === "sea" ? sea : style === "light" ? "rgba(255,255,255,.12)" : ink;
  const stroke = style === "light" ? "#ffffff" : fill;
  const color = style === "light" || style === "dark" || style === "sea" ? "#ffffff" : ink;
  return `<rect x="${x}" y="${y}" width="${w}" height="46" rx="0" fill="${fill}" stroke="${stroke}"/>
  ${textBlock([label], x + w / 2, y + 29, { size: 12, fill: color, weight: 800, anchor: "middle" })}`;
}

function header(x, y, active = "About") {
  const nav = ["About", "Team", "Locations", "Contact"];
  return `<rect x="${x}" y="${y}" width="${W}" height="72" fill="#ffffff" opacity=".96"/>
  <line x1="${x}" y1="${y + 72}" x2="${x + W}" y2="${y + 72}" stroke="${line}"/>
  <circle cx="${x + M + 22}" cy="${y + 36}" r="21" fill="none" stroke="${ink}"/>
  ${textBlock(["JBY"], x + M + 22, y + 41, { size: 12, fill: ink, weight: 900, anchor: "middle" })}
  ${textBlock(["JEFF BROWN YACHTS"], x + M + 58, y + 41, { size: 12, fill: ink, weight: 850 })}
  ${nav.map((item, i) => textBlock([item.toUpperCase()], x + 640 + i * 116, y + 41, { size: 12, fill: item === active ? red : "#30363a", weight: 850 })).join("")}
  ${button("START A CONVERSATION", x + W - M - 196, y + 14, 196, "sea")}`;
}

function hero(x, y, eyebrow, title, copy, imgTone = sea) {
  return `<defs>
    <linearGradient id="hero-${x}-${y}" x1="0" x2="1">
      <stop offset="0" stop-color="#061417"/>
      <stop offset=".58" stop-color="${imgTone}"/>
      <stop offset="1" stop-color="#20383b"/>
    </linearGradient>
  </defs>
  <rect x="${x}" y="${y + 72}" width="${W}" height="318" fill="url(#hero-${x}-${y})"/>
  <path d="M${x + W - 360},${y + 72} C${x + W - 240},${y + 140} ${x + W - 210},${y + 300} ${x + W},${y + 270} L${x + W},${y + 72} Z" fill="#ffffff" opacity=".08"/>
  <line x1="${x + M}" y1="${y + 152}" x2="${x + M + 34}" y2="${y + 152}" stroke="${red}" stroke-width="3"/>
  ${textBlock([eyebrow.toUpperCase()], x + M + 48, y + 157, { size: 12, fill: "rgba(255,255,255,.82)", weight: 850 })}
  ${textBlock(title, x + M, y + 220, { size: 48, fill: "#ffffff", weight: 760, leading: 55 })}
  ${textBlock(copy, x + M, y + 320, { size: 18, fill: "rgba(255,255,255,.82)", leading: 27 })}`;
}

function card(x, y, w, h, title, copy, label = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${line}"/>
  ${label ? textBlock([label.toUpperCase()], x + 22, y + 34, { size: 11, fill: sea, weight: 850 }) : ""}
  ${textBlock([title], x + 22, y + (label ? 68 : 38), { size: 20, fill: ink, weight: 800 })}
  ${textBlock(copy, x + 22, y + (label ? 102 : 72), { size: 14, fill: muted, leading: 21 })}`;
}

function imageCard(x, y, w, h, title, sub, label = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${line}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${Math.round(h * .52)}" rx="8" fill="${soft}"/>
  <rect x="${x + 18}" y="${y + 18}" width="${w - 36}" height="${Math.round(h * .52) - 36}" rx="4" fill="${sea}" opacity=".16"/>
  <path d="M${x + 18},${y + Math.round(h * .52) - 40} C${x + 90},${y + 78} ${x + 170},${y + 160} ${x + w - 18},${y + 58}" fill="none" stroke="${gold}" stroke-width="3" opacity=".7"/>
  ${label ? `<rect x="${x + 20}" y="${y + Math.round(h * .52) + 20}" width="${label.length * 7 + 22}" height="28" rx="14" fill="${soft}" stroke="${line}"/>${textBlock([label.toUpperCase()], x + 32, y + Math.round(h * .52) + 39, { size: 10, fill: muted, weight: 800 })}` : ""}
  ${textBlock([title], x + 20, y + Math.round(h * .52) + (label ? 70 : 42), { size: 19, fill: ink, weight: 820 })}
  ${textBlock([sub], x + 20, y + Math.round(h * .52) + (label ? 100 : 72), { size: 14, fill: muted })}`;
}

function frameBase(frame, active) {
  return `<g id="${frame.id}">
  <text x="${frame.x}" y="${frame.y - 18}" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="850">${esc(frame.title)}</text>
  <rect x="${frame.x}" y="${frame.y}" width="${W}" height="${H}" rx="0" fill="#ffffff" stroke="#cbd2d4"/>
  ${header(frame.x, frame.y, active)}`;
}

function about() {
  const f = frames[0];
  const x = f.x, y = f.y;
  return `${frameBase(f, "About")}
  ${hero(x, y, "About JBY", ["A boutique yacht dealership", "with coast-to-coast reach."], ["Company story, services, brand trust,", "and clear routes into team and locations."], sea)}
  <rect x="${x + M}" y="${y + 430}" width="${W - M * 2}" height="116" fill="${soft}" stroke="${line}"/>
  ${["8 Office markets", "9 Premium brands", "4 Core services", "1 Contact path"].map((item, i) => {
    const [num, ...rest] = item.split(" ");
    return `${textBlock([num], x + M + 52 + i * 300, y + 484, { size: 40, fill: sea, weight: 850 })}${textBlock([rest.join(" ").toUpperCase()], x + M + 52 + i * 300, y + 512, { size: 11, fill: muted, weight: 850 })}`;
  }).join("")}
  ${textBlock(["What the About page should explain"], x + M, y + 612, { size: 32, fill: ink, weight: 760 })}
  ${[["New Yachts", "Brand-led discovery"], ["Brokerage", "People-first selling"], ["Service", "Office-specific support"], ["Locations", "Local SEO pages"]].map((c, i) => card(x + M + i * 306, y + 650, 286, 168, c[1], ["Short module that routes visitors", "to the best next action."], c[0])).join("")}
  </g>`;
}

function team() {
  const f = frames[1];
  const x = f.x, y = f.y;
  const chips = ["All", "Sales", "Service", "Leadership", "Marketing"];
  return `${frameBase(f, "Team")}
  ${hero(x, y, "Team & Brokers", ["Find the person who knows", "your water and next move."], ["Filter by role or office. Broker profiles", "include active yacht modules."], "#145d63")}
  ${textBlock(["Team directory with broker-specific listings"], x + M, y + 448, { size: 32, fill: ink, weight: 760 })}
  ${chips.map((chip, i) => `<rect x="${x + M + i * 122}" y="${y + 486}" width="${chip.length * 11 + 38}" height="36" rx="18" fill="${chip === "Sales" ? sea : "#ffffff"}" stroke="${chip === "Sales" ? sea : line}"/>${textBlock([chip.toUpperCase()], x + M + i * 122 + 18, y + 509, { size: 11, fill: chip === "Sales" ? "#ffffff" : text, weight: 850 })}`).join("")}
  ${[
    ["Allen Jones", "Sales Professional", "Newport Harbor"],
    ["Ryan Anderson", "Sales Professional", "San Diego"],
    ["Tommy Casias", "Sales Manager", "Seattle"],
    ["Pete McCormick", "Sales Professional", "Sausalito"],
    ["Annie Snyder", "Lead Service Technician", "Service"],
    ["Melina Monninger", "Marketing Manager", "San Diego"]
  ].map((p, i) => imageCard(x + M + (i % 3) * 406, y + 556 + Math.floor(i / 3) * 174, 376, 150, p[0], p[1], p[2])).join("")}
  </g>`;
}

function profile() {
  const f = frames[2];
  const x = f.x, y = f.y;
  return `${frameBase(f, "Team")}
  ${hero(x, y, "Broker Profile", ["Allen Jones"], ["Sales Professional & Mari~Time Manager", "Newport Harbor Office"], "#1f6970")}
  <rect x="${x + M}" y="${y + 430}" width="320" height="388" rx="8" fill="#ffffff" stroke="${line}"/>
  <rect x="${x + M}" y="${y + 430}" width="320" height="190" rx="8" fill="${soft}"/>
  ${textBlock(["ALLEN JONES"], x + M + 24, y + 668, { size: 22, fill: ink, weight: 850 })}
  ${textBlock(["Sales Professional", "allen@jeffbrownyachts.com", "949-630-2306"], x + M + 24, y + 704, { size: 14, fill: muted, leading: 24 })}
  ${button("CONTACT ALLEN", x + M + 24, y + 762, 168, "sea")}
  ${textBlock(["Broker profile with active yacht inventory."], x + 420, y + 456, { size: 34, fill: ink, weight: 760 })}
  ${textBlock(["Sales profiles need yachts directly on the page so buyers can connect a real", "person to real inventory and ask about a specific boat immediately."], x + 420, y + 508, { size: 17, fill: muted, leading: 26 })}
  ${["Primary role|Sales Professional", "Office|Newport Harbor", "Best CTA|Ask about a yacht"].map((item, i) => {
    const [a, b] = item.split("|");
    return card(x + 420 + i * 286, y + 568, 266, 98, b, [], a);
  }).join("")}
  ${textBlock(["Current Yachts"], x + 420, y + 724, { size: 28, fill: ink, weight: 760 })}
  ${[
    ["2024 Riva 66 Ribelle", "Call for Price"],
    ["2023 Pardo Endurance 60", "$2,250,000"],
    ["2023 Wally tender48", "Call for Price"]
  ].map((p, i) => imageCard(x + 420 + i * 286, y + 754, 266, 118, p[0], p[1], "Newport")).join("")}
  </g>`;
}

function locations() {
  const f = frames[3];
  const x = f.x, y = f.y;
  return `${frameBase(f, "Locations")}
  ${hero(x, y, "Locations", ["Offices designed for local", "discovery and local trust."], ["Map overview, office cards, and", "individual local landing pages."], "#2e686d")}
  <rect x="${x + M}" y="${y + 430}" width="760" height="360" rx="8" fill="#dfecec" stroke="${line}"/>
  <path d="M${x + 100},${y + 680} C${x + 260},${y + 520} ${x + 480},${y + 745} ${x + 760},${y + 520}" fill="none" stroke="${sea}" stroke-width="6" opacity=".28"/>
  ${[
    [130, 640, "San Diego"], [172, 610, "Newport"], [198, 555, "Sausalito"], [220, 490, "Seattle"], [610, 670, "Kona"], [690, 580, "Wrightsville"], [740, 624, "Charleston"]
  ].map(pin => `<circle cx="${x + pin[0]}" cy="${y + pin[1]}" r="9" fill="${red}" stroke="#ffffff" stroke-width="4"/><text x="${x + pin[0] + 16}" y="${y + pin[1] + 4}" fill="${ink}" font-family="Inter, Arial" font-size="12" font-weight="800">${pin[2]}</text>`).join("")}
  ${["San Diego|Shelter Island Drive", "Newport Harbor|West Coast Highway", "Marina del Rey|Esprit Marina", "Sausalito|Clipper Yacht Harbor", "Seattle|Salmon Bay Marine Center", "Charleston|Seabreeze Marina"].map((row, i) => {
    const [a, b] = row.split("|");
    return `<rect x="${x + 850}" y="${y + 430 + i * 58}" width="430" height="46" rx="8" fill="#ffffff" stroke="${line}"/>${textBlock([a], x + 870, y + 459 + i * 58, { size: 15, fill: ink, weight: 800 })}${textBlock([b], x + 1035, y + 459 + i * 58, { size: 13, fill: muted })}`;
  }).join("")}
  </g>`;
}

function office() {
  const f = frames[4];
  const x = f.x, y = f.y;
  return `${frameBase(f, "Locations")}
  ${hero(x, y, "Office Page", ["San Diego Yacht Brokerage"], ["Address, hours, local copy, team,", "directions, and local listings."], "#17666d")}
  ${textBlock(["Why keep individual office pages?"], x + M, y + 456, { size: 34, fill: ink, weight: 760 })}
  ${textBlock(["They support local SEO and help high-intent visitors find the right", "office, people, inventory, hours, and directions."], x + M, y + 508, { size: 17, fill: muted, leading: 26 })}
  ${["New yacht sales", "Brokerage", "Private showings", "Yacht management"].map((item, i) => card(x + M + (i % 2) * 306, y + 570 + Math.floor(i / 2) * 112, 286, 88, item, [], "Service")).join("")}
  <rect x="${x + 760}" y="${y + 430}" width="500" height="230" rx="8" fill="#ffffff" stroke="${line}"/>
  ${textBlock(["MAIN OFFICE"], x + 790, y + 474, { size: 12, fill: sea, weight: 850 })}
  ${textBlock(["San Diego"], x + 790, y + 512, { size: 28, fill: ink, weight: 850 })}
  ${textBlock(["2330 Shelter Island Drive, Suite 105", "San Diego, CA 92106", "619-222-9899", "Monday-Friday: 8am-5pm"], x + 790, y + 552, { size: 15, fill: muted, leading: 25 })}
  ${button("CONTACT OFFICE", x + 790, y + 600, 168, "sea")}
  ${textBlock(["Local Listings"], x + 760, y + 724, { size: 28, fill: ink, weight: 760 })}
  ${[["2026 Sirena 60", "Call for Price"], ["2024 Wally power58X", "Call for Price"], ["2026 Axopar 45 XC", "Call for Price"]].map((p, i) => imageCard(x + 760 + i * 176, y + 754, 156, 118, p[0], p[1], "San Diego")).join("")}
  </g>`;
}

function contact() {
  const f = frames[5];
  const x = f.x, y = f.y;
  return `${frameBase(f, "Contact")}
  ${hero(x, y, "General Contact", ["One form for every buyer,", "seller, owner, and request."], ["A universal lead-capture page for users", "who are not ready to choose a broker."], "#284f54")}
  <rect x="${x + M}" y="${y + 430}" width="760" height="388" rx="8" fill="#ffffff" stroke="${line}"/>
  ${textBlock(["How Can We Help?"], x + M + 28, y + 480, { size: 32, fill: ink, weight: 760 })}
  ${[
    ["Full Name", 0, 0], ["Email", 1, 0], ["Mobile", 0, 1], ["Preferred Location", 1, 1], ["Brand Interest", 0, 2], ["Inquiry Type", 1, 2]
  ].map(([label, col, row]) => `<text x="${x + M + 28 + col * 350}" y="${y + 528 + row * 72}" fill="${text}" font-family="Inter, Arial" font-size="12" font-weight="800">${label}</text><rect x="${x + M + 28 + col * 350}" y="${y + 540 + row * 72}" width="312" height="44" rx="6" fill="${soft}" stroke="${line}"/>`).join("")}
  <text x="${x + M + 28}" y="${y + 744}" fill="${text}" font-family="Inter, Arial" font-size="12" font-weight="800">Comments</text>
  <rect x="${x + M + 28}" y="${y + 756}" width="662" height="44" rx="6" fill="${soft}" stroke="${line}"/>
  ${button("SUBMIT INQUIRY", x + M + 28, y + 836, 168, "sea")}
  ${card(x + 850, y + 430, 430, 120, "Not sure who to contact?", ["Use this page as the universal", "lead capture and route by inquiry."], "Fast Path")}
  ${card(x + 850, y + 570, 430, 100, "(619) 222-9899", ["Main office line for users", "who prefer to call."], "Primary Phone")}
  ${card(x + 850, y + 690, 430, 128, "Connect form to CRM", ["Recommended routing: location,", "inquiry type, then brand interest."], "Next Steps")}
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4560" height="2040" viewBox="0 0 4560 2040">
<rect width="4560" height="2040" fill="#f1f4f4"/>
${about()}
${team()}
${profile()}
${locations()}
${office()}
${contact()}
</svg>`;

writeFileSync(new URL("./jby-figma-board.svg", import.meta.url), svg);
console.log("Created jby-figma-board.svg");
