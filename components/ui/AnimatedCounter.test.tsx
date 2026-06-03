import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AnimatedCounter from './AnimatedCounter';

// Mock useReducedMotion
vi.mock('@/lib/animations', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion's useInView
vi.mock('framer-motion', () => ({
  useInView: vi.fn(() => true),
}));

import { useReducedMotion } from '@/lib/animations';
import { useInView } from 'framer-motion';

describe('AnimatedCounter', () => {
  let rafCallbacks: ((time: number) => void)[];

  beforeEach(() => {
    rafCallbacks = [];
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);
    (useInView as ReturnType<typeof vi.fn>).mockReturnValue(true);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows final value immediately when prefers-reduced-motion is enabled', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<AnimatedCounter value={60} suffix="+" />);
    expect(screen.getByText('60+')).toBeInTheDocument();
  });

  it('starts counting from 0 when in view (briefly resets then animates)', () => {
    render(<AnimatedCounter value={100} suffix="+" />);
    // After the effect runs (useInView returns true immediately in test),
    // it resets to 0 and starts rAF animation. The initial state before effect
    // is the value (100), but React batches the update so we see 0 after effect.
    expect(screen.getByText('0+')).toBeInTheDocument();
  });

  it('animates to target value using requestAnimationFrame', () => {
    render(<AnimatedCounter value={100} />);

    // Simulate animation at 50% through duration (1000ms of 2000ms)
    act(() => {
      vi.spyOn(performance, 'now').mockReturnValue(1000);
      if (rafCallbacks.length > 0) {
        rafCallbacks[rafCallbacks.length - 1](1000);
      }
    });

    // easeOutCubic at t=0.5: 1 - (1-0.5)^3 = 1 - 0.125 = 0.875
    // 0.875 * 100 = 87.5 → rounded to 88
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('reaches final value at end of animation duration', () => {
    render(<AnimatedCounter value={60} suffix="+" />);

    // Simulate animation completing at full duration
    act(() => {
      vi.spyOn(performance, 'now').mockReturnValue(2000);
      if (rafCallbacks.length > 0) {
        rafCallbacks[rafCallbacks.length - 1](2000);
      }
    });

    expect(screen.getByText('60+')).toBeInTheDocument();
  });

  it('does not animate when not in view', () => {
    (useInView as ReturnType<typeof vi.fn>).mockReturnValue(false);

    render(<AnimatedCounter value={100} suffix="+" />);
    // Shows the value immediately (no "0+" placeholder)
    expect(screen.getByText('100+')).toBeInTheDocument();
  });

  it('renders suffix after the number', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<AnimatedCounter value={5} suffix="+" />);
    expect(screen.getByText('5+')).toBeInTheDocument();
  });

  it('renders without suffix when none provided', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<AnimatedCounter value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('uses custom duration', () => {
    render(<AnimatedCounter value={100} duration={1000} />);

    // At 500ms of 1000ms total duration (50% progress)
    act(() => {
      vi.spyOn(performance, 'now').mockReturnValue(500);
      if (rafCallbacks.length > 0) {
        rafCallbacks[rafCallbacks.length - 1](500);
      }
    });

    // easeOutCubic at t=0.5: 1 - (1-0.5)^3 = 0.875
    // 0.875 * 100 = 87.5 → rounded to 88
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { container } = render(<AnimatedCounter value={10} />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('10');
  });
});
