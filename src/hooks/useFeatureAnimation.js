// import { useRef, useCallback } from 'react';

// const smoothRotateTo = (target, angle, duration = 1000) => {
//   const startAngle = target.rotation;
//   const startTime = Date.now();

//   return new Promise((resolve) => {
//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);

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

// const pulseAnimation = (object, duration = 600) => {
//   const startScale = object.scale.clone();
//   const startTime = Date.now();

//   return new Promise((resolve) => {
//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);

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

// export const useFeatureAnimation = () => {
//   const animationRef = useRef(null);

//   const animateToFeature = useCallback((model, featureIndex, totalFeatures) => {
//     if (!model) return;

//     if (animationRef.current) {
//       animationRef.current = null;
//     }

//     const anglePerFeature = (Math.PI * 2) / totalFeatures;
//     const targetAngle = featureIndex * anglePerFeature;

//     animationRef.current = Promise.all([
//       smoothRotateTo(model, targetAngle, 1200),
//       pulseAnimation(model, 600)
//     ]);

//     return animationRef.current;
//   }, []);

//   return { animateToFeature };
// };

import { useRef, useCallback } from 'react';

const smoothRotateTo = (target, angle, duration = 1000) => {
  const startAngle = target.rotation;
  const startTime = Date.now();

  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

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

const pulseAnimation = (object, duration = 600) => {
  const startScale = object.scale.clone();
  const startTime = Date.now();

  return new Promise((resolve) => {
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

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

export const useFeatureAnimation = () => {
  const animationRef = useRef(null);

  const animateToFeature = useCallback((model, featureIndex, totalFeatures) => {
    if (!model) return;

    if (animationRef.current) {
      animationRef.current = null;
    }

    const anglePerFeature = (Math.PI * 2) / totalFeatures;
    const targetAngle = featureIndex * anglePerFeature;

    animationRef.current = Promise.all([
      smoothRotateTo(model, targetAngle, 1200),
      pulseAnimation(model, 600)
    ]);

    return animationRef.current;
  }, []);

  return { animateToFeature };
};