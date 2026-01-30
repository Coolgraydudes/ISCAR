"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function Water() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
        uColorDeep: { value: new THREE.Color("#062c3d") },     // deep ocean
        uColorShallow: { value: new THREE.Color("#4fc3e0") }, // cyan highlight
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
      <planeGeometry args={[2000, 2000, 128, 128]} />

      <shaderMaterial
        uniforms={uniforms}
        transparent
        vertexShader={/* glsl */ `
          uniform float uTime;
          varying vec3 vWorldPos;
          varying vec3 vNormal;

          float wave(vec2 p) {
            return
              sin(p.x * 0.04 + uTime * 1.5) * 0.25 +
              cos(p.y * 0.05 + uTime * 1.2) * 0.25 +
              sin((p.x + p.y) * 0.02 + uTime) * 0.15;

          }

          void main() {
            vec3 pos = position;
            float h = wave(pos.xy);
            pos.z += h;

            // approximate normal from height map
            float eps = 0.5;
            float hx = wave(pos.xy + vec2(eps, 0.0));
            float hy = wave(pos.xy + vec2(0.0, eps));

            vec3 dx = vec3(eps, 0.0, hx - h);
            vec3 dy = vec3(0.0, eps, hy - h);

            vNormal = normalize(cross(dy, dx));
            vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorDeep;
          uniform vec3 uColorShallow;
          varying vec3 vWorldPos;
          varying vec3 vNormal;

          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);

            vec3 color = mix(uColorDeep, uColorShallow, fresnel);
            gl_FragColor = vec4(color, 0.92);
          }
        `}
      />
    </mesh>
  );
}
