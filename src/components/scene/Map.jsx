"use client";

import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three-stdlib";
import { useEffect } from "react";
import { useIntro } from "../intro/IntroContext";


export default function Map() {
  const { scene } = useGLTF(
    "/models/ISCARIA_MapGading_BelomJadi_CR.glb",
    true,
    true,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const { setLoadingDone } = useIntro();
  useEffect(() => {
    if (scene) {
      setLoadingDone(true);
    }
  }, [scene, setLoadingDone]);


  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload(
  "/models/ISCARIA_MapGading_BelomJadi_CR.glb",
  true,
  true,
  (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  }
);
