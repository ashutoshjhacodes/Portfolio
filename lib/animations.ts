'use client';

import { Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const hoverScale = {
  scale: 1.04,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const cardHoverElevation = {
  y: -6,
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  borderColor: 'rgba(20,184,166,0.3)',
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const gradientSweep: Variants = {
  hidden: {
    backgroundPosition: '200% center',
  },
  visible: {
    backgroundPosition: '0% center',
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * Helper utility for animated number counting.
 * Returns configuration for use with Framer Motion's animate function.
 * @param start - Starting value (defaults to 0)
 * @param end - Target value to count to
 * @param duration - Animation duration in seconds (defaults to 0.5, clamped to 0.2-0.5)
 */
export function counterAnimation(
  start: number,
  end: number,
  duration: number = 0.5
): { start: number; end: number; duration: number } {
  const clampedDuration = Math.min(0.5, Math.max(0.2, duration));
  return { start, end, duration: clampedDuration };
}

/**
 * Hook that respects the user's `prefers-reduced-motion` preference.
 * Returns `true` when the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/** Static (disabled) variants for when reduced motion is preferred */
const disabledVariants = {
  fadeIn: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  } as Variants,
  slideUp: {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  scaleIn: {
    hidden: { opacity: 1, scale: 1 },
    visible: { opacity: 1, scale: 1 },
  } as Variants,
  staggerContainer: {
    hidden: {},
    visible: {},
  } as Variants,
  staggerItem: {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  gradientSweep: {
    hidden: { backgroundPosition: '0% center' },
    visible: { backgroundPosition: '0% center' },
  } as Variants,
};

/** Active variants (same as top-level exports) */
const activeVariants = {
  fadeIn,
  slideUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  gradientSweep,
};

export interface AnimationVariants {
  fadeIn: Variants;
  slideUp: Variants;
  scaleIn: Variants;
  staggerContainer: Variants;
  staggerItem: Variants;
  gradientSweep: Variants;
}

/**
 * Hook that returns animation variants based on the user's motion preference.
 * When reduced motion is active, returns static (disabled) variants with no animation.
 * When motion is allowed, returns the standard animation variants.
 */
export function useAnimationVariants(): AnimationVariants {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return disabledVariants;
  }

  return activeVariants;
}
