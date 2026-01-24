"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import CameraRail from "./CameraRail";
import Water from "./Water";
import CameraLook from "./CameraLook";

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
        position={[0, 10, 6]}
        castShadow
      />
      <directionalLight
        intensity={0.5}
        position={[-5, 5, 2]}
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
      <CameraRail />
      <CameraLook />
    </Canvas>
  );
}
