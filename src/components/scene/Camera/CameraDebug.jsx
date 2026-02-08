import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";

export default function CameraDebug() {
  const { camera } = useThree();
  const pos = useState({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    pos.current.x = camera.position.x.toFixed(2);
    pos.current.y = camera.position.y.toFixed(2);
    pos.current.z = camera.position.z.toFixed(2);
  });

  return (
    <Html fullscreen>
      <div className="fixed top-5 right-5 z-50 rounded-lg bg-black/60 px-3 py-2 text-xs text-white font-mono leading-tight pointer-events-none">
        <div>X: {pos.x}</div>
        <div>Y: {pos.y}</div>
        <div>Z: {pos.z}</div>
      </div>
    </Html>
  );
}
