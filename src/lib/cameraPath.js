import * as THREE from "three";

export const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(5, 1, 6),
  new THREE.Vector3(-5, 2, 3),
  new THREE.Vector3(0, 0, 0),
]);
