import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingParticles from './FloatingParticles';

// Mock useReducedMotion
vi.mock('@/lib/animations', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from '@/lib/animations';
const mockUseReducedMotion = vi.mocked(useReducedMotion);

describe('FloatingParticles', () => {
  it('renders a container with aria-hidden="true"', () => {
    const { container } = render(<FloatingParticles />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders 7 particle dots', () => {
    const { container } = render(<FloatingParticles />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(7);
  });

  it('applies absolute positioning and overflow-hidden to container', () => {
    const { container } = render(<FloatingParticles />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('absolute');
    expect(wrapper.className).toContain('inset-0');
    expect(wrapper.className).toContain('overflow-hidden');
  });

  it('applies rounded-full and bg-primary-accent to each dot', () => {
    const { container } = render(<FloatingParticles />);
    const dots = container.querySelectorAll('span');
    dots.forEach((dot) => {
      expect(dot.className).toContain('rounded-full');
      expect(dot.className).toContain('bg-primary-accent');
    });
  });

  it('does not apply continuous animation (animation is none)', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const { container } = render(<FloatingParticles />);
    const dots = container.querySelectorAll('span');
    dots.forEach((dot) => {
      expect(dot.style.animation).toBe('none');
    });
  });

  it('has animation none when reduced motion is active', () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(<FloatingParticles />);
    const dots = container.querySelectorAll('span');
    dots.forEach((dot) => {
      expect(dot.style.animation).toBe('none');
    });
  });

  it('renders dots with sizes between 2-4px', () => {
    const { container } = render(<FloatingParticles />);
    const dots = container.querySelectorAll('span');
    dots.forEach((dot) => {
      const width = parseInt(dot.style.width);
      expect(width).toBeGreaterThanOrEqual(2);
      expect(width).toBeLessThanOrEqual(4);
    });
  });

  it('renders dots with opacity between 0.2 and 0.4', () => {
    const { container } = render(<FloatingParticles />);
    const dots = container.querySelectorAll('span');
    dots.forEach((dot) => {
      const opacity = parseFloat(dot.style.opacity);
      expect(opacity).toBeGreaterThanOrEqual(0.2);
      expect(opacity).toBeLessThanOrEqual(0.4);
    });
  });

  it('applies pointer-events-none to prevent interaction', () => {
    const { container } = render(<FloatingParticles />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('pointer-events-none');
  });
});
