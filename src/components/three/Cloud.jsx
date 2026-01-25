"use client";

import { useRef } from "react";
import * as THREE from "three";

export default function Cloud({
  position = [0, 145, 180],
  scale = 120,
}) {
  const cloudRef = useRef();

  return (
    <mesh ref={cloudRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.25}
        depthWrite={false}
        roughness={1}
      />
    </mesh>
  );
}
