// Each interactive object, drawn in scene coordinates (480x270) on its own
// layer. draw() paints the visible sprite; hit() (optional) paints the filled
// silhouette used for the hover outline and pointer hit-testing, e.g. the
// racket head is solid there even though the strings let the wall show through.
//
// Shading style: flat bands from short palette ramps (tone), thin seams
// between bands, light from the monitor (cool) and the light bar (amber).
import { Layer, bulge, clamp, distToSeg, hash, inEllipse, inPoly, inRoundRect, mix, text, tone } from "./lib.mjs";

// ---------- Palette ----------
export const P = {
  bezel: ["#0b0c10", "#111318", "#181b21", "#20242c", "#2b303a", "#3a404c"],
  metal: ["#101216", "#171a1f", "#20242a", "#2b3038", "#3a404a", "#4f5662", "#68707d"],
  screen: ["#e1dbcc", "#e8e3d6", "#eee9de", "#f2eee5", "#f5f2e9"], // warm ivory glass, matching the HTML theme
  amber: ["#6b3f17", "#a3652a", "#d8954a", "#f6be78", "#ffdcaa"],
  garnet: ["#33081a", "#4f0d28", "#6c1336", "#8c1c48", "#a92b5c"],
  blue: ["#0a1631", "#0f234c", "#15336d", "#1d4790", "#2a5db0"],
  navy: ["#070c1d", "#0d1530", "#17224a"],
  gold: ["#5e4210", "#93681a", "#c48f26", "#e3b23c", "#f4d067"],
  frame: ["#060608", "#0e0e11", "#1a1a1f", "#2a2a31"],
  sky: ["#13284a", "#1b3a68", "#25579a", "#3378bd", "#4f9bd8", "#7cc0ec"],
  rnavy: ["#0a1024", "#121b38", "#1e2b54", "#2c3c6b"],
  grip: ["#6d737c", "#959ba4", "#bcc1c8", "#dadee3", "#eef0f2"],
  slate: ["#14171c", "#1c2026", "#252a32", "#30363f", "#3d444f", "#4e5662", "#646d7a"],
  silver: ["#5f656e", "#959ba4", "#c9ced4", "#eef0f3"],
  box: ["#6f6a60", "#928c80", "#b4ad9f", "#cfc8b9", "#e4dfd2", "#f3efe7"],
  noodle: ["#6a3e12", "#94591d", "#b8772e", "#d69845", "#ebb966", "#f6d595"],
  onion: ["#2f5a22", "#4c8732", "#77b347"],
  lime: ["#4f7a23", "#82b13c", "#c3df7c"],
  shrimp: ["#a24f2e", "#d9784e", "#f2a681"],
  chop: ["#8a6a3e", "#b8955d", "#dcbd86"],
  cream: ["#857f73", "#aaa497", "#cbc5b8", "#e1dcd0", "#efebe2"],
  sage: ["#3d503b", "#587352", "#7b9875", "#a0ba99"],
  kbCase: ["#14161a", "#1d1f25", "#282b32", "#383c45"],
  mouse: ["#70757d", "#9a9fa7", "#c4c8ce", "#e2e5e9", "#f3f4f6"],
  paper: ["#8d8676", "#b3ab99", "#d6cfbe", "#ece6d8"],
};

const COOL = "#efe3c2"; // light from the warm ivory screen
const WARM = "#ffcf8f"; // light bar


// ---------- Monitor ----------
// The screen shows real HTML (photo, name, intro, links) laid over this, so
// the artwork only draws the glass, a title bar and the bezel.
export const SCREEN = { x0: 130, y0: 26, x1: 349, y1: 141 };

export const monitor = {
  id: "monitor",
  group: "computer",
  noSelout: true,
  draw() {
    const L = new Layer();
    // Light bar
    L.paint(170, 14, 310, 18, (x, y) => {
      if (y === 14) return P.bezel[4];
      if (y < 18) return P.bezel[2];
      return tone(P.amber, 0.45 + 0.55 * (1 - Math.abs(x - 240) / 70), x, y, 0.1);
    });
    L.paint(234, 19, 246, 21, () => P.bezel[1]);
    // Bezel, with a rim that separates it from the wall
    L.paint(126, 21, 353, 149, (x, y) => {
      if (!inRoundRect(x, y, 126, 21, 353, 149, 3)) return null;
      const outer = !inRoundRect(x, y, 127, 22, 352, 148, 2);
      if (outer) {
        if (y <= 22) return mix(P.bezel[5], WARM, 0.22 * clamp(1 - Math.abs(x - 240) / 100));
        if (y >= 148) return P.bezel[2];
        return mix(P.bezel[3], COOL, 0.12);
      }
      if (y > 141) return y === 142 ? P.bezel[0] : P.bezel[2];
      return P.bezel[1];
    });
    // Screen glass
    const { x0, y0, x1, y1 } = SCREEN;
    L.paint(x0, y0, x1, y1, (x, y) => {
      if (y <= y0 + 7) return y === y0 + 7 ? "#cfc7b6" : "#e8e3d7";
      return tone(P.screen, 1, x, y, 0); // flat ivory glass, matching the HTML theme
    });
    // Neck and base
    L.paint(232, 150, 248, 171, (x, y) => {
      const t = (x - 232) / 16;
      let v = 0.62 - Math.abs(t - 0.35) * 0.9;
      if (y < 153) v -= 0.25;
      return tone(P.metal, v, x, y);
    });
    L.paint(200, 166, 280, 178, (x, y) => {
      if (!inEllipse(x, y, 240, 172, 39, 5.5)) return null;
      if (!inEllipse(x, y, 240, 171, 38, 4.2)) return P.metal[1];
      const c = tone(P.metal, 0.62 - Math.abs(x - 240) / 70 - (y - 167) * 0.04, x, y);
      return mix(c, WARM, 0.08);
    });
    return L;
  },
};

// ---------- Keyboard & mouse ----------
const KB = { x0: 176, y0: 191, x1: 301, y1: 215 };

export const keyboard = {
  id: "keyboard",
  group: "computer",
  draw() {
    const L = new Layer();
    L.paint(KB.x0, KB.y0, KB.x1, KB.y1, (x, y) => {
      if (!inRoundRect(x, y, KB.x0, KB.y0, KB.x1, KB.y1, 2)) return null;
      if (y === KB.y0) return mix(P.kbCase[3], COOL, 0.15);
      if (y >= KB.y1 - 1) return P.kbCase[0];
      return P.kbCase[1];
    });
    const rows = [
      Array(20).fill(1),
      [...Array(18).fill(1), 2],
      [1.5, ...Array(17).fill(1), 1.5],
      [1.75, ...Array(14).fill(1), 2.25, 1, 1],
      [1.25, 1.25, 1.25, 7, 1.25, 1.25, 1.25, 1.25, 1, 1, 1, 1],
    ];
    const pitch = 6.15;
    rows.forEach((row, r) => {
      let ux = 0;
      row.forEach((u, k) => {
        const x = Math.round(KB.x0 + 2 + ux * pitch);
        const w = Math.round(u * pitch) - 1;
        const y = KB.y0 + 2 + r * 4;
        ux += u;
        const accent = (r === 0 && k === 0) || (r === 2 && k === row.length - 1) || (r === 4 && u === 7);
        const ramp = accent ? P.sage : P.cream;
        // Back rows catch the monitor's cool light; front rows the warm pool.
        const tint = r < 2 ? [COOL, 0.16 - r * 0.06] : [WARM, (r - 1) * 0.04];
        const lit = Math.abs(x + w / 2 - 240) < 46 ? 0.85 : 0.68;
        for (let i = 0; i < w; i++) {
          const gx = x + i;
          if (gx > KB.x1 - 2) continue;
          L.set(gx, y, mix(tone(ramp, lit + 0.1, gx, y), tint[0], tint[1]));
          L.set(gx, y + 1, mix(tone(ramp, lit, gx, y + 1), tint[0], tint[1]));
          L.set(gx, y + 2, tone(ramp, lit - 0.5, gx, y + 2));
        }
      });
    });
    return L;
  },
};

export const mouse = {
  id: "mouse",
  group: "computer",
  draw() {
    const L = new Layer();
    L.paint(320, 194, 338, 216, (x, y) => {
      if (!inEllipse(x, y, 329, 205, 7.2, 10.5)) return null;
      let v = bulge(x, y, 327, 201, 7.2, 10, [-0.6, -0.9, 0.7], 0.25, 0.8);
      if (y > 212) v -= 0.25;
      if (x === 329 && y < 202) v -= 0.3;
      return mix(tone(P.mouse, v, x, y), COOL, y < 202 ? 0.1 : 0);
    });
    L.set(329, 199, P.mouse[0]);
    return L;
  },
};

// ---------- Poké Ball, notebook and pen ----------
// One destination (Pokémon & strategy): the ball is the identifying object;
// the closed notebook and pen (team-building and planning) are muted so they
// support it. Light comes from the monitor, up and to the right.
const PB = {
  red: ["#561417", "#83201e", "#ad2f27", "#cf4535", "#e66a57"],
  white: ["#75726b", "#a09c93", "#c7c2b6", "#e2ddd1", "#f2eee5"],
  ink: "#16161a",
  cover: ["#232833", "#2c3341", "#363e4e", "#424b5d", "#4f596c"],
  pages: ["#7d776a", "#9f998b"],
  pen: ["#2f2c27", "#5e584e", "#857d70"],
};
const BALL = { cx: 91, cy: 214.5, r: 11.5 };
const BALL_LIGHT = [0.55, -0.7, 0.6];

export const pokemon = {
  id: "pokemon",
  draw() {
    const L = new Layer();

    // Notebook, lying flat and turned slightly: top face, then its page edges.
    const top = [[38, 205], [78, 202], [83, 215], [41, 218]];
    const front = [[41, 218], [83, 215], [83, 218], [41, 221]];
    L.paint(37, 201, 84, 222, (x, y) => {
      const px = x + 0.5;
      const py = y + 0.5;
      if (inPoly(px, py, top)) {
        if (px < 42.5 + (py - 205) * 0.25) return PB.cover[0]; // spine
        const strap = Math.abs(px - (72 + (py - 202) * 0.4)) < 0.8;
        if (strap) return PB.cover[0];
        return tone(PB.cover, 0.4 + (px - 40) / 90 - (py - 205) / 60, x, y);
      }
      if (inPoly(px, py, front)) {
        const row = y - Math.round(218 - (px - 41) * (3 / 42));
        if (row <= 0 || row >= 2) return PB.cover[1];
        return PB.pages[px > 62 ? 1 : 0];
      }
      return null;
    });

    // Pen resting diagonally across the cover
    const pa = [46, 214.5];
    const pb = [74, 205];
    L.paint(44, 203, 76, 217, (x, y) => {
      const d = distToSeg(x + 0.5, y + 0.5, pa[0], pa[1], pb[0], pb[1]);
      if (d > 1.1) return null;
      const t = clamp((x + 0.5 - pa[0]) / (pb[0] - pa[0]));
      if (t < 0.08) return P.silver[1]; // tip
      if (t > 0.86) return d < 0.6 ? P.silver[2] : P.silver[1]; // clip end
      const above = y + 0.5 < pa[1] + (pb[1] - pa[1]) * t;
      return above ? PB.pen[2] : PB.pen[1];
    });

    // Poké Ball: red top, white bottom, a dark band that curves with the
    // sphere, and the button facing the viewer.
    const { cx, cy, r } = BALL;
    L.paint(cx - 12, cy - 12, cx + 12, cy + 12, (x, y) => {
      const px = x + 0.5;
      const py = y + 0.5;
      const dx = px - cx;
      if (dx * dx + (py - cy) ** 2 > r * r) return null;
      const bandY = cy + 1.4 * Math.sqrt(Math.max(0, 1 - (dx / r) ** 2));
      const bd = Math.hypot(dx, py - (cy + 1.4));
      if (bd <= 2.3) return bd < 1.2 && dx > -0.5 ? PB.white[4] : PB.white[3];
      if (bd <= 3.9) return PB.ink;
      if (Math.abs(py - bandY) <= 1) return PB.ink;
      const v = bulge(px, py, cx, cy, r, r, BALL_LIGHT, 0.2, 0.85);
      if (py < bandY) return tone(PB.red, v, x, y, 0.1);
      return tone(PB.white, v * 0.95, x, y, 0.1);
    });
    // A small, crisp highlight on the red shell
    L.set(cx + 4, cy - 7, PB.red[4]);
    L.set(cx + 5, cy - 7, "#f2a090");
    L.set(cx + 5, cy - 6, PB.red[4]);
    return L;
  },
};

// ---------- Pad Thai takeout box ----------
export const padthai = {
  id: "padthai",
  draw() {
    const L = new Layer();
    // Back flap (inside of the box)
    const flap = [[111, 214], [113, 197], [141, 194], [144, 211]];
    L.paint(110, 193, 145, 215, (x, y) => (inPoly(x + 0.5, y + 0.5, flap) ? tone(P.box, x > 128 ? 0.66 : 0.56, x, y) : null));
    L.line(113, 197, 141, 194, P.box[5]);

    // Noodle heap: shaded dome, then a few deliberate strands
    const heap = (x, y) => inEllipse(x, y, 128, 212, 18, 9.5) && y <= 215;
    L.paint(109, 201, 147, 215, (x, y) =>
      heap(x, y) ? tone(P.noodle, bulge(x, y, 131, 209, 18, 9.5, [0.6, -0.6, 0.6], 0.2, 0.6), x, y) : null,
    );
    for (let s = 0; s < 26; s++) {
      let x = 113 + hash(s, 1) * 30;
      let y = 204 + hash(s, 2) * 9;
      let a = hash(s, 3) * Math.PI * 2;
      for (let k = 0; k < 7; k++) {
        a += (hash(s, k + 10) - 0.5) * 1.4;
        x += Math.cos(a);
        y += Math.sin(a) * 0.55;
        const rx = Math.round(x);
        const ry = Math.round(y);
        if (!heap(rx, ry)) break;
        L.set(rx, ry, P.noodle[ry < 208 ? 5 : 4]);
      }
    }
    // Toppings: spring onion, peanuts, chilli, sprouts, shrimp, lime
    [[118, 206], [125, 203], [134, 205], [140, 209], [122, 211], [131, 210]].forEach(([x, y]) => {
      L.set(x, y, P.onion[2]);
      L.set(x + 1, y, P.onion[1]);
      L.set(x, y + 1, P.onion[0]);
    });
    [[116, 210], [131, 204], [126, 209], [142, 211]].forEach(([x, y]) => L.set(x, y, "#d2b07a"));
    [[123, 207], [137, 207]].forEach(([x, y]) => L.set(x, y, "#c0412b"));
    L.line(113, 208, 116, 207, "#ece6d4");
    L.line(135, 211, 138, 212, "#ece6d4");
    L.paint(117, 199, 126, 206, (x, y) => {
      const d = Math.hypot(x - 121.5, y - 203.5);
      if (d < 2 || d > 4.2 || (y > 205 && x > 122)) return null;
      return tone(P.shrimp, y < 203 ? 0.85 : 0.45, x, y);
    });
    L.paint(137, 199, 147, 207, (x, y) => {
      if (!inEllipse(x, y, 142, 206, 5, 6) || y > 205) return null;
      return inEllipse(x, y, 142, 206.4, 3.8, 4.8) ? P.lime[2] : tone(P.lime, x < 142 ? 0.3 : 0.6, x, y);
    });

    // Box: lit front face and a narrower side face
    const front = [[109, 213], [138, 213], [134, 242], [114, 242]];
    const side = [[138, 213], [148, 211], [143, 239], [134, 242]];
    L.paint(108, 210, 149, 243, (x, y) => {
      const px = x + 0.5, py = y + 0.5;
      if (inPoly(px, py, front)) return y === 213 ? P.box[5] : mix(tone(P.box, y < 228 ? 0.82 : 0.7, x, y), WARM, 0.06);
      if (inPoly(px, py, side)) return tone(P.box, y < 226 ? 0.42 : 0.34, x, y);
      return null;
    });
    const tab = [[146, 211], [156, 207], [155, 214], [145, 217]];
    L.paint(144, 206, 157, 218, (x, y) => (inPoly(x + 0.5, y + 0.5, tab) ? tone(P.box, 0.55, x, y) : null));
    L.line(120, 222, 132, 222, P.box[3]);

    // Chopsticks
    [[133, 207, 157, 182], [137, 208, 161, 184]].forEach(([ax, ay, bx, by], i) => {
      L.line(ax, ay, bx, by, P.chop[i ? 1 : 2]);
      L.line(ax + 1, ay, bx + 1, by, P.chop[i ? 0 : 1]);
    });
    return L;
  },
};

// ---------- Headphones on a stand (AirPods Max-inspired, space grey) ----------
// Slim cups with the cushion facing inward, a thin curved band and a mesh
// canopy under it, joined by short steel arms. The canopy rests on the walnut
// top support of a slim stand; the cups hang either side of its stem.
const HP = { cx: 413, by: 173 };
const CUP = 32; // shell height (was 40): softly rectangular, not stretched

export const headphones = {
  id: "headphones",
  draw() {
    const L = new Layer();
    const { cx, by } = HP;
    const e = (x, y, rx, ry) => ((x - cx) / rx) ** 2 + ((y - by) / ry) ** 2;

    // Mesh canopy: a narrow band just under the headband's crown
    L.paint(cx - 26, by - 30, cx + 26, by - 8, (x, y) => {
      if (y > by - 9 || e(x, y, 25.5, 27.5) > 1 || e(x, y, 22, 22.5) < 1) return null;
      return tone(P.slate, (y & 1) === 0 ? 0.62 : 0.5, x, y, 0);
    });
    // Headband: thin and curved, lit along the top
    L.paint(cx - 29, by - 31, cx + 29, by + 1, (x, y) => {
      const o = e(x, y, 28, 30);
      if (o > 1 || e(x, y, 25.5, 27.5) <= 1 || y > by) return null;
      return tone(P.slate, o > 0.95 ? 0.62 : 0.42 - (x - cx) / 140, x, y, 0);
    });
    // Steel arms from the band into each cup
    [[cx - 27, cx - 26], [cx + 26, cx + 27]].forEach(([a, b]) => {
      for (let y = by; y <= by + 9; y++) {
        L.set(a, y, P.silver[a < cx ? 3 : 2]);
        L.set(b, y, P.silver[a < cx ? 1 : 0]);
      }
    });
    // Cups: a slim shell outside, a cushion facing inward
    const cup = (side) => {
      const shell = side < 0 ? [cx - 31, cx - 22] : [cx + 22, cx + 31];
      const cush = side < 0 ? [cx - 24, cx - 17] : [cx + 17, cx + 24];
      const dim = side < 0 ? 0 : -0.1; // the right cup is further from the light
      L.paint(cush[0], by + 9, cush[1], by + CUP + 8, (x, y) => {
        if (!inRoundRect(x, y, cush[0], by + 11, cush[1], by + CUP + 7, 3)) return null;
        const inner = side < 0 ? x === cush[1] : x === cush[0];
        return tone(P.slate, (inner ? 0.5 : 0.66) + dim, x, y, 0);
      });
      L.paint(shell[0], by + 8, shell[1], by + CUP + 10, (x, y) => {
        if (!inRoundRect(x, y, shell[0], by + 9, shell[1], by + CUP + 9, 4)) return null;
        const outer = side < 0 ? x <= shell[0] + 1 : x >= shell[1] - 1;
        let v = 0.36 + dim + (outer ? (side < 0 ? 0.2 : -0.06) : 0);
        if (y < by + 14) v += 0.08;
        if (y > by + CUP + 5) v -= 0.1;
        return tone(P.slate, v, x, y, 0);
      });
    };
    cup(-1);
    cup(1);
    // Digital crown on the right cup
    L.paint(cx + 28, by + 5, cx + 30, by + 8, (x, y) => tone(P.slate, y === by + 5 ? 0.7 : 0.5, x, y, 0));
    return L;
  },
};

// The stand: walnut base and top support, a slender dark stem.
const STAND_WOOD = ["#2a1d14", "#3b2a1d", "#503a28", "#664b34", "#7d5d41"];
const STAND = { top: HP.by - 22, base: 228 };

export const stand = {
  id: "stand",
  group: "headphones",
  draw() {
    const L = new Layer();
    const { cx } = HP;
    // Top support: a short curved saddle under the headband
    L.paint(cx - 8, STAND.top, cx + 8, STAND.top + 3, (x, y) => {
      const arch = Math.round(((x - cx) / 8) ** 2 * 2);
      if (y < STAND.top + arch || y > STAND.top + arch + 2) return null;
      return y === STAND.top + arch ? STAND_WOOD[4] : tone(STAND_WOOD, x < cx ? 0.7 : 0.45, x, y);
    });
    // Stem
    L.paint(cx - 1, STAND.top + 3, cx + 1, STAND.base - 4, (x) => (x === cx - 1 ? "#3a3d44" : x === cx ? "#25272c" : "#17181c"));
    // Base: a low rounded walnut block, lit top, darker front
    L.paint(cx - 13, STAND.base - 4, cx + 13, STAND.base, (x, y) => {
      if (!inRoundRect(x, y, cx - 13, STAND.base - 4, cx + 13, STAND.base, 2)) return null;
      if (y === STAND.base - 4) return STAND_WOOD[4];
      return tone(STAND_WOOD, (y < STAND.base - 2 ? 0.62 : 0.32) + (cx - x) / 80, x, y);
    });
    return L;
  },
};

// ---------- Tennis racket, hung straight on a wall hook ----------
const RK = { cx: 432, cy: 36, a: 26, b: 19.5 };
const RK_SHAFT = RK.cy + RK.a + 14; // where the throat beams meet

function racketPart(x, y) {
  const { cx, cy, a, b } = RK;
  const eo = ((x - cx) / b) ** 2 + ((y - cy) / a) ** 2;
  const ei = ((x - cx) / (b - 3)) ** 2 + ((y - cy) / (a - 3)) ** 2;
  if (eo <= 1 && ei > 1) return "frame";
  if (ei <= 1) return "strings";
  // Throat: two beams from the lower frame to the top of the shaft
  const jy = cy + 22;
  const jx = b * Math.sqrt(1 - (22 / a) ** 2) - 1.2;
  if (y > jy - 1 && y <= RK_SHAFT && (distToSeg(x, y, cx - jx, jy, cx - 1.5, RK_SHAFT) < 1.6 || distToSeg(x, y, cx + jx, jy, cx + 1.5, RK_SHAFT) < 1.6))
    return "throat";
  if (y > RK_SHAFT - 1 && y <= RK_SHAFT + 11 && Math.abs(x - cx) <= 2) return "shaft";
  if (y > RK_SHAFT + 11 && y <= RK_SHAFT + 44 && Math.abs(x - cx) <= 3) return "grip";
  if (y > RK_SHAFT + 44 && y <= RK_SHAFT + 47 && Math.abs(x - cx) <= 4) return "cap";
  return null;
}

export const RACKET_HOOK = [RK.cx, RK.cy + RK.a + 7];

// A tennis ball in a small walnut cup on the wall, beside the grip.
const TB = { cx: 446.5, cy: 102.5, r: 4.5 };
const BALL_GREEN = ["#4c561b", "#748326", "#9aaa34", "#bac852", "#d3dc80"];
const tennisCup = (x, y) => y >= TB.cy + 1 && ((x + 0.5 - TB.cx) / 6) ** 2 + ((y + 0.5 - TB.cy - 1.5) / 5) ** 2 <= 1;

function tennisBall(L) {
  const { cx, cy, r } = TB;
  L.paint(cx - 5, cy - 5, cx + 5, cy + 5, (x, y) => {
    const px = x + 0.5;
    const py = y + 0.5;
    if ((px - cx) ** 2 + (py - cy) ** 2 > r * r) return null;
    const seam = Math.abs(Math.hypot(px - (cx - 6.5), py - cy) - 5.2) < 0.55;
    if (seam) return "#d9dcc2";
    return tone(BALL_GREEN, bulge(px, py, cx, cy, r, r, [-0.5, -0.6, 0.6], 0.25, 0.75), x, y, 0.1);
  });
  // The cup sits in front of the ball's lower half
  L.paint(cx - 7, cy, cx + 7, cy + 7, (x, y) => {
    if (!tennisCup(x, y)) return null;
    return y === Math.ceil(TB.cy + 1) ? "#7d5d41" : tone(["#2a1d14", "#3b2a1d", "#503a28", "#664b34"], x < cx ? 0.75 : 0.45, x, y);
  });
}

export const racket = {
  id: "racket",
  draw() {
    const L = new Layer();
    const { cx, cy, a } = RK;
    L.paint(408, 6, 456, 130, (x, y) => {
      const part = racketPart(x, y);
      const side = (cx - x) / RK.b; // + on the side facing the monitor
      switch (part) {
        case "frame": {
          const low = y > cy + a * 0.5;
          const ramp = low ? P.rnavy : P.sky;
          return tone(ramp, 0.55 + side * 0.3 + (y < cy - a * 0.6 ? 0.1 : 0), x, y);
        }
        case "strings": {
          const main = (x - cx) % 4 === 0;
          const cross = (y - cy) % 4 === 0;
          if (main && cross) return "#b9bec6";
          if (main) return "#959ba4";
          if (cross) return "#6e747d";
          return null;
        }
        case "throat":
        case "shaft":
          return tone(P.rnavy, 0.6 + side * 0.4, x, y);
        case "grip": {
          const wrap = (y + (x - cx)) % 5 === 0;
          return tone(P.grip, (x < cx ? 0.82 : x === cx ? 0.66 : 0.46) - (wrap ? 0.3 : 0), x, y);
        }
        case "cap":
          return tone(P.rnavy, 0.5, x, y);
      }
      return null;
    });
    tennisBall(L);
    // Wall hook through the throat
    const [hx, hy] = RACKET_HOOK;
    L.paint(hx - 2, hy - 1, hx + 2, hy + 2, (x, y) => {
      if (Math.abs(x - hx) === 2 && (y === hy - 1 || y === hy + 2)) return null;
      return tone(P.silver, y === hy - 1 ? 0.95 : x < hx ? 0.6 : 0.3, x, y);
    });
    return L;
  },
  hit() {
    const L = new Layer();
    // Solid head and a filled throat, so the gaps still count as the racket.
    const jy = RK.cy + 22;
    L.paint(408, 6, 456, 130, (x, y) => {
      if (racketPart(x, y)) return "#fff";
      const t = (y - jy) / (RK_SHAFT - jy);
      return t >= 0 && t <= 1 && Math.abs(x - RK.cx) < 9.5 * (1 - t) + 1.5 ? "#fff" : null;
    });
    // The tennis ball and its cup
    L.paint(TB.cx - 7, TB.cy - 5, TB.cx + 7, TB.cy + 7, (x, y) =>
      (x + 0.5 - TB.cx) ** 2 + (y + 0.5 - TB.cy) ** 2 <= TB.r ** 2 || tennisCup(x, y) ? "#fff" : null,
    );
    return L;
  },
};

// ---------- FC Barcelona jersey in a frame, a soccer ball on a ledge ----------
// The jersey is designed on a 101x113 grid (FR) and drawn into a smaller frame
// (FRN): every pixel of the frame maps back to the design grid, so the shirt
// scales cleanly. The lettering and number are drawn at their real size.
const FR = { x0: 12, y0: 4, x1: 112, y1: 116 };
const JCX = 62;
const JK = 0.83; // the framed display is 17% smaller than the design grid
const FRN = { x0: 16, y0: 6, x1: 16 + Math.round((FR.x1 - FR.x0) * JK), y1: 6 + Math.round((FR.y1 - FR.y0) * JK) };
const toDesign = (x, y) => [FR.x0 + (x + 0.5 - FRN.x0) / JK, FR.y0 + (y + 0.5 - FRN.y0) / JK];
const JCXN = FRN.x0 + (JCX - FR.x0) * JK; // the shirt's centre line in the scene
const jerseyShape = [
  [JCX - 9, 12], [JCX - 22, 16], [JCX - 45, 31], [JCX - 39, 43], [JCX - 30, 37], [JCX - 31, 104],
  [JCX + 31, 104], [JCX + 30, 37], [JCX + 39, 43], [JCX + 45, 31], [JCX + 22, 16], [JCX + 9, 12],
  [JCX + 5, 14], [JCX, 15], [JCX - 5, 14],
];

// A chunky "2" for the number 22: 8x13 with three-pixel strokes.
const TWO = [
  ".######.",
  "########",
  "###..###",
  ".....###",
  ".....###",
  "....###.",
  "...###..",
  "..###...",
  ".###....",
  "###.....",
  "###.....",
  "########",
  "########",
];
const NUM = { x: Math.round(JCXN) - 9, y: 45 }; // two digits, 2px apart
const inNumber = (x, y) => {
  const r = y - NUM.y;
  if (r < 0 || r >= TWO.length) return false;
  const c = x - NUM.x;
  const d = c >= 10 ? c - 10 : c;
  return d >= 0 && d < 8 && (c < 8 || c >= 10) && TWO[r][d] === "#";
};

const folds = [
  // [ax, ay, bx, by, darkness], design grid
  [JCX - 29, 39, JCX - 14, 68, 0.2],
  [JCX + 29, 39, JCX + 15, 66, 0.2],
  [JCX - 19, 82, JCX - 17, 103, 0.14],
  [JCX + 21, 86, JCX + 19, 103, 0.14],
];

// A shallow walnut ledge under the frame, and a small ball resting on it.
const LEDGE = { x0: Math.round(JCXN) - 11, x1: Math.round(JCXN) + 11, y: FRN.y1 + 16 };
const SB = { cx: JCXN + 0.5, cy: LEDGE.y - 5.5, r: 5.5 };
const WALNUT = ["#2a1d14", "#3b2a1d", "#503a28", "#664b34", "#7d5d41"];

export const jerseyFrame = {
  id: "jersey",
  draw() {
    const L = new Layer();
    L.paint(FRN.x0, FRN.y0, FRN.x1, FRN.y1, (x, y) => {
      const edge = Math.min(x - FRN.x0, FRN.x1 - x, y - FRN.y0, FRN.y1 - y);
      if (edge === 0) return P.frame[2];
      if (edge === 1) return P.frame[1];
      if (edge === 2) return mix(P.frame[3], COOL, x > JCXN + 15 ? 0.15 : 0.05);
      return x > JCXN + 7 ? "#17181e" : "#131419";
    });
    L.paint(FRN.x0 + 3, FRN.y0 + 3, FRN.x1 - 3, FRN.y1 - 3, (x, y) => {
      const [dx, dy] = toDesign(x, y);
      if (!inPoly(dx, dy, jerseyShape)) return null;
      const right = x >= JCXN;
      let v = right ? 0.62 : 0.5; // the monitor is to the right
      for (const [ax, ay, bx, by, k] of folds) {
        const d = distToSeg(dx, dy, ax, ay, bx, by);
        if (d < 1.4) v -= k;
        else if (d < 2.8 && dx > (ax + bx) / 2) v += 0.1; // lit ridge beside each crease
      }
      const sleeve = Math.abs(dx - JCX) > 30;
      if (sleeve && distToSeg(dx, dy, JCX + Math.sign(dx - JCX) * 22, 16, JCX + Math.sign(dx - JCX) * 39, 43) < 4) v -= 0.12;
      const cuff = distToSeg(dx, dy, JCX - 45, 31, JCX - 39, 43) < 2.6 || distToSeg(dx, dy, JCX + 45, 31, JCX + 39, 43) < 2.6;
      if (cuff || (dy < 16.5 && Math.abs(dx - JCX) < 10)) return tone(P.navy, v + 0.1, x, y);
      if (inNumber(x, y)) return tone(P.gold, right ? 0.8 : 0.62, x, y);
      return tone(right ? P.blue : P.garnet, v, x, y);
    });
    // Deep gold edge around the number
    const ring = [];
    L.paint(NUM.x - 1, NUM.y - 1, NUM.x + 19, NUM.y + 14, (x, y) => {
      if (!inNumber(x, y) && (inNumber(x + 1, y) || inNumber(x - 1, y) || inNumber(x, y + 1) || inNumber(x, y - 1))) ring.push([x, y]);
      return null;
    });
    ring.forEach(([x, y]) => L.set(x, y, P.gold[0]));
    // Surname across the shoulders, gently arched like a printed nameset
    const name = "CHIVATXARANUKUL";
    const startX = Math.round(JCXN - (name.length * 4 - 1) / 2);
    [...name].forEach((ch, i) => {
      const k = (i - (name.length - 1) / 2) / ((name.length - 1) / 2);
      const lift = Math.round(k * k * 1.4);
      text(L, ch, startX + i * 4, 30 + lift, (x, y) => tone(P.gold, x >= JCXN ? 0.85 : 0.7, x, y));
    });
    // Catalan stripes at the back of the neck, brass plaque
    for (let d = 0; d < 5; d++) L.rect(Math.round(JCXN) - 2 + d, 18, 1, 2, d % 2 ? "#a02428" : "#d9b03a");
    L.rect(Math.round(JCXN) - 6, FRN.y1 - 7, 12, 2, "#9d8656");
    L.rect(Math.round(JCXN) - 6, FRN.y1 - 7, 12, 1, "#cdb684");
    // Glass: one clean diagonal glint
    L.paint(FRN.x0 + 3, FRN.y0 + 3, FRN.x1 - 3, FRN.y1 - 3, (x, y) => {
      const d = x - FRN.x0 - (y - FRN.y0) * 0.55;
      return d >= 57 && d < 59 ? mix(L.get(x, y), "#ffffff", 0.08) : null;
    });

    // Ledge: a lit top edge, the front face, and a small bracket below
    L.paint(LEDGE.x0, LEDGE.y, LEDGE.x1, LEDGE.y + 2, (x, y) =>
      y === LEDGE.y ? WALNUT[4] : tone(WALNUT, y === LEDGE.y + 1 ? 0.55 : 0.3, x, y),
    );
    L.rect(Math.round(JCXN) - 1, LEDGE.y + 3, 3, 2, WALNUT[1]);

    // Soccer ball: white with dark patches, lit from the monitor side
    const { cx, cy, r } = SB;
    const patches = [[cx, cy, 1.8], [cx - 4.2, cy - 2.4, 1.6], [cx + 4.2, cy - 2.2, 1.6], [cx - 3, cy + 4, 1.5], [cx + 3.2, cy + 4, 1.5]];
    L.paint(cx - 6, cy - 6, cx + 6, cy + 6, (x, y) => {
      const px = x + 0.5;
      const py = y + 0.5;
      if ((px - cx) ** 2 + (py - cy) ** 2 > r * r) return null;
      if (patches.some(([qx, qy, qr]) => (px - qx) ** 2 + (py - qy) ** 2 <= qr * qr)) return "#2a2b31";
      const v = bulge(px, py, cx, cy, r, r, [0.6, -0.6, 0.55], 0.25, 0.8);
      return tone(P.cream, v, x, y, 0.1);
    });
    return L;
  },
};

// ---------- Welcome card (a small tent card on the desk) ----------
export const card = {
  id: "card",
  draw() {
    const L = new Layer();
    const back = [[359, 229], [381, 229], [383.5, 232.5], [356.5, 232.5]];
    const front = [[357, 232], [383, 232], [384.5, 243.5], [355.5, 243.5]];
    L.paint(354, 228, 386, 244, (x, y) => {
      if (inPoly(x + 0.5, y + 0.5, front)) return y === 232 ? P.paper[3] : mix(tone(P.paper, y < 238 ? 0.9 : 0.78, x, y), WARM, 0.08);
      if (inPoly(x + 0.5, y + 0.5, back)) return tone(P.paper, 0.4, x, y);
      return null;
    });
    text(L, "HI!", 364, 235, "#3a352e");
    L.rect(363, 241, 15, 1, "#c58a43");
    return L;
  },
};

// ---------- Window and curtain (decoration only: no outline, label or hit area) ----------
// A narrow window at the far left of the room with a light linen curtain, and
// the soft patch of early-evening light it throws on the wall. Drawn on its own
// tall layer (scene y from the plate's top down to the desk); the page pins it
// to the left edge of whatever is visible, so it crops naturally.
const WIN = { top: -260, bottom: 149, w: 112 };
const WIN_H = WIN.bottom - WIN.top + 1;
const SKY = [
  [-70, "#9c9fb2"], // muted dusk blue
  [10, "#ada6b3"],
  [70, "#c2aca7"],
  [110, "#d2b49e"], // pale peach near the horizon
  [Infinity, "#d8bb9b"],
];
const LINEN = ["#a99b85", "#bcae98", "#cdc0aa", "#d9cdb8"];
const SASH = ["#9f917b", "#b6a891", "#cbbea8"];

export const windowDecor = {
  id: "window",
  origin: { x: 0, y: WIN.top },
  draw() {
    const L = new Layer(WIN.w, WIN_H);
    const sy = (ly) => ly + WIN.top; // scene y
    // City silhouette: a few low blocks, no detail
    const roof = (x) => 96 + Math.round(hash(Math.floor(x / 5), 7) * 22) - (x > 12 && x < 18 ? 14 : 0);
    L.paint(0, 0, WIN.w - 1, WIN_H - 1, (x, ly) => {
      const y = sy(ly);
      // Wall light patch: one quiet band of warm light to the right of the window
      const px = 46 + (y + 60) * 0.3;
      if (x >= 46 && y > -60 && x >= px && x < px + 30) return [236, 214, 170, 26];
      if (x > 30) return null;
      // Frame: painted wood, lit on the inner left edges
      if (x <= 2 || x >= 28 || y === 30 || y === 31) {
        if (y === 30 || y === 31) return SASH[y === 30 ? 2 : 0];
        return x === 1 || x === 28 ? SASH[2] : x === 2 ? SASH[0] : SASH[1];
      }
      // Glass: dusk sky, then the low city silhouette
      if (y >= roof(x)) return y > 128 ? "#5c5363" : "#6a6070";
      return SKY.find(([limit]) => y < limit)[1];
    });
    // Curtain: gathered linen hanging over the window's right side, folds lit
    // from the window (left)
    L.paint(22, 0, 44, WIN_H - 1, (x, ly) => {
      const y = sy(ly);
      const sway = Math.round(Math.sin((y + 40) / 37) * 1.2);
      const lx = x - 22 - sway;
      if (lx < 0 || lx > 20) return null;
      // Soft, uneven folds: a slow wave across the width whose spacing drifts
      // down the drop, brighter on the side facing the window.
      const phase = (lx + Math.sin(y / 53) * 1.5) / (5 + Math.sin(lx * 1.7) * 0.8);
      const fold = 0.5 + 0.5 * Math.cos(phase * Math.PI * 2);
      const v = fold * 0.7 + (20 - lx) / 60;
      return LINEN[Math.max(0, Math.min(3, Math.floor(v * 4)))];
    });
    return L;
  },
};

// Back to front.
export const ALL = [jerseyFrame, racket, monitor, stand, headphones, pokemon, padthai, keyboard, mouse, card];
export const DECOR = [windowDecor];
