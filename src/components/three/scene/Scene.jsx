"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";

import CameraRail from "../camera/CameraRail";
import CameraLook from "../camera/CameraLook";
import Water from "../environment/Water";
import Sky from "../environment/Sky";
import CloudGroup from "../environment/CloudGroup";


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
      camera={{ position: [0, 2, 6], fov: 60, near: 0.1, far: 2000,}}
      style={{ position: "fixed", inset: 0 }}
    >

      <Sky />
      <Lights />
      <CloudGroup />
      <Water />
      <CameraRail />
      <CameraLook />
    </Canvas>
  );
}

