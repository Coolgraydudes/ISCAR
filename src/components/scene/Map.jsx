"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { DRACOLoader } from "three-stdlib";
import { useEffect, useRef } from "react";
import { useIntro } from "../intro/IntroContext";
import * as THREE from "three";

export default function Map() {
  const { scene, animations } = useGLTF(
    "/models/iscaria.min.glb",
    true,
    true,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const { actions } = useAnimations(animations, scene);
  const {
    setLoadingDone,
    splashDone,
    startExplore,
    cameraSettled,
  } = useIntro();

  const initialized = useRef(false);

  const LOGO_SPEED = 1;
  const BASE_ROTATE_SPEED = 1;

  useEffect(() => {
    if (!scene) return;

    scene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;

      const name = obj.name.toLowerCase();
      if (!name.includes("logo")) return;

      const materials = Array.isArray(obj.material)
        ? obj.material
        : [obj.material];

      materials.forEach((mat) => {
        if (
          mat.isMeshStandardMaterial ||
          mat.isMeshPhysicalMaterial
        ) {
          mat.emissive = new THREE.Color("#ffd27d");
          mat.emissiveIntensity = 0;
        }
      });
    });
  }, [scene]);

  useEffect(() => {
    if (!scene || !actions || initialized.current) return;

    initialized.current = true;
    setLoadingDone(true);

    Object.values(actions).forEach((action) => {
      action.stop();
      action.enabled = false;
    });
  }, [scene, actions, setLoadingDone]);

  useEffect(() => {
    if (!splashDone || !actions) return;

    const logo = actions.logoBaruAction;
    if (!logo) return;

    logo.enabled = true;
    logo.reset();
    logo.setLoop(THREE.LoopOnce, 1);
    logo.clampWhenFinished = true;
    logo.timeScale = LOGO_SPEED;
    logo.play();
  }, [splashDone, actions]);

  useEffect(() => {
    if (!actions) return;

    const baseRotate = actions.baseDivisiRotate;
    if (!baseRotate) return;

    if (startExplore && !cameraSettled) {
      baseRotate.enabled = true;
      baseRotate.reset();
      baseRotate.setLoop(THREE.LoopRepeat, Infinity);
      baseRotate.timeScale = BASE_ROTATE_SPEED;
      baseRotate.play();
    }
  }, [startExplore, cameraSettled, actions]);

  useEffect(() => {
    if (!actions || !cameraSettled) return;

    const baseRotate = actions.baseDivisiRotate;
    if (!baseRotate) return;

    baseRotate.stop();
    baseRotate.enabled = false;
  }, [cameraSettled, actions]);

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

useGLTF.preload("/models/iscaria.min.glb");