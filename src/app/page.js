"use client";

import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import IntroUI from "@/components/intro/IntroUI";
import KF3UI from "@/components/ui/KF3UI";

const Map = dynamic(() => import("@/components/scene/Map"), { ssr: false });
const CameraController = dynamic(
  () => import("@/components/scene/Camera/CameraController"),
  { ssr: false }
);

function StageLighting({ introDone, boost }) {
  const spotRef = useRef();
  const dirRef = useRef();
  const pointRef = useRef();
  const acc = useRef(0);

  const HERO_BASE = 3.2;
  const HERO_BOOST = 4.4;

  useFrame((state, delta) => {
    acc.current += delta;
    if (acc.current < 1 / 30) return;
    acc.current = 0;

    const t = state.clock.elapsedTime;
    const heroTarget = boost ? HERO_BOOST : introDone ? HERO_BASE : 1.8;

    if (spotRef.current) {
      spotRef.current.position.x = Math.sin(t * 0.2) * 0.35;
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        heroTarget,
        0.08
      );
    }

    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(
        dirRef.current.intensity,
        introDone ? 1.2 : 0.9,
        0.06
      );
    }

    if (pointRef.current) {
      pointRef.current.intensity = THREE.MathUtils.lerp(
        pointRef.current.intensity,
        introDone ? 0.35 : 0.25,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <spotLight
        ref={spotRef}
        position={[0, 8, 5]}
        angle={0.38}
        penumbra={0.6}
        intensity={2}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        ref={dirRef}
        position={[-6, 6, -2]}
        intensity={1}
        color="#e8f0ff"
      />
      <pointLight
        ref={pointRef}
        position={[0, 3, -6]}
        intensity={0.3}
        color="#ffffff"
      />
    </>
  );
}

function EmissiveController({ introDone, boost }) {
  const { scene } = useThree();
  const mats = useRef([]);

  const BASE = 2.2;
  const BOOST = 3.6;

  useEffect(() => {
    mats.current = [];
    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      if (!o.name.toLowerCase().includes("logo")) return;

      const arr = Array.isArray(o.material) ? o.material : [o.material];
      arr.forEach((m) => {
        if (m.emissive) {
          m.emissive.set("#ffffff");
          m.emissiveIntensity = 0;
          m.mats.current.push(m);
        }
      });
    });
  }, [scene]);

  useFrame(() => {
    const target = boost ? BOOST : introDone ? BASE : 1.2;
    mats.current.forEach((m) => {
      m.emissiveIntensity = THREE.MathUtils.lerp(
        m.emissiveIntensity,
        target,
        0.1
      );
    });
  });

  return null;
}

function CameraBreathing() {
  const { camera } = useThree();
  const base = useRef(camera.position.clone());

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = base.current.x + Math.sin(t * 0.12) * 0.02;
    camera.position.y = base.current.y + Math.sin(t * 0.1) * 0.02;
    camera.fov = 45 + Math.sin(t * 0.1) * 0.25;
    camera.updateProjectionMatrix();
  });

  return null;
}

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const [boost, setBoost] = useState(false);

  const dpr = useMemo(
    () => (typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.25) : 1),
    []
  );

  useEffect(() => {
    if (!boost) return;
    const t = setTimeout(() => setBoost(false), 260);
    return () => clearTimeout(t);
  }, [boost]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#151515]">
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
      >
        <color attach="background" args={["#151515"]} />

        {process.env.NODE_ENV === "development" && <Stats />}

        <StageLighting introDone={introDone} boost={boost} />
        <CameraController />
        <CameraBreathing />
        <Map />
        <EmissiveController introDone={introDone} boost={boost} />

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.28} luminanceThreshold={0.85} />
          <Vignette offset={0.18} darkness={0.35} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}