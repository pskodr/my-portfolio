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
  screen: ["#0a0f1b", "#0c1322", "#0f172a", "#121c32", "#16223b"],
  amber: ["#6b3f17", "#a3652a", "#d8954a", "#f6be78", "#ffdcaa"],
  pika: ["#5a3f0f", "#86621a", "#b28824", "#d6a92f", "#ecc443", "#f6d866", "#fbe79a"],
  pikaInk: ["#121216", "#24242a"],
  cheek: ["#7a2218", "#a8301f", "#cd432c", "#e4613f"],
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

const COOL = "#9db7e8"; // monitor light
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
      if (y <= y0 + 7) return y === y0 + 7 ? "#22304b" : "#141c2f";
      const cx = (x - (x0 + x1) / 2) / ((x1 - x0) / 2);
      const cy = (y - (y0 + y1) / 2) / ((y1 - y0) / 2);
      return tone(P.screen, 0.9 - 0.55 * (cx * cx * 0.5 + cy * cy * 0.7), x, y, 0.08);
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

// ---------- Pikachu ----------
// Sprite-style: flat yellow with a few deliberate gold/brown clusters and a
// dark outline, sitting on the desk. Light comes from the monitor (right).
const PK = {
  line: "#2b1906",
  brown: "#8a5317",
  deep: "#c8851a",
  gold: "#e3a92a",
  base: "#f6cf3a",
  light: "#fbe47e",
  ink: "#19191e",
  inkHi: "#3d3d46",
  red: "#d8352a",
  redDk: "#9f2018",
  mouth: "#4a1a08",
  tongue: "#e9776a",
};
const PKL = [0.55, -0.65, 0.55];

// Flat bands from a bulge value: highlight, base, gold, deep gold.
const pkBand = (v) => (v > 0.86 ? PK.light : v > 0.5 ? PK.base : v > 0.3 ? PK.gold : PK.deep);

export const pikachu = {
  id: "pikachu",
  noSelout: true,
  draw() {
    const L = new Layer();
    const cx = 64;
    const head = (x, y) => inEllipse(x, y, cx, 186, 17, 13.5);
    const body = (x, y) => inEllipse(x, y, cx, 210, 16, 14) && y <= 223;

    // Lightning tail behind the right shoulder; brown where it meets the body
    const tail = [[77, 214], [84, 207], [80, 203], [91, 195], [87, 191], [99, 180], [104, 184], [95, 192], [99, 196], [88, 204], [92, 208], [80, 219]];
    L.paint(76, 179, 105, 220, (x, y) => {
      if (!inPoly(x + 0.5, y + 0.5, tail)) return null;
      if (y >= 205) return PK.brown;
      return inPoly(x + 0.5, y - 1.5, tail) ? (x > 93 ? PK.base : PK.gold) : PK.light;
    });

    // Ears: tapered, black tips, shaded on the side away from the monitor
    const ear = (bx, by, tx, ty) => {
      for (let t = 0; t <= 1; t += 0.01) {
        const ex = bx + (tx - bx) * t;
        const ey = by + (ty - by) * t;
        const r = 4.6 * Math.pow(1 - t, 0.55) + 0.6;
        L.paint(ex - r - 1, ey - r - 1, ex + r + 1, ey + r + 1, (x, y) => {
          if ((x - ex) ** 2 + (y - ey) ** 2 > r * r) return null;
          const lit = x >= ex;
          if (t > 0.62) return lit ? PK.inkHi : PK.ink;
          return lit ? PK.base : PK.gold;
        });
      }
    };
    ear(54, 178, 41, 149);
    ear(74, 178, 88, 151);

    // Body, then head on top
    L.paint(cx - 17, 195, cx + 17, 223, (x, y) => {
      if (!body(x, y)) return null;
      if (inEllipse(x, y - 2, cx, 186, 17, 13.5)) return PK.gold; // shadow under the head
      return pkBand(bulge(x, y, cx + 2, 208, 16, 14, PKL, 0.3, 0.75));
    });
    L.paint(cx - 18, 172, cx + 18, 200, (x, y) =>
      head(x, y) ? pkBand(bulge(x, y, cx + 2, 184, 17, 13.5, PKL, 0.3, 0.8)) : null,
    );
    // Seam where the head meets the shoulders
    L.paint(cx - 17, 196, cx + 17, 202, (x, y) => {
      const d = Math.abs(x - cx);
      return d > 8 && body(x, y) && !head(x, y) && head(x, y - 1) ? PK.brown : null;
    });

    // Paws resting on the belly
    // Arms: short nubs that reach past the body's sides, so the outline
    // defines them; a brown contour where they overlap the body
    [[48, 207, -1], [80, 207, 1]].forEach(([ax, ay, s]) => {
      const arm = (x, y) => inEllipse(x, y, ax, ay, 4.6, 3.2);
      L.paint(ax - 6, ay - 4, ax + 6, ay + 4, (x, y) => {
        if (!arm(x, y)) return null;
        const inner = s < 0 ? !arm(x + 1, y) : !arm(x - 1, y);
        if (inner || !arm(x, y + 1)) return PK.brown;
        return y < ay ? (s > 0 ? PK.light : PK.base) : s > 0 ? PK.base : PK.gold;
      });
    });
    // Feet
    [[55, 224], [73, 224]].forEach(([fx, fy]) =>
      L.paint(fx - 7, fy - 3, fx + 7, fy + 3, (x, y) => {
        if (!inEllipse(x, y, fx, fy, 6, 2.6)) return null;
        return y < fy - 1 ? PK.brown : x > fx ? PK.base : PK.gold;
      }),
    );

    // Face
    const EYE = [".EE.", "EWEE", "EEEE", ".EE."];
    [[54, 181], [69, 181]].forEach(([ex, ey]) =>
      EYE.forEach((row, j) => [...row].forEach((c, i) => c !== "." && L.set(ex + i, ey + j, c === "W" ? "#ffffff" : PK.ink))),
    );
    [[48, 191], [80, 191]].forEach(([chx, chy]) =>
      L.paint(chx - 4, chy - 3, chx + 4, chy + 3, (x, y) =>
        inEllipse(x, y, chx, chy, 3.6, 2.8) ? (y > chy + 1 ? PK.redDk : PK.red) : null,
      ),
    );
    L.set(63, 187, PK.ink);
    [[61, 190], [66, 190], [62, 191], [65, 191], [63, 192], [64, 192]].forEach(([x, y]) => L.set(x, y, PK.mouth));
    L.set(63, 191, PK.tongue);
    L.set(64, 191, PK.tongue);

    // Dark outline around the whole silhouette
    L.composite(L.outline(PK.line));
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

// ---------- Headphones (AirPods Max-inspired, space grey, front view) ----------
// Slim, tall cups with the cushion facing inward, a thin curved band and a
// mesh canopy under it, joined by short steel arms.
const HP = { cx: 413, by: 178 };

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
      L.paint(cush[0], by + 9, cush[1], by + 48, (x, y) => {
        if (!inRoundRect(x, y, cush[0], by + 11, cush[1], by + 46, 3)) return null;
        const inner = side < 0 ? x === cush[1] : x === cush[0];
        return tone(P.slate, (inner ? 0.5 : 0.66) + dim, x, y, 0);
      });
      L.paint(shell[0], by + 8, shell[1], by + 50, (x, y) => {
        if (!inRoundRect(x, y, shell[0], by + 9, shell[1], by + 49, 4)) return null;
        const outer = side < 0 ? x <= shell[0] + 1 : x >= shell[1] - 1;
        let v = 0.36 + dim + (outer ? (side < 0 ? 0.2 : -0.06) : 0);
        if (y < by + 14) v += 0.08;
        if (y > by + 45) v -= 0.1;
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
    return L;
  },
};

// ---------- FC Barcelona jersey in a frame ----------
const FR = { x0: 12, y0: 4, x1: 112, y1: 116 };
const JCX = 62;
const jerseyShape = [
  [JCX - 9, 12], [JCX - 22, 16], [JCX - 45, 31], [JCX - 39, 43], [JCX - 30, 37], [JCX - 31, 104],
  [JCX + 31, 104], [JCX + 30, 37], [JCX + 39, 43], [JCX + 45, 31], [JCX + 22, 16], [JCX + 9, 12],
  [JCX + 5, 14], [JCX, 15], [JCX - 5, 14],
];

// One continuous numeral: two overlapping lobes with a single opening each.
function eight(x, y) {
  const top = ((x - JCX) / 7.5) ** 2 + ((y - 60) / 8) ** 2 <= 1;
  const bot = ((x - JCX) / 8.5) ** 2 + ((y - 75) / 8.5) ** 2 <= 1;
  const holeT = ((x - JCX) / 3) ** 2 + ((y - 59.5) / 3.2) ** 2 <= 1;
  const holeB = ((x - JCX) / 3.5) ** 2 + ((y - 75.5) / 3.8) ** 2 <= 1;
  return (top || bot) && !holeT && !holeB;
}

const folds = [
  // [ax, ay, bx, by, darkness]
  [JCX - 29, 39, JCX - 14, 68, 0.2],
  [JCX + 29, 39, JCX + 15, 66, 0.2],
  [JCX - 19, 82, JCX - 17, 103, 0.14],
  [JCX + 21, 86, JCX + 19, 103, 0.14],
];

export const jerseyFrame = {
  id: "jersey",
  draw() {
    const L = new Layer();
    L.paint(FR.x0, FR.y0, FR.x1, FR.y1, (x, y) => {
      const edge = Math.min(x - FR.x0, FR.x1 - x, y - FR.y0, FR.y1 - y);
      if (edge === 0) return P.frame[2];
      if (edge === 1) return P.frame[1];
      if (edge === 2) return mix(P.frame[3], COOL, x > 80 ? 0.15 : 0.05);
      return x > 70 ? "#17181e" : "#131419";
    });
    L.paint(FR.x0 + 3, FR.y0 + 3, FR.x1 - 3, FR.y1 - 3, (x, y) => {
      if (!inPoly(x + 0.5, y + 0.5, jerseyShape)) return null;
      const right = x >= JCX;
      let v = right ? 0.62 : 0.5; // the monitor is to the right
      for (const [ax, ay, bx, by, k] of folds) {
        const d = distToSeg(x, y, ax, ay, bx, by);
        if (d < 1.3) v -= k;
        else if (d < 2.6 && x > (ax + bx) / 2) v += 0.1; // lit ridge beside each crease
      }
      // underside of the sleeves
      const sleeve = Math.abs(x - JCX) > 30;
      if (sleeve && distToSeg(x, y, JCX + Math.sign(x - JCX) * 22, 16, JCX + Math.sign(x - JCX) * 39, 43) < 4) v -= 0.12;
      const cuff =
        distToSeg(x, y, JCX - 45, 31, JCX - 39, 43) < 2.4 || distToSeg(x, y, JCX + 45, 31, JCX + 39, 43) < 2.4;
      if (cuff || (y < 16 && Math.abs(x - JCX) < 10)) return tone(P.navy, v + 0.1, x, y);
      if (eight(x, y)) return tone(P.gold, right ? 0.8 : 0.62, x, y);
      return tone(right ? P.blue : P.garnet, v, x, y);
    });
    // Deep gold outline around the 8
    const ring = [];
    L.paint(JCX - 10, 50, JCX + 10, 85, (x, y) => {
      if (!eight(x, y) && (eight(x + 1, y) || eight(x - 1, y) || eight(x, y + 1) || eight(x, y - 1))) ring.push([x, y]);
      return null;
    });
    ring.forEach(([x, y]) => L.set(x, y, P.gold[0]));
    // Surname, gently arched like a printed nameset
    const name = "CHIVATXARANUKUL";
    const startX = JCX - (name.length * 4 - 1) / 2;
    [...name].forEach((ch, i) => {
      const k = (i - (name.length - 1) / 2) / ((name.length - 1) / 2);
      const lift = Math.round(k * k * 2);
      text(L, ch, Math.round(startX + i * 4), 40 + lift, (x, y) => tone(P.gold, x >= JCX ? 0.85 : 0.7, x, y));
    });
    // Catalan stripes at the back of the neck, brass plaque
    for (let d = 0; d < 5; d++) L.rect(JCX - 2 + d, 17, 1, 3, d % 2 ? "#a02428" : "#d9b03a");
    L.rect(JCX - 7, 108, 14, 3, "#9d8656");
    L.rect(JCX - 7, 108, 14, 1, "#cdb684");
    // Glass: one clean diagonal glint
    L.paint(FR.x0 + 3, FR.y0 + 3, FR.x1 - 3, FR.y1 - 3, (x, y) => {
      const d = x - FR.x0 - (y - FR.y0) * 0.55;
      return d >= 68 && d < 70 ? mix(L.get(x, y), "#ffffff", 0.08) : null;
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

// Back to front.
export const ALL = [jerseyFrame, racket, monitor, headphones, pikachu, padthai, keyboard, mouse, card];
