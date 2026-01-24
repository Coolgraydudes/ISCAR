"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { useTexture, useCubeTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Water() {
  const { camera, gl, scene } = useThree();

  const normalMap = useTexture("/textures/water/tiles.jpg");
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;

  const envMap = useCubeTexture(
    ["xpos.jpg", "xneg.jpg", "ypos.jpg", "yneg.jpg", "zpos.jpg", "zneg.jpg"],
    { path: "/textures/skybox/" }
  );

  const depthTexture = useMemo(() => {
    const dt = new THREE.DepthTexture();
    dt.type = THREE.UnsignedShortType;
    return dt;
  }, []);

  const renderTarget = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    rt.depthTexture = depthTexture;
    rt.depthBuffer = true;
    return rt;
  }, [depthTexture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCameraPos: { value: new THREE.Vector3() },
      uWaterColor: { value: new THREE.Color(0x4aa3ff) },
      uDeepColor: { value: new THREE.Color(0x0b2d5c) },
      uSunDir: {
        value: new THREE.Vector3(0.3, 1.0, 0.2).normalize(),
      },
      uNormalMap: { value: normalMap },
      uEnvMap: { value: envMap },
      uDepthTexture: { value: renderTarget.depthTexture },
      uNear: { value: camera.near },
      uFar: { value: camera.far },
    }),
    [normalMap, envMap, depthTexture, camera]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uCameraPos.value.copy(camera.position);

    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, -1, 0]}
      frustumCulled={false}
    >
      <planeGeometry args={[400, 400, 512, 512]} />
      <shaderMaterial
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        depthTest={true}
        vertexShader={`
          uniform float uTime;
          varying vec3 vWorldPos;
          varying vec4 vClipPos;
          varying vec3 vNormal;

          float wave(vec2 p) {
            float w1 = sin(p.x * 0.12 + uTime * 0.8);
            float w2 = cos(p.y * 0.10 + uTime * 1.1);
            float w3 = sin((p.x + p.y) * 0.06 + uTime * 0.5);
            return (w1 + w2 + w3) * 0.35;
          }

          void main() {
            vec3 pos = position;
            pos.z += wave(pos.xz);
            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            vWorldPos = worldPos.xyz;
            vNormal = normalize(mat3(modelMatrix) * normal);
            vClipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_Position = vClipPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uCameraPos;
          uniform vec3 uWaterColor;
          uniform vec3 uDeepColor;
          uniform vec3 uSunDir;
          uniform sampler2D uNormalMap;
          uniform samplerCube uEnvMap;
          uniform sampler2D uDepthTexture;
          uniform float uNear;
          uniform float uFar;
          varying vec3 vWorldPos;
          varying vec4 vClipPos;
          varying vec3 vNormal;

          float linearizeDepth(float z) {
            float ndc = z * 2.0 - 1.0;
            return (2.0 * uNear * uFar) / (uFar + uNear - ndc * (uFar - uNear));
          }

          void main() {
            vec2 worldUV = vWorldPos.xz * 0.06;
            vec2 uv1 = worldUV + vec2(uTime * 0.03, uTime * 0.02);
            vec2 uv2 = worldUV * 1.7 - vec2(uTime * 0.015, uTime * 0.04);
            vec3 n1 = texture2D(uNormalMap, uv1).xyz * 2.0 - 1.0;
            vec3 n2 = texture2D(uNormalMap, uv2).xyz * 2.0 - 1.0;

            float dist = distance(uCameraPos, vWorldPos);
            float fade = smoothstep(10.0, 120.0, dist);

            vec3 normal = normalize(
              vNormal +
              n1 * mix(0.35, 0.18, fade) +
              n2 * mix(0.22, 0.10, fade)
            );

            vec2 screenUV = vClipPos.xy / vClipPos.w * 0.5 + 0.5;
            float sceneDepth = texture2D(uDepthTexture, screenUV).r;
            float sceneZ = linearizeDepth(sceneDepth);
            float waterZ = linearizeDepth(gl_FragCoord.z);

            float depthDiff = clamp((sceneZ - waterZ) * 0.12, 0.0, 1.0);
            vec3 baseColor = mix(uDeepColor, uWaterColor, depthDiff);

            vec3 viewDir = normalize(uCameraPos - vWorldPos);
            vec3 lightDir = normalize(uSunDir);
            float diffuse = clamp(dot(normal, lightDir) * 0.5 + 0.5, 0.0, 1.0);

            vec3 reflectDir = reflect(-viewDir, normal);
            reflectDir.xz += sin(uTime + vWorldPos.xz * 0.2) * 0.04;
            vec3 envColor = textureCube(uEnvMap, reflectDir).rgb * 0.9;

            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

            vec3 halfDir = normalize(lightDir + viewDir);
            float spec = pow(max(dot(normal, halfDir), 0.0), 80.0);
            float glitter = spec * smoothstep(0.3, 0.8, n1.x + n2.y);

            vec3 color = mix(baseColor, envColor, fresnel);
            color *= diffuse * 0.85 + 0.35;
            color += glitter * vec3(1.0, 0.95, 0.85);

            gl_FragColor = vec4(color, 0.88);
          }
        `}
      />
    </mesh>
  );
}