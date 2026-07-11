import { useEffect, useState } from 'react';

export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '50px' }
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Once intersected, we don't strictly need to keep observing if we just want a trigger
        // but we'll leave it up to the consumer if they want to disconnect.
      }
    }, options);

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [elementRef, options.threshold, options.rootMargin]);

  return isIntersecting;
}
