"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Gamepad2, Monitor, Shirt } from "lucide-react";
import { roomObjects, type RoomObjectId } from "@/content/room";
import { useRoom } from "@/components/room/RoomContext";

const icons: Partial<Record<RoomObjectId, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>>> = {
  computer: Monitor,
  soccer: Shirt,
  pokemon: Gamepad2,
  camera: Camera,
};

// The room's objects as plain links: the keyboard, screen-reader and touch path
// into every destination. Hover or focus lights the matching object in 3D.
export function ObjectNav() {
  const { setHovered, hovered, lastFocus } = useRoom();
  const refs = useRef<Partial<Record<RoomObjectId, HTMLAnchorElement | null>>>({});

  useEffect(() => {
    // Returning from a section: put focus back on the object that opened it.
    if (lastFocus) refs.current[lastFocus]?.focus({ preventScroll: true });
  }, [lastFocus]);

  return (
    <nav aria-label="Objects in the room" className="object-nav">
      <ul>
        {roomObjects
          .filter((o) => icons[o.id])
          .map((o) => {
            const Icon = icons[o.id]!;
            return (
              <li key={o.id}>
                <Link
                  href={o.href}
                  scroll={false}
                  ref={(el) => {
                    refs.current[o.id] = el;
                  }}
                  className={hovered === o.id ? "object-link is-lit" : "object-link"}
                  onPointerEnter={() => setHovered(o.id)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(o.id)}
                  onBlur={() => setHovered(null)}
                >
                  <Icon size={18} aria-hidden />
                  <span className="object-link-text">
                    <span className="object-link-label">{o.label}</span>
                    <span className="object-link-hint">{o.hint}</span>
                  </span>
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
