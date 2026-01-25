"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";

import CameraRail from "./CameraRail";
import CameraLook from "./CameraLook";
import Water from "./Water";
import CloudGroup from "./CloudGroup";
import Rain from "./Rain";

function Lights() {
  const dirLight = useRef();

  useEffect(() => {
    if (dirLight.current) {
      dirLight.current.target.position.set(0, 0, 0);
      dirLight.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />

      <directionalLight
        ref={dirLight}
        intensity={2}
        position={[0, 200, 100]}
        castShadow
      />

      <directionalLight
        intensity={0.5}
        position={[-100, 50, 50]}
        color="#88aaff"
      />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 60 }}
      style={{ position: "fixed", inset: 0 }}
    >
      <Lights />

      <Water />
      <CloudGroup />

      <Rain
        count={900}
        area={100}
        height={50}
        speed={45}
        length={1.1}
      />

      <CameraRail />
      <CameraLook />
    </Canvas>
  );
}