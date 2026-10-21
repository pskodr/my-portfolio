// Builds the small pixel-art icons used on Personal Interests and Contact Me:
// one system of 16x16 bitmaps with the same pixel scale and a dark edge,
// written as SVGs of exact squares, so they stay crisp at any display size.
// The interest icons simplify the desk artwork (scripts/desk-art/); the brand
// icons are pixel renderings of the official marks (see ASSET_CREDITS.md).
//
//   node scripts/build-icons.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "media", "icons");
mkdirSync(out, { recursive: true });

const INK = "#1d1a1c";

// Each icon: a palette (one character per colour, "." is transparent) and 16
// rows of 16 characters.
const icons = {
  // The desk's Poké Ball: red shell lit from the right, dark band, button.
  pokeball: {
    palette: { k: INK, r: "#d8403a", R: "#a8302c", h: "#f2a090", w: "#f2eee5", W: "#c9c4b8" },
    rows: [
      "................",
      ".....kkkkkk.....",
      "...kkrrrrrrkk...",
      "..krrrrrrrhhrk..",
      ".krrrrrrrrrhrrk.",
      ".kRrrrrrrrrrrrk.",
      "kRrrrrkkkkrrrrRk",
      "kkkkkkkwwkkkkkkk",
      "kkkkkkkwwkkkkkkk",
      "kWwwwwkkkkwwwwWk",
      ".kWwwwwwwwwwwwk.",
      ".kWwwwwwwwwwwWk.",
      "..kWwwwwwwwwWk..",
      "...kkWWWWWWkk...",
      ".....kkkkkk.....",
      "................",
    ],
  },
  // The desk's racket, laid on the diagonal so its oval head can be
  // properly elongated: sky-blue frame lit upper-left, a simple string grid,
  // then throat, shaft and white grip toward the lower left.
  racket: {
    palette: { k: INK, s: "#4f9bd8", S: "#25579a", g: "#c9ced4", G: "#8a919c", N: "#1e2b54", w: "#eef0f2", W: "#a7adb6" },
    rows: [
      "..........kkkk..",
      "........kkssssk.",
      ".......kssGgGSSk",
      "......kssGgGgGSk",
      ".....kssGgGgGgSk",
      "....kssGgGgGgGSk",
      "....ksGgGgGgGSk.",
      "....ksgGgGgGSSk.",
      "....ksGgGgGSSk..",
      "....ksSGgGSSk...",
      "...kNNSSSSSk....",
      "..kwNNkkkkk.....",
      ".kwwWk..........",
      "kwwWk...........",
      "kwWk............",
      ".kk.............",
    ],
  },
  // FC Barcelona crest, simplified: St George's cross, the senyera, the
  // band, blaugrana stripes and the ball.
  barcelona: {
    palette: { k: INK, w: "#f2eee5", R: "#c8102e", Y: "#edbb00", r: "#c8102e", b: "#1d4f9c", g: "#a50044", O: "#edbb00" },
    rows: [
      ".kkkkkkkkkkkkkk.",
      ".kwwRwwkYrYrYrk.",
      ".kwwRwwkYrYrYrk.",
      ".kRRRRRkYrYrYrk.",
      ".kwwRwwkYrYrYrk.",
      ".kkkkkkkkkkkkkk.",
      ".kwwYwwYwwYwwwk.",
      ".kkkkkkkkkkkkkk.",
      ".kbbggbbggbbggk.",
      ".kbbggbbggbbggk.",
      ".kbbggOOOObbggk.",
      ".kbbggOOOObbggk.",
      "..kbggbOOgbbgk..",
      "...kggbbggbbk...",
      "....kkbbggkk....",
      "......kkkk......",
    ],
  },
  // The desk's headphones: slim band, arms, two cups with inward cushions.
  headphones: {
    palette: { k: "#14171c", S: "#4e5662", s: "#646d7a", C: "#3d444f", c: "#252a32" },
    rows: [
      "................",
      "....kkkkkkkk....",
      "...kSssssssSk...",
      "..kSkkkkkkkkSk..",
      "..kSk......kSk..",
      "..kSk......kSk..",
      ".kkSkk....kkSkk.",
      ".kCCck....kcCCk.",
      ".kCCck....kcCCk.",
      ".kCCck....kcCCk.",
      ".kCCck....kcCCk.",
      ".kCCck....kcCCk.",
      ".kCCck....kcCCk.",
      ".kkkkk....kkkkk.",
      "................",
      "................",
    ],
  },
  // The desk's Pad Thai: takeout box, noodles with a little green onion,
  // chopsticks.
  padthai: {
    palette: { k: "#4a3a2c", c: "#b8955d", n: "#d69845", N: "#b8772e", o: "#77b347", w: "#efebe2", W: "#cbc5b8" },
    rows: [
      "................",
      "...........kk...",
      "..........kck...",
      ".........kck....",
      "....kkkkkckkk...",
      "...knnNnnnnnnk..",
      "..knNnonnNnnnnk.",
      "..kwwwwwwwwwwwk.",
      "..kwwwwwwwwwwWk.",
      "...kwwwwwwwwWk..",
      "...kwwwwwwwwWk..",
      "...kwwwwwwwwWk..",
      "....kwwwwwwWk...",
      "....kwwwwwwWk...",
      "....kkkkkkkkk...",
      "................",
    ],
  },
  // Gmail's M in its four colours.
  gmail: {
    palette: { R: "#c5221f", r: "#ea4335", B: "#4285f4", G: "#34a853", Y: "#fbbc04" },
    rows: [
      "................",
      "................",
      "................",
      ".Rr..........rY.",
      ".Rrr........rrY.",
      ".Brrr......rrrG.",
      ".BB.rr....rr.GG.",
      ".BB..rr..rr..GG.",
      ".BB...rrrr...GG.",
      ".BB....rr....GG.",
      ".BB..........GG.",
      ".BB..........GG.",
      ".BB..........GG.",
      "................",
      "................",
      "................",
    ],
  },
  // GitHub's mark: the Octocat as negative space in a dark circle.
  github: {
    palette: { k: "#1f2328" },
    rows: [
      ".....kkkkkk.....",
      "...kkkkkkkkkk...",
      "..kkkkkkkkkkkk..",
      ".kkk.kkkkkk.kkk.",
      ".kkk........kkk.",
      "kkk..........kkk",
      "kkk..........kkk",
      "kkk..........kkk",
      "kkkk........kkkk",
      "kkkkkk....kkkkkk",
      ".k..kk....kkkkk.",
      ".kk..k....kkkkk.",
      "..kk......kkkk..",
      "...kkk....kkk...",
      ".....k....k.....",
      "................",
    ],
  },
  // LinkedIn's "in" on its blue rounded square.
  linkedin: {
    palette: { B: "#0a66c2", w: "#ffffff" },
    rows: [
      "................",
      "..BBBBBBBBBBBB..",
      ".BBBBBBBBBBBBBB.",
      ".BBwwBBBBBBBBBB.",
      ".BBwwBBBBBBBBBB.",
      ".BBBBBBBBBBBBBB.",
      ".BBwwBwwBwwwBBB.",
      ".BBwwBwwwBBwwBB.",
      ".BBwwBwwBBBwwBB.",
      ".BBwwBwwBBBwwBB.",
      ".BBwwBwwBBBwwBB.",
      ".BBwwBwwBBBwwBB.",
      ".BBwwBwwBBBwwBB.",
      ".BBBBBBBBBBBBBB.",
      "..BBBBBBBBBBBB..",
      "................",
    ],
  },
};

for (const [name, { palette, rows }] of Object.entries(icons)) {
  if (rows.length !== 16 || rows.some((r) => r.length !== 16)) throw new Error(`${name}: rows must be 16x16`);
  // One rect per horizontal run of a colour.
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < 16; ) {
      const ch = row[x];
      let end = x + 1;
      while (end < 16 && row[end] === ch) end++;
      if (ch !== ".") {
        if (!palette[ch]) throw new Error(`${name}: no colour for "${ch}"`);
        rects.push(`<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${palette[ch]}"/>`);
      }
      x = end;
    }
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">${rects.join("")}</svg>\n`;
  writeFileSync(join(out, `${name}.svg`), svg);
}
console.log(`icons: ${Object.keys(icons).length} -> public/media/icons`);
