import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIEngineering from './AIEngineering';

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

describe('AIEngineering', () => {
  it('renders the section with correct heading', () => {
    render(<AIEngineering />);
    expect(screen.getByRole('heading', { level: 2, name: /ai engineering/i })).toBeInTheDocument();
  });

  it('renders all four AI tools from resume data', () => {
    render(<AIEngineering />);
    expect(screen.getByRole('heading', { level: 3, name: /chatgpt/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /claude/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /amazon q/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /kiro/i })).toBeInTheDocument();
  });

  it('displays workflow description for each tool', () => {
    render(<AIEngineering />);
    expect(screen.getByText(/Code generation and rapid prototyping/)).toBeInTheDocument();
    expect(screen.getByText(/Architecture design reviews and complex debugging/)).toBeInTheDocument();
    expect(screen.getByText(/AWS service integration and Bedrock pipeline/)).toBeInTheDocument();
    expect(screen.getByText(/Spec-driven development with automated task planning/)).toBeInTheDocument();
  });

  it('displays outcome for each tool', () => {
    render(<AIEngineering />);
    expect(screen.getByText(/Accelerated component development/)).toBeInTheDocument();
    expect(screen.getByText(/Improved system design decisions/)).toBeInTheDocument();
    expect(screen.getByText(/Streamlined CIPHER AI Platform/)).toBeInTheDocument();
    expect(screen.getByText(/Enhanced development workflow/)).toBeInTheDocument();
  });

  it('uses semantic HTML with proper section element', () => {
    render(<AIEngineering />);
    const section = screen.getByRole('region', { name: /ai engineering/i });
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe('SECTION');
  });

  it('has an accessible aria-label on the section', () => {
    render(<AIEngineering />);
    expect(screen.getByLabelText('AI Engineering')).toBeInTheDocument();
  });

  it('renders exactly 4 tool articles', () => {
    render(<AIEngineering />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(4);
  });

  it('displays workflow and outcome labels', () => {
    render(<AIEngineering />);
    const workflowLabels = screen.getAllByText('Workflow');
    const outcomeLabels = screen.getAllByText('Outcome');
    expect(workflowLabels).toHaveLength(4);
    expect(outcomeLabels).toHaveLength(4);
  });

  it('renders SVG icons for each tool', () => {
    const { container } = render(<AIEngineering />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(4);
  });
});
