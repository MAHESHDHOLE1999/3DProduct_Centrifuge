import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Plus, Minus, Info, ChevronDown } from 'lucide-react';

export default function CentrifugeTour2() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const dragStateRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0 },
    inertia: 0.95
  });

  const animationStateRef = useRef({
    targetZoom: 1,
    currentZoom: 1,
    targetRotationY: 0,
    currentRotationY: 0,
    autoRotationSpeed: 0.005
  });

  const features = [
    {
      id: 'touchscreen',
      name: 'Touchscreen Interface',
      description: 'Intuitive full-color touchscreen with single-screen programming',
      position: [0, 2, 0],
      color: '#FF6B6B'
    },
    {
      id: 'rotor',
      name: 'Auto-Lock Rotor Exchange',
      description: 'Push-button rotor exchange in just 3 seconds',
      position: [0, 0, 0],
      color: '#4ECDC4'
    },
    {
      id: 'body',
      name: 'Compact Design',
      description: 'Space-saving footprint ideal for any laboratory setup',
      position: [-2, 0, 0],
      color: '#45B7D1'
    },
    {
      id: 'base',
      name: 'Ergonomic Base',
      description: 'Stable foundation with improved reach-in accessibility',
      position: [0, -2, 0],
      color: '#96CEB4'
    }
  ];

  const easeOut = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const group = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.6,
      roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    group.add(body);

    // Top rotor
    const rotorGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32);
    const rotorMaterial = new THREE.MeshStandardMaterial({
      color: 0x4ECDC4,
      metalness: 0.8,
      roughness: 0.2
    });
    const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
    rotor.position.y = 1.7;
    group.add(rotor);

    // Screen panel
    const screenGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      emissive: 0x1a4d5c,
      emissiveIntensity: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(1.6, 0.5, 0);
    group.add(screen);

    // Base
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.4,
      roughness: 0.6
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.65;
    group.add(base);

    // Add decorative elements
    const handleGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.5,
      roughness: 0.5
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(-1.8, 1, 0);
    group.add(handle);

    scene.add(group);
    modelRef.current = group;
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Mouse event handlers
    const onMouseDown = (e) => {
      dragStateRef.current.isDragging = true;
      dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
      setIsAutoRotate(false);
    };

    const onMouseMove = (e) => {
      if (!dragStateRef.current.isDragging) return;

      const deltaX = e.clientX - dragStateRef.current.previousMousePosition.x;
      const deltaY = e.clientY - dragStateRef.current.previousMousePosition.y;

      const sensitivity = 0.01;

      // Store velocity for inertia
      dragStateRef.current.velocity.x = deltaY * sensitivity;
      dragStateRef.current.velocity.y = deltaX * sensitivity;

      // Rotate around Y axis (left-right drag)
      dragStateRef.current.rotation.y += deltaX * sensitivity;
      
      // Rotate around X axis (up-down drag)
      dragStateRef.current.rotation.x += deltaY * sensitivity;

      // Clamp X rotation to prevent flipping
      dragStateRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, dragStateRef.current.rotation.x));

      dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      dragStateRef.current.isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const newZoom = e.deltaY > 0 ? zoomLevel * 1.05 : zoomLevel * 0.95;
      setZoomLevel(newZoom);
      animationStateRef.current.targetZoom = newZoom;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    let animationId;
    let animationStartTime = null;
    const animationDuration = 600;

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);

      // Auto-rotate
      if (isAutoRotate) {
        dragStateRef.current.rotation.y += animationStateRef.current.autoRotationSpeed;
      }

      // Apply inertia/momentum when not dragging
      if (!dragStateRef.current.isDragging) {
        dragStateRef.current.rotation.y += dragStateRef.current.velocity.y;
        dragStateRef.current.rotation.x += dragStateRef.current.velocity.x;
        
        // Apply friction
        dragStateRef.current.velocity.y *= dragStateRef.current.inertia;
        dragStateRef.current.velocity.x *= dragStateRef.current.inertia;
        
        // Stop very small velocities
        if (Math.abs(dragStateRef.current.velocity.y) < 0.0001) dragStateRef.current.velocity.y = 0;
        if (Math.abs(dragStateRef.current.velocity.x) < 0.0001) dragStateRef.current.velocity.x = 0;
      }

      // Clamp X rotation to prevent flipping
      dragStateRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, dragStateRef.current.rotation.x));

      // Apply rotation to model
      group.rotation.order = 'YXZ';
      group.rotation.y = dragStateRef.current.rotation.y;
      group.rotation.x = dragStateRef.current.rotation.x;

      // Smooth zoom animation
      const state = animationStateRef.current;
      if (Math.abs(state.currentZoom - state.targetZoom) > 0.001) {
        if (!animationStartTime) animationStartTime = currentTime;
        
        const elapsed = currentTime - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const eased = easeOut(progress);
        
        state.currentZoom = state.currentZoom + (state.targetZoom - state.currentZoom) * eased;
        
        if (progress === 1) {
          animationStartTime = null;
        }
      }

      camera.position.z = 5 * state.currentZoom;

      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isAutoRotate]);

  const handleRotate = () => {
    setIsAutoRotate(!isAutoRotate);
  };

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? zoomLevel * 0.9 : zoomLevel * 1.1;
    setZoomLevel(newZoom);
    animationStateRef.current.targetZoom = newZoom;
  };

  const selectFeature = (index) => {
    setSelectedFeature(index);
    setIsAutoRotate(false);
  };

  const resetView = () => {
    dragStateRef.current.rotation = { x: 0, y: 0, z: 0 };
    setZoomLevel(1);
    animationStateRef.current.targetZoom = 1;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-8">
        <h1 className="text-4xl font-bold mb-2">Pro Centrifuge Series</h1>
        <p className="text-gray-400">Interactive 3D Product Tour - Drag to Rotate</p>
      </div>

      <div className="flex h-full pt-24 gap-4 p-4">
        {/* 3D Viewer */}
        <div className="flex-1 rounded-lg overflow-hidden shadow-2xl relative bg-gray-900">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          {/* Overlay hints */}
          <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 backdrop-blur rounded-lg p-3 text-sm">
            <p className="text-gray-300">🖱️ Click & drag to spin around</p>
            <p className="text-gray-300">📜 Release and it keeps spinning</p>
            <p className="text-gray-300">🔄 Scroll to zoom</p>
            <p className="text-gray-400 text-xs mt-1">Full 360° view with inertia</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 flex flex-col gap-4">
          {/* Controls */}
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur rounded-lg p-4 shadow-xl">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Controls</h3>
            
            <button
              onClick={handleRotate}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg mb-2 transition-all ${
                isAutoRotate
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <RotateCw size={18} />
              <span>{isAutoRotate ? 'Stop Rotation' : 'Start Rotation'}</span>
            </button>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleZoom('in')}
                className="flex-1 flex items-center justify-center gap-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                <Plus size={18} />
                <span>Zoom In</span>
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="flex-1 flex items-center justify-center gap-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                <Minus size={18} />
                <span>Zoom Out</span>
              </button>
            </div>

            <button
              onClick={resetView}
              className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-sm"
            >
              Reset View
            </button>
          </div>

          {/* Features List */}
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur rounded-lg p-4 shadow-xl flex-1 overflow-y-auto">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
              <Info size={16} />
              Key Features
            </h3>

            <div className="space-y-2">
              {features.map((feature, idx) => (
                <button
                  key={feature.id}
                  onClick={() => selectFeature(idx)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedFeature === idx
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{feature.name}</p>
                      <p className="text-xs text-gray-300 mt-1 leading-tight">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur rounded-lg p-4 shadow-xl">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Specs</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Capacity:</span>
                <span className="font-medium">4L</span>
              </div>
              <div className="flex justify-between">
                <span>Max RCF:</span>
                <span className="font-medium">25,000 x g</span>
              </div>
              <div className="flex justify-between">
                <span>Rotor Modes:</span>
                <span className="font-medium">18 Options</span>
              </div>
              <div className="flex justify-between">
                <span>Interface:</span>
                <span className="font-medium">Touchscreen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 flex items-center gap-1">
        <ChevronDown size={14} />
        Full 360° interactive view
      </div>
    </div>
  );
}