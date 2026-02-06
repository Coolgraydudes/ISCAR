"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { DRACOLoader } from "three-stdlib";
import { useEffect } from "react";
import { useIntro } from "../intro/IntroContext";

export default function Map() {
  const { scene, animations } = useGLTF(
    "/models/ismap.min.glb",
    true,
    true,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const { actions } = useAnimations(animations, scene);
  const { setLoadingDone } = useIntro();

  useEffect(() => {
    if (scene) {
      setLoadingDone(true);
      
      Object.values(actions).forEach((action) => {
        action.play();
      });
    }

    return () => {
      Object.values(actions).forEach((action) => action.stop());
    };
  }, [scene, actions, setLoadingDone]);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />  
  );
}

useGLTF.preload(
  "/models/ismap.min.glb",
  true,
  true,
  (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  }
);