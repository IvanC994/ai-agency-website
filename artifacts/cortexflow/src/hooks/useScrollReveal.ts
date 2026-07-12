import { useEffect, useRef, useState } from 'react';
import type React from 'react';

/** Returns true if the user has requested reduced motion at the OS level. */
function getPrefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Attaches an IntersectionObserver to the returned ref.  Once the element
 * crosses the viewport threshold the `visible` flag latches to `true` and
 * the observer disconnects (fires once only).
 *
 * When the user prefers reduced motion the flag starts as `true` so content
 * is never hidden.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);

  // Initialise to `true` immediately when reduced-motion is preferred so the
  // first render never hides content.
  const [visible, setVisible] = useState<boolean>(() => getPrefersReducedMotion());

  useEffect(() => {
    if (getPrefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/**
 * Inline style object that fades + slides an element into place.
 *
 * @param visible   Whether the element should be in its final visible state.
 * @param delayMs   Stagger delay in milliseconds (default 0).
 */
export function revealStyle(visible: boolean, delayMs = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 700ms ease-out ${delayMs}ms, transform 700ms ease-out ${delayMs}ms`,
  };
}
