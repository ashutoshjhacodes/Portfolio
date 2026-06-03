import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FeaturedProjects from './FeaturedProjects';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, animate, exit, whileInView, viewport, whileHover, ...rest } = props;
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
  cardHoverElevation: {},
}));

// Mock ProjectDetailModal
vi.mock('@/components/ui/ProjectDetailModal', () => ({
  default: ({ project, isOpen, onClose }: { project: { title: string } | null; isOpen: boolean; onClose: () => void }) => {
    if (!isOpen || !project) return null;
    return (
      <div data-testid="project-detail-modal" role="dialog" aria-modal="true">
        <span data-testid="modal-project-title">{project.title}</span>
        <button onClick={onClose} aria-label="Close modal">Close</button>
      </div>
    );
  },
}));

describe('FeaturedProjects', () => {
  it('renders the section with id="projects" for navigation targeting', () => {
    render(<FeaturedProjects />);
    const section = screen.getByLabelText('Featured Projects');
    expect(section).toHaveAttribute('id', 'projects');
  });

  it('renders the heading', () => {
    render(<FeaturedProjects />);
    expect(screen.getByRole('heading', { level: 2, name: 'Featured Projects' })).toBeInTheDocument();
  });

  it('displays all three project cards', () => {
    render(<FeaturedProjects />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  it('displays CIPHER as the first project (flagship)', () => {
    render(<FeaturedProjects />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('CIPHER AI Platform');
  });

  it('marks CIPHER card with flagship badge', () => {
    render(<FeaturedProjects />);
    expect(screen.getByText('Flagship')).toBeInTheDocument();
  });

  it('displays project titles in cards', () => {
    render(<FeaturedProjects />);
    expect(screen.getByText('CIPHER AI Platform')).toBeInTheDocument();
    expect(screen.getByText('Corporate Real Estate Platform')).toBeInTheDocument();
    expect(screen.getByText('Avis.com Performance Optimization')).toBeInTheDocument();
  });

  it('displays tech stack chips for each project', () => {
    render(<FeaturedProjects />);
    // CIPHER tech stack
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('AWS Bedrock')).toBeInTheDocument();
    expect(screen.getByText('Strands Agent SDK')).toBeInTheDocument();
  });

  it('displays project description for projects', () => {
    render(<FeaturedProjects />);
    expect(
      screen.getByText('AI-powered fleet damage assessment platform reducing processing from 45 minutes to 10 seconds')
    ).toBeInTheDocument();
  });

  it('displays project outcomes as impact points', () => {
    render(<FeaturedProjects />);
    // CIPHER outcomes (first 3)
    expect(screen.getByText('5-Agent Pipeline architecture for fleet damage assessment')).toBeInTheDocument();
  });

  it('renders View Details buttons for each project', () => {
    render(<FeaturedProjects />);
    const viewDetailsButtons = screen.getAllByRole('button', { name: /View details for/i });
    expect(viewDetailsButtons).toHaveLength(3);
  });

  it('opens ProjectDetailModal when View Details is clicked', () => {
    render(<FeaturedProjects />);
    const viewDetailsButton = screen.getByRole('button', { name: /View details for CIPHER AI Platform/i });
    fireEvent.click(viewDetailsButton);

    const modal = screen.getByTestId('project-detail-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByTestId('modal-project-title')).toHaveTextContent('CIPHER AI Platform');
  });

  it('closes ProjectDetailModal when onClose is called', () => {
    render(<FeaturedProjects />);
    const viewDetailsButton = screen.getByRole('button', { name: /View details for CIPHER AI Platform/i });
    fireEvent.click(viewDetailsButton);

    const closeButton = screen.getByRole('button', { name: /Close modal/i });
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('project-detail-modal')).not.toBeInTheDocument();
  });

  it('does NOT use accordion-style views (no aria-expanded buttons)', () => {
    render(<FeaturedProjects />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toHaveAttribute('aria-expanded');
    });
  });

  it('View Details buttons have minimum touch target size', () => {
    render(<FeaturedProjects />);
    const viewDetailsButtons = screen.getAllByRole('button', { name: /View details for/i });
    viewDetailsButtons.forEach((button) => {
      const style = button.getAttribute('style');
      expect(style).toContain('min-height: 44px');
      expect(style).toContain('min-width: 44px');
    });
  });
});
