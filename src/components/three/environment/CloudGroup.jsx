"use client";

import { Cloud } from "@react-three/drei";
import { Suspense } from "react";

export default function CloudGroup() {
  return (
    <Suspense fallback={null}>
      <Cloud
        seed={1}
        position={[0, 150, -360]}
        scale={45}
        speed={0.2}
        opacity={0.85}
        color="#ffffff"
        frustumCulled={false}
        depthTest={false}
        renderOrder={10}
        layers={2}
      />

      <Cloud
        seed={2}
        position={[120, 150, -400]}
        scale={55}
        speed={0.25}
        opacity={0.8}
        color="#f5faff"
        frustumCulled={false}
        depthTest={false}
        renderOrder={10}
        layers={2}
      />

      <Cloud
        seed={3}
        position={[-140, 150, -380]}
        scale={50}
        speed={0.15}
        opacity={0.9}
        color="#ffffff"
        frustumCulled={false}
        depthTest={false}
        renderOrder={10}
        layers={2}
      />
    </Suspense>
  );
}
