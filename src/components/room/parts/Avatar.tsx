"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

// PLACEHOLDER CHARACTER. A deliberately simple stylised figure seated at the
// desk, facing the monitor. Replace this whole component with a modelled
// character (e.g. a GLB via useGLTF) once the owner supplies a reference.
// Keep the export name and the seat anchor so the rest of the room is untouched.

const SKIN = "#c39572";
const HAIR = "#2a221d";
const TOP = "#4b5361";
const PANTS = "#24262b";
const SHOES = "#d6d2ca";

function Limb({ from, to, r, color }: { from: number[]; to: number[]; r: number; color: string }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: a.add(b).multiplyScalar(0.5), quat, len };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <capsuleGeometry args={[r, Math.max(len - r * 2, 0.01), 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

export function Avatar() {
  return (
    <group>
      {/* Hips and torso, leaning toward the screen */}
      <mesh position={[1.35, 0.6, -1.86]} castShadow>
        <boxGeometry args={[0.32, 0.14, 0.26]} />
        <meshStandardMaterial color={PANTS} roughness={0.9} />
      </mesh>
      <mesh position={[1.35, 0.88, -1.9]} rotation={[-0.14, 0, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.26, 8, 16]} />
        <meshStandardMaterial color={TOP} roughness={0.95} />
      </mesh>
      {/* Hood resting on the back */}
      <mesh position={[1.35, 1.08, -1.8]} scale={[1.2, 0.6, 0.8]} castShadow>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial color={TOP} roughness={0.95} />
      </mesh>
      <mesh position={[1.35, 1.12, -1.94]} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 0.08, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Head and hair */}
      <mesh position={[1.35, 1.26, -1.97]} castShadow>
        <sphereGeometry args={[0.125, 24, 18]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
      {/* Hair built from overlapping clumps, so it reads as hair from behind */}
      {[
        [0, 0.075, 0.0, 0.1],
        [-0.06, 0.06, 0.02, 0.085],
        [0.06, 0.06, 0.02, 0.085],
        [0, 0.05, 0.065, 0.09],
        [-0.075, 0.02, 0.05, 0.07],
        [0.075, 0.02, 0.05, 0.07],
        [-0.035, 0.1, -0.03, 0.07],
        [0.04, 0.095, -0.04, 0.07],
        [0, 0.0, 0.09, 0.075],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[1.35 + x, 1.26 + y, -1.97 + z]} scale={[1, 0.82, 1]} castShadow>
          <sphereGeometry args={[r, 14, 10]} />
          <meshStandardMaterial color={HAIR} roughness={0.85} />
        </mesh>
      ))}
      {/* Over-ear headphones: band across the crown, cups over the ears */}
      <mesh position={[1.35, 1.27, -1.96]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.011, 8, 28, Math.PI]} />
        <meshStandardMaterial color="#d8d4cc" roughness={0.45} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`cup${s}`} position={[1.35 + s * 0.145, 1.255, -1.96]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.035, 18]} />
          <meshStandardMaterial color="#d8d4cc" roughness={0.45} />
        </mesh>
      ))}
      {/* Joints and cuffs break up the capsule limbs */}
      {[-1, 1].map((s) => (
        <group key={`j${s}`}>
          <mesh position={[1.35 + s * 0.215, 0.83, -2.13]} castShadow>
            <sphereGeometry args={[0.052, 12, 10]} />
            <meshStandardMaterial color={TOP} roughness={0.95} />
          </mesh>
          <mesh position={[1.35 + s * 0.11, 0.57, -2.26]} castShadow>
            <sphereGeometry args={[0.07, 12, 10]} />
            <meshStandardMaterial color={PANTS} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {[
        [1.215, 0.81, -2.37],
        [1.675, 0.81, -2.35],
      ].map((p) => (
        <mesh key={p[0]} position={p as [number, number, number]} rotation={[Math.PI / 2 - 0.1, 0, 0]}>
          <torusGeometry args={[0.044, 0.01, 6, 16]} />
          <meshStandardMaterial color="#3a414e" roughness={0.9} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[1.35 + s * 0.125, 1.25, -1.96]} castShadow>
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.8} />
        </mesh>
      ))}

      {/* Arms reaching to keyboard and mouse */}
      <Limb from={[1.16, 1.0, -1.9]} to={[1.13, 0.83, -2.13]} r={0.05} color={TOP} />
      <Limb from={[1.13, 0.83, -2.13]} to={[1.22, 0.81, -2.38]} r={0.042} color={TOP} />
      <mesh position={[1.23, 0.805, -2.42]} castShadow>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      <Limb from={[1.54, 1.0, -1.9]} to={[1.6, 0.83, -2.13]} r={0.05} color={TOP} />
      <Limb from={[1.6, 0.83, -2.13]} to={[1.68, 0.81, -2.36]} r={0.042} color={TOP} />
      <mesh position={[1.69, 0.805, -2.4]} castShadow>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>

      {/* Legs */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb from={[1.35 + s * 0.09, 0.58, -1.86]} to={[1.35 + s * 0.11, 0.57, -2.26]} r={0.07} color={PANTS} />
          <Limb from={[1.35 + s * 0.11, 0.57, -2.26]} to={[1.35 + s * 0.11, 0.1, -2.22]} r={0.058} color={PANTS} />
          <RoundedBox args={[0.1, 0.07, 0.21]} radius={0.03} position={[1.35 + s * 0.11, 0.045, -2.29]} castShadow>
            <meshStandardMaterial color={SHOES} roughness={0.7} />
          </RoundedBox>
          <mesh position={[1.35 + s * 0.11, 0.012, -2.29]}>
            <boxGeometry args={[0.104, 0.018, 0.212]} />
            <meshStandardMaterial color="#3a3a3c" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
