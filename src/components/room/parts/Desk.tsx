"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { screenTexture } from "../textures";
import { useRoom } from "../RoomContext";

// Desk against the back wall. The monitor group is what the computer hotspot wraps.
export const MONITOR_POS: [number, number, number] = [1.35, 1.16, -2.74];

export function Monitor() {
  const screen = useMemo(() => screenTexture(), []);
  const light = useRef<THREE.PointLight>(null);
  const { reducedMotion, hovered, focus } = useRoom();
  // The screen brightens its spill on hover, matching the other objects' lift.
  const base = hovered === "computer" && !focus ? 6 : 3.2;

  useFrame(({ clock }) => {
    if (!light.current) return;
    // Faint screen shimmer: the only ambient motion in the room.
    const shimmer = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.12;
    light.current.intensity += (base + shimmer - light.current.intensity) * 0.2;
  });

  return (
    <group>
      <mesh position={[1.35, 0.78, -2.72]} castShadow>
        <boxGeometry args={[0.28, 0.018, 0.18]} />
        <meshStandardMaterial color="#1a1b1e" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[1.35, 0.94, -2.77]} castShadow>
        <boxGeometry args={[0.045, 0.3, 0.035]} />
        <meshStandardMaterial color="#1a1b1e" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={MONITOR_POS} castShadow>
        <boxGeometry args={[0.82, 0.48, 0.035]} />
        <meshStandardMaterial color="#0f1012" roughness={0.4} />
      </mesh>
      <mesh position={[MONITOR_POS[0], MONITOR_POS[1], MONITOR_POS[2] + 0.0185]} userData={{ noHighlight: true }}>
        <planeGeometry args={[0.78, 0.44]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[1.35, 1.12, -2.35]} color="#a9c7ff" intensity={3.2} distance={3.4} decay={2} />
    </group>
  );
}

export function Desk() {
  return (
    <group>
      {/* Desktop and frame */}
      <mesh position={[1.4, 0.745, -2.62]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.05, 0.72]} />
        <meshStandardMaterial color="#4a3a2f" roughness={0.6} />
      </mesh>
      {[
        [0.45, -2.3],
        [2.35, -2.3],
        [0.45, -2.92],
        [2.35, -2.92],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.04, 0.72, 0.04]} />
          <meshStandardMaterial color="#1c1d20" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Keyboard, mouse, mat */}
      <mesh position={[1.4, 0.772, -2.42]} receiveShadow>
        <boxGeometry args={[0.9, 0.004, 0.34]} />
        <meshStandardMaterial color="#1e1f23" roughness={1} />
      </mesh>
      <RoundedBox args={[0.44, 0.022, 0.14]} radius={0.008} position={[1.32, 0.786, -2.42]} castShadow>
        <meshStandardMaterial color="#2a2b2f" roughness={0.6} />
      </RoundedBox>
      <mesh position={[1.32, 0.8, -2.42]}>
        <boxGeometry args={[0.41, 0.006, 0.11]} />
        <meshStandardMaterial color="#3a3c42" roughness={0.7} />
      </mesh>
      <mesh position={[1.7, 0.787, -2.4]} scale={[0.7, 0.45, 1]} castShadow>
        <sphereGeometry args={[0.04, 16, 12]} />
        <meshStandardMaterial color="#2a2b2f" roughness={0.5} />
      </mesh>

      {/* Desk lamp, warm */}
      <group position={[0.62, 0.77, -2.8]}>
        <mesh position={[0, 0.012, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.025, 24]} />
          <meshStandardMaterial color="#1c1d20" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0.03]} rotation={[0.15, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />
          <meshStandardMaterial color="#1c1d20" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.42, 0.14]} rotation={[1.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.26, 8]} />
          <meshStandardMaterial color="#1c1d20" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.47, 0.26]} rotation={[0.5, 0, 0]} castShadow>
          <coneGeometry args={[0.07, 0.12, 20, 1, true]} />
          <meshStandardMaterial color="#1c1d20" side={2} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.43, 0.29]}>
          <sphereGeometry args={[0.025, 12, 8]} />
          <meshStandardMaterial color="#fff" emissive="#ffc58a" emissiveIntensity={2} />
        </mesh>
        <pointLight position={[0, 0.38, 0.3]} color="#ffb46b" intensity={1.4} distance={2.2} decay={2} />
      </group>

      {/* PC tower */}
      <group position={[2.12, 1.01, -2.64]}>
        <RoundedBox args={[0.22, 0.48, 0.44]} radius={0.015} castShadow>
          <meshStandardMaterial color="#17181b" roughness={0.45} metalness={0.2} />
        </RoundedBox>
        <mesh position={[0.112, 0.02, 0]}>
          <planeGeometry args={[0.36, 0.38]} />
          <meshStandardMaterial color="#20232a" roughness={0.1} metalness={0.3} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0.2, 0.222]}>
          <boxGeometry args={[0.12, 0.006, 0.002]} />
          <meshStandardMaterial color="#cfd9ec" emissive="#a9c7ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Mug and notebook */}
      <mesh position={[0.92, 0.82, -2.38]} castShadow>
        <cylinderGeometry args={[0.04, 0.038, 0.1, 18]} />
        <meshStandardMaterial color="#c8c1b4" roughness={0.7} />
      </mesh>
      <mesh position={[0.86, 0.776, -2.62]} rotation={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.2, 0.012, 0.28]} />
        <meshStandardMaterial color="#5a3d32" roughness={0.8} />
      </mesh>

      {/* Chair */}
      <group position={[1.35, 0, -1.84]}>
        <RoundedBox args={[0.52, 0.08, 0.5]} radius={0.03} position={[0, 0.48, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1f2024" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.5, 0.62, 0.07]} radius={0.03} position={[0, 0.86, 0.24]} rotation={[-0.08, 0, 0]} castShadow>
          <meshStandardMaterial color="#1f2024" roughness={0.9} />
        </RoundedBox>
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, a, 0]}>
              <mesh position={[0.15, 0.06, 0]} castShadow>
                <boxGeometry args={[0.3, 0.03, 0.04]} />
                <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh position={[0.29, 0.03, 0]}>
                <sphereGeometry args={[0.03, 10, 8]} />
                <meshStandardMaterial color="#0c0c0d" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
