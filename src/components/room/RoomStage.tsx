"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRoom } from "./RoomContext";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });

type Mode = "pending" | "3d" | "static";

function canRun3D() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 2) return false;
  return !new URLSearchParams(window.location.search).has("static");
}

// Hosts the 3D room, or a static render of it when WebGL isn't available or the
// device can't run the scene comfortably. The static image doubles as the
// loading state, so the room never flashes empty.
let cachedMode: Mode | null = null;
const subscribe = () => () => {};
const clientMode = () => (cachedMode ??= canRun3D() ? "3d" : "static");
const serverMode = (): Mode => "pending";

export function RoomStage() {
  const { focus } = useRoom();
  const mode = useSyncExternalStore(subscribe, clientMode, serverMode);
  const [ready, setReady] = useState(false);

  return (
    <div className="stage" data-focus={focus ?? "room"} data-mode={mode} data-ready={ready}>
      <picture>
        <source media="(max-width: 819px)" srcSet="/room/room-still-mobile.png" />
        <img className="stage-still" src="/room/room-still.png" alt="" fetchPriority="high" />
      </picture>
      {mode === "3d" && (
        <div className="stage-canvas">
          <Scene onReady={() => setReady(true)} />
        </div>
      )}
      {mode !== "3d" || !ready ? (
        <p className="stage-status" role="status">
          {mode === "static" ? "Showing a still of the room." : "Setting up the room…"}
        </p>
      ) : null}
    </div>
  );
}
