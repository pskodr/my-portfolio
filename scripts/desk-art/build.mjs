// Builds the desk scene: a background plate plus one PNG per interactive
// object, its hover outline, and a hit mask for pointer hit-testing.
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
const COOL = "#7f9bd6";
const AMBER = "#e9a35e";

const DESK_TOP = 150;
const DESK_LIP = 244;
const FLOOR_Y = 258;

const g = (x, y, cx, cy, sx, sy) => Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
const vignette = (x) => 0.55 + 0.45 * steps(Math.min(x / 80, (W - 1 - x) / 80, 1), 4);

const sprites = ALL.map((o) => {
  const layer = o.draw();
  const hit = o.hit ? o.hit() : layer;
  if (!o.noSelout) layer.selout(hit);
  return { id: o.id, group: o.group ?? o.id, layer, hit };
});
const byId = Object.fromEntries(sprites.map((s) => [s.id, s]));

// Distance from a point to the monitor bezel (0 inside).
const bezelDist = (x, y) => Math.hypot(Math.max(126 - x, 0, x - 353), Math.max(21 - y, 0, y - 149));

// Contact shadows on the desk: [cx, cy, rx, ry]
const deskShadows = [
  [240, 175, 42, 5],
  [239, 216, 66, 3.5],
  [330, 215, 9, 2.5],
  [66, 227, 24, 3],
  [128, 242, 19, 3],
  [390, 228, 7, 2],
  [436, 228, 7, 2],
  [370, 244, 15, 1.6],
];
// Objects on the wall cast a short shadow away from the monitor.
const wallShadows = [
  { hit: byId.jersey.hit, dx: -3, dy: 3 },
  { hit: byId.racket.hit, dx: 3, dy: 3 },
];

function background() {
  const L = new Layer();
  L.paint(0, 0, W - 1, H - 1, (x, y) => {
    if (y < DESK_TOP) {
      // Wall: a broad glow behind the monitor, a little amber spill above the
      // light bar, and a cool halo hugging the bezel so the monitor separates.
      let v = 0.2 + 0.42 * steps(g(x, y, 240, 90, 175, 115), 6);
      const halo = steps(clamp(1 - bezelDist(x, y) / 8), 1);
      const spill = steps(g(x, y, 240, 8, 80, 9), 2);
      v += halo * 0.05 + spill * 0.06;
      if (wallShadows.some((s) => s.hit.has(x - s.dx, y - s.dy))) v -= 0.14;
      if (y >= DESK_TOP - 2) v -= 0.1;
      let c = tone(WALL, v * vignette(x), x, y, 0.1);
      if (halo) c = mix(c, COOL, halo * 0.1);
      if (spill) c = mix(c, AMBER, spill * 0.12);
      return c;
    }
    if (y < DESK_LIP) {
      const warm = steps(g(x, y, 240, 194, 140, 34) * 1.15, 4);
      const cool = steps(g(x, y, 240, 158, 110, 18) * 1.1, 3);
      let v = 0.26 + warm * 0.3 + cool * 0.12;
      if (y < DESK_TOP + 2) v -= 0.14;
      // Long, sparse grain streaks rather than per-pixel noise
      const row = Math.floor((y - DESK_TOP) / 3);
      const start = hash(row, 1) * W;
      if ((y - DESK_TOP) % 3 === 1 && hash(row, 2) > 0.45 && Math.abs(x - start) < 30 + hash(row, 3) * 40) v -= 0.06;
      let shadow = 0;
      for (const [cx, cy, rx, ry] of deskShadows) shadow = Math.max(shadow, g(x, y, cx, cy, rx, ry));
      v -= steps(shadow, 2) * 0.24;
      // Desk mat
      const t = (y - 184) / 46;
      const mx0 = 162 - t * 8;
      const mx1 = 352 + t * 8;
      if (y >= 184 && y <= 230 && x >= mx0 && x <= mx1) {
        const rim = y === 184 || y === 230 || x < mx0 + 1 || x > mx1 - 1;
        let c = tone(FELT, (v - 0.02 + (rim ? 0.14 : 0)) * vignette(x), x, y, 0.1);
        if (cool) c = mix(c, COOL, cool * 0.1);
        return c;
      }
      let c = tone(WOOD, v * vignette(x), x, y, 0.12);
      if (warm) c = mix(c, AMBER, warm * 0.1);
      if (cool) c = mix(c, COOL, cool * 0.12);
      return c;
    }
    if (y < FLOOR_Y) {
      const lit = steps(g(x, y, 240, DESK_LIP, 170, 12), 2);
      const v = y === DESK_LIP ? 0.55 + lit * 0.3 : y < DESK_LIP + 3 ? 0.3 : 0.12;
      return tone(WOOD, v * vignette(x), x, y, 0.1);
    }
    return FLOOR;
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
writeFileSync(join(outDir, "desk-bg.png"), encodePNG(W, H, bg.data));

const entries = [];
const full = new Layer();
full.composite(bg);
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
  entries.push({ id: s.id, group: s.group, ...u, mask: maskString(s.hit, u) });
}

const ts = `// Generated by scripts/desk-art/build.mjs. Do not edit by hand.
// Positions are in scene pixels (${W}x${H}); masks are bit-packed rows, base64.

export const SCENE = { width: ${W}, height: ${H} } as const;

// The monitor's glass, where the HTML intro is laid over the artwork.
export const SCREEN = ${JSON.stringify(SCREEN)} as const;

export type SpriteId = ${entries.map((e) => JSON.stringify(e.id)).join(" | ")};
export type GroupId = ${[...new Set(entries.map((e) => JSON.stringify(e.group)))].join(" | ")};

export type Sprite = { id: SpriteId; group: GroupId; x: number; y: number; w: number; h: number; mask: string };

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
