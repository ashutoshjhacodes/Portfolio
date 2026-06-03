import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectDetailModal from './ProjectDetailModal';
import { Project } from '@/lib/resume-data';

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onClick,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div onClick={onClick} className={className} data-testid="motion-div" {...rest}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project',
  isFlagship: false,
  techStack: ['React', 'TypeScript', 'Node.js'],
  challenges: ['Challenge 1', 'Challenge 2'],
  outcomes: ['Outcome 1', 'Outcome 2'],
  metrics: {
    'Users': '10K+',
    'Uptime': '99.9%',
  },
};

const mockProjectNoMetrics: Project = {
  id: 'no-metrics',
  title: 'No Metrics Project',
  isFlagship: true,
  techStack: ['Python'],
  challenges: ['A challenge'],
  outcomes: ['An outcome'],
};

describe('ProjectDetailModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ProjectDetailModal project={mockProject} isOpen={false} onClose={mockOnClose} />
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders nothing when project is null', () => {
    const { container } = render(
      <ProjectDetailModal project={null} isOpen={true} onClose={mockOnClose} />
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders the modal with correct ARIA attributes when open', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'project-modal-title');
  });

  it('displays the project title', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Project').id).toBe('project-modal-title');
  });

  it('displays tech stack chips', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('displays challenges', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Challenge 1')).toBeInTheDocument();
    expect(screen.getByText('Challenge 2')).toBeInTheDocument();
  });

  it('displays outcomes', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Outcomes')).toBeInTheDocument();
    expect(screen.getByText('Outcome 1')).toBeInTheDocument();
    expect(screen.getByText('Outcome 2')).toBeInTheDocument();
  });

  it('displays metrics when present', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Impact Metrics')).toBeInTheDocument();
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });

  it('does not display metrics section when metrics is undefined', () => {
    render(
      <ProjectDetailModal
        project={mockProjectNoMetrics}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Impact Metrics')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    // The backdrop is the first motion.div with aria-hidden
    const motionDivs = screen.getAllByTestId('motion-div');
    const backdrop = motionDivs[0];
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the modal content', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    const title = screen.getByText('Test Project');
    fireEvent.click(title);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('sets body overflow hidden when open', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('has a close button with accessible label', () => {
    render(
      <ProjectDetailModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });
});
