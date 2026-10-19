"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { stripeTexture } from "../textures";

// Blaugrana stripes only: no crest or sponsor marks.
function shirtShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.09, 0.36);
  s.lineTo(-0.21, 0.33);
  s.lineTo(-0.37, 0.2);
  s.lineTo(-0.29, 0.08);
  s.lineTo(-0.21, 0.14);
  s.lineTo(-0.22, -0.36);
  s.quadraticCurveTo(0, -0.39, 0.22, -0.36);
  s.lineTo(0.21, 0.14);
  s.lineTo(0.29, 0.08);
  s.lineTo(0.37, 0.2);
  s.lineTo(0.21, 0.33);
  s.lineTo(0.09, 0.36);
  s.quadraticCurveTo(0, 0.28, -0.09, 0.36);
  return s;
}

export function Jersey() {
  const geo = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shirtShape(), {
        depth: 0.025,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.01,
        bevelSegments: 3,
      }),
    [],
  );
  const stripes = useMemo(() => stripeTexture(), []);

  return (
    <group position={[-0.62, 1.72, -2.97]}>
      {/* Nail and hanger */}
      <mesh position={[0, 0.5, 0.02]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 8]} />
        <meshStandardMaterial color="#8a8780" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.43, 0.05]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.035, 0.005, 6, 16, Math.PI * 1.4]} />
        <meshStandardMaterial color="#2b2b2e" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.36, 0.05]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.24, 0.007, 6, 24, Math.PI * 0.55]} />
        <meshStandardMaterial color="#2b2b2e" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh geometry={geo} position={[0, 0, 0.03]} castShadow>
        <meshStandardMaterial map={stripes} roughness={0.85} />
      </mesh>
      {/* Collar trim */}
      <mesh position={[0, 0.315, 0.072]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.085, 0.008, 6, 20, Math.PI]} />
        <meshStandardMaterial color="#e3b52a" roughness={0.7} />
      </mesh>
    </group>
  );
}

const PHI = (1 + Math.sqrt(5)) / 2;
const PATCH_DIRS = [
  [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
].map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());

export const BALL_POS: [number, number, number] = [-0.35, 0.11, -2.45];

export function Ball() {
  const R = 0.11;
  const patches = useMemo(
    () =>
      PATCH_DIRS.map((d) => ({
        pos: d.clone().multiplyScalar(R * 1.001),
        quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), d),
      })),
    [],
  );
  return (
    <group position={BALL_POS} rotation={[0.4, 0.6, 0.1]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[R, 40, 28]} />
        <meshStandardMaterial color="#e7e4dc" roughness={0.55} />
      </mesh>
      {patches.map((p, i) => (
        <mesh key={i} position={p.pos} quaternion={p.quat}>
          <circleGeometry args={[0.038, 5]} />
          <meshStandardMaterial color="#1b1b1d" roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      ))}
    </group>
  );
}
