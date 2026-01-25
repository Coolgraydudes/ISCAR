"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function Rain({
  count = 1200,
  area = 100,
  height = 50,
  speed = 45,
  length = 1.2,
}) {
  const lines = useRef(null);
  const group = useRef(null);
  const { camera } = useThree();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 6);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * area;
      const y = Math.random() * height;
      const z = (Math.random() - 0.5) * area;

      pos.set([x, y, z, x, y - length, z], i * 6);
      vel[i] = speed * (0.6 + Math.random() * 0.8);
    }

    return { positions: pos, velocities: vel };
  }, [count, area, height, length, speed]);

  useFrame((_, delta) => {
    if (!group.current || !lines.current) return;

    const dt = Math.min(delta, 0.033);

    group.current.position.set(
      camera.position.x,
      camera.position.y + height * 0.5,
      camera.position.z
    );

    const pos = lines.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const v = velocities[i] * dt;

      pos[i * 6 + 1] -= v;
      pos[i * 6 + 4] -= v;

      if (pos[i * 6 + 1] < -height) {
        pos[i * 6 + 1] += height * 2;
        pos[i * 6 + 4] = pos[i * 6 + 1] - length;
      }
    }

    lines.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#bcdcff"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}