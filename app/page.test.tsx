import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock all section components to isolate page composition testing
// Each component renders its own <section> with the appropriate id
vi.mock('@/components/sections/HeroSection', () => ({
  default: () => <section id="hero" aria-label="Hero section"><div data-testid="hero-section">HeroSection</div></section>,
}));
vi.mock('@/components/sections/ImpactDashboard', () => ({
  default: () => <section id="impact" aria-label="Impact Metrics Dashboard"><div data-testid="impact-dashboard">ImpactDashboard</div></section>,
}));
vi.mock('@/components/sections/AboutSection', () => ({
  default: () => <section id="about" aria-label="About"><div data-testid="about-section">AboutSection</div></section>,
}));
vi.mock('@/components/sections/TechnicalLeadership', () => ({
  default: () => <section id="technical-leadership" aria-label="Technical Leadership"><div data-testid="technical-leadership">TechnicalLeadership</div></section>,
}));
vi.mock('@/components/sections/ArchitecturePrinciples', () => ({
  default: () => <section id="architecture" aria-label="Architecture Principles"><div data-testid="architecture-principles">ArchitecturePrinciples</div></section>,
}));
vi.mock('@/components/sections/ExperienceTimeline', () => ({
  default: () => <section id="experience" aria-label="Professional Experience"><div data-testid="experience-timeline">ExperienceTimeline</div></section>,
}));
vi.mock('@/components/sections/FeaturedProjects', () => ({
  default: () => <section id="projects" aria-label="Featured Projects"><div data-testid="featured-projects">FeaturedProjects</div></section>,
}));
vi.mock('@/components/sections/AIEngineering', () => ({
  default: () => <section id="ai-engineering" aria-label="AI Engineering"><div data-testid="ai-engineering">AIEngineering</div></section>,
}));
vi.mock('@/components/sections/SkillsDisplay', () => ({
  default: () => <section id="skills" aria-label="Skills"><div data-testid="skills-display">SkillsDisplay</div></section>,
}));
vi.mock('@/components/sections/ContactSection', () => ({
  default: () => <section id="contact" aria-label="Contact information"><div data-testid="contact-section">ContactSection</div></section>,
}));
vi.mock('@/components/features/CareerStoryGenerator', () => ({
  default: () => <section id="career-story" aria-label="Career Story Generator"><div data-testid="career-story-generator">CareerStoryGenerator</div></section>,
}));

describe('Home Page', () => {
  it('renders all section components', () => {
    render(<Home />);

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('impact-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('technical-leadership')).toBeInTheDocument();
    expect(screen.getByTestId('architecture-principles')).toBeInTheDocument();
    expect(screen.getByTestId('experience-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('featured-projects')).toBeInTheDocument();
    expect(screen.getByTestId('ai-engineering')).toBeInTheDocument();
    expect(screen.getByTestId('skills-display')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
  });

  it('renders sections in the correct order', () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll('section');

    expect(sections).toHaveLength(11);
    expect(sections[0]).toHaveAttribute('id', 'hero');
    expect(sections[1]).toHaveAttribute('id', 'impact');
    expect(sections[2]).toHaveAttribute('id', 'about');
    expect(sections[3]).toHaveAttribute('id', 'technical-leadership');
    expect(sections[4]).toHaveAttribute('id', 'architecture');
    expect(sections[5]).toHaveAttribute('id', 'experience');
    expect(sections[6]).toHaveAttribute('id', 'projects');
    expect(sections[7]).toHaveAttribute('id', 'ai-engineering');
    expect(sections[8]).toHaveAttribute('id', 'career-story');
    expect(sections[9]).toHaveAttribute('id', 'skills');
    expect(sections[10]).toHaveAttribute('id', 'contact');
  });

  it('provides id attributes for smooth scroll navigation', () => {
    render(<Home />);

    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('impact')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('technical-leadership')).toBeInTheDocument();
    expect(document.getElementById('architecture')).toBeInTheDocument();
    expect(document.getElementById('experience')).toBeInTheDocument();
    expect(document.getElementById('projects')).toBeInTheDocument();
    expect(document.getElementById('ai-engineering')).toBeInTheDocument();
    expect(document.getElementById('skills')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('has aria-label attributes on all sections for accessibility', () => {
    const { container } = render(<Home />);
    const sections = container.querySelectorAll('section');

    sections.forEach((section) => {
      expect(section).toHaveAttribute('aria-label');
    });
  });

  it('wraps content in overflow-x-hidden container to prevent horizontal scroll', () => {
    const { container } = render(<Home />);
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('overflow-x-hidden');
  });

  it('uses section-container class for consistent max-width and padding', () => {
    const { container } = render(<Home />);
    // All sections except Hero should have a section-container div
    const sectionContainers = container.querySelectorAll('.section-container');

    // 10 sections (all except Hero) should have section-container
    expect(sectionContainers.length).toBe(10);
  });

  it('applies py-16 md:py-20 spacing to non-hero section wrappers', () => {
    const { container } = render(<Home />);
    const wrapper = container.firstElementChild as HTMLElement;
    // The first child is HeroSection (no wrapper div), the rest are wrapped in divs with py-16
    const spacingDivs = wrapper.querySelectorAll(':scope > div.py-16');
    expect(spacingDivs.length).toBe(10);
  });
});
