// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// export const loadGLTFModel = (url) => {
//   return new Promise((resolve, reject) => {
//     const loader = new GLTFLoader();
//     loader.load(
//       url,
//       (gltf) => resolve(gltf.scene),
//       (progress) => console.log('Loading:', (progress.loaded / progress.total) * 100 + '%'),
//       (error) => reject(error)
//     );
//   });
// };

// export const centerAndScaleModel = (model) => {
//   const box = new THREE.Box3().setFromObject(model);
//   const center = box.getCenter(new THREE.Vector3());
//   model.position.sub(center);

//   const size = box.getSize(new THREE.Vector3());
//   const maxDim = Math.max(size.x, size.y, size.z);
//   const scale = 3 / maxDim;
//   model.scale.multiplyScalar(scale);

//   return model;
// };

// export const createGeometricModel = () => {
//   const group = new THREE.Group();

//   const bodyGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
//   const bodyMaterial = new THREE.MeshStandardMaterial({
//     color: 0x333333,
//     metalness: 0.6,
//     roughness: 0.4
//   });
//   const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
//   group.add(body);

//   const rotorGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
//   const rotorMaterial = new THREE.MeshStandardMaterial({
//     color: 0x4ECDC4,
//     metalness: 0.8,
//     roughness: 0.2
//   });
//   const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
//   rotor.position.y = 1.7;
//   group.add(rotor);

//   const screenGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
//   const screenMaterial = new THREE.MeshStandardMaterial({
//     color: 0x222222,
//     emissive: 0x1a4d5c,
//     emissiveIntensity: 0.2
//   });
//   const screen = new THREE.Mesh(screenGeometry, screenMaterial);
//   screen.position.set(1.6, 0.5, 0);
//   group.add(screen);

//   const baseGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
//   const baseMaterial = new THREE.MeshStandardMaterial({
//     color: 0x1a1a1a,
//     metalness: 0.4,
//     roughness: 0.6
//   });
//   const base = new THREE.Mesh(baseGeometry, baseMaterial);
//   base.position.y = -1.65;
//   group.add(base);

//   return group;
// };

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const loadGLTFModel = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),
      (progress) => console.log('Loading:', (progress.loaded / progress.total) * 100 + '%'),
      (error) => reject(error)
    );
  });
};

export const centerAndScaleModel = (model) => {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);

  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 3 / maxDim;
  model.scale.multiplyScalar(scale);

  return model;
};

export const createGeometricModel = () => {
  const group = new THREE.Group();

  const bodyGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.6,
    roughness: 0.4
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  const rotorGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
  const rotorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4ECDC4,
    metalness: 0.8,
    roughness: 0.2
  });
  const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
  rotor.position.y = 1.7;
  group.add(rotor);

  const screenGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    emissive: 0x1a4d5c,
    emissiveIntensity: 0.2
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(1.6, 0.5, 0);
  group.add(screen);

  const baseGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.4,
    roughness: 0.6
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -1.65;
  group.add(base);

  return group;
};