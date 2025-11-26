// // import { useRef, useCallback } from 'react';

// // export const useDragRotation = () => {
// //   const dragStateRef = useRef({
// //     isDragging: false,
// //     previousMousePosition: { x: 0, y: 0 },
// //     rotation: { x: 0, y: 0, z: 0 },
// //     velocity: { x: 0, y: 0 },
// //     inertia: 0.95
// //   });

// //   const onMouseDown = useCallback((e) => {
// //     dragStateRef.current.isDragging = true;
// //     dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
// //   }, []);

// //   const onMouseMove = useCallback((e) => {
// //     if (!dragStateRef.current.isDragging) return;

// //     const deltaX = e.clientX - dragStateRef.current.previousMousePosition.x;
// //     const deltaY = e.clientY - dragStateRef.current.previousMousePosition.y;

// //     const sensitivity = 0.01;

// //     dragStateRef.current.velocity.x = deltaY * sensitivity;
// //     dragStateRef.current.velocity.y = deltaX * sensitivity;

// //     dragStateRef.current.rotation.y += deltaX * sensitivity;
// //     dragStateRef.current.rotation.x += deltaY * sensitivity;

// //     // Clamp X rotation
// //     dragStateRef.current.rotation.x = Math.max(
// //       -Math.PI / 2,
// //       Math.min(Math.PI / 2, dragStateRef.current.rotation.x)
// //     );

// //     dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
// //   }, []);

// //   const onMouseUp = useCallback(() => {
// //     dragStateRef.current.isDragging = false;
// //   }, []);

// //   const applyInertia = useCallback(() => {
// //     if (!dragStateRef.current.isDragging) {
// //       dragStateRef.current.rotation.y += dragStateRef.current.velocity.y;
// //       dragStateRef.current.rotation.x += dragStateRef.current.velocity.x;

// //       dragStateRef.current.velocity.y *= dragStateRef.current.inertia;
// //       dragStateRef.current.velocity.x *= dragStateRef.current.inertia;

// //       if (Math.abs(dragStateRef.current.velocity.y) < 0.0001) {
// //         dragStateRef.current.velocity.y = 0;
// //       }
// //       if (Math.abs(dragStateRef.current.velocity.x) < 0.0001) {
// //         dragStateRef.current.velocity.x = 0;
// //       }

// //       dragStateRef.current.rotation.x = Math.max(
// //         -Math.PI / 2,
// //         Math.min(Math.PI / 2, dragStateRef.current.rotation.x)
// //       );
// //     }
// //   }, []);

// //   return {
// //     dragStateRef,
// //     onMouseDown,
// //     onMouseMove,
// //     onMouseUp,
// //     applyInertia
// //   };
// // };

// import { useRef, useCallback } from 'react';

// export const useDragRotation = () => {
//   const dragStateRef = useRef({
//     isDragging: false,
//     previousMousePosition: { x: 0, y: 0 },
//     rotation: { x: 0, y: 0, z: 0 },
//     velocity: { x: 0, y: 0, z: 0 },
//     inertia: 0.95
//   });

//   const onMouseDown = useCallback((e) => {
//     dragStateRef.current.isDragging = true;
//     dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
//   }, []);

//   const onMouseMove = useCallback((e) => {
//     if (!dragStateRef.current.isDragging) return;

//     const deltaX = e.clientX - dragStateRef.current.previousMousePosition.x;
//     const deltaY = e.clientY - dragStateRef.current.previousMousePosition.y;

//     const sensitivity = 0.01;

//     // Update velocities
//     dragStateRef.current.velocity.x = deltaY * sensitivity;
//     dragStateRef.current.velocity.y = deltaX * sensitivity;
//     dragStateRef.current.velocity.z = (deltaX + deltaY) * sensitivity * 0.5; // NEW

//     // Apply rotation
//     dragStateRef.current.rotation.y += deltaX * sensitivity; // spin left/right
//     dragStateRef.current.rotation.x += deltaY * sensitivity; // tilt up/down
//     dragStateRef.current.rotation.z += (deltaX + deltaY) * sensitivity * 0.5; // NEW roll rotation

//     // REMOVE THE CLAMP — allows full 360° rotation
//     // ❌ Removed X-axis lock

//     dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
//   }, []);

//   const onMouseUp = useCallback(() => {
//     dragStateRef.current.isDragging = false;
//   }, []);

//   const applyInertia = useCallback(() => {
//     if (!dragStateRef.current.isDragging) {
//       dragStateRef.current.rotation.y += dragStateRef.current.velocity.y;
//       dragStateRef.current.rotation.x += dragStateRef.current.velocity.x;
//       dragStateRef.current.rotation.z += dragStateRef.current.velocity.z; // NEW

//       dragStateRef.current.velocity.y *= dragStateRef.current.inertia;
//       dragStateRef.current.velocity.x *= dragStateRef.current.inertia;
//       dragStateRef.current.velocity.z *= dragStateRef.current.inertia; // NEW

//       if (Math.abs(dragStateRef.current.velocity.y) < 0.0001) dragStateRef.current.velocity.y = 0;
//       if (Math.abs(dragStateRef.current.velocity.x) < 0.0001) dragStateRef.current.velocity.x = 0;
//       if (Math.abs(dragStateRef.current.velocity.z) < 0.0001) dragStateRef.current.velocity.z = 0;
//     }
//   }, []);

//   return {
//     dragStateRef,
//     onMouseDown,
//     onMouseMove,
//     onMouseUp,
//     applyInertia
//   };
// };

import { useRef, useCallback } from 'react';

export const useDragRotation = () => {
  const dragStateRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0 },
    inertia: 0.95
  });

  const onMouseDown = useCallback((e) => {
    dragStateRef.current.isDragging = true;
    dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragStateRef.current.isDragging) return;

    const deltaX = e.clientX - dragStateRef.current.previousMousePosition.x;
    const deltaY = e.clientY - dragStateRef.current.previousMousePosition.y;

    const sensitivity = 0.01;

    dragStateRef.current.velocity.x = deltaY * sensitivity;
    dragStateRef.current.velocity.y = deltaX * sensitivity;

    dragStateRef.current.rotation.y += deltaX * sensitivity;
    dragStateRef.current.rotation.x += deltaY * sensitivity;

    dragStateRef.current.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, dragStateRef.current.rotation.x)
    );

    dragStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    dragStateRef.current.isDragging = false;
  }, []);

  const applyInertia = useCallback(() => {
    if (!dragStateRef.current.isDragging) {
      dragStateRef.current.rotation.y += dragStateRef.current.velocity.y;
      dragStateRef.current.rotation.x += dragStateRef.current.velocity.x;

      dragStateRef.current.velocity.y *= dragStateRef.current.inertia;
      dragStateRef.current.velocity.x *= dragStateRef.current.inertia;

      if (Math.abs(dragStateRef.current.velocity.y) < 0.0001) {
        dragStateRef.current.velocity.y = 0;
      }
      if (Math.abs(dragStateRef.current.velocity.x) < 0.0001) {
        dragStateRef.current.velocity.x = 0;
      }

      dragStateRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, dragStateRef.current.rotation.x)
      );
    }
  }, []);

  return {
    dragStateRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    applyInertia
  };
};
