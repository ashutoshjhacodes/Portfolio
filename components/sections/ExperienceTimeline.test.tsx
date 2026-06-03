import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceTimeline from './ExperienceTimeline';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, animate, exit, ...rest } = props;
      return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    },
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, animate, ...rest } = props;
      return <h2 {...(rest as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h2>;
    },
  },
}));

// Mock animations
vi.mock('@/lib/animations', () => ({
  slideUp: {},
}));

describe('ExperienceTimeline', () => {
  it('renders the section with correct heading', () => {
    render(<ExperienceTimeline />);
    expect(
      screen.getByRole('heading', { level: 2, name: /experience/i })
    ).toBeInTheDocument();
  });

  it('has section with id="experience" for navigation targeting', () => {
    render(<ExperienceTimeline />);
    const section = document.getElementById('experience');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('displays company names as badges', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText('Avis Budget Group')).toBeInTheDocument();
    expect(screen.getByText('TCS')).toBeInTheDocument();
  });

  it('displays role and period for each entry', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText(/Software Development Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/Oct 2023 – Present/)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Oct 2020 – Mar 2023/)).toBeInTheDocument();
  });

  it('displays client information when available', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText(/· DSB Bank/)).toBeInTheDocument();
  });

  it('displays achievements as bullet list items', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText(/Core Web Vitals scores/)).toBeInTheDocument();
    expect(screen.getByText(/reusable component library/)).toBeInTheDocument();
  });

  it('has accessible section label', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByLabelText('Professional Experience')).toBeInTheDocument();
  });

  it('renders visual timeline connector line', () => {
    render(<ExperienceTimeline />);
    const connectors = document.querySelectorAll('[aria-hidden="true"]');
    expect(connectors.length).toBeGreaterThan(0);
  });

  it('renders timeline dots for each entry', () => {
    render(<ExperienceTimeline />);
    // Timeline dots are aria-hidden divs with the bg-primary-accent class
    const ariaHiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    // Should have: 1 connector line + 1 dot per entry (2 entries = 3 total)
    expect(ariaHiddenElements.length).toBeGreaterThanOrEqual(3);
  });
});
