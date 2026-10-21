"use client";
/* eslint-disable @next/next/no-img-element -- pixel art is served as-is:
   tiny PNGs that must not be resampled or re-encoded by next/image. */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fitScale, place, type Placement } from "./layout";
import { MonitorScreen } from "./MonitorScreen";
import { openWelcome } from "./Welcome";
import {
  FRONT_H,
  PLATE,
  SCREEN,
  decor,
  groupBox,
  groupForPath,
  groups,
  hitTest,
  labelAnchor,
  objectFor,
  sprites,
  type GroupId,
} from "./scene";

type Frame = Placement & { vw: number; vh: number; compact: boolean; barBottom: number; artBottom: number };

// Space kept clear for the shortcut bar (Work, Résumé, Contact, Help), which
// sits outside the scene's transform.
const BAR = { wide: 68, compact: 60 };

// Safe-area insets (notches, home indicators), read from CSS env().
function safeArea() {
  const cs = getComputedStyle(document.documentElement);
  const n = (v: string) => parseFloat(cs.getPropertyValue(v)) || 0;
  return { t: n("--safe-t"), r: n("--safe-r"), b: n("--safe-b"), l: n("--safe-l") };
}

// The wall and desk always fill the window; the objects are laid out in the
// space below the shortcut bar (see layout.ts). Narrow, portrait or very short
// windows get the compact layout: the scene across the top, with labelled
// destinations listed beneath. Phones in portrait stack the objects around
// the monitor when that makes it larger than the desk arrangement would.
function measure(): Frame {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const safe = safeArea();
  // Keep in step with the compact media query in globals.css.
  const compact = vw < 820 || vh > vw || vh < 480;
  const barBottom = (compact ? BAR.compact : BAR.wide) + safe.t;
  const w = vw - safe.l - safe.r;
  const h = compact ? Math.max(150, (vh - barBottom) * 0.72) : vh - barBottom - safe.b;
  const area = { x: safe.l, y: barBottom, w, h };
  const stack = compact && fitScale("stack", w, h) > fitScale("desk", w, h) * 1.05;
  let p = place(stack ? "stack" : "desk", area, dpr);
  // Compact: the scene is only as tall as its objects, so the list beneath
  // starts right under the desk instead of after empty wall.
  if (compact && p.height < h - 1) p = place(p.arrangement, { ...area, h: p.height }, dpr);
  return { ...p, vw, vh, compact, barBottom, artBottom: compact ? barBottom + Math.min(h, p.height) : vh };
}

const SSR_FRAME: Frame = {
  ...place("desk", { x: 0, y: 68, w: 1440, h: 832 }, 1),
  vw: 1440,
  vh: 900,
  compact: false,
  barBottom: 68,
  artBottom: 900,
};

export function DeskStage() {
  const pathname = usePathname();
  const router = useRouter();
  const view = pathname === "/" ? "desk" : pathname.startsWith("/work") ? "monitor" : "window";
  const focused = groupForPath(pathname);

  const [frame, setFrame] = useState<Frame>(SSR_FRAME);
  const [measured, setMeasured] = useState(false);
  const [pointer, setPointer] = useState<GroupId | null>(null);
  const [keyFocus, setKeyFocus] = useState<GroupId | null>(null);
  const hotspots = useRef<Partial<Record<GroupId, HTMLElement | null>>>({});
  const labels = useRef<Partial<Record<GroupId, HTMLElement | null>>>({});
  const opener = useRef<GroupId | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const f = measure();
      setFrame(f);
      setMeasured(true);
      const at = (x: number, y: number) => [f.left + x * f.s, f.top + y * f.s];
      const r = document.documentElement.style;
      // Where the screen sits, for the monitor's open transition.
      r.setProperty("--screen-top", `${f.top + SCREEN.y0 * f.s}px`);
      r.setProperty("--screen-left", `${f.left + SCREEN.x0 * f.s}px`);
      r.setProperty("--screen-right", `${f.vw - (f.left + (SCREEN.x1 + 1) * f.s)}px`);
      r.setProperty("--screen-bottom", `${f.vh - (f.top + (SCREEN.y1 + 1) * f.s)}px`);
      r.setProperty("--art-bottom", `${f.artBottom}px`);
      // The welcome card, so its window can sit just above it.
      const card = groupBox("card", f.offsets);
      const [cx, cy] = at(card.x + card.w / 2, card.y);
      r.setProperty("--card-x", `${cx}px`);
      r.setProperty("--card-top", `${cy}px`);
    };
    // Re-fit on any size change: window resize (including height only),
    // rotation, browser zoom and mobile toolbars showing or hiding. Batched to
    // one measurement per frame; measuring never changes the layout it reads,
    // so it can't loop.
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    const ro = new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, []);

  // Remember which object a page belongs to; when the visitor comes back to
  // the desk, focus returns to it.
  useEffect(() => {
    if (focused) opener.current = focused;
    if (view === "desk" && opener.current) hotspots.current[opener.current]?.focus({ preventScroll: true });
  }, [view, focused]);

  const toScene = useCallback(
    (cx: number, cy: number) => hitTest((cx - frame.left) / frame.s, (cy - frame.top) / frame.s, frame.offsets),
    [frame],
  );

  const activate = (id: GroupId) => {
    const o = objectFor(id);
    if (o.action === "welcome") return openWelcome();
    opener.current = id;
    setPointer(null);
    router.push(o.href!, { scroll: false });
  };

  const active = view === "desk" ? (pointer ?? keyFocus) : null;

  // Keep labels inside the scene and clear of the shortcut bar. All of them,
  // since touch screens show every label at once.
  useLayoutEffect(() => {
    for (const el of Object.values(labels.current)) {
      if (!el) continue;
      el.style.setProperty("--nx", "0px");
      el.style.setProperty("--ny", "0px");
      const r = el.getBoundingClientRect();
      const pad = 8;
      const nx = Math.max(pad - r.left, 0) + Math.min(frame.vw - pad - r.right, 0);
      const ny = Math.max(frame.barBottom + 4 - r.top, 0) + Math.min(frame.artBottom - pad - r.bottom, 0);
      el.style.setProperty("--nx", `${nx}px`);
      el.style.setProperty("--ny", `${ny}px`);
    }
  }, [frame]);
  const lit = (g: GroupId) => active === g || (view !== "desk" && focused === g);
  const origin = focused ? originFor(focused, frame) : "50% 50%";

  return (
    <div
      className="desk"
      data-view={view}
      data-measured={measured}
      data-arrangement={frame.arrangement}
      data-hover={pointer ? "" : undefined}
      onPointerMove={(e) => view === "desk" && e.pointerType === "mouse" && setPointer(toScene(e.clientX, e.clientY))}
      onPointerLeave={() => setPointer(null)}
      onClick={(e) => {
        if (view !== "desk" || (e.target as HTMLElement).closest("a, button")) return;
        const id = toScene(e.clientX, e.clientY);
        if (id) activate(id);
      }}
    >
      <div className="desk-cam" style={{ transformOrigin: origin }}>
        <div className="desk-art" style={{ left: frame.left, top: frame.top, transform: `scale(${frame.s})` }} aria-hidden>
          {/* The wall and desk surface, then the desk's front edge and the floor
              under it, then decoration (never interactive), then each object's
              shadow, then the objects. */}
          <img
            className="px"
            src="/desk/desk-bg.png"
            width={PLATE.w}
            height={PLATE.h}
            style={{ left: PLATE.x, top: PLATE.y }}
            alt=""
            fetchPriority="high"
          />
          <img
            className="px"
            src="/desk/desk-front.png"
            width={PLATE.w}
            height={FRONT_H}
            style={{ left: PLATE.x, top: frame.lipY }}
            alt=""
          />
          <div className="desk-floor" style={{ left: PLATE.x, top: frame.lipY + FRONT_H, width: PLATE.w }} />
          {decor.map((d) => {
            const o = frame.decor[d.id];
            if (!o) return null;
            return (
              <div key={d.id} className="decor">
                {d.shadow && (
                  <img
                    className="px"
                    src={`/desk/${d.id}-shadow.png`}
                    width={d.shadow.w}
                    height={d.shadow.h}
                    style={{ left: d.shadow.x + o.dx, top: d.shadow.y + o.dy }}
                    alt=""
                  />
                )}
                <img className="px" src={`/desk/${d.id}.png`} width={d.w} height={d.h} style={{ left: d.x + o.dx, top: d.y + o.dy }} alt="" />
              </div>
            );
          })}
          {sprites.map(
            (s) =>
              s.shadow && (
                <img
                  key={s.id}
                  className="px"
                  src={`/desk/${s.id}-shadow.png`}
                  width={s.shadow.w}
                  height={s.shadow.h}
                  style={{ left: s.shadow.x + frame.offsets[s.group].dx, top: s.shadow.y + frame.offsets[s.group].dy }}
                  alt=""
                />
              ),
          )}
          {sprites.map((s) => (
            <div
              key={s.id}
              className="sprite"
              data-id={s.id}
              data-active={lit(s.group) ? "" : undefined}
              style={{ left: s.x + frame.offsets[s.group].dx, top: s.y + frame.offsets[s.group].dy, width: s.w, height: s.h }}
            >
              <img className="px" src={`/desk/${s.id}.png`} width={s.w} height={s.h} alt="" />
              <img className="px sprite-outline" src={`/desk/${s.id}-outline.png`} width={s.w + 4} height={s.h + 4} alt="" />
            </div>
          ))}
        </div>
        {measured && (
          <div inert={view !== "desk"}>
            <MonitorScreen
              left={frame.left}
              top={frame.top}
              s={frame.s}
              density={frame.s < 1.5 ? "min" : "full"}
            />
          </div>
        )}
      </div>

      {groups.map((o) => {
        const a = labelAnchor(o.id, frame.arrangement, frame.offsets);
        return (
          <p
            key={o.id}
            ref={(el) => {
              labels.current[o.id] = el;
            }}
            className="desk-label"
            data-side={a.side}
            data-on={active === o.id ? "" : undefined}
            style={{ left: frame.left + a.x * frame.s, top: frame.top + a.y * frame.s }}
            aria-hidden
          >
            {o.label}
          </p>
        );
      })}

      {/* Keyboard path into the scene: one stop per object (the computer is
          one stop). Pointers use the pixel hit-test above instead, so these
          never catch clicks meant for a neighbouring object. */}
      <nav aria-label="Objects on the desk" className="desk-hotspots" inert={view !== "desk"}>
        <ul>
          {groups.map((o) => {
            const b = groupBox(o.id, frame.offsets);
            const props = {
              id: `hotspot-${o.id}`,
              className: "desk-hotspot",
              ref: (el: HTMLElement | null) => {
                hotspots.current[o.id] = el;
              },
              style: { left: frame.left + b.x * frame.s, top: frame.top + b.y * frame.s, width: b.w * frame.s, height: b.h * frame.s },
              onFocus: (e: React.FocusEvent<HTMLElement>) => e.currentTarget.matches(":focus-visible") && setKeyFocus(o.id),
              onBlur: () => setKeyFocus(null),
            };
            return (
              <li key={o.id}>
                {o.href ? (
                  <Link href={o.href} scroll={false} {...props} onClick={() => (opener.current = o.id)}>
                    {o.name}: {o.label}
                  </Link>
                ) : (
                  <button type="button" {...props} onClick={openWelcome}>
                    {o.name}: {o.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function originFor(id: GroupId, f: Frame) {
  const b = id === "computer" ? { x: SCREEN.x0, y: SCREEN.y0, w: SCREEN.x1 - SCREEN.x0, h: SCREEN.y1 - SCREEN.y0 } : groupBox(id, f.offsets);
  return `${f.left + (b.x + b.w / 2) * f.s}px ${f.top + (b.y + b.h / 2) * f.s}px`;
}
