import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactSection from './ContactSection';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...filterMotionProps(props)}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...filterMotionProps(props)}>{children}</p>,
  },
  useReducedMotion: () => false,
}));

function filterMotionProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {};
  for (const key of Object.keys(props)) {
    if (
      !['variants', 'initial', 'whileInView', 'viewport', 'animate', 'transition', 'whileHover', 'whileTap'].includes(key)
    ) {
      filtered[key] = props[key];
    }
  }
  return filtered;
}

describe('ContactSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the aspirational heading', () => {
    render(<ContactSection />);
    expect(screen.getByRole('heading', { name: /let's build something exceptional/i })).toBeInTheDocument();
  });

  it('renders sub-text below the heading', () => {
    render(<ContactSection />);
    expect(screen.getByText(/have a project in mind/i)).toBeInTheDocument();
  });

  it('renders GitHub link that opens in new tab', () => {
    render(<ContactSection />);
    const githubLink = screen.getByLabelText(/github profile/i);
    expect(githubLink).toHaveAttribute('href', 'https://github.com/ashutoshjhacodes');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders LinkedIn link that opens in new tab', () => {
    render(<ContactSection />);
    const linkedinLink = screen.getByLabelText(/linkedin profile/i);
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/mrjha');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Email link with mailto href', () => {
    render(<ContactSection />);
    const emailLink = screen.getByLabelText(/send email/i);
    expect(emailLink).toHaveAttribute('href', 'mailto:jashutosh498@gmail.com');
  });

  it('renders Resume download button', () => {
    render(<ContactSection />);
    const downloadBtn = screen.getByLabelText(/download resume/i);
    expect(downloadBtn).toBeInTheDocument();
  });

  it('shows error message when PDF download fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<ContactSection />);
    const downloadBtn = screen.getByLabelText(/download resume/i);
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Resume could not be downloaded. Please try again later.'
      );
    });
  });

  it('shows error message when PDF HEAD request returns non-ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<ContactSection />);
    const downloadBtn = screen.getByLabelText(/download resume/i);
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Resume could not be downloaded. Please try again later.'
      );
    });
  });

  it('initiates download when PDF is available', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<ContactSection />);
    const downloadBtn = screen.getByLabelText(/download resume/i);

    const createElementSpy = vi.spyOn(document, 'createElement');
    vi.spyOn(document.body, 'appendChild');
    vi.spyOn(document.body, 'removeChild');

    fireEvent.click(downloadBtn);

    await waitFor(() => {
      const anchorCalls = createElementSpy.mock.results.filter(
        (r) => r.type === 'return' && r.value instanceof HTMLAnchorElement
      );
      expect(anchorCalls.length).toBeGreaterThan(0);
    });

    createElementSpy.mockRestore();
  });

  it('has section with proper aria-label', () => {
    render(<ContactSection />);
    expect(screen.getByLabelText(/contact information/i)).toBeInTheDocument();
  });

  it('applies generous vertical padding to the section', () => {
    render(<ContactSection />);
    const section = screen.getByLabelText(/contact information/i);
    expect(section.className).toContain('py-32');
  });

  it('displays visible labels for each link', () => {
    render(<ContactSection />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
  });

  it('has subtle background gradient overlay', () => {
    render(<ContactSection />);
    const section = screen.getByLabelText(/contact information/i);
    expect(section.className).toContain('relative');
    expect(section.className).toContain('overflow-hidden');
  });

  it('contact links have hover accent color transition classes', () => {
    render(<ContactSection />);
    // Secondary links (GitHub, LinkedIn) keep the outlined hover style
    const githubLink = screen.getByLabelText(/github profile/i);
    expect(githubLink.className).toContain('hover:border-primary-accent');
    expect(githubLink.className).toContain('hover:text-primary-accent');
    expect(githubLink.className).toContain('transition-all');
    expect(githubLink.className).toContain('duration-300');
  });

  it('secondary contact links are styled as rounded pill buttons with outlined style', () => {
    render(<ContactSection />);
    const githubLink = screen.getByLabelText(/github profile/i);
    expect(githubLink.className).toContain('rounded-full');
    expect(githubLink.className).toContain('border');
    expect(githubLink.className).toContain('bg-surface');
  });

  it('primary CTAs (Email, Resume) have gradient styling', () => {
    render(<ContactSection />);
    const emailLink = screen.getByLabelText(/send email/i);
    expect(emailLink.className).toContain('bg-gradient-to-r');
    expect(emailLink.className).toContain('from-primary-accent');
    expect(emailLink.className).toContain('to-secondary-accent');
    expect(emailLink.className).toContain('text-white');
  });
});
