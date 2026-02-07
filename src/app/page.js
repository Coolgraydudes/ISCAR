"use client";

import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import IntroUI from "@/components/intro/IntroUI";
import KF3UI from "@/components/ui/KF3UI";

const Map = dynamic(() => import("@/components/scene/Map"), { ssr: false });
const CameraController = dynamic(
  () => import("@/components/scene/Camera/CameraController"),
  { ssr: false }
);

function StageLighting() {
  const spotRef = useRef();

  useFrame(({ clock }) => {
    if (!spotRef.current) return;
    const t = clock.getElapsedTime();
    spotRef.current.position.x = Math.sin(t * 0.2) * 0.4;
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <spotLight
        ref={spotRef}
        position={[0, 10, 5]}
        angle={0.45}
        penumbra={1}
        intensity={4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={2} color="#ffffff" />
      <directionalLight position={[0, 10, -10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, 0, 0]} intensity={0.8} color="#ffffff" />
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#f0f0f0]">
      <IntroUI
        onClick={() => {
          setIntroDone(true);
          setBoost(true);
        }}
      />  
      <KF3UI />

      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ fov: 45, position: [0, 4, 10] }}
        className="absolute inset-0"
      >
        <color attach="background" args={["#f0f0f0"]} />
        <Stats showPanel={0} />
        <StageLighting />
2        <CameraController />
        <Map />
      </Canvas>
    </div>
  );
}