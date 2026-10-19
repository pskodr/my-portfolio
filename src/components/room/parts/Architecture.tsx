"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { fabricTexture, floorTexture, plasterTexture, rugTexture, bookSpineTexture } from "../textures";

// Static set dressing: the diorama base, walls, window, rug, bed, nightstand,
// shelf and frames. Nothing here is interactive.
export function Architecture() {
  const floor = useMemo(() => floorTexture(), []);
  const wallBack = useMemo(() => plasterTexture("#56575c"), []);
  const wallLeft = useMemo(() => plasterTexture("#5a5b60"), []);
  const rug = useMemo(() => rugTexture(), []);
  const duvet = useMemo(() => fabricTexture("#3a4350", 2), []);
  const sheet = useMemo(() => fabricTexture("#8a867f", 4), []);
  const curtain = useMemo(() => fabricTexture("#3b3a38", 9), []);
  const books = useMemo(() => bookSpineTexture(), []);

  return (
    <group>
      {/* Diorama base */}
      <mesh position={[-0.075, -0.16, -0.075]} receiveShadow>
        <boxGeometry args={[6.35, 0.32, 6.35]} />
        <meshStandardMaterial color="#17181b" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial map={floor} roughness={0.72} />
      </mesh>

      {/* Walls */}
      <mesh position={[-0.075, 1.5, -3.075]} receiveShadow>
        <boxGeometry args={[6.15, 3, 0.15]} />
        <meshStandardMaterial map={wallBack} roughness={0.95} />
      </mesh>
      <mesh position={[-3.075, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.15, 3, 6]} />
        <meshStandardMaterial map={wallLeft} roughness={0.95} />
      </mesh>
      {/* Skirting */}
      <mesh position={[0, 0.05, -2.99]}>
        <boxGeometry args={[6, 0.1, 0.03]} />
        <meshStandardMaterial color="#1d1e21" roughness={0.6} />
      </mesh>
      <mesh position={[-2.99, 0.05, 0]}>
        <boxGeometry args={[0.03, 0.1, 6]} />
        <meshStandardMaterial color="#1d1e21" roughness={0.6} />
      </mesh>

      {/* Window on the left wall */}
      <group position={[-2.99, 1.65, 1.0]}>
        <mesh>
          <boxGeometry args={[0.04, 1.2, 1.3]} />
          <meshStandardMaterial color="#1b1c1f" roughness={0.5} />
        </mesh>
        <mesh position={[0.025, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.18, 1.08]} />
          <meshStandardMaterial color="#121a2b" emissive="#2a3c61" emissiveIntensity={0.55} roughness={0.2} />
        </mesh>
        <mesh position={[0.035, 0, 0]}>
          <boxGeometry args={[0.02, 1.1, 0.035]} />
          <meshStandardMaterial color="#1b1c1f" />
        </mesh>
        <mesh position={[0.035, 0, 0]}>
          <boxGeometry args={[0.02, 0.035, 1.2]} />
          <meshStandardMaterial color="#1b1c1f" />
        </mesh>
        <mesh position={[0.09, -0.62, 0]} castShadow>
          <boxGeometry args={[0.18, 0.04, 1.42]} />
          <meshStandardMaterial color="#2f3033" roughness={0.7} />
        </mesh>
        {/* Curtains */}
        {[-0.82, 0.82].map((z) => (
          <mesh key={z} position={[0.1, 0.05, z]} castShadow>
            <boxGeometry args={[0.06, 1.5, 0.34]} />
            <meshStandardMaterial map={curtain} roughness={1} />
          </mesh>
        ))}
        <mesh position={[0.14, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 2.1, 8]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.008, -0.55]} receiveShadow>
        <planeGeometry args={[3.0, 2.2]} />
        <meshStandardMaterial map={rug} roughness={1} />
      </mesh>

      {/* Bed against the left wall, headboard in the corner */}
      <group position={[-2.3, 0, -1.85]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.3, 2.2]} />
          <meshStandardMaterial color="#2c2522" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.66, -1.08]} castShadow>
          <boxGeometry args={[1.44, 0.95, 0.07]} />
          <meshStandardMaterial color="#2c2522" roughness={0.75} />
        </mesh>
        <RoundedBox args={[1.3, 0.2, 2.08]} radius={0.06} position={[0, 0.45, 0.02]} castShadow receiveShadow>
          <meshStandardMaterial map={sheet} roughness={1} />
        </RoundedBox>
        <RoundedBox args={[1.36, 0.12, 1.42]} radius={0.05} position={[0, 0.56, 0.4]} castShadow receiveShadow>
          <meshStandardMaterial map={duvet} roughness={1} />
        </RoundedBox>
        {/* Folded-back top of the duvet, showing the sheet side */}
        <RoundedBox args={[1.37, 0.05, 0.2]} radius={0.024} smoothness={6} position={[0, 0.615, -0.24]} castShadow>
          <meshStandardMaterial map={duvet} color="#c9c6c0" roughness={1} />
        </RoundedBox>
        {/* Headboard panel inset */}
        <mesh position={[0, 0.78, -1.04]}>
          <boxGeometry args={[1.26, 0.5, 0.012]} />
          <meshStandardMaterial color="#3a312c" roughness={0.8} />
        </mesh>
        <RoundedBox args={[0.82, 0.14, 0.42]} radius={0.06} position={[0, 0.6, -0.78]} rotation={[0.12, 0, 0]} castShadow>
          <meshStandardMaterial color="#b0aba2" roughness={1} />
        </RoundedBox>
      </group>

      {/* Nightstand and lamp */}
      <group position={[-2.68, 0, -0.38]}>
        <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.52, 0.44]} />
          <meshStandardMaterial color="#332a25" roughness={0.7} />
        </mesh>
        {/* Drawer fronts with pulls */}
        {[0.36, 0.14].map((y) => (
          <group key={y}>
            <mesh position={[0.251, y, 0]}>
              <boxGeometry args={[0.004, 0.18, 0.4]} />
              <meshStandardMaterial color="#3b312b" roughness={0.6} />
            </mesh>
            <mesh position={[0.258, y, 0]}>
              <boxGeometry args={[0.01, 0.018, 0.12]} />
              <meshStandardMaterial color="#9c8a70" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.06, 0.535, 0.1]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.16, 0.03, 0.22]} />
          <meshStandardMaterial color="#6d5a4a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.16, 16]} />
          <meshStandardMaterial color="#c9c2b5" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.77, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.18, 24, 1, true]} />
          <meshStandardMaterial color="#e9dcc4" emissive="#ffb86b" emissiveIntensity={0.9} side={2} />
        </mesh>
        <pointLight position={[0, 0.78, 0.05]} color="#ffb46b" intensity={1.6} distance={2.6} decay={2} />
      </group>

      {/* Shelf above the desk */}
      <group position={[1.35, 2.05, -2.86]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.04, 0.26]} />
          <meshStandardMaterial color="#3a2e27" roughness={0.7} />
        </mesh>
        <mesh position={[-0.42, 0.15, 0]} castShadow>
          <boxGeometry args={[0.62, 0.26, 0.2]} />
          <meshStandardMaterial map={books} roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.09, 0.02]} rotation={[0, 0, 0.0]} castShadow>
          <boxGeometry args={[0.2, 0.14, 0.02]} />
          <meshStandardMaterial color="#d8d2c6" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
          <meshStandardMaterial color="#b9b1a4" roughness={0.8} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0.6 + Math.cos(i * 1.3) * 0.04, 0.17 + i * 0.012, Math.sin(i * 1.3) * 0.04]} rotation={[Math.sin(i) * 0.5, i, Math.cos(i) * 0.5]} castShadow>
            <sphereGeometry args={[0.05, 10, 8]} />
            <meshStandardMaterial color="#4b6650" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Frames above the bed, ready for the owner's photos */}
      {[
        { z: -2.25, h: 0.5, w: 0.38, art: "#4a4f5a" },
        { z: -1.7, h: 0.38, w: 0.5, art: "#5a4b44" },
      ].map((f) => (
        <group key={f.z} position={[-2.985, 1.75, f.z]}>
          <mesh castShadow>
            <boxGeometry args={[0.03, f.h, f.w]} />
            <meshStandardMaterial color="#141416" roughness={0.6} />
          </mesh>
          <mesh position={[0.017, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[f.w - 0.06, f.h - 0.06]} />
            <meshStandardMaterial color={f.art} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Floor plant, back-right corner */}
      <group position={[2.72, 0, -2.66]}>
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.36, 20]} />
          <meshStandardMaterial color="#5c5750" roughness={0.85} />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.12, 0.62 + (i % 3) * 0.12, Math.sin(a) * 0.12]} rotation={[Math.sin(a) * 0.5, a, Math.cos(a) * 0.5]} castShadow>
              <coneGeometry args={[0.07, 0.55, 6]} />
              <meshStandardMaterial color="#3f5544" roughness={0.9} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
