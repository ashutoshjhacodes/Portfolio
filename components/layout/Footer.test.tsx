import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders a footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Ashutosh Jha. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('renders GitHub link opening in new tab', () => {
    render(<Footer />);
    const githubLink = screen.getByLabelText('GitHub profile (opens in new tab)');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/ashutoshjhacodes');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders LinkedIn link opening in new tab', () => {
    render(<Footer />);
    const linkedinLink = screen.getByLabelText('LinkedIn profile (opens in new tab)');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/mrjha');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Email link with mailto', () => {
    render(<Footer />);
    const emailLink = screen.getByLabelText('Send email to Ashutosh Jha');
    expect(emailLink).toHaveAttribute('href', 'mailto:jashutosh498@gmail.com');
  });

  it('has a social links navigation with aria-label', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: /social links/i })).toBeInTheDocument();
  });
});
