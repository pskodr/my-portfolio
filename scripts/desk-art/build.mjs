// Builds the desk scene in layers, so the page can lay it out to fill any
// window: a wide background plate (wall and desk surface, extending well past
// the objects), a desk-front strip placed separately, and one PNG per
// interactive object with its hover outline, its own shadow and a hit mask.
//
//   node scripts/desk-art/build.mjs [--preview <dir>]
//
// Everything is original artwork drawn here in code; no external assets.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePNG } from "./png.mjs";
import { H, Layer, W, bayer, clamp, hash, mix, steps, tone } from "./lib.mjs";
import { ALL, DECOR, SCREEN } from "./objects.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = join(root, "public", "desk");
const dataFile = join(root, "src", "components", "desk", "sprites.generated.ts");
const OUTLINE = "#f5d76e";
const OUTLINE_EDGE = [36, 28, 20, 230]; // dark supporting ring outside the yellow

// A warm bedroom workspace: mushroom/taupe walls, a honey-toned wooden desk,
// a dark felt mat. Kept low in saturation so the objects stay the focus.
const WALL = ["#3d312a", "#4a3c33", "#57473d", "#645347", "#715e51", "#7e6a5b", "#8a7565"];
const WOOD = ["#40291b", "#4f3221", "#5f3d27", "#6f482e", "#7f5436", "#8e603e", "#9c6d48", "#a87a53"];
const FELT = ["#16171a", "#1b1c20", "#212226", "#28292e", "#303137"];
const FLOOR = "#241b15";
const COOL = "#c8b78e"; // the monitor's warm-ivory spill
const AMBER = "#e9a35e";
const DAYLIGHT = "#e2c48f"; // early-evening light from the window: soft, neutral gold

const DESK_TOP = 150;
const FRONT_H = 14; // the desk's front edge, placed by the page under the front objects

// The plate covers far more than the objects, in scene coordinates, so the
// wall and desk reach the edges of any window. All light is radial around the
// monitor and settles to flat bands away from it, so no edge or seam shows
// wherever the window crops the plate.
const PLATE = { x: -400, y: -260, w: 1280, h: 620 };

const g = (x, y, cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));

// Quantise a light amount into n flat bands. Only a short stretch between
// bands is dithered (ordered, 4x4), so light reads as calm pixel clusters
// rather than rings, patches or blur.
function band(v, n, x, y) {
  const t = clamp(v) * n;
  let i = Math.floor(t);
  const f = t - i;
  if (f > 0.6) i += 1;
  else if (f > 0.4 && (f - 0.4) / 0.2 > bayer(x, y)) i += 1;
  return i / n;
}

// Wall panels: faint vertical seams, spaced from the monitor's centre.
const SEAM = 96;
const seamAt = (x) => (((x - 240 - SEAM / 2) % SEAM) + SEAM) % SEAM;

// One soft wash of daylight from the window at the left, over wall and desk.
const dayWall = (x, y) => band(g(x, y, -170, 40, 360, 260), 3, x, y);
const dayDesk = (x, y) => band(g(x, y, -170, 200, 360, 130), 3, x, y);
// The monitor: a modest glow on the wall behind it, warm light from the light
// bar rising a little up the wall, and its light on the desk just in front.
const monitorWall = (x, y) => band(g(x, y, 240, 82, 160, 100), 3, x, y);
const lightBar = (x, y) => band(g(x, y, 240, 11, 92, 12), 2, x, y);
const monitorDesk = (x, y) => band(g(x, y, 240, 170, 150, 24), 2, x, y);

const sprites = ALL.map((o) => {
  const layer = o.draw();
  const hit = o.hit ? o.hit() : layer;
  if (!o.noSelout) layer.selout(hit);
  return { id: o.id, group: o.group ?? o.id, layer, hit };
});
// Decoration: drawn like the objects, but with no outline, hit mask or group,
// so it can never be hovered, focused or clicked. A decoration with an
// `origin` is drawn on its own layer whose top-left sits at that scene point.
const decorations = DECOR.map((o) => {
  const layer = o.draw();
  if (!o.origin) layer.selout();
  return { id: o.id, layer, hit: layer, origin: o.origin ?? { x: 0, y: 0 } };
});

// Distance from a point to the monitor bezel (0 inside).
const bezelDist = (x, y) => Math.hypot(Math.max(126 - x, 0, x - 353), Math.max(21 - y, 0, y - 149));

// Contact shadows of the computer, which never moves: baked into the plate.
const deskShadows = [
  [240, 175, 42, 5],
  [239, 216, 66, 3.5],
  [330, 215, 9, 2.5],
];

// Everything else carries its own shadow, so it can move with the layout.
// Desk objects: contact ellipses [cx, cy, rx, ry]. Wall objects: a short offset
// copy of their silhouette, cast away from the monitor.
const SHADOW = [6, 5, 4];
const objectShadows = {
  pokemon: { contact: [[62, 220, 26, 3], [91, 226, 10, 2.2]] },
  padthai: { contact: [[128, 242, 19, 3]] },
  stand: { contact: [[412, 228, 16, 2.2]] },
  card: { contact: [[370, 244, 15, 1.6]] },
  jersey: { offset: [-3, 3] },
  racket: { offset: [3, 3] },
};

function shadowLayer(s) {
  const spec = objectShadows[s.id];
  if (!spec) return null;
  const L = new Layer();
  L.paint(0, 0, W - 1, H - 1, (x, y) => {
    if (s.hit.has(x, y)) return null;
    let a = 0;
    if (spec.offset && s.hit.has(x - spec.offset[0], y - spec.offset[1])) a = 0.34;
    for (const [cx, cy, rx, ry] of spec.contact ?? []) a = Math.max(a, steps(g(x, y, cx, cy, rx, ry), 2) * 0.5);
    return a ? [...SHADOW, Math.round(a * 255)] : null;
  });
  return L;
}

function background() {
  const L = new Layer(PLATE.w, PLATE.h);
  L.paint(0, 0, PLATE.w - 1, PLATE.h - 1, (px, py) => {
    const x = px + PLATE.x;
    const y = py + PLATE.y;
    if (y < DESK_TOP) {
      // Wall: taupe, brighter toward the window, a modest glow behind the
      // monitor, the light bar's warm light rising above it, and a halo
      // hugging the bezel. Panel seams catch the light faintly: a dark line
      // with a lit edge beside it. A soft shadow where the wall meets the desk.
      const day = dayWall(x, y);
      const glow = monitorWall(x, y);
      const bar = lightBar(x, y);
      const halo = steps(clamp(1 - bezelDist(x, y) / 8), 1);
      let v = 0.38 + day * 0.22 + glow * 0.1 + bar * 0.06 + halo * 0.04;
      const seam = seamAt(x);
      if (seam === 0) v -= 0.12;
      else if (seam === 1) v += 0.05;
      if (y >= DESK_TOP - 3) v -= 0.12;
      let c = tone(WALL, v, x, y, 0.1);
      if (day) c = mix(c, DAYLIGHT, day * 0.14);
      if (bar) c = mix(c, AMBER, bar * 0.1);
      if (halo) c = mix(c, COOL, halo * 0.08);
      return c;
    }
    {
      // Desk: honey wood, daylight from the left and the monitor's light in
      // front of it. Matte: no reflections.
      const day = dayDesk(x, y);
      const lit = monitorDesk(x, y);
      let v = 0.42 + day * 0.18 + lit * 0.1;
      if (y < DESK_TOP + 2) v -= 0.14;
      // Long, sparse grain streaks rather than per-pixel noise
      const row = Math.floor((y - DESK_TOP) / 3);
      const grain = [0, 1, 2].some((k) => {
        const start = PLATE.x + hash(row, 1 + k * 7) * PLATE.w;
        return hash(row, 2 + k * 7) > 0.45 && Math.abs(x - start) < 30 + hash(row, 3 + k * 7) * 40;
      });
      if ((y - DESK_TOP) % 3 === 1 && grain) v -= 0.1;
      let shadow = 0;
      for (const [cx, cy, rx, ry] of deskShadows) shadow = Math.max(shadow, g(x, y, cx, cy, rx, ry));
      v -= steps(shadow, 2) * 0.24;
      // Desk mat
      const t = (y - 184) / 46;
      const mx0 = 162 - t * 8;
      const mx1 = 352 + t * 8;
      if (y >= 184 && y <= 230 && x >= mx0 && x <= mx1) {
        const rim = y === 184 || y === 230 || x < mx0 + 1 || x > mx1 - 1;
        let c = tone(FELT, v - 0.04 + (rim ? 0.14 : 0), x, y, 0.1);
        if (lit) c = mix(c, COOL, lit * 0.08);
        return c;
      }
      let c = tone(WOOD, v, x, y, 0.12);
      if (day) c = mix(c, DAYLIGHT, day * 0.08);
      if (lit) c = mix(c, COOL, lit * 0.08);
      return c;
    }
  });
  return L;
}

// The desk's front edge: a lit lip, then the dark front face. The floor below
// it is a flat colour drawn by the page.
function deskFront() {
  const L = new Layer(PLATE.w, FRONT_H);
  L.paint(0, 0, PLATE.w - 1, FRONT_H - 1, (px, y) => {
    const x = px + PLATE.x;
    const lit = steps(g(x, 0, 240, 0, 170, 12), 2);
    const v = y === 0 ? 0.7 + lit * 0.2 : y < 3 ? 0.42 + lit * 0.1 : 0.22;
    return tone(WOOD, v, x, y, 0.1);
  });
  return L;
}

function maskString(hit, box) {
  // Bit-packed rows, base64: 1 = part of the object.
  const bytes = new Uint8Array(Math.ceil((box.w * box.h) / 8));
  for (let y = 0; y < box.h; y++)
    for (let x = 0; x < box.w; x++) {
      const i = y * box.w + x;
      if (hit.has(box.x + x, box.y + y)) bytes[i >> 3] |= 1 << (i & 7);
    }
  return Buffer.from(bytes).toString("base64");
}

mkdirSync(outDir, { recursive: true });
const bg = background();
writeFileSync(join(outDir, "desk-bg.png"), encodePNG(PLATE.w, PLATE.h, bg.data));
const front = deskFront();
writeFileSync(join(outDir, "desk-front.png"), encodePNG(PLATE.w, FRONT_H, front.data));

const shadows = Object.fromEntries([...sprites, ...decorations.filter((d) => !d.origin.x && !d.origin.y)].map((s) => [s.id, shadowLayer(s)]));
const entries = [];
const full = new Layer();
full.composite(bg.crop({ x: -PLATE.x, y: -PLATE.y, w: W, h: H }));
full.composite(front.crop({ x: -PLATE.x, y: 0, w: W, h: FRONT_H }), 0, 244);
for (let y = 244 + FRONT_H; y < H; y++) for (let x = 0; x < W; x++) full.set(x, y, FLOOR);
// Preview only: shadows blended over the plate.
for (const sh of Object.values(shadows)) {
  if (!sh) continue;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const c = sh.get(x, y);
      if (c) full.set(x, y, mix(full.get(x, y), c, c[3] / 255));
    }
}
const decor = [];
for (const d of decorations) {
  const box = d.layer.bbox();
  writeFileSync(join(outDir, `${d.id}.png`), encodePNG(box.w, box.h, d.layer.crop(box).data));
  full.composite(d.layer, d.origin.x, d.origin.y);
  const sh = d.origin.x || d.origin.y ? null : shadows[d.id];
  const b = sh?.bbox();
  if (sh) writeFileSync(join(outDir, `${d.id}-shadow.png`), encodePNG(b.w, b.h, sh.crop(b).data));
  decor.push({ id: d.id, x: box.x + d.origin.x, y: box.y + d.origin.y, w: box.w, h: box.h, shadow: b ?? null });
}
for (const s of sprites) {
  const box = s.layer.bbox();
  const hitBox = s.hit.bbox();
  const u = { x: Math.min(box.x, hitBox.x), y: Math.min(box.y, hitBox.y) };
  u.w = Math.max(box.x + box.w, hitBox.x + hitBox.w) - u.x;
  u.h = Math.max(box.y + box.h, hitBox.y + hitBox.h) - u.y;
  const sprite = s.layer.crop(u);
  // The yellow ring, then a dark ring outside it, so the highlight reads on
  // light wall and wood as well as dark objects.
  const ring = s.hit.outline(OUTLINE);
  const solid = new Layer();
  solid.composite(s.hit);
  solid.composite(ring);
  const both = solid.outline(OUTLINE_EDGE);
  both.composite(ring);
  const outline = both.crop({ x: u.x - 2, y: u.y - 2, w: u.w + 4, h: u.h + 4 });
  writeFileSync(join(outDir, `${s.id}.png`), encodePNG(sprite.w, sprite.h, sprite.data));
  writeFileSync(join(outDir, `${s.id}-outline.png`), encodePNG(outline.w, outline.h, outline.data));
  full.composite(s.layer);
  let shadow = null;
  const sh = shadows[s.id];
  if (sh) {
    const b = sh.bbox();
    writeFileSync(join(outDir, `${s.id}-shadow.png`), encodePNG(b.w, b.h, sh.crop(b).data));
    shadow = b;
  }
  entries.push({ id: s.id, group: s.group, ...u, shadow, mask: maskString(s.hit, u) });
}

const ts = `// Generated by scripts/desk-art/build.mjs. Do not edit by hand.
// Positions are in scene pixels (${W}x${H}); masks are bit-packed rows, base64.

export const SCENE = { width: ${W}, height: ${H} } as const;

// The background plate, in scene pixels, and the height of the desk-front strip.
export const PLATE = ${JSON.stringify(PLATE)} as const;
export const FRONT_H = ${FRONT_H};
export const FLOOR = ${JSON.stringify(FLOOR)};

// The monitor's glass, where the HTML intro is laid over the artwork.
export const SCREEN = ${JSON.stringify(SCREEN)} as const;

export type SpriteId = ${entries.map((e) => JSON.stringify(e.id)).join(" | ")};
export type GroupId = ${[...new Set(entries.map((e) => JSON.stringify(e.group)))].join(" | ")};

type Box = { x: number; y: number; w: number; h: number };
export type Sprite = Box & { id: SpriteId; group: GroupId; shadow: Box | null; mask: string };

// Back to front.
export const sprites: Sprite[] = ${JSON.stringify(entries, null, 2)};

// Decoration only, drawn behind the objects: never outlined, hit-tested or focusable.
export type Decor = Box & { id: ${decor.map((d) => JSON.stringify(d.id)).join(" | ")}; shadow: Box | null };
export const decor: Decor[] = ${JSON.stringify(decor, null, 2)};
`;
mkdirSync(dirname(dataFile), { recursive: true });
writeFileSync(dataFile, ts);

const previewArg = process.argv.indexOf("--preview");
if (previewArg > -1) {
  const dir = process.argv[previewArg + 1];
  mkdirSync(dir, { recursive: true });
  const big = full.scaled(3);
  writeFileSync(join(dir, "desk-preview.png"), encodePNG(big.w, big.h, big.data));
  const lit = new Layer();
  lit.composite(full);
  for (const s of sprites) lit.composite(s.hit.outline(OUTLINE));
  const big2 = lit.scaled(2);
  writeFileSync(join(dir, "desk-outlines.png"), encodePNG(big2.w, big2.h, big2.data));
}
console.log(`desk art: ${entries.length} objects -> public/desk`);
