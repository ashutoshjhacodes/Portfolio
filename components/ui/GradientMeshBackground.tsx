'use client';

import { useReducedMotion } from '@/lib/animations';

/**
 * GradientMeshBackground
 *
 * A decorative gradient mesh background using three overlapping
 * radial gradients. Static positioned blobs that fade in on mount.
 *
 * - aria-hidden="true" since it's purely decorative
 * - Respects prefers-reduced-motion by disabling the fade-in transition
 */
export default function GradientMeshBackground() {
  const prefersReducedMotion = useReducedMotion();

  const fadeInStyle = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, transition: 'opacity 1.5s ease-out' };

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Gradient 1 — primary-accent, top-left bias */}
      <div
        className="absolute -left-1/4 -top-1/4 h-[60%] w-[60%] rounded-full opacity-[0.15]"
        style={{
          background:
            'radial-gradient(circle, var(--primary-accent) 0%, transparent 70%)',
          ...fadeInStyle,
        }}
      />

      {/* Gradient 2 — secondary-accent, center-right bias */}
      <div
        className="absolute -right-1/4 top-1/4 h-[50%] w-[50%] rounded-full opacity-[0.10]"
        style={{
          background:
            'radial-gradient(circle, var(--secondary-accent) 0%, transparent 70%)',
          ...fadeInStyle,
        }}
      />

      {/* Gradient 3 — primary-accent, bottom-center bias */}
      <div
        className="absolute -bottom-1/4 left-1/3 h-[55%] w-[55%] rounded-full opacity-[0.12]"
        style={{
          background:
            'radial-gradient(circle, var(--primary-accent) 0%, transparent 70%)',
          ...fadeInStyle,
        }}
      />
    </div>
  );
}
