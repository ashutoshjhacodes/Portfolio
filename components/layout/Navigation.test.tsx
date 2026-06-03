import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...filterMotionProps(props)}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...filterMotionProps(props)}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Helper to filter out framer-motion specific props
function filterMotionProps(props: Record<string, any>) {
  const motionKeys = ['initial', 'animate', 'exit', 'transition', 'variants', 'custom', 'whileHover', 'whileTap'];
  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!motionKeys.includes(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

// Import after mocking
import Navigation from './Navigation';

describe('Navigation', () => {
  beforeEach(() => {
    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    // Start with scroll at 0
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    // Mock navigator.platform
    Object.defineProperty(navigator, 'platform', { value: 'Win32', writable: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders navigation after scrolling past hero', () => {
    render(<Navigation />);

    // Simulate scrolling past hero
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });

  it('displays all navigation links', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const expectedLinks = ['About', 'Experience', 'Projects', 'Skills', 'Blog', 'Contact'];
    expectedLinks.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('displays command palette shortcut hint', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByText('K')).toBeInTheDocument();
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
  });

  it('displays ⌘ on Mac platform', () => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', writable: true, configurable: true });

    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByText('⌘')).toBeInTheDocument();
  });

  it('has a theme toggle button', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByLabelText(/Switch to (light|dark) mode/)).toBeInTheDocument();
  });

  it('has a hamburger menu button for mobile', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is clicked', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    fireEvent.click(screen.getByLabelText('Open menu'));

    expect(screen.getByLabelText('Mobile navigation menu')).toBeInTheDocument();
  });

  it('theme toggle switches between dark and light', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const html = document.documentElement;
    html.classList.add('dark');

    fireEvent.click(screen.getByLabelText(/Switch to (light|dark) mode/));

    expect(html.classList.contains('light')).toBe(true);
    expect(html.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme-preference')).toBe('light');
  });

  it('nav links have correct href attributes', () => {
    render(<Navigation />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const aboutLink = screen.getByText('About');
    expect(aboutLink).toHaveAttribute('href', '#about');

    const contactLink = screen.getByText('Contact');
    expect(contactLink).toHaveAttribute('href', '#contact');
  });
});
