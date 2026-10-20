// Pixel-art drawing helpers: a layer of RGBA pixels, palette ramps shaded with
// ordered dithering, and silhouette tools (outline, crop, hit mask).

export const W = 480;
export const H = 270;

export function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
}

export function mix(a, b, t) {
  const A = typeof a === "string" ? hex(a) : a;
  const B = typeof b === "string" ? hex(b) : b;
  return [0, 1, 2].map((i) => Math.round(A[i] + (B[i] - A[i]) * t)).concat(255);
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
export const bayer = (x, y) => (BAYER[y & 3][x & 3] + 0.5) / 16;

export function hash(x, y, s = 0) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Pick a ramp colour for light value v (0..1) as flat bands. Only a thin seam
// between neighbouring bands is broken up (2x2 checker), so surfaces read as
// clean areas of colour rather than stipple.
export function tone(ramp, v, x, y, seam = 0.16) {
  const t = clamp(v) * (ramp.length - 1);
  let i = Math.floor(t);
  const f = t - i;
  if (f > 0.5 + seam / 2) i += 1;
  else if (f > 0.5 - seam / 2) i += ((x >> 0) + (y >> 0)) & 1;
  const c = ramp[Math.min(i, ramp.length - 1)];
  return typeof c === "string" ? hex(c) : c;
}

// Quantise a 0..1 amount into n flat steps (for light washes and shadows).
export const steps = (v, n) => Math.round(clamp(v) * n) / n;

// Pick a ramp colour for light value v (0..1), dithering between neighbours.
export function shade(ramp, v, x, y) {
  const t = clamp(v) * (ramp.length - 1);
  const i = Math.floor(t);
  const f = t - i;
  const c = ramp[f > bayer(x, y) ? Math.min(i + 1, ramp.length - 1) : i];
  return typeof c === "string" ? hex(c) : c;
}

// Lambert-ish shading for a point on an ellipsoid bulge.
export function bulge(x, y, cx, cy, rx, ry, light, ambient = 0.25, diffuse = 0.75) {
  const nx = clamp((x - cx) / rx, -1, 1);
  const ny = clamp((y - cy) / ry, -1, 1);
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const [lx, ly, lz] = light;
  const l = Math.hypot(lx, ly, lz);
  return ambient + diffuse * Math.max(0, (nx * lx + ny * ly + nz * lz) / l);
}

export const inEllipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;

export function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function inRoundRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
  const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r + 0.5;
}

export function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

export class Layer {
  constructor(w = W, h = H) {
    this.w = w;
    this.h = h;
    this.data = new Uint8ClampedArray(w * h * 4);
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (!c || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const col = typeof c === "string" ? hex(c) : c;
    const i = (y * this.w + x) * 4;
    this.data[i] = col[0];
    this.data[i + 1] = col[1];
    this.data[i + 2] = col[2];
    this.data[i + 3] = col[3] ?? 255;
  }

  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    const i = (y * this.w + x) * 4;
    if (!this.data[i + 3]) return null;
    return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
  }

  has(x, y) {
    return !!this.get(x, y);
  }

  clear(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.data[(y * this.w + x) * 4 + 3] = 0;
  }

  // Paint every pixel in a box with fn(x, y) -> colour | null.
  paint(x0, y0, x1, y1, fn) {
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(this.h - 1, Math.ceil(y1)); y++)
      for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(this.w - 1, Math.ceil(x1)); x++) {
        const c = fn(x, y);
        if (c) this.set(x, y, c);
      }
  }

  rect(x, y, w, h, c) {
    this.paint(x, y, x + w - 1, y + h - 1, () => c);
  }

  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, typeof c === "function" ? c(x0, y0) : c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  composite(src, ox = 0, oy = 0) {
    for (let y = 0; y < src.h; y++)
      for (let x = 0; x < src.w; x++) {
        const c = src.get(x, y);
        if (c) this.set(x + ox, y + oy, c);
      }
  }

  bbox() {
    let x0 = this.w, y0 = this.h, x1 = -1, y1 = -1;
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++)
        if (this.has(x, y)) {
          if (x < x0) x0 = x;
          if (y < y0) y0 = y;
          if (x > x1) x1 = x;
          if (y > y1) y1 = y;
        }
    return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }

  crop({ x, y, w, h }) {
    const out = new Layer(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out.set(i, j, this.get(x + i, y + j));
    return out;
  }

  // Pixels outside the silhouette that touch it (4-neighbour), in colour c.
  outline(c) {
    const out = new Layer(this.w, this.h);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        if (this.has(x, y)) continue;
        if (this.has(x - 1, y) || this.has(x + 1, y) || this.has(x, y - 1) || this.has(x, y + 1)) out.set(x, y, c);
      }
    return out;
  }

  // Edge pixels on the side facing away from the light get darker, which
  // separates soft shapes from a dark background without a hard black line.
  rimShade(dir, amount = 0.45, ink = "#0a0a0d") {
    const edits = [];
    const [dx, dy] = dir; // direction pointing away from the light
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.get(x, y);
        if (!c) continue;
        const away = !this.has(x + dx, y) || !this.has(x, y + dy);
        if (away) edits.push([x, y, mix(c, ink, amount)]);
      }
    for (const [x, y, c] of edits) this.set(x, y, c);
  }

  // One consistent outline weight for every object: the outermost pixels of
  // the silhouette (taken from `hit`, so holes like racket strings don't
  // count) are darkened, more on the shadow side.
  selout(hit = this, ink = "#08090c", side = 0.38, shadow = 0.55) {
    const edits = [];
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const c = this.get(x, y);
        if (!c || !hit.has(x, y)) continue;
        const below = !hit.has(x, y + 1);
        const edge = below || !hit.has(x - 1, y) || !hit.has(x + 1, y) || !hit.has(x, y - 1);
        if (edge) edits.push([x, y, mix(c, ink, below ? shadow : side)]);
      }
    for (const [x, y, c] of edits) this.set(x, y, c);
  }

  scaled(k) {
    const out = new Layer(this.w * k, this.h * k);
    for (let y = 0; y < out.h; y++)
      for (let x = 0; x < out.w; x++) out.set(x, y, this.get(Math.floor(x / k), Math.floor(y / k)));
    return out;
  }
}

// 3x5 pixel font for the tiny text drawn on the monitor and jersey.
const GLYPHS = {
  A: [".#.", "#.#", "###", "#.#", "#.#"],
  B: ["##.", "#.#", "##.", "#.#", "##."],
  C: [".##", "#..", "#..", "#..", ".##"],
  D: ["##.", "#.#", "#.#", "#.#", "##."],
  E: ["###", "#..", "##.", "#..", "###"],
  F: ["###", "#..", "##.", "#..", "#.."],
  G: [".##", "#..", "#.#", "#.#", ".##"],
  H: ["#.#", "#.#", "###", "#.#", "#.#"],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  J: ["..#", "..#", "..#", "#.#", ".#."],
  K: ["#.#", "#.#", "##.", "#.#", "#.#"],
  L: ["#..", "#..", "#..", "#..", "###"],
  M: ["#.#", "###", "###", "#.#", "#.#"],
  N: ["##.", "#.#", "#.#", "#.#", "#.#"],
  O: [".#.", "#.#", "#.#", "#.#", ".#."],
  P: ["##.", "#.#", "##.", "#..", "#.."],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  S: [".##", "#..", ".#.", "..#", "##."],
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"],
  V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  W: ["#.#", "#.#", "###", "###", "#.#"],
  X: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."],
  Z: ["###", "..#", ".#.", "#..", "###"],
  ">": ["#..", ".#.", "..#", ".#.", "#.."],
  "~": ["...", "##.", "#.#", ".##", "..."],
  "/": ["..#", "..#", ".#.", "#..", "#.."],
  ":": ["...", ".#.", "...", ".#.", "..."],
  "@": [".#.", "#.#", "###", "#..", ".##"],
  "-": ["...", "...", "###", "...", "..."],
  "_": ["...", "...", "...", "...", "###"],
  " ": ["...", "...", "...", "...", "..."],
  "!": [".#.", ".#.", ".#.", "...", ".#."],
};

export function text(layer, str, x, y, color, scale = 1) {
  let cx = x;
  for (const ch of str.toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    for (let j = 0; j < 5; j++)
      for (let i = 0; i < 3; i++)
        if (g[j][i] === "#")
          for (let a = 0; a < scale; a++)
            for (let b = 0; b < scale; b++)
              layer.set(cx + i * scale + a, y + j * scale + b, typeof color === "function" ? color(cx + i * scale + a, y + j * scale + b) : color);
    cx += 4 * scale;
  }
  return cx;
}
