import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArchitecturePrinciples from './ArchitecturePrinciples';
import { resumeData } from '@/lib/resume-data';

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, whileHover, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, ...rest } = props;
      return <h2 {...rest}>{children}</h2>;
    },
    article: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, whileHover, ...rest } = props;
      return <article {...rest}>{children}</article>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock animations
vi.mock('@/lib/animations', () => ({
  staggerContainer: { hidden: {}, visible: {} },
  staggerItem: { hidden: {}, visible: {} },
  cardHoverElevation: { y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', borderColor: 'rgba(20,184,166,0.3)', transition: { duration: 0.3, ease: 'easeOut' } },
}));

describe('ArchitecturePrinciples', () => {
  it('renders the section with correct aria-label', () => {
    render(<ArchitecturePrinciples />);
    expect(screen.getByLabelText('Architecture Principles')).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(<ArchitecturePrinciples />);
    expect(screen.getByRole('heading', { level: 2, name: 'Architecture Principles' })).toBeInTheDocument();
  });

  it('displays all 8 principle titles', () => {
    render(<ArchitecturePrinciples />);
    const expectedTitles = [
      'Component-Driven Development',
      'GraphQL-First',
      'Performance-First',
      'Accessibility',
      'Scalability',
      'Reusability',
      'Developer Experience',
      'AI-Assisted Engineering',
    ];
    expectedTitles.forEach((title) => {
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument();
    });
  });

  it('displays descriptions for each principle', () => {
    render(<ArchitecturePrinciples />);
    resumeData.principles.forEach((principle) => {
      expect(screen.getByText(principle.description)).toBeInTheDocument();
    });
  });

  it('displays related technology for each principle', () => {
    render(<ArchitecturePrinciples />);
    resumeData.principles.forEach((principle) => {
      expect(screen.getByText(principle.relatedTech)).toBeInTheDocument();
    });
  });

  it('renders all principle descriptions within 150 characters', () => {
    resumeData.principles.forEach((principle) => {
      expect(principle.description.length).toBeLessThanOrEqual(150);
    });
  });

  it('renders exactly 8 principle cards', () => {
    render(<ArchitecturePrinciples />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(8);
  });

  it('uses responsive grid classes', () => {
    const { container } = render(<ArchitecturePrinciples />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('xl:grid-cols-4');
  });

  it('renders an icon for each principle card', () => {
    const { container } = render(<ArchitecturePrinciples />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(8);
  });

  it('renders icons as decorative (aria-hidden)', () => {
    const { container } = render(<ArchitecturePrinciples />);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
