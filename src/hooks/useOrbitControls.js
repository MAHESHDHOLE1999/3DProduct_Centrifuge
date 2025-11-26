import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useOrbitControls = (camera, renderer, options = {}) => {
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!camera || !renderer) return;

    const controls = new OrbitControls(camera, renderer.domElement);

    // Default settings
    controls.enableDamping = options.enableDamping !== false;
    controls.dampingFactor = options.dampingFactor || 0.05;
    controls.autoRotate = options.autoRotate !== false;
    controls.autoRotateSpeed = options.autoRotateSpeed || 2;
    controls.enableZoom = options.enableZoom !== false;
    controls.zoomSpeed = options.zoomSpeed || 1;
    controls.enablePan = options.enablePan !== false;

    // Set camera distance
    controls.minDistance = options.minDistance || 3;
    controls.maxDistance = options.maxDistance || 10;

    controlsRef.current = controls;

    // Animation loop for damping
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (controls.enableDamping) {
        controls.update();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      controls.dispose();
    };
  }, [camera, renderer]);

  return controlsRef;
};