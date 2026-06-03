import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipToContent from './SkipToContent';

describe('SkipToContent', () => {
  it('renders a link with "Skip to main content" text', () => {
    render(<SkipToContent />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
  });

  it('links to #main-content', () => {
    render(<SkipToContent />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('has the skip-to-content class for off-screen positioning', () => {
    render(<SkipToContent />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toHaveClass('skip-to-content');
  });
});
