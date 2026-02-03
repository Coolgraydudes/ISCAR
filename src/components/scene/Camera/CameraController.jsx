"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useIntro } from "../../intro/IntroContext";
import * as THREE from "three";

function cubicBezier(p1x, p1y, p2x, p2y) {
  return function (t) {
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;
    const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
    const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    let x = t;
    for (let i = 0; i < 5; i++) {
      const dx = sampleCurveX(x) - t;
      if (Math.abs(dx) < 1e-5) break;
      x -= dx / sampleCurveDerivativeX(x);
    }
    return sampleCurveY(x);
  };
}

export default function CameraController() {
  const { camera } = useThree();
  const { setIntroReady } = useIntro();
  const startPos = useRef(new THREE.Vector3(0, 3, 7));
  const endPos = useRef(new THREE.Vector3(0, 1, 5.5));
  const startPitch = -0.85;
  const endPitch = 0;
  const timer = useRef(0);
  const DURATION = 6;
  const ease = useRef(cubicBezier(0.51, 0.01, 0.0, 1.0));

  const cursor = useRef({ x: 0, y: 0 });
  const currentYaw = useRef(0);
  const currentPitchOffset = useRef(0);

  const MAX_YAW = THREE.MathUtils.degToRad(9);
  const MAX_PITCH = THREE.MathUtils.degToRad(8);
  
  const YAW_BIAS = -0.01; 

  useEffect(() => {
    camera.position.copy(startPos.current);
    camera.rotation.order = "YXZ";

    const onMouseMove = (e) => {
      cursor.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      cursor.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [camera]);

  const introTriggered = useRef(false);
  useFrame((_, delta) => {
  timer.current += delta;
  const t = Math.min(timer.current / DURATION, 1);
  const eased = ease.current(t);

  if (t === 1 && !introTriggered.current) {
    introTriggered.current = true;
    setIntroReady(true);
  }

  camera.position.lerpVectors(startPos.current, endPos.current, eased);

  const basePitch = THREE.MathUtils.lerp(startPitch, endPitch, eased);

  const targetYaw = (-cursor.current.x * MAX_YAW) + YAW_BIAS;
  const targetPitchOffset = -cursor.current.y * MAX_PITCH;

  currentYaw.current = THREE.MathUtils.lerp(
    currentYaw.current,
    targetYaw,
    delta * 4
  );

  currentPitchOffset.current = THREE.MathUtils.lerp(
    currentPitchOffset.current,
    targetPitchOffset,
    delta * 4
  );

  camera.rotation.y = currentYaw.current;
  camera.rotation.x = basePitch + currentPitchOffset.current;
  camera.rotation.z = 0;
});


  return null;
}