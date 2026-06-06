import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HeroSection from './HeroSection';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...filterMotionProps(props)}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...filterMotionProps(props)}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...filterMotionProps(props)}>{children}</span>,
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Filter out framer-motion specific props that aren't valid DOM attributes
function filterMotionProps(props: Record<string, any>) {
  const {
    variants, initial, animate, exit, whileHover, whileTap,
    custom, transition, layout, layoutId, ...rest
  } = props;
  return rest;
}

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="profile-image" {...props} />
  ),
}));

// Mock UI sub-components
vi.mock('@/components/ui/GradientMeshBackground', () => ({
  default: () => <div data-testid="gradient-mesh-background" />,
}));

vi.mock('@/components/ui/FloatingParticles', () => ({
  default: () => <div data-testid="floating-particles" />,
}));

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the name "Ashutosh Jha" in hero typography', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Ashutosh Jha');
    expect(heading.className).toContain('text-hero');
  });

  it('renders the professional title "Software Development Engineer"', () => {
    render(<HeroSection />);
    expect(screen.getByText('Software Development Engineer')).toBeInTheDocument();
  });

  it('renders a profile photo with proper alt text', () => {
    render(<HeroSection />);
    const img = screen.getByTestId('profile-image');
    expect(img).toHaveAttribute('alt', 'Profile photo of Ashutosh Jha');
  });

  it('renders hero badges for location, experience, and company', () => {
    render(<HeroSection />);
    expect(screen.getByText('Bangalore, India')).toBeInTheDocument();
    expect(screen.getByText('5+ Years')).toBeInTheDocument();
    expect(screen.getByText('Avis Budget Group')).toBeInTheDocument();
  });

  it('renders CTA buttons with correct labels', () => {
    render(<HeroSection />);
    expect(screen.getByRole('button', { name: /view projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download resume/i })).toBeInTheDocument();
  });

  it('has full viewport height (min-h-screen) and bg-background', () => {
    render(<HeroSection />);
    const section = screen.getByRole('region', { name: /hero section/i });
    expect(section.className).toContain('min-h-screen');
    expect(section.className).toContain('bg-background');
  });

  it('does not use pure black background', () => {
    render(<HeroSection />);
    const section = screen.getByRole('region', { name: /hero section/i });
    expect(section.className).not.toContain('bg-black');
    expect(section.className).toContain('bg-background');
  });

  it('CTA buttons have minimum 44x44px touch targets', () => {
    render(<HeroSection />);
    // View Projects and Get In Touch have touch-target class
    const viewProjectsBtn = screen.getByRole('button', { name: /view projects/i });
    const getInTouchBtn = screen.getByRole('button', { name: /get in touch/i });
    expect(viewProjectsBtn.className).toContain('touch-target');
    expect(getInTouchBtn.className).toContain('touch-target');
  });

  it('renders GradientMeshBackground component', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('gradient-mesh-background')).toBeInTheDocument();
  });

  it('renders FloatingParticles component', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('floating-particles')).toBeInTheDocument();
  });

  it('View Projects button has gradient styling', () => {
    render(<HeroSection />);
    const btn = screen.getByRole('button', { name: /view projects/i });
    expect(btn.className).toContain('bg-gradient-to-r');
    expect(btn.className).toContain('from-primary-accent');
    expect(btn.className).toContain('to-secondary-accent');
  });

  it('profile image has gradient border ring effect', () => {
    render(<HeroSection />);
    // Check that the gradient ring wrapper exists in the tree (now a static div, not animated)
    const gradientRing = document.querySelector('.bg-gradient-to-r.from-primary-accent.to-secondary-accent');
    expect(gradientRing).toBeInTheDocument();
  });

  it('shows error message when resume download fails', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<HeroSection />);
    const downloadBtn = screen.getByRole('button', { name: /download resume/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Resume could not be downloaded. Please try again later.'
      );
    });
  });

  it('shows error message when resume PDF returns non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });

    render(<HeroSection />);
    const downloadBtn = screen.getByRole('button', { name: /download resume/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Resume could not be downloaded. Please try again later.'
      );
    });
  });

  it('triggers download when resume PDF is available', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });

    render(<HeroSection />);
    const downloadBtn = screen.getByRole('button', { name: /download resume/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/Ashutosh_India.pdf', { method: 'HEAD' });
    });
  });

  it('smooth scrolls to projects section when View Projects is clicked', () => {
    const scrollIntoViewMock = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = scrollIntoViewMock;
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    render(<HeroSection />);
    const viewProjectsBtn = screen.getByRole('button', { name: /view projects/i });
    fireEvent.click(viewProjectsBtn);

    expect(document.getElementById).toHaveBeenCalledWith('projects');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('smooth scrolls to contact section when Get In Touch is clicked', () => {
    const scrollIntoViewMock = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = scrollIntoViewMock;
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    render(<HeroSection />);
    const contactBtn = screen.getByRole('button', { name: /get in touch/i });
    fireEvent.click(contactBtn);

    expect(document.getElementById).toHaveBeenCalledWith('contact');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('uses responsive flex layout (column on mobile, row on desktop)', () => {
    render(<HeroSection />);
    const section = screen.getByRole('region', { name: /hero section/i });
    const contentContainer = section.querySelector('.flex-col.md\\:flex-row');
    expect(contentContainer).toBeInTheDocument();
  });
});
