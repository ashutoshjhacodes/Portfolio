import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TechnicalLeadership from './TechnicalLeadership';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, whileHover, viewport, animate, ...rest } = props;
      return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    },
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, animate, ...rest } = props;
      return <h2 {...(rest as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h2>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, animate, ...rest } = props;
      return <p {...(rest as React.HTMLAttributes<HTMLParagraphElement>)}>{children}</p>;
    },
    article: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, animate, ...rest } = props;
      return <article {...(rest as React.HTMLAttributes<HTMLElement>)}>{children}</article>;
    },
  },
}));

describe('TechnicalLeadership', () => {
  it('renders the section with correct heading', () => {
    render(<TechnicalLeadership />);
    expect(screen.getByRole('heading', { level: 2, name: /technical leadership/i })).toBeInTheDocument();
  });

  it('renders all four leadership areas', () => {
    render(<TechnicalLeadership />);
    expect(screen.getByRole('heading', { level: 3, name: /architecture design/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /team enablement/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /performance engineering/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /ai integration/i })).toBeInTheDocument();
  });

  it('references shared component libraries across 5+ modules', () => {
    render(<TechnicalLeadership />);
    expect(screen.getByText(/5\+ modules/)).toBeInTheDocument();
  });

  it('references Core Web Vitals optimization and 60+ countries', () => {
    render(<TechnicalLeadership />);
    expect(screen.getByText(/Core Web Vitals/)).toBeInTheDocument();
    expect(screen.getByText(/60\+ countries/)).toBeInTheDocument();
  });

  it('uses semantic HTML with proper heading hierarchy', () => {
    render(<TechnicalLeadership />);
    const section = screen.getByRole('region', { name: /technical leadership/i });
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe('SECTION');
  });

  it('has an accessible aria-label on the section', () => {
    render(<TechnicalLeadership />);
    expect(screen.getByLabelText('Technical Leadership')).toBeInTheDocument();
  });

  it('renders icons as decorative elements', () => {
    const { container } = render(<TechnicalLeadership />);
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs).toHaveLength(4);
  });

  it('applies glass-card styling to leadership cards', () => {
    const { container } = render(<TechnicalLeadership />);
    const cards = container.querySelectorAll('.rounded-xl.p-6');
    expect(cards).toHaveLength(4);
  });

  it('uses a 2-column grid layout on desktop', () => {
    const { container } = render(<TechnicalLeadership />);
    const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    expect(grid).toBeInTheDocument();
  });
});
