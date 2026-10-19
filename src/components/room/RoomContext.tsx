"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { focusForPath, type RoomObjectId } from "@/content/room";

type RoomState = {
  hovered: RoomObjectId | null;
  setHovered: (id: RoomObjectId | null) => void;
  focus: RoomObjectId | null;
  go: (href: string) => void;
  // The object whose panel was open last, so focus can return to it.
  lastFocus: RoomObjectId | null;
  reducedMotion: boolean;
};

const Ctx = createContext<RoomState | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const focus = focusForPath(pathname);
  const [hovered, setHovered] = useState<RoomObjectId | null>(null);
  const [lastFocus, setLastFocus] = useState<RoomObjectId | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const prevFocus = useRef(focus);

  useEffect(() => {
    if (prevFocus.current && !focus) setLastFocus(prevFocus.current);
    prevFocus.current = focus;
    setHovered(null);
  }, [focus]);

  useEffect(() => {
    // Review hooks, only in builds made with NEXT_PUBLIC_REVIEW_HOOKS=1:
    // ?capture renders the room alone (used to make the static fallback
    // stills); ?hover=<id> previews an object's highlight.
    if (process.env.NEXT_PUBLIC_REVIEW_HOOKS !== "1") return;
    const q = new URLSearchParams(window.location.search);
    if (q.has("capture")) document.documentElement.dataset.capture = "";
    const h = q.get("hover") as RoomObjectId | null;
    if (h) setTimeout(() => setHovered(h), 50);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const value = useMemo<RoomState>(
    () => ({
      hovered,
      setHovered,
      focus,
      go: (href) => router.push(href, { scroll: false }),
      lastFocus,
      reducedMotion,
    }),
    [hovered, focus, router, lastFocus, reducedMotion],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRoom() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRoom must be used inside RoomProvider");
  return v;
}
