// export const smoothRotateTo = (target, angle, duration = 1000) => {
//   const startAngle = target.rotation;
//   const startTime = Date.now();

//   return new Promise((resolve) => {
//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Easing function (ease-out)
//       const eased = 1 - Math.pow(1 - progress, 3);

//       target.rotation.y = startAngle + (angle - startAngle) * eased;

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         resolve();
//       }
//     };
//     animate();
//   });
// };

// export const pulseAnimation = (object, duration = 600) => {
//   const startScale = object.scale.clone();
//   const startTime = Date.now();

//   return new Promise((resolve) => {
//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Pulse effect: scale up then down
//       const scale = 1 + Math.sin(progress * Math.PI) * 0.1;

//       object.scale.copy(startScale).multiplyScalar(scale);

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         object.scale.copy(startScale);
//         resolve();
//       }
//     };
//     animate();
//   });
// };

export const smoothRotateTo = (target, angle, duration = 1000) => {
  const startAngle = target.rotation;
  const startTime = Date.now();

  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      target.rotation.y = startAngle + (angle - startAngle) * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    animate();
  });
};

export const pulseAnimation = (object, duration = 600) => {
  const startScale = object.scale.clone();
  const startTime = Date.now();

  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Pulse effect: scale up then down
      const scale = 1 + Math.sin(progress * Math.PI) * 0.1;

      object.scale.copy(startScale).multiplyScalar(scale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        object.scale.copy(startScale);
        resolve();
      }
    };
    animate();
  });
};