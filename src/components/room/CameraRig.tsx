"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { RoomObjectId } from "@/content/room";
import { useRoom } from "./RoomContext";

type Shot = { pos: [number, number, number]; target: [number, number, number]; fov: number };

// Overview and per-object shots. Desktop shots leave room on the right for the
// panel; the view offset below shifts the frame so the object sits left of it.
const desktop: Record<"room" | RoomObjectId, Shot> = {
  room: { pos: [6.9, 5.5, 7.3], target: [-0.75, 0.85, -0.75], fov: 31 },
  computer: { pos: [4.4, 2.7, 1.3], target: [1.3, 1.05, -2.5], fov: 32 },
  soccer: { pos: [2.2, 2.3, 1.6], target: [-0.5, 1.0, -2.6], fov: 32 },
  pokemon: { pos: [1.2, 2.2, 1.0], target: [-2.1, 0.62, -1.85], fov: 30 },
  camera: { pos: [2.4, 2.3, 3.6], target: [-0.95, 1.05, 0.75], fov: 30 },
  avatar: { pos: [4.0, 2.6, 1.0], target: [1.35, 1.0, -1.95], fov: 30 },
};

const mobile: Record<"room" | RoomObjectId, Shot> = {
  room: { pos: [9.2, 7.0, 8.2], target: [0.55, 0.95, -0.95], fov: 46 },
  computer: { pos: [2.9, 2.0, 0.2], target: [1.35, 1.1, -2.6], fov: 44 },
  soccer: { pos: [1.2, 1.8, 0.6], target: [-0.5, 1.0, -2.6], fov: 44 },
  pokemon: { pos: [0.3, 1.8, 0.4], target: [-2.1, 0.62, -1.85], fov: 44 },
  camera: { pos: [1.4, 1.9, 2.6], target: [-0.95, 1.1, 0.75], fov: 44 },
  avatar: { pos: [3.0, 2.2, 0.4], target: [1.35, 1.0, -1.95], fov: 44 },
};

export const PANEL_FRACTION = 0.5;

export function CameraRig() {
  const { size } = useThree();
  const { focus, reducedMotion } = useRoom();
  const target = useRef(new THREE.Vector3(...desktop.room.target));
  const offset = useRef(0);
  const lift = useRef(0);
  const first = useRef(true);
  const want = useRef(new THREE.Vector3());

  const isMobile = size.width < 820;
  const shots = isMobile ? mobile : desktop;
  const shot = shots[focus ?? "room"];

  useFrame((state, dt) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    // First frame (and reduced motion) snaps; otherwise an exponential approach
    // that is brief and interruptible by any new focus.
    const snap = first.current || reducedMotion;
    first.current = false;
    const k = snap ? 1 : 1 - Math.exp(-dt * 5.5);
    cam.position.lerp(want.current.set(...shot.pos), k);
    target.current.lerp(want.current.set(...shot.target), k);
    cam.fov += (shot.fov - cam.fov) * k;

    // Desktop: slide the frame so the focused object sits left of the panel.
    // Mobile overview: lift the room into the band between intro and controls.
    const wantOffset = focus && !isMobile ? size.width * PANEL_FRACTION * 0.5 : 0;
    const wantLift = !focus && isMobile ? size.height * 0.08 : 0;
    offset.current += (wantOffset - offset.current) * k;
    lift.current += (wantLift - lift.current) * k;
    if (Math.abs(offset.current) > 0.5 || Math.abs(lift.current) > 0.5) {
      cam.setViewOffset(size.width, size.height, offset.current, lift.current, size.width, size.height);
    } else {
      cam.clearViewOffset();
    }
    cam.lookAt(target.current);
    cam.updateProjectionMatrix();
  });

  return null;
}
