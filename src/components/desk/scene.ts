import { deskObjects, type DeskObject } from "@/content/destinations";
import { SCENE, SCREEN, sprites, type GroupId, type Sprite, type SpriteId } from "./sprites.generated";

export { SCENE, SCREEN, sprites };
export type { GroupId, Sprite, SpriteId };

// Where each hover label sits, in scene pixels: the point it hangs from and
// which way it opens. Chosen so no label covers an object.
export type Side = "above" | "below" | "left" | "right";
export const labelAnchors: Record<GroupId, { x: number; y: number; side: Side }> = {
  computer: { x: 240, y: 12, side: "above" },
  jersey: { x: 62, y: 118, side: "below" },
  pikachu: { x: 64, y: 146, side: "above" },
  racket: { x: 411, y: 40, side: "left" },
  headphones: { x: 413, y: 143, side: "above" },
  padthai: { x: 128, y: 246, side: "below" },
  card: { x: 353, y: 237, side: "left" },
};

export const groups = deskObjects as (DeskObject & { id: GroupId })[];
export const objectFor = (id: GroupId) => groups.find((o) => o.id === id)!;
export const spritesIn = (id: GroupId) => sprites.filter((s) => s.group === id);

// Bounding box of a group, in scene pixels.
export function groupBox(id: GroupId) {
  const list = spritesIn(id);
  const x0 = Math.min(...list.map((s) => s.x));
  const y0 = Math.min(...list.map((s) => s.y));
  const x1 = Math.max(...list.map((s) => s.x + s.w));
  const y1 = Math.max(...list.map((s) => s.y + s.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// Which object a route belongs to, so the desk can lean toward it while its
// page is open and return focus to it afterwards.
export function groupForPath(pathname: string): GroupId | null {
  if (pathname.startsWith("/work")) return "computer";
  const o = groups.find((d) => d.href && d.href !== "/work" && pathname.startsWith(d.href));
  return o ? o.id : null;
}

const masks = new Map<SpriteId, Uint8Array>();
function maskOf(s: Sprite) {
  let m = masks.get(s.id);
  if (!m) {
    m = Uint8Array.from(atob(s.mask), (c) => c.charCodeAt(0));
    masks.set(s.id, m);
  }
  return m;
}

// The group of the front-most object whose actual pixels are under scene
// point (x, y).
export function hitTest(x: number, y: number): GroupId | null {
  for (let i = sprites.length - 1; i >= 0; i--) {
    const s = sprites[i];
    const lx = Math.floor(x - s.x);
    const ly = Math.floor(y - s.y);
    if (lx < 0 || ly < 0 || lx >= s.w || ly >= s.h) continue;
    const bit = ly * s.w + lx;
    if (maskOf(s)[bit >> 3] & (1 << (bit & 7))) return s.group;
  }
  return null;
}
