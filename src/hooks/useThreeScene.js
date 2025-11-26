// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// export const useThreeScene = (containerRef, options = {}) => {
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const modelRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     // scene.background = new THREE.Color(options.bgColor || 0x1a1a1a);
//     scene.background = new THREE.Color(0xffffff);

//     // Camera setup
//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     camera.position.set(0, 0, 5);

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       // alpha: true
//       alpha: false
//     });
//     renderer.setSize(width, height);
//     renderer.setClearColor(0xffffff, 1);
//     renderer.shadowMap.enabled = true;
//     renderer.setPixelRatio(window.devicePixelRatio);
//     containerRef.current.appendChild(renderer.domElement);

//     sceneRef.current = scene;
//     cameraRef.current = camera;
//     rendererRef.current = renderer;

//     // Handle window resize
//     const handleResize = () => {
//       // if (!containerRef.current) return;
//       const w = containerRef.current.clientWidth;
//       const h = containerRef.current.clientHeight;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       renderer.dispose();
//       if (containerRef.current?.contains(renderer.domElement)) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return {
//     scene: sceneRef,
//     camera: cameraRef,
//     renderer: rendererRef,
//     modelRef
//   };
// };

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const useThreeScene = (containerRef, options = {}) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(options.bgColor || 0x1a1a1a);
    scene.background = new THREE.Color(0xFFFFFF);

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    modelRef
  };
};