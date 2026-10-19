"use client";

import { useMemo } from "react";
import * as THREE from "three";

const YELLOW = "#f6d24f";
const BROWN = "#6e4a2d";
const BLACK = "#1b1a19";

function tailShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0.05, 0.07);
  s.lineTo(0.02, 0.09);
  s.lineTo(0.09, 0.17);
  s.lineTo(0.05, 0.19);
  s.lineTo(0.13, 0.3);
  s.lineTo(-0.02, 0.21);
  s.lineTo(0.01, 0.19);
  s.lineTo(-0.05, 0.1);
  s.lineTo(-0.02, 0.08);
  s.lineTo(-0.04, 0.02);
  s.lineTo(0, 0);
  return s;
}

// A plush version of the owner's Pikachu, sitting on the bed by the pillow.
export function Plush() {
  const tail = useMemo(
    () => new THREE.ExtrudeGeometry(tailShape(), { depth: 0.02, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 }),
    [],
  );
  const fabric = { color: YELLOW, roughness: 0.95 };

  return (
    <group position={[-1.98, 0.555, -2.22]} rotation={[0, 0.55, 0]}>
      {/* Body */}
      <mesh position={[0, 0.13, 0]} scale={[1, 1.04, 0.9]} castShadow>
        <sphereGeometry args={[0.13, 28, 20]} />
        <meshStandardMaterial {...fabric} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`f${s}`} position={[s * 0.06, 0.02, 0.07]} scale={[1, 0.55, 1.3]} castShadow>
          <sphereGeometry args={[0.04, 14, 10]} />
          <meshStandardMaterial {...fabric} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`a${s}`} position={[s * 0.085, 0.16, 0.08]} scale={[0.7, 1, 0.8]} castShadow>
          <sphereGeometry args={[0.035, 12, 10]} />
          <meshStandardMaterial {...fabric} />
        </mesh>
      ))}
      {/* Back stripes */}
      {[0.17, 0.11].map((y) => (
        <mesh key={y} position={[0, y, -0.105]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.11, 0.022, 0.03]} />
          <meshStandardMaterial color={BROWN} roughness={0.95} />
        </mesh>
      ))}

      {/* Head */}
      <mesh position={[0, 0.31, 0.005]} scale={[1.12, 0.94, 1]} castShadow>
        <sphereGeometry args={[0.115, 28, 20]} />
        <meshStandardMaterial {...fabric} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={`e${s}`} position={[s * 0.075, 0.4, -0.01]} rotation={[0, 0, -s * 0.5]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.036, 0.13, 14]} />
            <meshStandardMaterial {...fabric} />
          </mesh>
          <mesh position={[0, 0.155, 0]} castShadow>
            <coneGeometry args={[0.024, 0.07, 14]} />
            <meshStandardMaterial color={BLACK} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Face */}
      {[-1, 1].map((s) => (
        <group key={`x${s}`}>
          <mesh position={[s * 0.045, 0.33, 0.1]}>
            <sphereGeometry args={[0.016, 12, 10]} />
            <meshStandardMaterial color={BLACK} roughness={0.3} />
          </mesh>
          <mesh position={[s * 0.045 + 0.005, 0.337, 0.113]}>
            <sphereGeometry args={[0.005, 8, 6]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[s * 0.08, 0.29, 0.088]} rotation={[0, s * 0.6, 0]}>
            <circleGeometry args={[0.022, 18]} />
            <meshStandardMaterial color="#c4473b" roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.31, 0.112]}>
        <sphereGeometry args={[0.005, 8, 6]} />
        <meshStandardMaterial color={BLACK} />
      </mesh>

      {/* Tail */}
      <mesh geometry={tail} position={[0.1, 0.06, -0.1]} rotation={[0, -1.0, -0.15]} scale={1.35} castShadow>
        <meshStandardMaterial {...fabric} />
      </mesh>
    </group>
  );
}

export function Switch() {
  return (
    <group position={[-2.3, 0.625, -1.32]} rotation={[-Math.PI / 2, 0, 0.35]}>
      <mesh castShadow>
        <boxGeometry args={[0.17, 0.1, 0.013]} />
        <meshStandardMaterial color="#1c1d20" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.0068]} userData={{ noHighlight: true }}>
        <planeGeometry args={[0.15, 0.085]} />
        <meshStandardMaterial color="#0d0f14" emissive="#28344d" emissiveIntensity={0.5} roughness={0.15} />
      </mesh>
      <mesh position={[-0.103, 0, 0]} castShadow>
        <boxGeometry args={[0.036, 0.1, 0.016]} />
        <meshStandardMaterial color="#3f6aa8" roughness={0.5} />
      </mesh>
      <mesh position={[0.103, 0, 0]} castShadow>
        <boxGeometry args={[0.036, 0.1, 0.016]} />
        <meshStandardMaterial color="#b9463c" roughness={0.5} />
      </mesh>
    </group>
  );
}
