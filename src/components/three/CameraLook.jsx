"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function CameraLook() {
    const { camera } = useThree();
    
    const mouse = useRef({ x: 0, y: 0});
    const targetRot = useRef(new THREE.Vector2());
    const currentRot = useRef(new THREE.Vector2());

    useEffect(() => {
        const onMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };

        window.addEventListener("mousemove", onMouseMove);
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    useFrame(() => {
        const intensity = 0.15;

        targetRot.current.x = -mouse.current.y * intensity;
        targetRot.current.y = -mouse.current.x * intensity;

        currentRot.current.lerp(targetRot.current, 0.08);

        camera.rotation.x = currentRot.current.x;
        camera.rotation.y = currentRot.current.y;
    });

    return null;
}