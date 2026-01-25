"use client";

import * as THREE from "three";

const CLOUDS = [
  { pos: [0, 0, 0], scale: 60 },
  { pos: [30, 10, -20], scale: 45 },
  { pos: [-40, -5, 10], scale: 50 },
  { pos: [20, -10, 30], scale: 40 },
  { pos: [-25, 5, -35], scale: 35 },
];

export default function CloudGroup() {
  return (
    <group position={[0, 145, 140]}>
      {CLOUDS.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh> 
      ))}
    </group>
  );
}
