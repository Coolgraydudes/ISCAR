"use client";

import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

import IntroUI from "@/components/intro/IntroUI";

const Map = dynamic(() => import("@/components/scene/Map"), { ssr: false });
const CameraController = dynamic(
  () => import("@/components/scene/Camera/CameraController"),
  { ssr: false }
);

function StageLighting({ introDone, boost }) {
  const spotRef = useRef();
  const baseIntensity = 2.2;
  const boostedIntensity = 2.8;

  const isLowEnd =
    typeof navigator !== "undefined" &&
    navigator.hardwareConcurrency &&
    navigator.hardwareConcurrency <= 4;

  useFrame(({ clock }) => {
    if (!spotRef.current) return;

    const t = clock.getElapsedTime();
    spotRef.current.position.x = Math.sin(t * 0.2) * 0.4;

    const target = boost ? boostedIntensity : introDone ? baseIntensity : 0;

    spotRef.current.intensity = THREE.MathUtils.lerp(
      spotRef.current.intensity,
      target,
      0.05
    );
  });

  return (
    <>
      <ambientLight intensity={0.06} />

      <spotLight
        ref={spotRef}
        position={[0, 8, 4]}
        angle={0.32}
        penumbra={0.7}
        intensity={0}
        color="#ffffff"
        castShadow={!isLowEnd}
        shadow-mapSize-width={isLowEnd ? 512 : 1024}
        shadow-mapSize-height={isLowEnd ? 512 : 1024}
      />

      <pointLight
        position={[0, 6, -8]}
        intensity={0.12}
        color="#3a2f1f"
      />

      <directionalLight
        position={[-4, 2, -2]}
        intensity={0.22}
        color="#9bb0ff"
      />

      <directionalLight
        position={[0, 3, -6]}
        intensity={0.35}
        color="#8aa4ff"
      />

      <directionalLight
        position={[0, -3, 0]}
        intensity={0.15}
        color="#000000"
      />
    </>
  );
}

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const [boost, setBoost] = useState(false);

  useEffect(() => {
    if (!boost) return;
    const t = setTimeout(() => setBoost(false), 300);
    return () => clearTimeout(t);
  }, [boost]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0b0b]">
      <IntroUI
        onClick={() => {
          setIntroDone(true);
          setBoost(true);
        }}
      />

      <Canvas
        dpr={[1, 1.25]}
        shadows
        camera={{ fov: 45, position: [0, 1.5, 6] }}
        className="absolute inset-0"
      >
        <color attach="background" args={["#0b0b0b"]} />

        <Stats showPanel={0} />

        <StageLighting introDone={introDone} boost={boost} />

        <CameraController />
        <Map />
      </Canvas>
    </div>
  );
}