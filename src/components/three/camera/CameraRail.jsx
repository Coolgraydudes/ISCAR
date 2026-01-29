"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRail() {
  const { camera } = useThree();
  const startTime = useRef(null);
  const lookAtVec = useRef(new THREE.Vector3());

  const keyframes = useRef([
    {
      time: 0,
      position: new THREE.Vector3(0, 120, 270),
      lookAt: new THREE.Vector3(10, 0, 0),
    },
    {
      time: 5,
      position: new THREE.Vector3(0, 120, 100),
      lookAt: new THREE.Vector3(0, 40, 0),
    },
    {
      time: 9,
      position: new THREE.Vector3(0, 100  , 100),
      lookAt: new THREE.Vector3(0, 0, 0),
    },
  ]);

  useEffect(() => {
    const kf0 = keyframes.current[0];
    camera.position.copy(kf0.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(kf0.lookAt);
    camera.rotation.z = 0;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(({ clock }) => {
    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTime.current;
    const kfs = keyframes.current;

    let i = 0;
    for (; i < kfs.length - 1; i++) {
      if (elapsed >= kfs[i].time && elapsed <= kfs[i + 1].time) break;
    }

    if (i >= kfs.length - 1) return;

    const kfA = kfs[i];
    const kfB = kfs[i + 1];

    const alpha = (elapsed - kfA.time) / (kfB.time - kfA.time);

    camera.position.lerpVectors(kfA.position, kfB.position, alpha);

    lookAtVec.current.lerpVectors(kfA.lookAt, kfB.lookAt, alpha);

    camera.up.set(0, 1, 0);
    camera.lookAt(lookAtVec.current);
    camera.rotation.z = 0;
  });

  return null;
}