"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIntro } from "../../intro/IntroContext";

function cubicBezier(p1x, p1y, p2x, p2y) {
  return function (t) {
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;

    const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;

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
  const { loadingDone, setIntroReady, hoverZoom } = useIntro();

  const startPos = useRef(new THREE.Vector3(0, 3, 7));
  const endPos = useRef(new THREE.Vector3(0, 1, 5.5));

  const startPitch = -0.85;
  const endPitch = 0;
  const basePitchRef = useRef(startPitch);

  const baseFov = useRef(camera.fov);
  const targetFov = useRef(camera.fov);

  const timer = useRef(0);
  const duration = 14;
  const ease = useRef(cubicBezier(0.51, 0.01, 0.0, 1.0));

  const cursor = useRef({ x: 0, y: 0 });
  const currentYaw = useRef(0);
  const currentPitchOffset = useRef(0);

  const maxYaw = THREE.MathUtils.degToRad(9);
  const maxPitch = THREE.MathUtils.degToRad(8);
  const yawBias = -0.01;

  const initialized = useRef(false);
  const introFinished = useRef(false);

  useEffect(() => {
    if (!loadingDone || initialized.current) return;

    initialized.current = true;
    introFinished.current = false;
    timer.current = 0;

    camera.position.copy(startPos.current);
    camera.rotation.order = "YXZ";
    camera.rotation.set(startPitch, 0, 0);

    basePitchRef.current = startPitch;
    baseFov.current = camera.fov;

    const onMouseMove = (e) => {
      cursor.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      cursor.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [loadingDone, camera]);

  useFrame((_, delta) => {
    if (!loadingDone) return;

    if (!introFinished.current) {
      timer.current += delta;
      const t = Math.min(timer.current / duration, 1);
      const eased = ease.current(t);

      camera.position.lerpVectors(startPos.current, endPos.current, eased);
      basePitchRef.current = THREE.MathUtils.lerp(startPitch, endPitch, eased);

      if (t === 1) {
        introFinished.current = true;
        setIntroReady(true);
      }
    }

    targetFov.current = hoverZoom ? baseFov.current - 5 : baseFov.current;

    camera.fov = THREE.MathUtils.lerp(
      camera.fov,
      targetFov.current,
      delta * 3
    );
    camera.updateProjectionMatrix();

    const targetYaw = -cursor.current.x * maxYaw + yawBias;
    const targetPitchOffset = -cursor.current.y * maxPitch;

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
    camera.rotation.x = basePitchRef.current + currentPitchOffset.current;
    camera.rotation.z = 0;
  });

  return null;
}