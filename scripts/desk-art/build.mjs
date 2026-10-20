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
import { H, Layer, W, clamp, hash, mix, steps, tone } from "./lib.mjs";
import { ALL, SCREEN } from "./objects.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = join(root, "public", "desk");
const dataFile = join(root, "src", "components", "desk", "sprites.generated.ts");
const OUTLINE = "#f5d76e";

const WALL = ["#0e0f13", "#121318", "#16181e", "#1b1d24", "#21242c", "#282b35", "#30343f"];
const WOOD = ["#140e0b", "#1b1410", "#241a14", "#2f2219", "#3b2b1f", "#4a3626", "#5b432f", "#6e5239"];
const FELT = ["#121316", "#16171b", "#1b1c21", "#212328", "#282a30"];
const FLOOR = "#0b0c0f";
const COOL = "#c8b78e"; // the monitor's warm-ivory spill
const AMBER = "#e9a35e";

const DESK_TOP = 150;
const FRONT_H = 14; // the desk's front edge, placed by the page under the front objects

// The plate covers far more than the objects, in scene coordinates, so the
// wall and desk reach the edges of any window. All light is radial around the
// monitor and settles to flat bands away from it, so no edge or seam shows
// wherever the window crops the plate.
const PLATE = { x: -400, y: -260, w: 1280, h: 620 };

const g = (x, y, cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));

const sprites = ALL.map((o) => {
  const layer = o.draw();
  const hit = o.hit ? o.hit() : layer;
  if (!o.noSelout) layer.selout(hit);
  return { id: o.id, group: o.group ?? o.id, layer, hit };
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
  pikachu: { contact: [[66, 227, 24, 3]] },
  padthai: { contact: [[128, 242, 19, 3]] },
  headphones: { contact: [[390, 228, 7, 2], [436, 228, 7, 2]] },
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
      // Wall: a broad glow behind the monitor, a little amber spill above the
      // light bar, and a cool halo hugging the bezel so the monitor separates.
      let v = 0.11 + 0.5 * steps(g(x, y, 240, 90, 190, 125), 6);
      const halo = steps(clamp(1 - bezelDist(x, y) / 8), 1);
      const spill = steps(g(x, y, 240, 8, 80, 9), 2);
      v += halo * 0.05 + spill * 0.06;
      if (y >= DESK_TOP - 2) v -= 0.1;
      let c = tone(WALL, v, x, y, 0.1);
      if (halo) c = mix(c, COOL, halo * 0.1);
      if (spill) c = mix(c, AMBER, spill * 0.12);
      return c;
    }
    {
      const warm = steps(g(x, y, 240, 194, 175, 40) * 1.15, 4);
      const cool = steps(g(x, y, 240, 158, 110, 18) * 1.1, 3);
      let v = 0.14 + warm * 0.36 + cool * 0.12;
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
        let c = tone(FELT, v - 0.02 + (rim ? 0.14 : 0), x, y, 0.1);
        if (cool) c = mix(c, COOL, cool * 0.1);
        return c;
      }
      let c = tone(WOOD, v, x, y, 0.12);
      if (warm) c = mix(c, AMBER, warm * 0.1);
      if (cool) c = mix(c, COOL, cool * 0.12);
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
    const v = y === 0 ? 0.36 + lit * 0.45 : y < 3 ? 0.2 + lit * 0.12 : 0.08;
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

const shadows = Object.fromEntries(sprites.map((s) => [s.id, shadowLayer(s)]));
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
for (const s of sprites) {
  const box = s.layer.bbox();
  const hitBox = s.hit.bbox();
  const u = { x: Math.min(box.x, hitBox.x), y: Math.min(box.y, hitBox.y) };
  u.w = Math.max(box.x + box.w, hitBox.x + hitBox.w) - u.x;
  u.h = Math.max(box.y + box.h, hitBox.y + hitBox.h) - u.y;
  const sprite = s.layer.crop(u);
  const outline = s.hit.outline(OUTLINE).crop({ x: u.x - 1, y: u.y - 1, w: u.w + 2, h: u.h + 2 });
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
