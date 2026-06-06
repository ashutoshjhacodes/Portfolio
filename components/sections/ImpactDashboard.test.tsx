import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImpactDashboard from './ImpactDashboard';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

let intersectionCallback: IntersectionObserverCallback;

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();

  global.IntersectionObserver = vi.fn((callback) => {
    intersectionCallback = callback;
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: () => [],
    };
  }) as unknown as typeof IntersectionObserver;
});

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, variants, initial, animate, whileInView, whileHover, viewport, ...rest }: React.PropsWithChildren<Record<string, unknown>>) => {
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useInView: () => true,
}));

// Mock animations
vi.mock('@/lib/animations', () => ({
  staggerContainer: { hidden: {}, visible: {} },
  staggerItem: { hidden: {}, visible: {} },
  cardHoverElevation: { y: -6 },
  useReducedMotion: vi.fn(() => false),
}));

describe('ImpactDashboard', () => {
  it('renders the section with correct aria-label', () => {
    render(<ImpactDashboard />);
    expect(screen.getByLabelText('Impact Metrics Dashboard')).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(<ImpactDashboard />);
    expect(screen.getByRole('heading', { name: 'Engineering Impact' })).toBeInTheDocument();
  });

  it('displays all metric labels from resume data', () => {
    render(<ImpactDashboard />);
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('Countries Served')).toBeInTheDocument();
    expect(screen.getByText('Users Served')).toBeInTheDocument();
    expect(screen.getByText('LCP Reduction')).toBeInTheDocument();
    expect(screen.getByText('AI Processing Time')).toBeInTheDocument();
  });

  it('displays non-numeric metric value directly', () => {
    render(<ImpactDashboard />);
    expect(screen.getByText('45min→10sec')).toBeInTheDocument();
  });

  it('sets up IntersectionObserver with 0.5 threshold', () => {
    render(<ImpactDashboard />);
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );
    expect(mockObserve).toHaveBeenCalled();
  });

  it('uses centered responsive wrapping layout classes', () => {
    const { container } = render(<ImpactDashboard />);
    const metricList = container.querySelector('.flex.flex-wrap');
    expect(metricList).toHaveClass('justify-center');
    expect(metricList).toHaveClass('gap-6');
    expect(metricList).toHaveClass('md:gap-8');
  });
});
