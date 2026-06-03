import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import GradientMeshBackground from './GradientMeshBackground';

// Mock useReducedMotion
vi.mock('@/lib/animations', () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from '@/lib/animations';

describe('GradientMeshBackground', () => {
  it('renders a container with aria-hidden="true"', () => {
    const { container } = render(<GradientMeshBackground />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders three gradient child divs', () => {
    const { container } = render(<GradientMeshBackground />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.children).toHaveLength(3);
  });

  it('applies fade-in transition when motion is allowed', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const { container } = render(<GradientMeshBackground />);
    const wrapper = container.firstElementChild as HTMLElement;
    const gradients = Array.from(wrapper.children) as HTMLElement[];

    gradients.forEach((gradient) => {
      expect(gradient.style.transition).toContain('opacity 1.5s ease-out');
    });
  });

  it('does not apply continuous animation (no gradient-float)', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const { container } = render(<GradientMeshBackground />);
    const wrapper = container.firstElementChild as HTMLElement;
    const gradients = Array.from(wrapper.children) as HTMLElement[];

    gradients.forEach((gradient) => {
      expect(gradient.style.animation).not.toContain('gradient-float');
    });
  });

  it('sets opacity directly without transition when reduced motion is preferred', () => {
    (useReducedMotion as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { container } = render(<GradientMeshBackground />);
    const wrapper = container.firstElementChild as HTMLElement;
    const gradients = Array.from(wrapper.children) as HTMLElement[];

    gradients.forEach((gradient) => {
      expect(gradient.style.opacity).toBe('1');
      expect(gradient.style.transition).toBe('');
    });
  });

  it('uses absolute positioning to fill parent', () => {
    const { container } = render(<GradientMeshBackground />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('absolute');
    expect(wrapper.className).toContain('inset-0');
  });
});
