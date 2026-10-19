"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { Interactive } from "./Interactive";
import { Architecture } from "./parts/Architecture";
import { Avatar } from "./parts/Avatar";
import { Desk, Monitor } from "./parts/Desk";
import { Plush, Switch } from "./parts/Pokemon";
import { Ball, Jersey } from "./parts/Soccer";
import { VideoCamera } from "./parts/VideoCamera";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} color="#b4b2ae" />
      <hemisphereLight args={["#9a9a9e", "#2e2622", 0.85]} />
      {/* Low room fill, as if from a ceiling light just out of frame */}
      <pointLight position={[0.2, 2.9, -0.6]} intensity={9} distance={9} decay={2} color="#ecdfcc" />
      {/* Warm spill over the bed so the plush's yellow lands */}
      <pointLight position={[-1.75, 1.35, -1.55]} intensity={1.6} distance={2.4} decay={2} color="#ffcf8f" />
      {/* Moonlight through the window */}
      <directionalLight
        position={[-7, 6.5, 3]}
        intensity={1.1}
        color="#9fb2e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      {/* Soft key from the open side of the diorama */}
      <spotLight position={[6, 7, 6]} angle={0.55} penumbra={1} intensity={110} color="#d9d4cc" decay={2} />
    </>
  );
}

export function Scene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, 1.75]}
      camera={{ position: [8.4, 6.6, 8.8], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      resize={{ debounce: 0 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0d0e10");
        onReady?.();
      }}
      aria-hidden="true"
    >
      <fog attach="fog" args={["#0d0e10", 16, 30]} />
      <Lights />
      <Architecture />
      <Desk />
      <Interactive id="computer" labelAt={[1.35, 1.55, -2.74]}>
        <Monitor />
      </Interactive>
      <Interactive id="avatar" labelAt={[1.35, 1.55, -1.95]}>
        <Avatar />
      </Interactive>
      <Interactive id="soccer" labelAt={[-0.62, 2.35, -2.9]}>
        <Jersey />
        <Ball />
      </Interactive>
      <Interactive id="pokemon" labelAt={[-2.05, 1.18, -2.0]}>
        <Plush />
        <Switch />
      </Interactive>
      <Interactive id="camera" labelAt={[-0.95, 1.65, 0.75]}>
        <VideoCamera />
      </Interactive>
      <CameraRig />
    </Canvas>
  );
}
