"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { roomObjects, type RoomObjectId } from "@/content/room";
import { useRoom } from "./RoomContext";

type Props = {
  id: RoomObjectId;
  labelAt: [number, number, number];
  children: React.ReactNode;
};

// Wraps a group of meshes so it reacts as one object: on hover or keyboard focus
// each surface glows faintly in its own colour (so Pikachu stays yellow and the
// jersey stays blaugrana), plus a short label; click navigates.
export function Interactive({ id, labelAt, children }: Props) {
  const ref = useRef<THREE.Group>(null);
  const { hovered, setHovered, focus, go } = useRoom();
  const obj = roomObjects.find((o) => o.id === id);
  const lit = hovered === id && !focus;

  useEffect(() => {
    ref.current?.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.noHighlight) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats as THREE.MeshStandardMaterial[]) {
        if (!("emissive" in m)) continue;
        if (!m.userData.base) {
          m.userData.base = { color: m.emissive.clone(), intensity: m.emissiveIntensity };
        }
        const base = m.userData.base as { color: THREE.Color; intensity: number };
        if (lit) {
          // Own-colour lift; near-black materials (monitor, tower) get a cool
          // floor so they read as clearly as bright ones.
          // Textured surfaces (the jersey's stripes) glow through their own map.
          if (m.map && !m.emissiveMap) {
            m.emissiveMap = m.map;
            m.needsUpdate = true;
          }
          m.emissive.copy(m.color).multiplyScalar(0.32);
          const l = m.emissive.r + m.emissive.g + m.emissive.b;
          if (l < 0.18) m.emissive.add(new THREE.Color(0.06, 0.07, 0.1));
          m.emissiveIntensity = 1;
        } else {
          m.emissive.copy(base.color);
          m.emissiveIntensity = base.intensity;
        }
      }
    });
  }, [lit]);

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (focus) return;
    setHovered(id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    if (hovered === id) setHovered(null);
    document.body.style.cursor = "";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "";
    if (obj) go(obj.href);
  };

  return (
    <group ref={ref} onPointerOver={over} onPointerOut={out} onClick={click}>
      {children}
      {obj && (
        <Html position={labelAt} center zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
          <div className={lit ? "obj-label is-on" : "obj-label"} aria-hidden="true">
            <span className="obj-label-name">{obj.label}</span>
            <span className="obj-label-hint">{obj.hint}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
