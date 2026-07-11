import { useState, useEffect } from 'react';

export function useCountUp(target: number, duration: number = 1500, suffix: string = '') {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Avoid re-running if already animated or target is 0
    if (hasAnimated || target === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      setHasAnimated(true);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easedPercentage = easeOutQuart(percentage);
      const currentCount = Math.floor(easedPercentage * target);
      
      setCount(currentCount);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
        setHasAnimated(true);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, hasAnimated]);

  return { count, suffix, hasAnimated, setHasAnimated };
}
