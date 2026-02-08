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
  const {
    loadingDone,
    setIntroReady,
    setCameraSettled,
    hoverZoom,
    startExplore,
  } = useIntro();

  const kf1Pos = useRef(new THREE.Vector3(0, 10, 12.6));
  const kf2Pos = useRef(new THREE.Vector3(0, 1.1, 5.5));
  const kf3Pos = useRef(new THREE.Vector3(0, 0.4, 0.13));

  const startPitch = -1.6;
  const endPitch = 0.09;
  const explorePitch = 0.11;

  const BASE_FOV = useRef(camera.fov);
  const zoomAmount = 5;
  const zoomFactor = useRef(0);

  const introTimer = useRef(0);
  const exploreTimer = useRef(0);
  const settleTimer = useRef(0);

  const introDuration = 9.5;
  const exploreDuration = 6;
  const SETTLE_DELAY = 0.6;

  const ease = useRef(cubicBezier(0.51, 0.01, 0.0, 1.0));

  const cursor = useRef({ x: 0, y: 0 });
  const currentYaw = useRef(0);
  const currentPitchOffset = useRef(0);

  const maxYaw = THREE.MathUtils.degToRad(9);
  const maxPitch = THREE.MathUtils.degToRad(8);
  const yawBias = -0.01;

  const initialized = useRef(false);
  const frameReady = useRef(false);
  const introFinished = useRef(false);
  const cameraSettledRef = useRef(false);
  const kf3Active = useRef(false);

  const frozenPos = useRef(new THREE.Vector3());
  const frozenRot = useRef(new THREE.Euler());

  useEffect(() => {
    if (!loadingDone || initialized.current) return;

    initialized.current = true;
    frameReady.current = false;
    introFinished.current = false;
    cameraSettledRef.current = false;
    kf3Active.current = false;
    introTimer.current = 0;
    exploreTimer.current = 0;
    settleTimer.current = 0;

    camera.position.copy(kf1Pos.current);
    camera.rotation.order = "YXZ";
    camera.rotation.set(startPitch, 0, 0);

    BASE_FOV.current = camera.fov;
    zoomFactor.current = 0;

    requestAnimationFrame(() => {
      frameReady.current = true;
    });

    const onMouseMove = (e) => {
      cursor.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      cursor.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [loadingDone, camera]);

  useFrame((_, delta) => {
    if (!loadingDone || !frameReady.current) return;

    if (!introFinished.current) {
      introTimer.current += delta;
      const t = Math.min(introTimer.current / introDuration, 1);
      const eased = ease.current(t);

      camera.position.lerpVectors(kf1Pos.current, kf2Pos.current, eased);
      camera.rotation.x = THREE.MathUtils.lerp(startPitch, endPitch, eased);

      if (t === 1) {
        introFinished.current = true;
        frozenPos.current.copy(camera.position);
        frozenRot.current.copy(camera.rotation);
      }
    }

    if (introFinished.current && !cameraSettledRef.current && !startExplore) {
      settleTimer.current += delta;
      if (settleTimer.current >= SETTLE_DELAY) {
        cameraSettledRef.current = true;
        setCameraSettled(true);
        setIntroReady(true);
      }
    }

    if (startExplore && !kf3Active.current) {
      kf3Active.current = true;
      exploreTimer.current = 0;
      cameraSettledRef.current = false;
      setCameraSettled(false);
    }

    if (kf3Active.current) {
      exploreTimer.current += delta;
      const t = Math.min(exploreTimer.current / exploreDuration, 1);
      const eased = ease.current(t);

      camera.position.lerpVectors(kf2Pos.current, kf3Pos.current, eased);
      camera.rotation.x = THREE.MathUtils.lerp(endPitch, explorePitch, eased);

      if (t === 1 && !cameraSettledRef.current) {
        cameraSettledRef.current = true;
        setCameraSettled(true);
      }
    }

    if (introFinished.current && !kf3Active.current) {
      camera.position.copy(frozenPos.current);
      camera.rotation.copy(frozenRot.current);
    }

    const hoverAllowed =
      introFinished.current &&
      cameraSettledRef.current &&
      !kf3Active.current;

    const targetZoom = hoverAllowed && hoverZoom ? 1 : 0;

    zoomFactor.current = THREE.MathUtils.damp(
      zoomFactor.current,
      targetZoom,
      6,
      delta
    );

    camera.fov = BASE_FOV.current - zoomFactor.current * zoomAmount;
    camera.updateProjectionMatrix();

    const targetYaw = -cursor.current.x * maxYaw + yawBias;
    const targetPitchOffset = -cursor.current.y * maxPitch;

    currentYaw.current = THREE.MathUtils.damp(
      currentYaw.current,
      targetYaw,
      6,
      delta
    );

    currentPitchOffset.current = THREE.MathUtils.damp(
      currentPitchOffset.current,
      targetPitchOffset,
      6,
      delta
    );

    camera.rotation.y = currentYaw.current;
    camera.rotation.x += currentPitchOffset.current;
    camera.rotation.z = 0;
  });

  return null;
}