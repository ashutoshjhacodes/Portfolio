import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fadeIn,
  slideUp,
  scaleIn,
  staggerContainer,
  staggerItem,
  hoverScale,
  cardHoverElevation,
  gradientSweep,
  counterAnimation,
} from './animations';

describe('Animation variants', () => {
  it('fadeIn has correct hidden and visible states', () => {
    expect(fadeIn.hidden).toEqual({ opacity: 0 });
    expect(fadeIn.visible).toEqual({
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    });
  });

  it('slideUp has correct hidden and visible states', () => {
    expect(slideUp.hidden).toEqual({ opacity: 0, y: 20 });
    expect(slideUp.visible).toEqual({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  });

  it('scaleIn has correct hidden and visible states', () => {
    expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.95 });
    expect(scaleIn.visible).toEqual({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    });
  });

  it('staggerContainer uses 120ms (0.12) stagger delay', () => {
    expect(staggerContainer.hidden).toEqual({});
    expect(staggerContainer.visible).toEqual({
      transition: { staggerChildren: 0.12 },
    });
  });

  it('staggerItem has fadeIn + slideUp behavior', () => {
    expect(staggerItem.hidden).toEqual({ opacity: 0, y: 20 });
    expect(staggerItem.visible).toEqual({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  });

  it('hoverScale has correct scale and transition', () => {
    expect(hoverScale.scale).toBe(1.04);
    expect(hoverScale.transition).toEqual({ duration: 0.2, ease: 'easeOut' });
  });

  it('cardHoverElevation has correct elevation properties', () => {
    expect(cardHoverElevation.y).toBe(-6);
    expect(cardHoverElevation.boxShadow).toBe('0 20px 40px rgba(0,0,0,0.3)');
    expect(cardHoverElevation.borderColor).toBe('rgba(20,184,166,0.3)');
    expect(cardHoverElevation.transition).toEqual({
      duration: 0.3,
      ease: 'easeOut',
    });
  });

  it('gradientSweep has correct hidden and visible states', () => {
    expect(gradientSweep.hidden).toEqual({ backgroundPosition: '200% center' });
    expect(gradientSweep.visible).toEqual({
      backgroundPosition: '0% center',
      transition: { duration: 0.5, ease: 'easeOut' },
    });
  });

  it('all animation durations are between 200ms and 500ms for interactive elements', () => {
    const variants = [fadeIn, slideUp, scaleIn];
    for (const variant of variants) {
      const visible = variant.visible as { transition: { duration: number } };
      const duration = visible.transition.duration;
      expect(duration).toBeGreaterThanOrEqual(0.2);
      expect(duration).toBeLessThanOrEqual(0.5);
    }

    // hoverScale
    expect(hoverScale.transition.duration).toBeGreaterThanOrEqual(0.2);
    expect(hoverScale.transition.duration).toBeLessThanOrEqual(0.5);

    // cardHoverElevation
    expect(cardHoverElevation.transition.duration).toBeGreaterThanOrEqual(0.2);
    expect(cardHoverElevation.transition.duration).toBeLessThanOrEqual(0.5);

    // staggerItem
    const staggerItemVisible = staggerItem.visible as { transition: { duration: number } };
    expect(staggerItemVisible.transition.duration).toBeGreaterThanOrEqual(0.2);
    expect(staggerItemVisible.transition.duration).toBeLessThanOrEqual(0.5);

    // gradientSweep
    const gradientVisible = gradientSweep.visible as { transition: { duration: number } };
    expect(gradientVisible.transition.duration).toBeGreaterThanOrEqual(0.2);
    expect(gradientVisible.transition.duration).toBeLessThanOrEqual(0.5);
  });

  it('all animations use easeOut easing', () => {
    const variants = [fadeIn, slideUp, scaleIn, staggerItem];
    for (const variant of variants) {
      const visible = variant.visible as { transition: { ease: string } };
      expect(visible.transition.ease).toBe('easeOut');
    }

    expect(hoverScale.transition.ease).toBe('easeOut');
    expect(cardHoverElevation.transition.ease).toBe('easeOut');
  });
});

describe('counterAnimation', () => {
  it('returns start, end, and duration values', () => {
    const result = counterAnimation(0, 100);
    expect(result).toEqual({ start: 0, end: 100, duration: 0.5 });
  });

  it('accepts custom start and end values', () => {
    const result = counterAnimation(10, 500, 0.4);
    expect(result).toEqual({ start: 10, end: 500, duration: 0.4 });
  });

  it('clamps duration to minimum 200ms', () => {
    const result = counterAnimation(0, 50, 0.1);
    expect(result.duration).toBe(0.2);
  });

  it('clamps duration to maximum 500ms', () => {
    const result = counterAnimation(0, 50, 1.0);
    expect(result.duration).toBe(0.5);
  });
});

describe('useReducedMotion and useAnimationVariants hooks', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('useReducedMotion returns false when motion is not reduced', async () => {
    const { useReducedMotion } = await import('./animations');
    const { renderHook } = await import('@testing-library/react');
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('useReducedMotion returns true when motion is reduced', async () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { useReducedMotion } = await import('./animations');
    const { renderHook } = await import('@testing-library/react');
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('useAnimationVariants returns active variants when motion is allowed', async () => {
    const { useAnimationVariants } = await import('./animations');
    const { renderHook } = await import('@testing-library/react');
    const { result } = renderHook(() => useAnimationVariants());

    expect(result.current.fadeIn).toEqual(fadeIn);
    expect(result.current.slideUp).toEqual(slideUp);
    expect(result.current.staggerContainer).toEqual(staggerContainer);
    expect(result.current.staggerItem).toEqual(staggerItem);
    expect(result.current.gradientSweep).toEqual(gradientSweep);
  });

  it('useAnimationVariants returns disabled variants when motion is reduced', async () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { useAnimationVariants } = await import('./animations');
    const { renderHook } = await import('@testing-library/react');
    const { result } = renderHook(() => useAnimationVariants());

    // Disabled variants show final state immediately (no animation)
    expect(result.current.fadeIn.hidden).toEqual({ opacity: 1 });
    expect(result.current.fadeIn.visible).toEqual({ opacity: 1 });
    expect(result.current.slideUp.hidden).toEqual({ opacity: 1, y: 0 });
    expect(result.current.staggerContainer.visible).toEqual({});
  });
});
