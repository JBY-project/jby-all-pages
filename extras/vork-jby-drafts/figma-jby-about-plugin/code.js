const W = 1440;
const H = 1020;
const GAP = 160;
const M = 64;

const colors = {
  ink: rgb("#111315"),
  text: rgb("#364047"),
  muted: rgb("#68747b"),
  line: rgb("#e1e6e7"),
  paper: rgb("#ffffff"),
  soft: rgb("#f4f7f7"),
  mist: rgb("#eaf3f2"),
  sea: rgb("#006f78"),
  seaDark: rgb("#064b51"),
  red: rgb("#e23d35"),
  gold: rgb("#b9975b"),
  darkHero: rgb("#061417")
};

function rgb(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255
  };
}

function solid(color) {
  return [{ type: "SOLID", color }];
}

function stroke(node, color = colors.line, weight = 1) {
  node.strokes = solid(color);
  node.strokeWeight = weight;
}

function setRadius(node, radius = 8) {
  node.cornerRadius = radius;
}

function rect(parent, name, x, y, w, h, fill = colors.paper, radius = 0) {
  const node = figma.createRectangle();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = solid(fill);
  if (radius) setRadius(node, radius);
  parent.appendChild(node);
  return node;
}

function ellipse(parent, name, x, y, w, h, fill = colors.paper) {
  const node = figma.createEllipse();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, h);
  node.fills = solid(fill);
  parent.appendChild(node);
  return node;
}

function line(parent, name, x, y, w, color = colors.line, weight = 1) {
  const node = figma.createLine();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, 0);
  node.strokes = solid(color);
  node.strokeWeight = weight;
  parent.appendChild(node);
  return node;
}

function text(parent, name, value, x, y, w, opts = {}) {
  const node = figma.createText();
  node.name = name;
  node.x = x;
  node.y = y;
  node.resize(w, opts.h || 24);
  node.characters = value;
  node.fontName = { family: "Inter", style: opts.weight || "Regular" };
  node.fontSize = opts.size || 16;
  node.lineHeight = { unit: "PIXELS", value: opts.lineHeight || Math.round((opts.size || 16) * 1.35) };
  node.fills = solid(opts.color || colors.text);
  if (opts.align) node.textAlignHorizontal = opts.align;
  parent.appendChild(node);
  return node;
}

function button(parent, label, x, y, w, variant = "dark") {
  const fill = variant === "sea" ? colors.sea : variant === "light" ? colors.paper : colors.ink;
  const textColor = variant === "light" ? colors.ink : colors.paper;
  const bg = rect(parent, `Button / ${label}`, x, y, w, 46, fill, 0);
  stroke(bg, variant === "light" ? colors.paper : fill, 1);
  text(parent, `Button Label / ${label}`, label.toUpperCase(), x, y + 15, w, {
    size: 12,
    weight: "Bold",
    color: textColor,
    align: "CENTER",
    h: 16
  });
}

function chip(parent, label, x, y, active = false) {
  const width = Math.max(76, label.length * 9 + 34);
  const bg = rect(parent, `Chip / ${label}`, x, y, width, 34, active ? colors.sea : colors.paper, 17);
  stroke(bg, active ? colors.sea : colors.line);
  text(parent, `Chip Label / ${label}`, label.toUpperCase(), x, y + 11, width, {
    size: 10,
    weight: "Bold",
    color: active ? colors.paper : colors.text,
    align: "CENTER",
    h: 12
  });
  return width;
}

function card(parent, title, copy, x, y, w, h, label) {
  const bg = rect(parent, `Card / ${title}`, x, y, w, h, colors.paper, 8);
  stroke(bg);
  if (label) {
    text(parent, `Card Label / ${title}`, label.toUpperCase(), x + 22, y + 22, w - 44, {
      size: 11,
      weight: "Bold",
      color: colors.sea,
      h: 14
    });
  }
  text(parent, `Card Title / ${title}`, title, x + 22, y + (label ? 54 : 28), w - 44, {
    size: 20,
    weight: "Bold",
    color: colors.ink,
    h: 30
  });
  text(parent, `Card Copy / ${title}`, copy, x + 22, y + (label ? 88 : 62), w - 44, {
    size: 14,
    color: colors.muted,
    lineHeight: 21,
    h: h - 90
  });
}

function imageCard(parent, title, sub, label, x, y, w, h) {
  const bg = rect(parent, `Image Card / ${title}`, x, y, w, h, colors.paper, 8);
  stroke(bg);
  const image = rect(parent, `Image Placeholder / ${title}`, x, y, w, Math.round(h * 0.52), colors.soft, 8);
  stroke(image, colors.line);
  rect(parent, `Water Shape / ${title}`, x + 18, y + 18, w - 36, Math.round(h * 0.52) - 36, colors.mist, 4);
  ellipse(parent, `Marina Accent / ${title}`, x + w - 82, y + 28, 46, 46, colors.gold);
  if (label) chip(parent, label, x + 20, y + Math.round(h * 0.52) + 18, false);
  text(parent, `Image Card Title / ${title}`, title, x + 20, y + Math.round(h * 0.52) + (label ? 64 : 36), w - 40, {
    size: 19,
    weight: "Bold",
    color: colors.ink,
    h: 26
  });
  text(parent, `Image Card Sub / ${title}`, sub, x + 20, y + Math.round(h * 0.52) + (label ? 94 : 66), w - 40, {
    size: 14,
    color: colors.muted,
    h: 20
  });
}

function makeFrame(page, name, x, y, activeNav) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.x = x;
  frame.y = y;
  frame.resize(W, H);
  frame.fills = solid(colors.paper);
  page.appendChild(frame);

  rect(frame, "Top Navigation", 0, 0, W, 76, colors.paper);
  line(frame, "Header Border", 0, 76, W, colors.line);
  ellipse(frame, "JBY Crest", M, 18, 40, 40, colors.paper);
  stroke(frame.children[frame.children.length - 1], colors.ink);
  text(frame, "JBY Crest Text", "JBY", M, 32, 40, { size: 11, weight: "Bold", color: colors.ink, align: "CENTER", h: 14 });
  text(frame, "Logo Text", "JEFF BROWN YACHTS", M + 54, 32, 190, { size: 12, weight: "Bold", color: colors.ink, h: 16 });

  ["About", "Team", "Locations", "Contact"].forEach((item, index) => {
    text(frame, `Nav / ${item}`, item.toUpperCase(), 690 + index * 120, 33, 100, {
      size: 12,
      weight: "Bold",
      color: item === activeNav ? colors.red : colors.text,
      h: 16
    });
  });
  button(frame, "Start a Conversation", W - M - 210, 15, 210, "sea");
  return frame;
}

function hero(frame, eyebrow, title, copy, tone = colors.sea) {
  rect(frame, "Hero Background", 0, 76, W, 330, colors.darkHero);
  rect(frame, "Hero Color Wash", W * 0.46, 76, W * 0.54, 330, tone);
  rect(frame, "Hero Image Placeholder", W - 420, 118, 300, 210, colors.mist, 8);
  rect(frame, "Hero Waterline", W - 380, 220, 220, 4, colors.gold, 0);
  line(frame, "Hero Eyebrow Rule", M, 154, 34, colors.red, 3);
  text(frame, "Hero Eyebrow", eyebrow.toUpperCase(), M + 48, 147, 260, { size: 12, weight: "Bold", color: colors.paper, h: 18 });
  text(frame, "Hero Title", title, M, 205, 760, { size: 54, weight: "Bold", color: colors.paper, lineHeight: 60, h: 132 });
  text(frame, "Hero Copy", copy, M, 334, 620, { size: 18, color: colors.paper, lineHeight: 27, h: 56 });
}

function buildAbout(page) {
  const f = makeFrame(page, "01 About JBY", 0, 0, "About");
  hero(f, "About JBY", "A boutique yacht dealership\nwith coast-to-coast reach.", "Company story, services, brand trust,\nand clear routes into team and locations.");
  rect(f, "Stats Band", M, 456, W - M * 2, 112, colors.soft);
  stroke(f.children[f.children.length - 1], colors.line);
  ["8\nOffice markets", "9\nPremium brands", "4\nCore services", "1\nContact path"].forEach((item, i) => {
    const [big, small] = item.split("\n");
    text(f, `Stat Number ${i + 1}`, big, M + 72 + i * 310, 484, 90, { size: 40, weight: "Bold", color: colors.sea, h: 48 });
    text(f, `Stat Label ${i + 1}`, small.toUpperCase(), M + 72 + i * 310, 532, 150, { size: 11, weight: "Bold", color: colors.muted, h: 16 });
  });
  text(f, "Section Title", "What the About page should explain", M, 640, 760, { size: 36, weight: "Bold", color: colors.ink, h: 48 });
  [
    ["Brand-led discovery", "Route visitors into new yacht brand pages and available inventory.", "New Yachts"],
    ["People-first selling", "Brokerage feels stronger when users can connect yachts to specific people.", "Brokerage"],
    ["Office-specific support", "Service users need credentials, location, and appointment flow.", "Service"],
    ["Local SEO pages", "Office pages carry address, team, listings, and search-intent copy.", "Locations"]
  ].forEach((item, i) => card(f, item[0], item[1], M + i * 316, 700, 296, 180, item[2]));
}

function buildTeam(page) {
  const f = makeFrame(page, "02 Team & Brokers", W + GAP, 0, "Team");
  hero(f, "Team & Brokers", "Find the person who knows\nyour water and next move.", "Filter by role or office. Broker profiles\ninclude active yacht modules.", colors.seaDark);
  text(f, "Section Title", "Team directory with broker-specific listings", M, 448, 780, { size: 36, weight: "Bold", color: colors.ink, h: 48 });
  let x = M;
  ["All", "Sales", "Service", "Leadership", "Marketing"].forEach(label => {
    const w = chip(f, label, x, 508, label === "Sales");
    x += w + 12;
  });
  [
    ["Allen Jones", "Sales Professional", "Newport Harbor"],
    ["Ryan Anderson", "Sales Professional", "San Diego"],
    ["Tommy Casias", "Sales Manager", "Seattle"],
    ["Pete McCormick", "Sales Professional", "Sausalito"],
    ["Annie Snyder", "Lead Service Technician", "Service"],
    ["Melina Monninger", "Marketing Manager", "San Diego"]
  ].forEach((person, i) => imageCard(f, person[0], person[1], person[2], M + (i % 3) * 420, 586 + Math.floor(i / 3) * 190, 388, 168));
}

function buildProfile(page) {
  const f = makeFrame(page, "03 Broker Profile", (W + GAP) * 2, 0, "Team");
  hero(f, "Broker Profile", "Allen Jones", "Sales Professional & Mari~Time Manager\nNewport Harbor Office", colors.sea);
  rect(f, "Profile Sidebar", M, 456, 340, 430, colors.paper, 8);
  stroke(f.children[f.children.length - 1]);
  rect(f, "Profile Photo Placeholder", M, 456, 340, 200, colors.soft, 8);
  text(f, "Profile Name", "Allen Jones", M + 24, 700, 260, { size: 24, weight: "Bold", color: colors.ink, h: 32 });
  text(f, "Profile Details", "Sales Professional\nallen@jeffbrownyachts.com\n949-630-2306\nNewport Harbor Office", M + 24, 740, 270, { size: 15, color: colors.muted, lineHeight: 25, h: 110 });
  button(f, "Contact Allen", M + 24, 840, 166, "sea");
  text(f, "Main Profile Title", "Broker profile with active yacht inventory.", 470, 470, 760, { size: 38, weight: "Bold", color: colors.ink, h: 50 });
  text(f, "Main Profile Copy", "Sales profiles need yachts directly on the page so buyers can connect a real person to real inventory and ask about a specific boat immediately.", 470, 530, 760, { size: 17, color: colors.muted, lineHeight: 27, h: 70 });
  [
    ["Sales Professional", "Primary role"],
    ["Newport Harbor", "Office"],
    ["Ask about a yacht", "Best CTA"]
  ].forEach((item, i) => card(f, item[0], "", 470 + i * 294, 630, 274, 100, item[1]));
  text(f, "Current Yachts Title", "Current Yachts", 470, 790, 400, { size: 30, weight: "Bold", color: colors.ink, h: 40 });
  [
    ["2024 Riva 66 Ribelle", "Call for Price"],
    ["2023 Pardo Endurance 60", "$2,250,000"],
    ["2023 Wally tender48", "Call for Price"]
  ].forEach((boat, i) => imageCard(f, boat[0], boat[1], "Newport", 470 + i * 294, 840, 274, 150));
}

function buildLocations(page) {
  const f = makeFrame(page, "04 Locations", 0, H + GAP, "Locations");
  hero(f, "Locations", "Offices designed for local\ndiscovery and local trust.", "Map overview, office cards, and\nindividual local landing pages.", colors.seaDark);
  rect(f, "Map Area", M, 456, 800, 410, colors.mist, 8);
  stroke(f.children[f.children.length - 1]);
  [
    [120, 314, "San Diego"],
    [180, 280, "Newport"],
    [210, 226, "Sausalito"],
    [232, 164, "Seattle"],
    [620, 330, "Kona"],
    [704, 252, "Wrightsville"],
    [760, 304, "Charleston"]
  ].forEach(pin => {
    ellipse(f, `Map Pin / ${pin[2]}`, M + pin[0], 456 + pin[1], 18, 18, colors.red);
    text(f, `Pin Label / ${pin[2]}`, pin[2], M + pin[0] + 26, 456 + pin[1] + 1, 120, { size: 12, weight: "Bold", color: colors.ink, h: 16 });
  });
  [
    ["San Diego", "Shelter Island Drive"],
    ["Newport Harbor", "West Coast Highway"],
    ["Marina del Rey", "Esprit Marina"],
    ["Sausalito", "Clipper Yacht Harbor"],
    ["Seattle", "Salmon Bay Marine Center"],
    ["Charleston", "Seabreeze Marina"]
  ].forEach((office, i) => {
    rect(f, `Office Row / ${office[0]}`, 930, 456 + i * 62, 420, 48, colors.paper, 8);
    stroke(f.children[f.children.length - 1]);
    text(f, `Office Row Name / ${office[0]}`, office[0], 952, 472 + i * 62, 160, { size: 15, weight: "Bold", color: colors.ink, h: 20 });
    text(f, `Office Row Address / ${office[0]}`, office[1], 1130, 472 + i * 62, 180, { size: 13, color: colors.muted, h: 20 });
  });
}

function buildOffice(page) {
  const f = makeFrame(page, "05 Office Page", W + GAP, H + GAP, "Locations");
  hero(f, "Office Page", "San Diego Yacht Brokerage", "Address, hours, local copy, team,\ndirections, and local listings.", colors.sea);
  text(f, "Office Why Title", "Why keep individual office pages?", M, 462, 700, { size: 38, weight: "Bold", color: colors.ink, h: 50 });
  text(f, "Office Why Copy", "They support local SEO and help high-intent visitors find the right office, people, inventory, hours, and directions.", M, 526, 650, { size: 17, color: colors.muted, lineHeight: 27, h: 64 });
  ["New yacht sales", "Brokerage", "Private showings", "Yacht management"].forEach((item, i) => {
    card(f, item, "", M + (i % 2) * 324, 640 + Math.floor(i / 2) * 118, 304, 90, "Service");
  });
  rect(f, "Office Info Card", 820, 456, 500, 246, colors.paper, 8);
  stroke(f.children[f.children.length - 1]);
  text(f, "Office Label", "MAIN OFFICE", 850, 492, 160, { size: 12, weight: "Bold", color: colors.sea, h: 16 });
  text(f, "Office Name", "San Diego", 850, 530, 240, { size: 30, weight: "Bold", color: colors.ink, h: 40 });
  text(f, "Office Details", "2330 Shelter Island Drive, Suite 105\nSan Diego, CA 92106\n619-222-9899\nMonday-Friday: 8am-5pm", 850, 582, 360, { size: 15, color: colors.muted, lineHeight: 25, h: 105 });
  button(f, "Contact Office", 850, 640, 170, "sea");
  text(f, "Local Listings", "Local Listings", 820, 766, 300, { size: 30, weight: "Bold", color: colors.ink, h: 40 });
  [
    ["2026 Sirena 60", "Call for Price"],
    ["2024 Wally power58X", "Call for Price"],
    ["2026 Axopar 45 XC", "Call for Price"]
  ].forEach((boat, i) => imageCard(f, boat[0], boat[1], "San Diego", 820 + i * 174, 820, 154, 150));
}

function buildContact(page) {
  const f = makeFrame(page, "06 General Contact", (W + GAP) * 2, H + GAP, "Contact");
  hero(f, "General Contact", "One form for every buyer,\nseller, owner, and request.", "A universal lead-capture page for users\nwho are not ready to choose a broker.", colors.seaDark);
  rect(f, "Contact Form Card", M, 456, 780, 450, colors.paper, 8);
  stroke(f.children[f.children.length - 1]);
  text(f, "Contact Form Title", "How Can We Help?", M + 32, 502, 520, { size: 36, weight: "Bold", color: colors.ink, h: 48 });
  [
    ["Full Name", 0, 0],
    ["Email", 1, 0],
    ["Mobile", 0, 1],
    ["Preferred Location", 1, 1],
    ["Brand Interest", 0, 2],
    ["Inquiry Type", 1, 2]
  ].forEach(field => {
    const x = M + 32 + field[1] * 356;
    const y = 568 + field[2] * 78;
    text(f, `Field Label / ${field[0]}`, field[0], x, y, 260, { size: 12, weight: "Bold", color: colors.text, h: 16 });
    rect(f, `Input / ${field[0]}`, x, y + 22, 320, 46, colors.soft, 6);
    stroke(f.children[f.children.length - 1]);
  });
  text(f, "Field Label / Comments", "Comments", M + 32, 802, 260, { size: 12, weight: "Bold", color: colors.text, h: 16 });
  rect(f, "Input / Comments", M + 32, 824, 676, 46, colors.soft, 6);
  stroke(f.children[f.children.length - 1]);
  button(f, "Submit Inquiry", M + 32, 892, 170, "sea");
  card(f, "Not sure who to contact?", "Use this page as the universal lead capture and route by inquiry.", 930, 456, 420, 128, "Fast Path");
  card(f, "(619) 222-9899", "Main office line for users who prefer to call.", 930, 610, 420, 112, "Primary Phone");
  card(f, "Connect form to CRM", "Recommended routing: location, inquiry type, then brand interest.", 930, 748, 420, 128, "Next Steps");
}

async function main() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const page = figma.createPage();
  page.name = "About / Team / Locations Concept";
  figma.currentPage = page;

  buildAbout(page);
  buildTeam(page);
  buildProfile(page);
  buildLocations(page);
  buildOffice(page);
  buildContact(page);

  figma.viewport.scrollAndZoomIntoView(page.children);
  figma.notify("JBY editable About, Team, Locations, Office, Broker, and Contact frames created.");
  figma.closePlugin();
}

main();
