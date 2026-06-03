'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from '@/lib/animations';

interface AnimatedCounterProps {
  /** The target numeric value to count up to */
  value: number;
  /** Suffix to display after the number (e.g., "+", "K") */
  suffix?: string;
  /** Duration of the counting animation in milliseconds (default: 2000) */
  duration?: number;
}

/**
 * Easing function: ease-out cubic for smooth deceleration
 * t => 1 - (1 - t)^3
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState<number>(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is preferred, keep showing the final value
    if (prefersReducedMotion) {
      setCount(value);
      if (isInView) setHasAnimated(true);
      return;
    }

    // Only trigger animation once when in view
    if (!isInView || hasAnimated) return;

    setHasAnimated(true);

    // Use a microtask to batch the count-from-zero with the first rAF paint
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.round(easedProgress * value);

      setCount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start from 0 only within the animation frame loop to avoid flash
    animationRef.current = requestAnimationFrame((firstFrame) => {
      setCount(0);
      const startTime = firstFrame;
      
      const animateLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.round(easedProgress * value);

        setCount(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateLoop);
        }
      };

      animationRef.current = requestAnimationFrame(animateLoop);
    });

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, value, hasAnimated, prefersReducedMotion, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
