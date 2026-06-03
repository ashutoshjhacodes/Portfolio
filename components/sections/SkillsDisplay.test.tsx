import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillsDisplay from './SkillsDisplay';
import { resumeData } from '@/lib/resume-data';

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, ...rest } = props;
      return <h2 {...rest}>{children}</h2>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock animations
vi.mock('@/lib/animations', () => ({
  staggerContainer: { hidden: {}, visible: {} },
  staggerItem: { hidden: {}, visible: {} },
}));

describe('SkillsDisplay', () => {
  it('renders the section with id="skills" for navigation targeting', () => {
    const { container } = render(<SkillsDisplay />);
    const section = container.querySelector('section#skills');
    expect(section).toBeInTheDocument();
  });

  it('renders the section with correct aria-label', () => {
    render(<SkillsDisplay />);
    expect(screen.getByLabelText('Technical Skills')).toBeInTheDocument();
  });

  it('renders the heading with correct styling', () => {
    render(<SkillsDisplay />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Technical Skills' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-heading', 'font-bold', 'text-text-primary');
  });

  it('displays all category sub-headings', () => {
    render(<SkillsDisplay />);
    const expectedCategories = [
      'Frontend Frameworks',
      'Styling',
      'Languages',
      'APIs',
      'Tools',
      'AI/ML',
    ];
    expectedCategories.forEach((category) => {
      const heading = screen.getByRole('heading', { level: 3, name: category });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('text-sm', 'font-semibold', 'uppercase', 'tracking-wider', 'text-text-secondary');
    });
  });

  it('displays all skills from resume data', () => {
    render(<SkillsDisplay />);
    const allSkills = resumeData.skills.flatMap((cat) => cat.skills);
    allSkills.forEach((skill) => {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    });
  });

  it('renders skills as chips with correct styling', () => {
    const { container } = render(<SkillsDisplay />);
    const chips = container.querySelectorAll('.rounded-full');
    const totalSkills = resumeData.skills.reduce(
      (sum, cat) => sum + cat.skills.length,
      0
    );
    expect(chips.length).toBe(totalSkills);
    chips.forEach((chip) => {
      expect(chip).toHaveClass('border', 'border-border', 'bg-surface', 'px-4', 'py-2', 'text-sm', 'text-text-secondary');
    });
  });

  it('renders category containers with glass-card styling', () => {
    const { container } = render(<SkillsDisplay />);
    const glassCards = container.querySelectorAll('.backdrop-blur');
    expect(glassCards.length).toBe(resumeData.skills.length);
    glassCards.forEach((card) => {
      expect(card).toHaveClass('rounded-xl', 'p-6');
    });
  });

  it('uses responsive grid layout for category containers', () => {
    const { container } = render(<SkillsDisplay />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
  });

  it('uses flex-wrap layout for chips within each category', () => {
    const { container } = render(<SkillsDisplay />);
    const flexContainers = container.querySelectorAll('.flex.flex-wrap');
    expect(flexContainers.length).toBe(resumeData.skills.length);
  });
});
