import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { fadeIn, slideUp, scaleIn, staggerContainer, hoverScale } from '@/lib/animations';
import { getStoredTheme, setStoredTheme } from '@/lib/utils/theme';
import type { Theme } from '@/lib/utils/theme';

/**
 * Feature: career-platform
 * Property 10: Animation Duration Bounds
 * 
 * For any animation variant defined in the Animation System, its duration
 * shall be between 150ms and 500ms inclusive, and its easing function
 * shall be one of 'ease' or 'easeOut'.
 * 
 * **Validates: Requirements 14.5**
 */
describe('Feature: career-platform, Property 10: Animation Duration Bounds', () => {
  // All animation variants that have a direct duration (excluding staggerContainer which only has staggerChildren)
  const animationVariantsWithDuration = [
    { name: 'fadeIn', variant: fadeIn },
    { name: 'slideUp', variant: slideUp },
    { name: 'scaleIn', variant: scaleIn },
  ] as const;

  const validEasings = ['ease', 'easeOut'];

  it('all animation variants have duration between 150ms and 500ms with ease/easeOut easing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...animationVariantsWithDuration),
        ({ name, variant }) => {
          const visible = variant.visible as { transition: { duration: number; ease: string } };
          const durationInMs = visible.transition.duration * 1000;

          // Duration must be between 150ms and 500ms inclusive
          expect(durationInMs).toBeGreaterThanOrEqual(150);
          expect(durationInMs).toBeLessThanOrEqual(500);

          // Easing must be 'ease' or 'easeOut'
          expect(validEasings).toContain(visible.transition.ease);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('hoverScale animation has duration between 150ms and 500ms with ease/easeOut easing', () => {
    fc.assert(
      fc.property(
        fc.constant(hoverScale),
        (hover) => {
          const durationInMs = hover.transition.duration * 1000;

          // Duration must be between 150ms and 500ms inclusive
          expect(durationInMs).toBeGreaterThanOrEqual(150);
          expect(durationInMs).toBeLessThanOrEqual(500);

          // Easing must be 'ease' or 'easeOut'
          expect(validEasings).toContain(hover.transition.ease);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('staggerContainer staggerChildren delay is within animation bounds', () => {
    fc.assert(
      fc.property(
        fc.constant(staggerContainer),
        (container) => {
          const visible = container.visible as { transition: { staggerChildren: number } };
          const staggerInMs = visible.transition.staggerChildren * 1000;

          // staggerChildren delay must be between 100ms and 150ms inclusive (per Requirement 14.2)
          expect(staggerInMs).toBeGreaterThanOrEqual(100);
          expect(staggerInMs).toBeLessThanOrEqual(150);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no animation variant exceeds the upper bound of 500ms', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { name: 'fadeIn', duration: (fadeIn.visible as any).transition.duration },
          { name: 'slideUp', duration: (slideUp.visible as any).transition.duration },
          { name: 'scaleIn', duration: (scaleIn.visible as any).transition.duration },
          { name: 'hoverScale', duration: hoverScale.transition.duration },
        ),
        ({ duration }) => {
          expect(duration * 1000).toBeLessThanOrEqual(500);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no animation variant is below the lower bound of 150ms', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { name: 'fadeIn', duration: (fadeIn.visible as any).transition.duration },
          { name: 'slideUp', duration: (slideUp.visible as any).transition.duration },
          { name: 'scaleIn', duration: (scaleIn.visible as any).transition.duration },
          { name: 'hoverScale', duration: hoverScale.transition.duration },
        ),
        ({ duration }) => {
          expect(duration * 1000).toBeGreaterThanOrEqual(150);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: career-platform
 * Property 9: Theme Persistence Round-Trip
 * 
 * For any theme value (dark or light), storing the theme preference and
 * then retrieving it shall return the identical theme value.
 * 
 * **Validates: Requirements 14.2**
 */
describe('Feature: career-platform, Property 9: Theme Persistence Round-Trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('storing and retrieving any theme returns the identical value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('dark', 'light'),
        (theme) => {
          setStoredTheme(theme);
          const retrieved = getStoredTheme();
          expect(retrieved).toBe(theme);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('theme persistence is idempotent - setting the same theme multiple times returns the same value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('dark', 'light'),
        fc.integer({ min: 1, max: 10 }),
        (theme, times) => {
          for (let i = 0; i < times; i++) {
            setStoredTheme(theme);
          }
          const retrieved = getStoredTheme();
          expect(retrieved).toBe(theme);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('last stored theme wins when multiple themes are set sequentially', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom<Theme>('dark', 'light'), { minLength: 1, maxLength: 20 }),
        (themes) => {
          for (const theme of themes) {
            setStoredTheme(theme);
          }
          const lastTheme = themes[themes.length - 1];
          const retrieved = getStoredTheme();
          expect(retrieved).toBe(lastTheme);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('getStoredTheme returns null when no theme has been stored', () => {
    fc.assert(
      fc.property(
        fc.constant(undefined),
        () => {
          localStorage.clear();
          const retrieved = getStoredTheme();
          expect(retrieved).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('stored theme is not affected by unrelated localStorage operations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('dark', 'light'),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 0, maxLength: 100 }),
        (theme, randomKey, randomValue) => {
          // Avoid colliding with the theme storage key
          const safeKey = randomKey === 'theme-preference' ? 'other-key' : randomKey;
          
          setStoredTheme(theme);
          localStorage.setItem(safeKey, randomValue);
          
          const retrieved = getStoredTheme();
          expect(retrieved).toBe(theme);
        }
      ),
      { numRuns: 100 }
    );
  });
});
