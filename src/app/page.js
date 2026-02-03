"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

import IntroUI from "@/components/intro/IntroUI";

const Map = dynamic(() => import("@/components/scene/Map"), { ssr: false });
const CameraController = dynamic(
  () => import("@/components/scene/Camera/CameraController"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1c1c1c]">
      <IntroUI
        onClick={() => {
          console.log("Intro clicked");
        }}
      />

      <Canvas
        dpr={[1, 1.25]}
        shadows={false}
        camera={{ fov: 40, position: [0, 0, 0] }}
        className="absolute inset-0"
      >
        <color attach="background" args={["#1c1c1c"]} />

        <Stats showPanel={0} className="absolute top-0 right-0" />

        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} />

        <CameraController />
        <Map />
      </Canvas>
    </div>
  );
}
