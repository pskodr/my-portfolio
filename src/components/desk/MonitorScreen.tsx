"use client";

import Image from "next/image";
import Link from "next/link";
import { profile, showDrafts } from "@/content/site";
import { SCREEN } from "./scene";

const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("");

// The monitor's screen as real HTML, laid exactly over the glass in the
// artwork: a preview of Home (portrait, name, My Projects). Sizes are in art
// pixels (--u), so it scales with the scene. When the scene is too small for
// the button to read, "min" keeps the portrait and name.
export type Density = "full" | "min";

export function MonitorScreen({ left, top, s, density }: { left: number; top: number; s: number; density: Density }) {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <div
      className="screen"
      data-density={density}
      style={
        {
          left: left + SCREEN.x0 * s,
          top: top + SCREEN.y0 * s,
          width: (SCREEN.x1 - SCREEN.x0 + 1) * s,
          height: (SCREEN.y1 - SCREEN.y0 + 1) * s,
          "--u": `${s}px`,
        } as React.CSSProperties
      }
    >
      <p className="screen-bar" aria-hidden>
        ~/workspace
      </p>
      <div className="screen-body">
        <div className="screen-group">
          <figure className="screen-photo">
            {profile.photo ? (
              // The photo frame is 64 art pixels wide: ask for exactly that much,
              // so it is sharp at any scale and device density.
              <Image src={profile.photo.src} alt="" fill sizes={`${Math.ceil(64 * s)}px`} />
            ) : (
              <span className="screen-photo-empty" aria-hidden>
                <span>{initials}</span>
                {showDrafts && <small>Photo to come</small>}
              </span>
            )}
          </figure>
          <div className="screen-text">
            <p className="screen-name">
              {first}
              <br />
              {rest.join(" ")}
            </p>
            <Link href="/work/projects" scroll={false} className="screen-primary">
              My Projects <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
