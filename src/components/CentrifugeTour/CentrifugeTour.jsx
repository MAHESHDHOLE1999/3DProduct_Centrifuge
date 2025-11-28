// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { RotateCw, Plus, Minus, Info, Share2 } from 'lucide-react';

// const productSpecs = {
//   'Physical': [
//     { label: 'Capacity', value: '4L' },
//     { label: 'Weight', value: '45 kg' },
//     { label: 'Dimensions', value: '600 × 500 × 800 mm' },
//     { label: 'Color', value: 'White/Gray' },
//   ],
//   'Performance': [
//     { label: 'Max RPM', value: '3,600' },
//     { label: 'Max RCF', value: '25,000 x g' },
//     { label: 'Rotor Options', value: '18+' },
//     { label: 'Speed Control', value: '100-3600 RPM' },
//   ],
//   'Features': [
//     { label: 'Display', value: '7" Touchscreen' },
//     { label: 'Programs', value: '10 preset + custom' },
//     { label: 'Cooling', value: 'Forced Air' },
//     { label: 'Noise Level', value: '< 70 dB' },
//   ],
// };

// export default function CentrifugeTour() {
//   const containerRef = useRef(null);
//   const [selectedFeature, setSelectedFeature] = useState(0);
//   const [isAutoRotate, setIsAutoRotate] = useState(true);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [expandedSpecSection, setExpandedSpecSection] = useState(null);
//   const [modelLoaded, setModelLoaded] = useState(false);

//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const modelRef = useRef(null);

//   const dragStateRef = useRef({
//     isDragging: false,
//     previousMousePosition: { x: 0, y: 0 },
//     rotation: { x: 0.2, y: 0.5, z: 0 },
//     velocity: { x: 0, y: 0 },
//     inertia: 0.95
//   });

//   const animationStateRef = useRef({
//     targetZoom: 1,
//     currentZoom: 1,
//     autoRotationSpeed: 0.005,
//     baseCameraZ: 10
//   });

//   const features = [
//     {
//       id: 'touchscreen',
//       name: 'Touchscreen Interface',
//       description: 'Intuitive full-color touchscreen with single-screen programming',
//       color: '#FF6B6B'
//     },
//     {
//       id: 'rotor',
//       name: 'Auto-Lock Rotor Exchange',
//       description: 'Push-button rotor exchange in just 3 seconds',
//       color: '#4ECDC4'
//     },
//     {
//       id: 'body',
//       name: 'Compact Design',
//       description: 'Space-saving footprint ideal for any laboratory setup',
//       color: '#45B7D1'
//     },
//     {
//       id: 'base',
//       name: 'Ergonomic Base',
//       description: 'Stable foundation with improved reach-in accessibility',
//       color: '#96CEB4'
//     }
//   ];

//   // Initialize THREE.js scene
//   useEffect(() => {
//     if (!containerRef.current || sceneRef.current) return;

//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf5f5f5);

//     // Camera
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     camera.position.set(0, 2, 10);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     containerRef.current.appendChild(renderer.domElement);

//     sceneRef.current = scene;
//     cameraRef.current = camera;
//     rendererRef.current = renderer;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
//     scene.add(ambientLight);

//     const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
//     dirLight.position.set(10, 15, 10);
//     dirLight.castShadow = true;
//     dirLight.shadow.mapSize.width = 2048;
//     dirLight.shadow.mapSize.height = 2048;
//     scene.add(dirLight);

//     const pointLight = new THREE.PointLight(0xffffff, 0.8);
//     pointLight.position.set(-10, 10, 5);
//     scene.add(pointLight);

//     // Model group
//     const modelGroup = new THREE.Group();
//     scene.add(modelGroup);
//     modelRef.current = modelGroup;

//     // Load model
//     const loadModel = async () => {
//       try {
//         const response = await fetch('/models/product_model.glb');
//         if (!response.ok) throw new Error('Model file not found');

//         const arrayBuffer = await response.arrayBuffer();
//         const loader = new THREE.GLTFLoader();

//         loader.parse(arrayBuffer, '/models', (gltf) => {
//           const model = gltf.scene;

//           // Clear previous children
//           while (modelGroup.children.length > 0) {
//             modelGroup.remove(modelGroup.children[0]);
//           }
//           modelGroup.add(model);

//           // Fix materials
//           model.traverse((child) => {
//             if (child.isMesh) {
//               child.castShadow = true;
//               child.receiveShadow = true;

//               if (!child.material) {
//                 child.material = new THREE.MeshStandardMaterial({
//                   color: 0x6B7280,
//                   metalness: 0.3,
//                   roughness: 0.7
//                 });
//               } else {
//                 child.material.side = THREE.DoubleSide;
//                 child.material.transparent = false;
//                 child.material.opacity = 1;
//                 child.material.wireframe = false;

//                 if (child.material.color) {
//                   const c = child.material.color;
//                   const brightness = (c.r + c.g + c.b) / 3;
//                   if (brightness < 0.3) {
//                     child.material.color.set(0x7C8FA3);
//                   }
//                 }

//                 if (child.material.metalness === undefined) child.material.metalness = 0.3;
//                 if (child.material.roughness === undefined) child.material.roughness = 0.7;
//               }
//             }
//           });

//           // Center and scale
//           const bbox = new THREE.Box3().setFromObject(model);
//           const center = bbox.getCenter(new THREE.Vector3());
//           const size = bbox.getSize(new THREE.Vector3());
//           const maxDim = Math.max(size.x, size.y, size.z);

//           model.position.set(-center.x, -center.y, -center.z);

//           if (maxDim > 0) {
//             const scale = 12 / maxDim;
//             model.scale.set(scale, scale, scale);
//           }

//           dragStateRef.current.rotation = { x: 0.2, y: 0.5, z: 0 };
//           setModelLoaded(true);
//         });
//       } catch (error) {
//         console.error('Model load error:', error);
//         // Fallback cube
//         const geo = new THREE.BoxGeometry(3, 3, 3);
//         const mat = new THREE.MeshStandardMaterial({
//           color: 0x4ECDC4,
//           metalness: 0.3,
//           roughness: 0.7
//         });
//         const mesh = new THREE.Mesh(geo, mat);
//         modelGroup.add(mesh);
//         setModelLoaded(true);
//       }
//     };

//     loadModel();

//     // Handle resize
//     const handleResize = () => {
//       if (!containerRef.current) return;
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

//   // Animation loop
//   useEffect(() => {
//     if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

//     let frameId;
//     const animate = () => {
//       frameId = requestAnimationFrame(animate);

//       if (modelRef.current) {
//         if (isAutoRotate) {
//           dragStateRef.current.rotation.y += animationStateRef.current.autoRotationSpeed;
//         }

//         if (!dragStateRef.current.isDragging) {
//           dragStateRef.current.rotation.y += dragStateRef.current.velocity.y;
//           dragStateRef.current.rotation.x += dragStateRef.current.velocity.x;
//           dragStateRef.current.velocity.x *= dragStateRef.current.inertia;
//           dragStateRef.current.velocity.y *= dragStateRef.current.inertia;

//           if (Math.abs(dragStateRef.current.velocity.x) < 0.0001) dragStateRef.current.velocity.x = 0;
//           if (Math.abs(dragStateRef.current.velocity.y) < 0.0001) dragStateRef.current.velocity.y = 0;
//         }

//         modelRef.current.rotation.order = 'YXZ';
//         modelRef.current.rotation.y = dragStateRef.current.rotation.y;
//         modelRef.current.rotation.x = dragStateRef.current.rotation.x;
//       }

//       const state = animationStateRef.current;
//       if (Math.abs(state.currentZoom - state.targetZoom) > 0.001) {
//         state.currentZoom += (state.targetZoom - state.currentZoom) * 0.1;
//       }
//       cameraRef.current.position.z = state.baseCameraZ * state.currentZoom;

//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };

//     animate();
//     return () => cancelAnimationFrame(frameId);
//   }, [isAutoRotate]);

//   // Mouse events
//   useEffect(() => {
//     const canvas = rendererRef.current?.domElement;
//     if (!canvas) return;

//     const handleMouseDown = (e) => {
//       dragStateRef.current.isDragging = true;
//       dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const handleMouseMove = (e) => {
//       if (!dragStateRef.current.isDragging) return;
//       const deltaX = e.clientX - dragStateRef.current.previousMousePosition.x;
//       const deltaY = e.clientY - dragStateRef.current.previousMousePosition.y;
//       const sensitivity = 0.01;

//       dragStateRef.current.velocity.x = deltaY * sensitivity;
//       dragStateRef.current.velocity.y = deltaX * sensitivity;
//       dragStateRef.current.rotation.y += deltaX * sensitivity;
//       dragStateRef.current.rotation.x += deltaY * sensitivity;
//       dragStateRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, dragStateRef.current.rotation.x));

//       dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const handleMouseUp = () => {
//       dragStateRef.current.isDragging = false;
//     };

//     const handleWheel = (e) => {
//       e.preventDefault();
//       const newZoom = e.deltaY > 0 ? zoomLevel * 1.1 : zoomLevel * 0.9;
//       const clamped = Math.max(0.4, Math.min(3, newZoom));
//       animationStateRef.current.targetZoom = clamped;
//       setZoomLevel(clamped);
//     };

//     canvas.addEventListener('mousedown', handleMouseDown);
//     canvas.addEventListener('mousemove', handleMouseMove);
//     canvas.addEventListener('mouseup', handleMouseUp);
//     canvas.addEventListener('wheel', handleWheel, { passive: false });

//     return () => {
//       canvas.removeEventListener('mousedown', handleMouseDown);
//       canvas.removeEventListener('mousemove', handleMouseMove);
//       canvas.removeEventListener('mouseup', handleMouseUp);
//       canvas.removeEventListener('wheel', handleWheel);
//     };
//   }, [zoomLevel]);

//   const handleRotate = () => setIsAutoRotate(!isAutoRotate);

//   const handleZoom = (dir) => {
//     const newZoom = dir === 'in' ? zoomLevel * 0.9 : zoomLevel * 1.1;
//     const clamped = Math.max(0.4, Math.min(3, newZoom));
//     animationStateRef.current.targetZoom = clamped;
//     setZoomLevel(clamped);
//   };

//   const resetView = () => {
//     dragStateRef.current.rotation = { x: 0.2, y: 0.5, z: 0 };
//     dragStateRef.current.velocity = { x: 0, y: 0 };
//     animationStateRef.current.targetZoom = 1;
//     setZoomLevel(1);
//     setSelectedFeature(0);
//   };

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 overflow-hidden flex flex-col">
//       <div className="p-6 bg-white shadow-sm">
//         <h1 className="text-4xl font-bold text-gray-900">Pro Centrifuge Series</h1>
//         <p className="text-gray-600 text-sm">Interactive 3D Product Tour</p>
//       </div>

//       <div className="flex-1 flex gap-4 p-4 overflow-hidden">
//         <div className="flex-1 rounded-xl overflow-hidden shadow-lg bg-white relative">
//           <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

//           {!modelLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-3 mx-auto"></div>
//                 <p className="text-gray-700 font-medium">Loading Model...</p>
//               </div>
//             </div>
//           )}

//           <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 backdrop-blur text-white rounded-lg p-3 text-xs space-y-1">
//             <p>🖱️ Drag to rotate</p>
//             <p>📜 Release for inertia</p>
//             <p>🔄 Scroll to zoom</p>
//           </div>
//         </div>

//         <div className="w-80 overflow-y-auto space-y-3 pr-2">
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h3 className="font-bold text-sm mb-3 text-gray-900">CONTROLS</h3>
//             <button
//               onClick={handleRotate}
//               className={`w-full py-2 rounded-lg mb-2 transition font-medium text-white ${
//                 isAutoRotate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
//               }`}
//             >
//               <RotateCw size={16} className="inline mr-2" />
//               {isAutoRotate ? 'Stop' : 'Start'} Rotation
//             </button>

//             <div className="flex gap-2 mb-2">
//               <button onClick={() => handleZoom('in')} className="flex-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium">
//                 <Plus size={16} className="inline mr-1" /> Zoom In
//               </button>
//               <button onClick={() => handleZoom('out')} className="flex-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium">
//                 <Minus size={16} className="inline mr-1" /> Out
//               </button>
//             </div>

//             <button onClick={resetView} className="w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium mb-2">
//               Reset View
//             </button>

//             <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
//               <Share2 size={16} className="inline mr-2" /> Share
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h3 className="font-bold text-sm mb-3 text-gray-900 flex items-center gap-2">
//               <Info size={16} /> FEATURES
//             </h3>
//             <div className="space-y-2">
//               {features.map((f, i) => (
//                 <button
//                   key={f.id}
//                   onClick={() => setSelectedFeature(i)}
//                   className={`w-full p-3 rounded-lg text-left transition text-sm ${
//                     selectedFeature === i
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-start gap-2">
//                     <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: f.color }} />
//                     <div>
//                       <p className="font-medium">{f.name}</p>
//                       <p className="text-xs opacity-75">{f.description}</p>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h3 className="font-bold text-sm mb-3 text-gray-900">SPECIFICATIONS</h3>
//             <div className="space-y-2">
//               {Object.entries(productSpecs).map(([section, specs]) => (
//                 <div key={section} className="border border-gray-300 rounded-lg">
//                   <button
//                     onClick={() => setExpandedSpecSection(expandedSpecSection === section ? null : section)}
//                     className="w-full px-3 py-2 flex justify-between items-center hover:bg-gray-100 transition text-sm"
//                   >
//                     <span className="font-medium">{section}</span>
//                     <span className={`transition-transform ${expandedSpecSection === section ? 'rotate-180' : ''}`}>▼</span>
//                   </button>
//                   {expandedSpecSection === section && (
//                     <div className="px-3 py-2 bg-gray-50 space-y-1 text-xs border-t">
//                       {specs.map((s, i) => (
//                         <div key={i} className="flex justify-between">
//                           <span className="text-gray-600">{s.label}:</span>
//                           <span className="font-medium text-gray-900">{s.value}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//Version 2
// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { RotateCw, Plus, Minus, Info, Share2 } from "lucide-react";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { centerAndScaleModel } from "../../utils/modelLoader";
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
// import gsap from "gsap";

// const productSpecs = {
//   Physical: [
//     { label: "Capacity", value: "4L" },
//     { label: "Weight", value: "45 kg" },
//     { label: "Dimensions", value: "600 × 500 × 800 mm" },
//     { label: "Color", value: "White/Gray" },
//   ],
//   Performance: [
//     { label: "Max RPM", value: "3,600" },
//     { label: "Max RCF", value: "25,000 x g" },
//     { label: "Rotor Options", value: "18+" },
//     { label: "Speed Control", value: "100-3600 RPM" },
//   ],
//   Features: [
//     { label: "Display", value: '7" Touchscreen' },
//     { label: "Programs", value: "10 preset + custom" },
//     { label: "Cooling", value: "Forced Air" },
//     { label: "Noise Level", value: "< 70 dB" },
//   ],
// };

// export default function CentrifugeTour() {
//   const containerRef = useRef(null);
//   const [selectedFeature, setSelectedFeature] = useState(0);
//   const [isAutoRotate, setIsAutoRotate] = useState(true);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [expandedSpecSection, setExpandedSpecSection] = useState(null);
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [loadError, setLoadError] = useState(null);

//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const modelRef = useRef(null);

//   const dragStateRef = useRef({
//     isDragging: false,
//     previousMousePosition: { x: 0, y: 0 },
//     rotation: { x: 0.2, y: 0.5, z: 0 },
//     velocity: { x: 0, y: 0 },
//     inertia: 0.95,
//   });

//   const animationStateRef = useRef({
//     targetZoom: 1,
//     currentZoom: 1,
//     autoRotationSpeed: 0.005,
//     baseCameraZ: 10,
//   });

//   const features = [
//     {
//       id: "touchscreen",
//       name: "Touchscreen Interface",
//       description:
//         "Intuitive full-color touchscreen with single-screen programming",
//       color: "#FF6B6B",
//     },
//     {
//       id: "rotor",
//       name: "Auto-Lock Rotor Exchange",
//       description: "Push-button rotor exchange in just 3 seconds",
//       color: "#4ECDC4",
//     },
//     {
//       id: "body",
//       name: "Compact Design",
//       description: "Space-saving footprint ideal for any laboratory setup",
//       color: "#45B7D1",
//     },
//     {
//       id: "base",
//       name: "Ergonomic Base",
//       description: "Stable foundation with improved reach-in accessibility",
//       color: "#96CEB4",
//     },
//   ];

//   // Initialize THREE.js scene
//   useEffect(() => {
//     if (!containerRef.current || sceneRef.current) return;

//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;

//     // Scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf5f5f5);
//     // scene.background = new THREE.Color(0x000000);

//     // Camera
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     //camera.position.set(x,y,z);
//     camera.position.set(0, 4, 10);

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
//     containerRef.current.appendChild(renderer.domElement);

//     sceneRef.current = scene;
//     cameraRef.current = camera;
//     rendererRef.current = renderer;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
//     // const ambientLight = new THREE.AmbientLight(0xFB923C, 3);
//     scene.add(ambientLight);

//     const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
//     dirLight.position.set(10, 15, 10);
//     dirLight.castShadow = true;
//     dirLight.shadow.mapSize.width = 2048;
//     dirLight.shadow.mapSize.height = 2048;
//     scene.add(dirLight);

//     const pointLight = new THREE.PointLight(0xffffff, 0.8);
//     pointLight.position.set(-10, 10, 5);
//     scene.add(pointLight);

//     // Model group
//     const modelGroup = new THREE.Group();
//     scene.add(modelGroup);
//     modelRef.current = modelGroup;

//     // Load model with proper GLTFLoader
//     const loadModel = async () => {
//       try {
//             // const dracoLoader = new DRACOLoader();
//             // dracoLoader.setDecoderPath('/draco/'); // make sure /public/draco exists

//             const loader = new GLTFLoader();
//             // loader.setDRACOLoader(dracoLoader);
//             // loader.setMeshoptDecoder(MeshoptDecoder);

//         // Wrap loader.load inside a Promise so we can await it with try/catch
//         const model = await new Promise((resolve, reject) => {
//           loader.load(
//             "/models/BBRUnit.glb", // MUST be absolute path from public/
//             (gltf) => resolve(gltf.scene),
//             undefined,
//             (err) => reject(err)
//           );
//         });

//         // ================= Add Model to Scene =================
//         modelRef.current.clear(); // remove previous
//         modelRef.current.add(model);

//         // ================= Auto-Center & Scale =================
//         const box = new THREE.Box3().setFromObject(model);
//         const center = box.getCenter(new THREE.Vector3());
//         const size = box.getSize(new THREE.Vector3());
//         const max = Math.max(size.x, size.y, size.z);

//         // model.position.set(center.x, center.y, center.z);
//         model.position.sub(center);

//         //this is comment
//         const desiredSize = 9;
//         const scale = desiredSize / max;
//         model.scale.setScalar(scale);

//         // model.scale.setScalar(10 / max);
//         // centerAndScaleModel(model);

//         // ================ Material Brightness Fix ================
//         model.traverse((child) => {
//           if (child.isMesh && child.material) {
//             child.material.side = THREE.DoubleSide;
//             child.material.transparent = false;
//             child.material.castShadow = true;
//             child.material.receiveShadow = true;

//             // brighten if material is too dark
//             const avg =
//               (child.material.color.r +
//                 child.material.color.g +
//                 child.material.color.b) /
//               3;
//             if (avg < 0.35) child.material.color.set(0xa3a3a3);
//           }
//         });

//         setModelLoaded(true);
//         setLoadError(null);
//         console.log("🚀 Model Loaded Successfully");
//         // dracoLoader.dispose();
//       } catch (error) {
//         console.error("❌ Model Load Failed:", error);
//         setLoadError("Model could not load — fallback object applied.");

//         // =============== Load Fallback Model ===============
//         try {
//           const fallback = createFallbackModel();
//           modelRef.current.clear();
//           modelRef.current.add(fallback);
//           setModelLoaded(true);
//           console.log("🔄 Fallback model applied");
//         } catch (fallbackError) {
//           console.error("⚠ Failed to load fallback model:", fallbackError);
//           setLoadError("Critical: No model could be displayed.");
//         }
//       }
//     };

//     const createFallbackModel = () => {
//       // Main body (cylinder)
//       const bodyGeo = new THREE.CylinderGeometry(2, 2.2, 3, 32);
//       const bodyMat = new THREE.MeshStandardMaterial({
//         color: 0x888899,
//         metalness: 0.4,
//         roughness: 0.6,
//       });
//       const body = new THREE.Mesh(bodyGeo, bodyMat);
//       body.castShadow = true;
//       body.receiveShadow = true;
//       modelGroup.add(body);

//       // Top lid
//       const lidGeo = new THREE.CylinderGeometry(2, 1.8, 0.5, 32);
//       const lidMat = new THREE.MeshStandardMaterial({
//         color: 0x4a4a5e,
//         metalness: 0.6,
//         roughness: 0.4,
//       });
//       const lid = new THREE.Mesh(lidGeo, lidMat);
//       lid.position.y = 1.75;
//       lid.castShadow = true;
//       lid.receiveShadow = true;
//       modelGroup.add(lid);

//       // Base
//       const baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.4, 32);
//       const baseMat = new THREE.MeshStandardMaterial({
//         color: 0x6b7280,
//         metalness: 0.3,
//         roughness: 0.7,
//       });
//       const base = new THREE.Mesh(baseGeo, baseMat);
//       base.position.y = -1.7;
//       base.castShadow = true;
//       base.receiveShadow = true;
//       modelGroup.add(base);

//       // Rotor
//       const rotorGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.6, 32);
//       const rotorMat = new THREE.MeshStandardMaterial({
//         color: 0x45b7d1,
//         metalness: 0.7,
//         roughness: 0.2,
//       });
//       const rotor = new THREE.Mesh(rotorGeo, rotorMat);
//       rotor.position.y = 0;
//       rotor.castShadow = true;
//       rotor.receiveShadow = true;
//       modelGroup.add(rotor);

//       // Display screen
//       const screenGeo = new THREE.BoxGeometry(1.2, 1, 0.05);
//       const screenMat = new THREE.MeshStandardMaterial({
//         color: 0x1a1a2e,
//         metalness: 0.9,
//         roughness: 0.1,
//       });
//       const screen = new THREE.Mesh(screenGeo, screenMat);
//       screen.position.set(2.1, 0.5, 0);
//       screen.castShadow = true;
//       screen.receiveShadow = true;
//       modelGroup.add(screen);

//       // Control buttons
//       for (let i = 0; i < 4; i++) {
//         const buttonGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
//         const buttonMat = new THREE.MeshStandardMaterial({
//           color: 0xff6b6b,
//           metalness: 0.5,
//           roughness: 0.5,
//         });
//         const button = new THREE.Mesh(buttonGeo, buttonMat);
//         button.position.set(2.1, -0.5 + i * 0.3, 0.1);
//         button.castShadow = true;
//         button.receiveShadow = true;
//         modelGroup.add(button);
//       }

//       setModelLoaded(true);
//     };

//     loadModel();

//     // Handle resize
//     const handleResize = () => {
//       if (!containerRef.current) return;
//       const w = containerRef.current.clientWidth;
//       const h = containerRef.current.clientHeight;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       renderer.dispose();
//       if (containerRef.current?.contains(renderer.domElement)) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   // Animation loop
//   useEffect(() => {
//     if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

//     let frameId;
//     const animate = () => {
//       frameId = requestAnimationFrame(animate);

//       if (modelRef.current) {
//         if (isAutoRotate && !dragStateRef.current.isDragging) {
//           dragStateRef.current.rotation.y +=
//             animationStateRef.current.autoRotationSpeed;
//         }

//         if (!dragStateRef.current.isDragging) {
//           dragStateRef.current.rotation.y += dragStateRef.current.velocity.y;
//           dragStateRef.current.rotation.x += dragStateRef.current.velocity.x;
//           dragStateRef.current.velocity.x *= dragStateRef.current.inertia;
//           dragStateRef.current.velocity.y *= dragStateRef.current.inertia;

//           if (Math.abs(dragStateRef.current.velocity.x) < 0.0001)
//             dragStateRef.current.velocity.x = 0;
//           if (Math.abs(dragStateRef.current.velocity.y) < 0.0001)
//             dragStateRef.current.velocity.y = 0;
//         }

//         modelRef.current.rotation.order = "YXZ";
//         modelRef.current.rotation.y = dragStateRef.current.rotation.y;
//         modelRef.current.rotation.x = dragStateRef.current.rotation.x;
//         modelRef.current.rotation.z = dragStateRef.current.rotation.z;
//       }

//       const state = animationStateRef.current;
//       if (Math.abs(state.currentZoom - state.targetZoom) > 0.001) {
//         state.currentZoom += (state.targetZoom - state.currentZoom) * 0.1;
//       }
//       cameraRef.current.position.z = state.baseCameraZ * state.currentZoom;

//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     };

//     animate();
//     return () => cancelAnimationFrame(frameId);
//   }, [isAutoRotate]);

//   // Mouse and touch events
//   useEffect(() => {
//     const canvas = rendererRef.current?.domElement;
//     if (!canvas) return;

//     const getCoordinates = (e) => {
//       if (e.touches) {
//         return { x: e.touches[0].clientX, y: e.touches[0].clientY };
//       }
//       return { x: e.clientX, y: e.clientY };
//     };

//     const handleStart = (e) => {
//       dragStateRef.current.isDragging = true;
//       const coords = getCoordinates(e);
//       dragStateRef.current.previousMousePosition = { x: coords.x, y: coords.y };
//       setIsAutoRotate(false);
//     };

//     const handleMove = (e) => {
//       if (!dragStateRef.current.isDragging) return;
//       const coords = getCoordinates(e);
//       const { x, y } = e.touches
//         ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
//         : { x: e.clientX, y: e.clientY };

//       const deltaX = coords.x - dragStateRef.current.previousMousePosition.x;
//       const deltaY = coords.y - dragStateRef.current.previousMousePosition.y;
//       // const deltaZ = coords.z - dragStateRef.current.previousMousePosition.z;
//       const sensitivity = 0.005;

//       dragStateRef.current.velocity.x = deltaY * sensitivity;
//       dragStateRef.current.velocity.y = deltaX * sensitivity;
//       // dragStateRef.current.velocity.z = deltaZ * sensitivity;
//       dragStateRef.current.rotation.y += deltaX * sensitivity;
//       dragStateRef.current.rotation.x += deltaY * sensitivity;
//       // dragStateRef.current.rotation.z += deltaZ * sensitivity;
//       dragStateRef.current.rotation.x = Math.max(
//         -Math.PI / 2,
//         Math.min(Math.PI / 2, dragStateRef.current.rotation.x)
//       );

//       dragStateRef.current.previousMousePosition = { x: coords.x, y: coords.y };
//     };

//     const handleEnd = () => {
//       dragStateRef.current.isDragging = false;
//     };

//     const handleWheel = (e) => {
//       e.preventDefault();
//       const newZoom = e.deltaY > 0 ? zoomLevel * 1.1 : zoomLevel * 0.9;
//       const clamped = Math.max(0.4, Math.min(3, newZoom));
//       animationStateRef.current.targetZoom = clamped;
//       setZoomLevel(clamped);
//     };

//     canvas.addEventListener("mousedown", handleStart);
//     canvas.addEventListener("mousemove", handleMove);
//     canvas.addEventListener("mouseup", handleEnd);
//     canvas.addEventListener("mouseleave", handleEnd);
//     canvas.addEventListener("touchstart", handleStart);
//     canvas.addEventListener("touchmove", handleMove);
//     canvas.addEventListener("touchend", handleEnd);
//     canvas.addEventListener("wheel", handleWheel, { passive: false });

//     return () => {
//       canvas.removeEventListener("mousedown", handleStart);
//       canvas.removeEventListener("mousemove", handleMove);
//       canvas.removeEventListener("mouseup", handleEnd);
//       canvas.removeEventListener("mouseleave", handleEnd);
//       canvas.removeEventListener("touchstart", handleStart);
//       canvas.removeEventListener("touchmove", handleMove);
//       canvas.removeEventListener("touchend", handleEnd);
//       canvas.removeEventListener("wheel", handleWheel);
//     };
//   }, [zoomLevel]);

//   const handleRotate = () => setIsAutoRotate(!isAutoRotate);

//   const handleZoom = (dir) => {
//     const newZoom = dir === "in" ? zoomLevel * 0.9 : zoomLevel * 1.1;
//     const clamped = Math.max(0.4, Math.min(3, newZoom));
//     animationStateRef.current.targetZoom = clamped;
//     setZoomLevel(clamped);
//   };

//   const resetView = () => {
//     dragStateRef.current.rotation = { x: 0.2, y: 0.5, z: 0 };
//     dragStateRef.current.velocity = { x: 0, y: 0 };
//     animationStateRef.current.targetZoom = 1;
//     setZoomLevel(1);
//     setSelectedFeature(0);
//     setIsAutoRotate(true);
//   };

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 overflow-hidden flex flex-col">
//       <div className="p-6 bg-white shadow-sm">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Pro Centrifuge Series
//         </h1>
//         <p className="text-gray-600 text-sm">Interactive 3D Product Tour</p>
//       </div>

//       <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4 md:flex-row">
//         <div className="flex-1 rounded-xl overflow-hidden shadow-lg relative bg-white order-1 md:order-none">
//           <div
//             ref={containerRef}
//             className="w-full h-[60vh] md:h-full cursor-grab active:cursor-grabbing"
//           />

//           {!modelLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-3 mx-auto"></div>
//                 <p className="text-gray-700 font-medium">Loading Model...</p>
//               </div>
//             </div>
//           )}

//           {loadError && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
//               <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 max-w-sm">
//                 <p className="text-yellow-800 font-semibold">
//                   ℹ️ Using Fallback Model
//                 </p>
//                 <p className="text-yellow-700 text-sm mt-2">{loadError}</p>
//                 <p className="text-yellow-600 text-xs mt-3">
//                   Showing procedural model. Ensure models/product_model.glb
//                   exists in your public folder.
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 backdrop-blur text-white rounded-lg p-3 text-xs space-y-1">
//             <p>🖱️ Drag to rotate</p>
//             <p>📜 Release for inertia</p>
//             <p>🔄 Scroll to zoom</p>
//           </div>
//         </div>

//         <div className="w-80 overflow-y-auto space-y-3 pr-2 hidden md:block">
//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h3 className="font-bold text-sm mb-3 text-gray-900">CONTROLS</h3>
//             <button
//               onClick={handleRotate}
//               className={`w-full py-2 rounded-lg mb-2 transition font-medium text-white ${
//                 isAutoRotate
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-gray-600 hover:bg-gray-700"
//               }`}
//             >
//               <RotateCw size={16} className="inline mr-2" />
//               {isAutoRotate ? "Stop" : "Start"} Rotation
//             </button>

//             <div className="flex gap-2 mb-2">
//               <button
//                 onClick={() => handleZoom("in")}
//                 className="flex-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium"
//               >
//                 <Plus size={16} className="inline mr-1" /> Zoom In
//               </button>
//               <button
//                 onClick={() => handleZoom("out")}
//                 className="flex-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium"
//               >
//                 <Minus size={16} className="inline mr-1" /> Out
//               </button>
//             </div>

//             <button
//               onClick={resetView}
//               className="w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium mb-2"
//             >
//               Reset View
//             </button>

//             <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
//               <Share2 size={16} className="inline mr-2" /> Share
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h3 className="font-bold text-sm mb-3 text-gray-900 flex items-center gap-2">
//               <Info size={16} /> FEATURES
//             </h3>
//             <div className="space-y-2">
//               {features.map((f, i) => (
//                 <button
//                   key={f.id}
//                   onClick={() => setSelectedFeature(i)}
//                   className={`w-full p-3 rounded-lg text-left transition text-sm ${
//                     selectedFeature === i
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 hover:bg-gray-200 text-gray-900"
//                   }`}
//                 >
//                   <div className="flex items-start gap-2">
//                     <div
//                       className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
//                       style={{ backgroundColor: f.color }}
//                     />
//                     <div>
//                       <p className="font-medium">{f.name}</p>
//                       <p className="text-xs opacity-75">{f.description}</p>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md p-4">
//             <h3 className="font-bold text-sm mb-3 text-gray-900">
//               SPECIFICATIONS
//             </h3>
//             <div className="space-y-2">
//               {Object.entries(productSpecs).map(([section, specs]) => (
//                 <div
//                   key={section}
//                   className="border border-gray-300 rounded-lg"
//                 >
//                   <button
//                     onClick={() =>
//                       setExpandedSpecSection(
//                         expandedSpecSection === section ? null : section
//                       )
//                     }
//                     className="w-full px-3 py-2 flex justify-between items-center hover:bg-gray-100 transition text-sm"
//                   >
//                     <span className="font-medium">{section}</span>
//                     <span
//                       className={`transition-transform ${
//                         expandedSpecSection === section ? "rotate-180" : ""
//                       }`}
//                     >
//                       ▼
//                     </span>
//                   </button>
//                   {expandedSpecSection === section && (
//                     <div className="px-3 py-2 bg-gray-50 space-y-1 text-xs border-t">
//                       {specs.map((s, i) => (
//                         <div key={i} className="flex justify-between">
//                           <span className="text-gray-600">{s.label}:</span>
//                           <span className="font-medium text-gray-900">
//                             {s.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Version 3
// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { RotateCw, Plus, Minus, Info, Share2 } from "lucide-react";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

// const productSpecs = {
//   Physical: [
//     { label: "Capacity", value: "4L" },
//     { label: "Weight", value: "45 kg" },
//     { label: "Dimensions", value: "600 × 500 × 800 mm" },
//     { label: "Color", value: "White/Gray" },
//   ],
//   Performance: [
//     { label: "Max RPM", value: "3,600" },
//     { label: "Max RCF", value: "25,000 x g" },
//     { label: "Rotor Options", value: "18+" },
//     { label: "Speed Control", value: "100-3600 RPM" },
//   ],
//   Features: [
//     { label: "Display", value: '7" Touchscreen' },
//     { label: "Programs", value: "10 preset + custom" },
//     { label: "Cooling", value: "Forced Air" },
//     { label: "Noise Level", value: "< 70 dB" },
//   ],
// };

// export default function CentrifugeTour() {
//   /* ========================================================= */
//   /* 🔥 STATES & REFS (SAME) */
//   /* ========================================================= */
//   const containerRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const pivotRef = useRef(null);

//   const [selectedFeature, setSelectedFeature] = useState(0);
//   const [isAutoRotate, setIsAutoRotate] = useState(true);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [expandedSpecSection, setExpandedSpecSection] = useState(null);
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [loadError, setLoadError] = useState(null);

//   // rotation store (not model rotation now - camera orbit instead)
//   const drag = useRef({
//     isDragging: false,
//     prev: { x: 0, y: 0 },
//     rot: { x: 0.2, y: 0.5 },
//   });

//   const zoomState = useRef({ current: 1, target: 1 });

//   /* ========================================================= */
//   /* 🔥 INITIAL SCENE SETUP */
//   /* ========================================================= */
//   useEffect(() => {
//     if (!containerRef.current || sceneRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf5f5f5);
//     sceneRef.current = scene;

//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;

//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
//     camera.position.set(0, 4, 10);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(width, height);
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     /* 🔥 Lights */
//     scene.add(new THREE.AmbientLight(0xffffff, 2));
//     const dl = new THREE.DirectionalLight(0xffffff, 1.7);
//     dl.position.set(5, 10, 10);
//     scene.add(dl);

//     /* ========================================================= */
//     /* 🔥 Load Model — Center + Scale + Pivot */
//     /* ========================================================= */

//     const loader = new GLTFLoader();
//     const draco = new DRACOLoader();
//     draco.setDecoderPath("/draco/");
//     loader.setDRACOLoader(draco);

//     loader.load(
//       "/models/product_draco.glb",
//       (gltf) => {
//         const model = gltf.scene;
//         const pivot = new THREE.Group();
//         pivotRef.current = pivot;
//         scene.add(pivot);
//         pivot.add(model);

//         // center model
//         const box = new THREE.Box3().setFromObject(model);
//         const center = box.getCenter(new THREE.Vector3());
//         model.position.sub(center);

//         // scale consistent
//         const size = box.getSize(new THREE.Vector3());
//         const max = Math.max(size.x, size.y, size.z);
//         model.scale.setScalar(9 / max);

//         setModelLoaded(true);
//       },
//       undefined,
//       (e) => setLoadError("MODEL LOAD FAILED")
//     );

//     /* ========================================================= */
//     /* 🔥 Animation — ROTATING CAMERA (Not Model) */
//     /* ========================================================= */
//     function animate() {
//       requestAnimationFrame(animate);

//       const rot = drag.current.rot;
//       const radius = 12;

//       // camera.position.x = radius*Math.sin(rot.y);
//       // camera.position.z = radius*Math.cos(rot.y);
//       // camera.position.y = 4 + rot.x*2;

//       // if(isAutoRotate && !drag.current.isDragging)
//       //     drag.current.rot.y += 0.002;
//       // Convert to spherical orbit
//       // const phi = Math.max(0.1, Math.min(Math.PI - 0.1, rot.x + Math.PI / 2)); // vertical full rotation
//       const phi = (rot.x % (Math.PI*2)) + Math.PI/2;

//       const theta = rot.y; // horizontal infinite rotation

//       camera.position.set(
//         radius * Math.sin(phi) * Math.sin(theta), // X
//         radius * Math.cos(phi), // Y (full top/bottom orbit)
//         radius * Math.sin(phi) * Math.cos(theta) // Z
//       );

//       camera.lookAt(0, 5, 0);

//       zoomState.current.current +=
//         (zoomState.current.target - zoomState.current.current) * 0.08;
//       camera.position.multiplyScalar(zoomState.current.current);

//       renderer.render(scene, camera);
//     }
//     animate();

//     /* Resize */
//     window.addEventListener("resize", () => {
//       const w = containerRef.current.clientWidth;
//       const h = containerRef.current.clientHeight;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     });
//   }, []);

//   /* ========================================================= */
//   /* 🔥 MOUSE + TOUCH CONTROLS — Orbit Camera */
//   /* ========================================================= */
//   useEffect(() => {
//     const canvas = rendererRef.current?.domElement;
//     if (!canvas) return;

//     const pos = (e) =>
//       e.touches
//         ? {
//             x: e.touches[0].clientX,
//             y: e.touches[0].clientY,
//           }
//         : { x: e.clientX, y: e.clientY };

//     const start = (e) => {
//       drag.current.isDragging = true;
//       drag.current.prev = pos(e);
//     };
//     const end = () => (drag.current.isDragging = false);

//     const move = (e) => {
//       if (!drag.current.isDragging) return;
//       if (e.cancelable) e.preventDefault();

//       const { x, y } = pos(e);
//       const dx = x - drag.current.prev.x;
//       const dy = y - drag.current.prev.y;

//       drag.current.rot.y += dx * 0.004;
//       drag.current.rot.x += dy * 0.004;
//       drag.current.rot.x = Math.max(-1.2, Math.min(1.2, drag.current.rot.x));

//       drag.current.prev = { x, y };
//     };

//     const zoom = (e) => {
//       const z = e.deltaY > 0 ? zoomLevel * 1.1 : zoomLevel * 0.9;
//       const clamp = Math.max(0.5, Math.min(3, z));
//       zoomState.current.target = clamp;
//       setZoomLevel(clamp);
//       e.preventDefault();
//     };

//     canvas.addEventListener("mousedown", start);
//     canvas.addEventListener("mousemove", move);
//     canvas.addEventListener("mouseup", end);
//     canvas.addEventListener("mouseleave", end);

//     canvas.addEventListener("touchstart", start, { passive: true });
//     canvas.addEventListener("touchmove", move, { passive: false });
//     canvas.addEventListener("touchend", end);

//     canvas.addEventListener("wheel", zoom, { passive: false });
//   }, [zoomLevel]);

//   /* ========================================================= */
//   /* UI section remained untouched exactly as you wanted */
//   /* ========================================================= */

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 overflow-hidden flex flex-col">
//       {/* ---------- Header UI (UNTOUCHED) --------- */}
//       <div className="p-6 bg-white shadow-sm">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Pro Centrifuge Series
//         </h1>
//         <p className="text-gray-600 text-sm">Interactive 3D Product Tour</p>
//       </div>

//       <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4 md:flex-row">
//         {/* ========== 3D VIEW (UI same) ========== */}
//         <div className="flex-1 shadow-lg rounded-xl bg-white relative">
//           <div
//             ref={containerRef}
//             className="w-full h-[60vh] md:h-full cursor-grab active:cursor-grabbing"
//           />

//           {!modelLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center bg-white/80">
//               <div className="text-center">
//                 <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
//                 <p className="mt-3 font-medium text-gray-700">
//                   Loading Model...
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ========== UI CONTROL PANEL (UNTOUCHED) ========== */}
//         <div className="w-80 space-y-3 overflow-y-auto pr-2 hidden md:block">
//           <div className="bg-white p-4 shadow-md rounded-xl">
//             <h3 className="font-bold text-sm mb-3">CONTROLS</h3>
//             <button
//               onClick={() => setIsAutoRotate(!isAutoRotate)}
//               className={`w-full py-2 text-white rounded-lg mb-2 font-medium ${
//                 isAutoRotate ? "bg-blue-600" : "bg-gray-600"
//               } `}
//             >
//               <RotateCw size={16} className="inline mr-2" />
//               {isAutoRotate ? "Stop" : "Start"} Rotation
//             </button>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setZoomLevel((z) => Math.max(0.6, z * 0.9))}
//                 className="flex-1 py-2 bg-gray-700 text-white rounded-lg"
//               >
//                 <Plus size={16} />
//                 Zoom In
//               </button>
//               <button
//                 onClick={() => setZoomLevel((z) => Math.min(2.5, z * 1.1))}
//                 className="flex-1 py-2 bg-gray-700 text-white rounded-lg"
//               >
//                 <Minus size={16} />
//                 Out
//               </button>
//             </div>

//             <button
//               onClick={() => {
//                 drag.current.rot = { x: 0.2, y: 0.5 };
//                 zoomState.current.target = 1;
//               }}
//               className="w-full mt-2 py-2 bg-gray-700 text-white rounded-lg"
//             >
//               Reset View
//             </button>

//             <button className="mt-2 w-full py-2 rounded-lg font-medium bg-purple-600 text-white">
//               <Share2 size={16} /> Share
//             </button>
//           </div>

//           {/* ========== Features + Specs (Untouched) ========== */}
//           <div className="bg-white shadow-md rounded-xl p-4">
//             <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
//               <Info size={14} /> FEATURES
//             </h3>
//             {Object.entries(productSpecs.Features).map(([i, f]) => (
//               <button
//                 key={i}
//                 className="w-full p-3 rounded-lg text-left bg-gray-100 hover:bg-gray-200 text-sm mb-2"
//               >
//                 {f.label + " - " + f.value}
//               </button>
//             ))}
//           </div>

//           {/* SPEC LIST SAME */}
//           <div className="bg-white shadow-md rounded-xl p-4">
//             <h3 className="font-bold text-sm mb-3">SPECIFICATIONS</h3>
//             {Object.entries(productSpecs).map(([section, specs]) => (
//               <div key={section} className="border rounded-md mb-2">
//                 <button
//                   onClick={() =>
//                     setExpandedSpecSection((x) =>
//                       x === section ? null : section
//                     )
//                   }
//                   className="px-3 py-2 w-full flex justify-between text-sm"
//                 >
//                   <span>{section}</span>
//                   <span
//                     className={
//                       expandedSpecSection === section ? "rotate-180" : ""
//                     }
//                   >
//                     ▼
//                   </span>
//                 </button>
//                 {expandedSpecSection === section && (
//                   <div className="px-3 py-2 text-xs bg-gray-50">
//                     {specs.map((s, i) => (
//                       <p key={i} className="flex justify-between text-gray-600">
//                         <span>{s.label}</span>
//                         <span>{s.value}</span>
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//Version 4
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Plus, Minus, Info, Share2 } from "lucide-react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const productSpecs = {
  Physical: [
    { label: "Capacity", value: "4L" },
    { label: "Weight", value: "45 kg" },
    { label: "Dimensions", value: "600 × 500 × 800 mm" },
    { label: "Color", value: "White/Gray" },
  ],
  Performance: [
    { label: "Max RPM", value: "3,600" },
    { label: "Max RCF", value: "25,000 x g" },
    { label: "Rotor Options", value: "18+" },
    { label: "Speed Control", value: "100-3600 RPM" },
  ],
  Features: [
    { label: "Display", value: `7" Touchscreen` },
    { label: "Programs", value: "10 preset + custom" },
    { label: "Cooling", value: "Forced Air" },
    { label: "Noise Level", value: "< 70 dB" },
  ],
};

export default function CentrifugeTour() {
  const containerRef = useRef(null);

  const [isAutoRotate, setIsAutoRotate] = useState(true);
  // const [zoomLevel, setZoomLevel] = useState(1);
  const zoom = useRef(1.2);
  const [expandedSpecSection, setExpandedSpecSection] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  // const [loadProgress, setLoadProgress] = useState(0);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  /* 🔥 Rotation State */
  const drag = useRef({
    isDragging: false,
    prev: { x: 0, y: 0 },
    rot: { x: 1, y: 1 }, // spherical orbit
  });

  /* 🔥 INIT SCENE + CAMERA + MODEL */
  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;

    //Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x909090);
    // scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    //Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 15, 12);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* 🌟 Lights */
    // scene.add(new THREE.AmbientLight(0xFB923C, 3));
    scene.add(new THREE.AmbientLight(0xffffff, 3));
    const dl = new THREE.DirectionalLight(0xffffff, 1.8);
    dl.position.set(10, 10, 10);
    scene.add(dl);

    /* 🔥 Load Model */
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    draco.setDecoderConfig({ type: "wasm" });
    loader.setDRACOLoader(draco);
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      "/models/product_draco.glb",
      (gltf) => {
        const model = gltf.scene;

        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.set(0, -4, 0);

        const size = box.getSize(new THREE.Vector3());
        const max = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(9 / max);

        setModelLoaded(true);
        // setLoadProgress(100);
        // setTimeout(() => setModelLoaded(true), 250);
        // setLoadProgress(100);
      },
      // ▶ PROGRESS TRACKING
      // (xhr) => {
      //   const total = xhr.total || xhr.loaded * 3;  // Estimate if unknown
      //   const percent = Math.min(100, Math.round((xhr.loaded / total) * 100));
      //   setLoadProgress(percent);
      // },
      undefined,
      () => console.log("Failed to load")
    );

    /* ---------------- ANIMATION FULL 360° ORBIT ---------------- */
    // function animate() {
    //   requestAnimationFrame(animate);

    //   const r = 13; // radius (distance from model)

    //   // 🔥 spherical orbit logic
    //   if (isAutoRotate && !drag.current.isDragging) {
    //     drag.current.rot.y += 0.03; // auto rotation
    //   }

    //   camera.position.set(
    //     r * Math.sin(drag.current.rot.x) * Math.sin(drag.current.rot.y),
    //     r * Math.cos(drag.current.rot.x),
    //     r * Math.sin(drag.current.rot.x) * Math.cos(drag.current.rot.y)
    //   );

    //   camera.lookAt(0, 0, 0);
    //   renderer.render(scene, camera);
    // }
    // animate();

    /* Resize */
    window.addEventListener("resize", () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }, []);

  // CONTROLS
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    let frame;
    function animate() {
      const r = zoom.current * 13;

      // 🔥 working auto-rotate toggle
      if (isAutoRotate && !drag.current.isDragging) {
        drag.current.rot.y += 0.03;
      }

      cameraRef.current.position.set(
        r * Math.sin(drag.current.rot.x) * Math.sin(drag.current.rot.y),
        r * Math.cos(drag.current.rot.x),
        r * Math.sin(drag.current.rot.x) * Math.cos(drag.current.rot.y)
      );

      cameraRef.current.lookAt(0, 0, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);

      frame = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isAutoRotate]); // ⭐ This FIX makes start/stop work

  /* ---------------- TOUCH + MOUSE CONTROL ---------------- */
  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;

    const pos = (e) =>
      e.touches
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    const start = (e) => {
      drag.current.isDragging = true;
      drag.current.prev = pos(e);
    };

    const move = (e) => {
      if (!drag.current.isDragging) return;
      if (e.cancelable) e.preventDefault();

      const { x, y } = pos(e);
      const dx = x - drag.current.prev.x;
      const dy = y - drag.current.prev.y;

      drag.current.rot.y -= dx * 0.004;
      drag.current.rot.x -= dy * 0.004;

      drag.current.rot.x = Math.max(
        0.2,
        Math.min(Math.PI - 0.2, drag.current.rot.x)
      );
      drag.current.prev = { x, y };
    };

    const end = () => (drag.current.isDragging = false);

    /* Scroll zoom*/
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      zoom.current += e.deltaY > 0 ? 0.05 : -0.05;
      zoom.current = THREE.MathUtils.clamp(zoom.current, 0.6, 2.5);
    });

    // Pinch zoom
    let dist = null;
    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (dist) {
          zoom.current -= (d - dist) * 0.007;
          zoom.current = THREE.MathUtils.clamp(zoom.current, 0.6, 2.5);
        }
        dist = d;
      }
    });
    canvas.addEventListener("touchend", () => (dist = null));

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);

    canvas.addEventListener("touchstart", start, { passive: true });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
  }, []);

  /* ---------------- UI — NO CHANGE ---------------- */
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 overflow-hidden flex flex-col">
      <div className="p-6 bg-white shadow-sm">
        <h1 className="text-4xl font-bold">Pro Centrifuge Series</h1>
        <p className="text-gray-600 text-sm">Interactive 3D Product Tour</p>
      </div>

      <div className="flex-1 p-4 flex gap-4 md:flex-row flex-col">
        <div className="flex-1 bg-white rounded-xl shadow relative">
          <div
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
          {/* /* {!modelLoaded && (
            <p className="absolute inset-0 flex items-center justify-center">
              Loading...
            </p>
          )} */}

          {!modelLoaded && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center 
                  bg-white bg-opacity-90 backdrop-blur-sm"
            >
              <div className="text-lg font-semibold text-gray-700 mb-2">
                Loading 3D Model...
              </div>

              {/* spinner */}
              <div
                className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 
                   rounded-full animate-spin mb-4"
              ></div>

              {/* progress bar */}
              {/* <div className="w-56 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>

              <p className="text-gray-600 text-sm mt-2">{loadProgress}%</p> */}
            </div>
          )}
        </div>

        <div className="w-80 hidden md:block space-y-3 overflow-y-auto pr-2">
          <div className="bg-white p-4 shadow-md rounded-xl">
            <h3 className="font-bold text-sm mb-3">CONTROLS</h3>

            <button
              onClick={() => setIsAutoRotate((v) => !v)}
              className={`w-full py-2 text-white rounded-lg mb-2 font-medium ${
                isAutoRotate ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <RotateCw size={16} className="inline mr-2" />
              {isAutoRotate ? "Stop Rotation" : "Start Rotation"}
            </button>

            <button
              onClick={() => (drag.current.rot = { x: 1, y: 1 })}
              className="w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg"
            >
              Reset View
            </button>

            <button className="w-full mt-2 py-2 bg-purple-600 text-white rounded-lg">
              <Share2 size={16} className="inline mr-2" /> Share
            </button>
          </div>

          <div className="bg-white p-4 shadow-md rounded-xl">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Info size={16} /> FEATURES
            </h3>
            {productSpecs.Features.map((f, i) => (
              <p key={i} className="p-2 rounded bg-gray-100 mb-1">
                {f.label} — {f.value}
              </p>
            ))}
          </div>

          <div className="bg-white p-4 shadow-md rounded-xl">
            <h3 className="font-bold text-sm mb-3">SPECIFICATIONS</h3>
            {Object.entries(productSpecs).map(([section, specs]) => (
              <div key={section} className="border rounded mb-2">
                <button
                  onClick={() =>
                    setExpandedSpecSection(
                      expandedSpecSection === section ? null : section
                    )
                  }
                  className="px-3 py-2 w-full flex justify-between text-sm"
                >
                  <span>{section}</span>
                  <span>{expandedSpecSection === section ? "▲" : "▼"}</span>
                </button>

                {expandedSpecSection === section && (
                  <div className="px-3 py-2 text-xs bg-gray-50">
                    {specs.map((s, i) => (
                      <p key={i} className="flex justify-between">
                        <span>{s.label}</span>
                        <span>{s.value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
