import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutSection from './AboutSection';
import { resumeData } from '@/lib/resume-data';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...filterMotionProps(props)}>{children}</h2>,
  },
}));

// Filter out framer-motion specific props that aren't valid DOM attributes
function filterMotionProps(props: Record<string, any>) {
  const {
    variants, initial, animate, exit, whileHover, whileTap, whileInView,
    custom, transition, layout, layoutId, viewport, ...rest
  } = props;
  return rest;
}

describe('AboutSection', () => {
  it('renders a section element with id="about"', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    expect(section).toHaveAttribute('id', 'about');
  });

  it('renders the "About" heading', () => {
    render(<AboutSection />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('About');
  });

  it('renders narrative content between 50 and 200 words', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    const paragraphs = section.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThanOrEqual(1);

    const allText = Array.from(paragraphs).map(p => p.textContent!).join(' ');
    const wordCount = allText.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(50);
    expect(wordCount).toBeLessThanOrEqual(200);
  });

  it('references only technologies present in Resume_Data', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    const content = section.textContent!;

    // Verify key technologies mentioned are in Resume_Data
    const allSkills = resumeData.skills.flatMap(cat => cat.skills.map(s => s.name));
    const allTech = resumeData.experience.flatMap(exp => exp.technologies);
    const validTechnologies = [...new Set([...allSkills, ...allTech])];

    // Technologies explicitly mentioned in the about content
    const mentionedTechs = ['React', 'TypeScript', 'GraphQL'];
    mentionedTechs.forEach(tech => {
      expect(content).toContain(tech);
      // Verify the tech exists in resume data (partial match)
      const found = validTechnologies.some(
        validTech => validTech.toLowerCase().includes(tech.toLowerCase())
      );
      expect(found).toBe(true);
    });
  });

  it('references experience domains from Resume_Data', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    const content = section.textContent!;

    // Verify domains mentioned match resume data companies
    expect(content).toContain('Avis Budget Group');
    expect(content).toContain('TCS');
    expect(content).toContain('DSB Bank');
  });

  it('mentions years of experience consistent with Resume_Data', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    const content = section.textContent!;

    // Resume data shows 5+ years
    expect(content).toMatch(/5\s*years/i);
  });

  it('uses semantic HTML section element with aria-label', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('aria-label');
  });

  it('renders expertise area chips', () => {
    render(<AboutSection />);
    const expectedAreas = [
      'Enterprise Architecture',
      'Performance Optimization',
      'AI Engineering',
      'Technical Leadership',
      'Component Libraries',
      'Web Vitals',
    ];

    expectedAreas.forEach(area => {
      expect(screen.getByText(area)).toBeInTheDocument();
    });
  });

  it('renders a two-column grid layout on desktop', () => {
    render(<AboutSection />);
    const section = screen.getByRole('region', { name: /about/i });
    const gridContainer = section.querySelector('.grid');
    expect(gridContainer).not.toBeNull();
    expect(gridContainer!.className).toContain('md:grid-cols-2');
    expect(gridContainer!.className).toContain('grid-cols-1');
  });
});
