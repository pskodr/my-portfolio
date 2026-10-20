import { sprites, type GroupId } from "./sprites.generated";

// Lays the desk out to fill the window. The wall and desk surface are one wide
// plate that always reaches the edges; the objects move to suit the space.
// The monitor stays fixed at the centre and sets the scale, so it is as large
// as the window allows while every object stays fully visible below the
// shortcut bar.
//
// Two arrangements:
// - "desk": the full composition. Spare width spreads the side objects
//   outward; in short windows the wall objects drop and the front objects
//   move back, so the scale is limited by a tighter box.
// - "stack": for phones in portrait. The jersey and racket hang above the
//   monitor and the small objects sit in a row in front of the keyboard.

export type Arrangement = "desk" | "stack";
export type Offset = { dx: number; dy: number };
export type Offsets = Record<GroupId, Offset>;

const CENTER = 240; // the monitor's centre, in scene pixels
const PAD = 5; // clear space around the objects, in scene pixels
const SPREAD_CAP = 72; // how far (before scaling by spread) side objects drift in wide windows

// Desk arrangement. dx: shift in the tightest layout. spread: how far it
// follows spare width (negative = leftward). shortDy: shift in short windows.
const DESK: Record<GroupId, { dx: number; spread: number; shortDy: number }> = {
  computer: { dx: 0, spread: 0, shortDy: 0 },
  jersey: { dx: 6, spread: -0.75, shortDy: 8 },
  pikachu: { dx: 2, spread: -0.65, shortDy: 0 },
  padthai: { dx: 0, spread: -0.35, shortDy: -5 },
  racket: { dx: -10, spread: 0.75, shortDy: 8 },
  headphones: { dx: -4, spread: 0.65, shortDy: 0 },
  card: { dx: 0, spread: 0.25, shortDy: -4 },
};

// Stack arrangement: fixed offsets from the drawn positions.
const STACK: Offsets = {
  computer: { dx: 0, dy: 0 },
  jersey: { dx: 146, dy: -113 },
  racket: { dx: -130, dy: -120 },
  pikachu: { dx: 84, dy: 72 },
  padthai: { dx: 87, dy: 58 },
  headphones: { dx: -124, dy: 72 },
  card: { dx: -27, dy: 57 },
};

// Where the desk's front edge sits (scene y) in each arrangement.
export const LIP_Y: Record<Arrangement, number> = { desk: 244, stack: 304 };

type Box = { x0: number; y0: number; x1: number; y1: number };

const ids = [...new Set(sprites.map((s) => s.group))];

function rawBox(id: GroupId): Box {
  const list = sprites.filter((s) => s.group === id);
  return {
    x0: Math.min(...list.map((s) => s.x)),
    y0: Math.min(...list.map((s) => s.y)),
    x1: Math.max(...list.map((s) => s.x + s.w)),
    y1: Math.max(...list.map((s) => s.y + s.h)),
  };
}
const RAW = Object.fromEntries(ids.map((id) => [id, rawBox(id)])) as Record<GroupId, Box>;

// The box around every object, with the monitor kept at the centre: the
// width is twice the larger half.
function extent(o: Offsets) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const id of ids) {
    const b = RAW[id];
    x0 = Math.min(x0, b.x0 + o[id].dx);
    x1 = Math.max(x1, b.x1 + o[id].dx);
    y0 = Math.min(y0, b.y0 + o[id].dy);
    y1 = Math.max(y1, b.y1 + o[id].dy);
  }
  return { w: 2 * Math.max(CENTER - x0, x1 - CENTER) + 2 * PAD, top: y0 - PAD, h: y1 - y0 + 2 * PAD };
}

function deskOffsets(spread: number, short: number): Offsets {
  const e = Math.min(spread, SPREAD_CAP);
  return Object.fromEntries(
    ids.map((id) => {
      const d = DESK[id];
      return [id, { dx: Math.round(d.dx + d.spread * e), dy: Math.round(d.shortDy * short) }];
    }),
  ) as Offsets;
}

const TIGHT = extent(deskOffsets(0, 1));
const RELAXED_H = extent(deskOffsets(0, 0)).h;
const STACKED = extent(STACK);

// Snap to whole device pixels for crisp art, unless that would shrink the
// scene noticeably.
function snap(fit: number, dpr: number) {
  const whole = Math.floor(fit * dpr) / dpr;
  return whole >= fit * 0.9 ? whole : fit;
}

export type Placement = {
  arrangement: Arrangement;
  s: number;
  left: number; // screen position of scene (0, 0)
  top: number;
  offsets: Offsets;
  lipY: number;
  height: number; // screen height the objects need, padding included
};

// Fit an arrangement into the area (x, y, w, h) where objects may sit.
// `above` is the share of spare height that goes to the wall above.
export function place(arrangement: Arrangement, area: { x: number; y: number; w: number; h: number }, dpr: number, above = 0.65): Placement {
  let s: number;
  let offsets: Offsets;
  if (arrangement === "stack") {
    s = snap(Math.min(area.w / STACKED.w, area.h / STACKED.h), dpr);
    offsets = STACK;
  } else {
    s = snap(Math.min(area.w / TIGHT.w, area.h / TIGHT.h), dpr);
    const visW = area.w / s;
    const visH = area.h / s;
    const short = 1 - Math.min(1, Math.max(0, (visH - TIGHT.h) / (RELAXED_H - TIGHT.h)));
    offsets = deskOffsets(Math.max(0, (visW - TIGHT.w) / 2), short);
  }
  const box = extent(offsets);
  const spare = Math.max(0, area.h / s - box.h);
  const top = area.y - (box.top - spare * above) * s;
  const left = area.x + area.w / 2 - CENTER * s;
  return { arrangement, s, left, top, offsets, lipY: LIP_Y[arrangement], height: box.h * s };
}

// The scale each arrangement would get, to choose between them.
export function fitScale(arrangement: Arrangement, w: number, h: number) {
  const b = arrangement === "stack" ? STACKED : TIGHT;
  return Math.min(w / b.w, h / b.h);
}
