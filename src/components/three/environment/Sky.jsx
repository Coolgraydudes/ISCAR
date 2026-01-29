"use client";

import * as THREE from "three";
import { useMemo } from "react";

export default function Sky() {
  const material = useMemo(() => {
return new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  uniforms: {
    topColor: { value: new THREE.Color("#8ecae6") },
    bottomColor: { value: new THREE.Color("#e0f2ff") },
    offset: { value: 33 },
    exponent: { value: 0.6 },
  },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;

        void main() {
          float h = normalize(vWorldPosition + offset).y;
          float mixVal = max(pow(max(h, 0.0), exponent), 0.0);
          gl_FragColor = vec4(mix(bottomColor, topColor, mixVal), 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh 
    scale={500}
    renderOrder={-1}
    frustumCulled={false}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
    