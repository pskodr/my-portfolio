"use client";

import { RoundedBox } from "@react-three/drei";

const METAL = { color: "#1b1c1f", metalness: 0.5, roughness: 0.45 } as const;

export const CAMERA_POS: [number, number, number] = [-0.95, 0, 0.75];

// A mirrorless camera on a tripod, aimed across the room at the desk, so it
// reads in profile from the viewer's angle.
export function VideoCamera() {
  const head = 1.18;
  return (
    <group position={CAMERA_POS} rotation={[0, 2.35, 0]}>
      {/* Tripod legs */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4;
        const fx = Math.cos(a) * 0.34;
        const fz = Math.sin(a) * 0.34;
        const len = Math.hypot(fx, head - 0.06, fz);
        const tilt = Math.atan2(Math.hypot(fx, fz), head - 0.06);
        return (
          <group key={i} position={[0, head - 0.06, 0]} rotation={[0, -a, 0]}>
            <mesh position={[Math.sin(tilt) * len * 0.5, -Math.cos(tilt) * len * 0.5, 0]} rotation={[0, 0, tilt]} castShadow>
              <cylinderGeometry args={[0.012, 0.009, len, 8]} />
              <meshStandardMaterial {...METAL} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, head - 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.5, 8]} />
        <meshStandardMaterial {...METAL} />
      </mesh>
      <mesh position={[0, head - 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 16]} />
        <meshStandardMaterial {...METAL} />
      </mesh>

      {/* Camera body */}
      <group position={[0, head + 0.1, 0]} scale={1.7}>
        <RoundedBox args={[0.15, 0.1, 0.075]} radius={0.012} castShadow>
          <meshStandardMaterial color="#202125" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[0.04, 0.09, 0.05]} radius={0.01} position={[-0.075, -0.004, 0.03]} castShadow>
          <meshStandardMaterial color="#17181b" roughness={0.9} />
        </RoundedBox>
        <mesh position={[0.012, -0.004, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.038, 0.04, 0.1, 24]} />
          <meshStandardMaterial color="#141517" roughness={0.5} />
        </mesh>
        <mesh position={[0.012, -0.004, 0.131]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.002, 24]} />
          <meshStandardMaterial color="#0a0c12" roughness={0.05} metalness={0.8} />
        </mesh>
        <mesh position={[0.012, -0.004, 0.105]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.039, 0.003, 6, 24]} />
          <meshStandardMaterial color="#5a5c62" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Top mic and record light */}
        <mesh position={[0.02, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.012, 0.07, 4, 10]} />
          <meshStandardMaterial color="#2a2b2f" roughness={1} />
        </mesh>
        <mesh position={[0.06, 0.035, 0.038]}>
          <sphereGeometry args={[0.005, 8, 6]} />
          <meshStandardMaterial color="#c24a3d" emissive="#c24a3d" emissiveIntensity={0.6} />
        </mesh>
        {/* Flip screen */}
        <mesh position={[0.085, 0, -0.01]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.07, 0.05, 0.006]} />
          <meshStandardMaterial color="#17181b" emissive="#2a3550" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}
