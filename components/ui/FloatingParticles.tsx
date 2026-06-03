'use client';

import { useReducedMotion } from '@/lib/animations';

/**
 * Lightweight CSS-only floating particle effect.
 * Renders 7 small dots positioned statically for visual texture.
 * No continuous animation — dots provide subtle decorative detail without GPU cost.
 * Respects reduced motion preferences.
 */

interface Particle {
  id: number;
  size: number;
  top: string;
  left: string;
  opacity: number;
}

const particles: Particle[] = [
  { id: 1, size: 2, top: '12%', left: '8%', opacity: 0.25 },
  { id: 2, size: 3, top: '28%', left: '82%', opacity: 0.3 },
  { id: 3, size: 2, top: '55%', left: '22%', opacity: 0.2 },
  { id: 4, size: 4, top: '70%', left: '65%', opacity: 0.35 },
  { id: 5, size: 3, top: '15%', left: '48%', opacity: 0.25 },
  { id: 6, size: 2, top: '85%', left: '35%', opacity: 0.3 },
  { id: 7, size: 3, top: '42%', left: '90%', opacity: 0.2 },
];

export default function FloatingParticles() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-primary-accent"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            animation: 'none',
          }}
        />
      ))}
    </div>
  );
}
