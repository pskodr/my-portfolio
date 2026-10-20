"use client";
/* eslint-disable @next/next/no-img-element -- pixel art is served as-is:
   tiny PNGs that must not be resampled or re-encoded by next/image. */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MonitorScreen } from "./MonitorScreen";
import { openWelcome } from "./Welcome";
import {
  SCENE,
  SCREEN,
  groupBox,
  groupForPath,
  groups,
  hitTest,
  labelAnchors,
  objectFor,
  sprites,
  type GroupId,
} from "./scene";

type Frame = { s: number; left: number; top: number; vw: number; vh: number; compact: boolean };

// Scale the scene so each art pixel lands on whole device pixels: crisp at any
// size. Wide screens cover the viewport; narrow ones show the whole desk across
// the top, with a labelled list below.
function measure(): Frame {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const compact = vw < 820 || vh > vw;
  const target = compact ? vw / SCENE.width : Math.max(vw / SCENE.width, vh / SCENE.height);
  const s = Math.max(compact ? 0.5 : 1, Math.round(target * dpr)) / dpr;
  const left = vw / 2 - (SCENE.width / 2) * s;
  const top = compact ? 60 : (vh - SCENE.height * s) / 2;
  return { s, left, top, vw, vh, compact };
}

const SSR_FRAME: Frame = { s: 3, left: 0, top: 0, vw: 1440, vh: 810, compact: false };

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
      r.setProperty("--art-bottom", `${f.top + SCENE.height * f.s}px`);
      // The welcome card, so its window can sit just above it.
      const card = groupBox("card");
      const [cx, cy] = at(card.x + card.w / 2, card.y);
      r.setProperty("--card-x", `${cx}px`);
      r.setProperty("--card-top", `${cy}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Remember which object a page belongs to; when the visitor comes back to
  // the desk, focus returns to it.
  useEffect(() => {
    if (focused) opener.current = focused;
    if (view === "desk" && opener.current) hotspots.current[opener.current]?.focus({ preventScroll: true });
  }, [view, focused]);

  const toScene = useCallback(
    (cx: number, cy: number) => hitTest((cx - frame.left) / frame.s, (cy - frame.top) / frame.s),
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
  const lit = (g: GroupId) => active === g || (view !== "desk" && focused === g);
  const origin = focused ? originFor(focused, frame) : "50% 50%";

  return (
    <div
      className="desk"
      data-view={view}
      data-measured={measured}
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
          <img className="px" src="/desk/desk-bg.png" width={SCENE.width} height={SCENE.height} alt="" fetchPriority="high" />
          {sprites.map((s) => (
            <div
              key={s.id}
              className="sprite"
              data-id={s.id}
              data-active={lit(s.group) ? "" : undefined}
              style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
            >
              <img className="px" src={`/desk/${s.id}.png`} width={s.w} height={s.h} alt="" />
              <img className="px sprite-outline" src={`/desk/${s.id}-outline.png`} width={s.w + 2} height={s.h + 2} alt="" />
            </div>
          ))}
        </div>
        {measured && (
          <div inert={view !== "desk"}>
            <MonitorScreen left={frame.left} top={frame.top} s={frame.s} compact={frame.compact || frame.s < 2.5} />
          </div>
        )}
      </div>

      {groups.map((o) => {
        const a = labelAnchors[o.id];
        return (
          <p
            key={o.id}
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
            const b = groupBox(o.id);
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
  const b = id === "computer" ? { x: SCREEN.x0, y: SCREEN.y0, w: SCREEN.x1 - SCREEN.x0, h: SCREEN.y1 - SCREEN.y0 } : groupBox(id);
  return `${f.left + (b.x + b.w / 2) * f.s}px ${f.top + (b.y + b.h / 2) * f.s}px`;
}
