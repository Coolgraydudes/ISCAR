"use client";

import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import IntroUI from "@/components/intro/IntroUI";
import KF3UI from "@/components/ui/KF3UI";

const Map = dynamic(
  () => import("@/components/scene/Map"),
  { ssr: false }
);
const CameraController = dynamic(
  () => import("@/components/scene/Camera/CameraController"),
  { ssr: false }
);

function StageLighting({ introDone, boost }) {
  const spotRef = useRef();
  const dirRef = useRef();
  const pointRef = useRef();
  const acc = useRef(0);

  const HERO_BASE = 1.7;
  const HERO_BOOST = 2.4;

  useFrame((state, delta) => {
    if (!spotRef.current) return;

    acc.current += delta;
    if (acc.current < 1 / 30) return;
    acc.current = 0;

    const t = state.clock.elapsedTime;

    spotRef.current.position.x = Math.sin(t * 0.18) * 0.28;

    const heroTarget = boost ? HERO_BOOST : introDone ? HERO_BASE : 0;

    spotRef.current.intensity = THREE.MathUtils.lerp(
      spotRef.current.intensity,
      heroTarget,
      0.055
    );

    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(
        dirRef.current.intensity,
        introDone ? 0.06 : 0.16,
        0.045
      );
    }

    if (pointRef.current) {
      pointRef.current.intensity = THREE.MathUtils.lerp(
        pointRef.current.intensity,
        introDone ? 0.035 : 0.07,
        0.045
      );
    }
  });

  return (
    <>
      <ambientLight intensity={introDone ? 0.015 : 0.022} />

      <spotLight
        ref={spotRef}
        position={[0, 7.5, 4]}
        angle={0.32}
        penumbra={0.9}
        intensity={0}
        color="#fff1cf"
      />

      <directionalLight
        ref={dirRef}
        position={[-4, 3, -4]}
        intensity={0.16}
        color="#8fa3d1"
      />

      <pointLight
        ref={pointRef}
        position={[0, 4.5, -6]}
        intensity={0.07}
        color="#241a12"
      />
    </>
  );
}

function EmissiveController({ introDone, boost }) {
  const { scene } = useThree();
  const mats = useRef([]);
  const acc = useRef(0);

  const BASE = 1.85;
  const BOOST = 3.2;

  useEffect(() => {
    if (!scene) return;
    mats.current = [];

    scene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      if (!obj.name.toLowerCase().includes("logo")) return;

      const materials = Array.isArray(obj.material)
        ? obj.material
        : [obj.material];

      materials.forEach((mat) => {
        if (mat.emissive) {
          mat.emissiveIntensity = 0;
          mats.current.push(mat);
        }
      });
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!mats.current.length) return;

    acc.current += delta;
    if (acc.current < 1 / 30) return;
    acc.current = 0;

    const target = boost ? BOOST : introDone ? BASE : 0;

    mats.current.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        target,
        0.075
      );
    });
  });

  return null;
}

function BloomController({ boost }) {
  return (
    <Bloom
      intensity={boost ? 0.36 : 0.22}
      luminanceThreshold={0.92}
      luminanceSmoothing={0.1}
      mipmapBlur
    />
  );
}

function CameraBreathing() {
  const { camera } = useThree();
  const basePos = useRef(camera.position.clone());
  const acc = useRef(0);

  useFrame((state, delta) => {
    acc.current += delta;
    if (acc.current < 1 / 30) return;
    acc.current = 0;

    const t = state.clock.elapsedTime;

    camera.position.x = basePos.current.x + Math.sin(t * 0.12) * 0.02;
    camera.position.y = basePos.current.y + Math.sin(t * 0.08) * 0.015;

    camera.fov = 45 + Math.sin(t * 0.1) * 0.4;
    camera.updateProjectionMatrix();
  });

  return null;
}

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const [boost, setBoost] = useState(false);

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio || 1, 1.2);
  }, []);

  useEffect(() => {
    if (!boost) return;
    const t = setTimeout(() => setBoost(false), 260);
    return () => clearTimeout(t);
  }, [boost]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0b0b]">
      <IntroUI
        onClick={() => {
          setIntroDone(true);
          setBoost(true);
        }}
      />
      <KF3UI />

      <Canvas
        dpr={dpr}
        camera={{ fov: 45, position: [0, 1.8, 6] }}
        className="absolute inset-0"
      >
        <color attach="background" args={["#0b0b0b"]} />

        {process.env.NODE_ENV === "development" && <Stats />}

        <StageLighting introDone={introDone} boost={boost} />
        <CameraController />
        <CameraBreathing />
        <Map />

        <EmissiveController introDone={introDone} boost={boost} />

        <EffectComposer multisampling={0}>
          <BloomController boost={boost} />
          <Vignette offset={0.26} darkness={0.7} eskil={false} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}