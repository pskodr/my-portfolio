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
// artwork. Sizes are in art pixels (--u), so it scales with the scene.
export function MonitorScreen({ left, top, s, compact }: { left: number; top: number; s: number; compact: boolean }) {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <div
      className="screen"
      data-compact={compact || undefined}
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
        <figure className="screen-photo">
          {profile.photo ? (
            <Image src={profile.photo.src} alt={profile.photo.alt} fill sizes="200px" />
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
          <p className="screen-intro">{profile.monitorIntro}</p>
          <div className="screen-actions">
            <Link href="/work/projects" scroll={false} className="screen-primary">
              Explore projects <span aria-hidden>→</span>
            </Link>
            <span className="screen-secondary">
              <Link href="/work/resume" scroll={false}>
                Résumé
              </Link>
              <Link href="/work/contact" scroll={false}>
                Contact
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
