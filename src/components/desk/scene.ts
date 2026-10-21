import { deskObjects, type DeskObject } from "@/content/destinations";
import type { Arrangement, Offsets } from "./layout";
import { FLOOR, FRONT_H, PLATE, SCENE, SCREEN, decor, sprites, type GroupId, type Sprite, type SpriteId } from "./sprites.generated";

export { FLOOR, FRONT_H, PLATE, SCENE, SCREEN, decor, sprites };
export type { GroupId, Sprite, SpriteId };

// Where each hover label sits in the desk arrangement, in scene pixels before
// the layout moves the object: the point it hangs from and which way it
// opens. Chosen so no label covers an object.
export type Side = "above" | "below" | "left" | "right";
type Anchor = { x: number; y: number; side: Side };
const labelAnchors: Record<GroupId, Anchor> = {
  computer: { x: 240, y: 12, side: "above" },
  jersey: { x: 58, y: 121, side: "below" },
  pokemon: { x: 70, y: 200, side: "above" },
  racket: { x: 411, y: 40, side: "left" },
  headphones: { x: 413, y: 141, side: "above" },
  padthai: { x: 128, y: 246, side: "below" },
  card: { x: 353, y: 237, side: "left" },
};

export const groups = deskObjects as (DeskObject & { id: GroupId })[];
export const objectFor = (id: GroupId) => groups.find((o) => o.id === id)!;
export const spritesIn = (id: GroupId) => sprites.filter((s) => s.group === id);

// Bounding box of a group where the layout has placed it, in scene pixels.
export function groupBox(id: GroupId, offsets: Offsets) {
  const list = spritesIn(id);
  const { dx, dy } = offsets[id];
  const x0 = Math.min(...list.map((s) => s.x));
  const y0 = Math.min(...list.map((s) => s.y));
  const x1 = Math.max(...list.map((s) => s.x + s.w));
  const y1 = Math.max(...list.map((s) => s.y + s.h));
  return { x: x0 + dx, y: y0 + dy, w: x1 - x0, h: y1 - y0 };
}

// The label's anchor where the layout has placed the object. In the stacked
// phone arrangement, wall objects open their label below, desk objects above,
// and the computer's sits under the keyboard.
export function labelAnchor(id: GroupId, arrangement: Arrangement, offsets: Offsets): Anchor {
  const { dx, dy } = offsets[id];
  if (arrangement === "desk") {
    const a = labelAnchors[id];
    return { x: a.x + dx, y: a.y + dy, side: a.side };
  }
  if (id === "computer") return { x: 240, y: 218, side: "below" };
  const b = groupBox(id, offsets);
  const wall = id === "jersey" || id === "racket";
  return { x: b.x + b.w / 2, y: wall ? b.y + b.h : b.y, side: wall ? "below" : "above" };
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
// point (x, y), with objects where the layout has placed them.
export function hitTest(x: number, y: number, offsets: Offsets): GroupId | null {
  for (let i = sprites.length - 1; i >= 0; i--) {
    const s = sprites[i];
    const { dx, dy } = offsets[s.group];
    const lx = Math.floor(x - s.x - dx);
    const ly = Math.floor(y - s.y - dy);
    if (lx < 0 || ly < 0 || lx >= s.w || ly >= s.h) continue;
    const bit = ly * s.w + lx;
    if (maskOf(s)[bit >> 3] & (1 << (bit & 7))) return s.group;
  }
  return null;
}
