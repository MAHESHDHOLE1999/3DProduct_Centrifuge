// import * as THREE from 'three';

// export const setupAdvancedLighting = (scene) => {
//   const ambientLight = new THREE.AmbientLight(0xffffff, 2);
//   scene.add(ambientLight);

//   const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
//   mainLight.position.set(5, 10, 5);
//   mainLight.castShadow = true;
//   mainLight.shadow.mapSize.width = 2048;
//   mainLight.shadow.mapSize.height = 2048;
//   mainLight.shadow.camera.near = 0.5;
//   mainLight.shadow.camera.far = 50;
//   mainLight.shadow.camera.left = -15;
//   mainLight.shadow.camera.right = 15;
//   mainLight.shadow.camera.top = 15;
//   mainLight.shadow.camera.bottom = -15;
//   scene.add(mainLight);

//   const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
//   fillLight.position.set(-5, 5, -5);
//   scene.add(fillLight);

//   const backLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
//   backLight.position.set(0, 3, -8);
//   scene.add(backLight);

//   const pointLight = new THREE.PointLight(0xff6b9d, 0.5);
//   pointLight.position.set(-3, 2, 3);
//   scene.add(pointLight);

//   return {
//     ambient: ambientLight,
//     main: mainLight,
//     fill: fillLight,
//     back: backLight,
//     point: pointLight
//   };
// };

// export const updateLightingIntensity = (lights, intensity) => {
// //   lights.ambient.intensity = 0.4 * intensity;
//   lights.ambient.intensity = intensity;
// //   lights.main.intensity = 0.9 * intensity;
// //   lights.fill.intensity = 0.4 * intensity;
// //   lights.back.intensity = 0.3 * intensity;
// //   lights.point.intensity = 0.5 * intensity;
// lights.directional.intensity = intensity * 1.5;
// };

import * as THREE from 'three';

export const setupAdvancedLighting = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 50;
  mainLight.shadow.camera.left = -15;
  mainLight.shadow.camera.right = 15;
  mainLight.shadow.camera.top = 15;
  mainLight.shadow.camera.bottom = -15;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
  backLight.position.set(0, 3, -8);
  scene.add(backLight);

  const pointLight = new THREE.PointLight(0xff6b9d, 0.5);
  pointLight.position.set(-3, 2, 3);
  scene.add(pointLight);

  return {
    ambient: ambientLight,
    main: mainLight,
    fill: fillLight,
    back: backLight,
    point: pointLight
  };
};

export const updateLightingIntensity = (lights, intensity) => {
  lights.ambient.intensity = 0.4 * intensity;
  lights.main.intensity = 0.9 * intensity;
  lights.fill.intensity = 0.4 * intensity;
  lights.back.intensity = 0.3 * intensity;
  lights.point.intensity = 0.5 * intensity;
};
