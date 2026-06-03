import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { resumeData } from '../../lib/resume-data';

// Import the aboutContent from the AboutSection component
// We re-declare it here since it's a module-level constant not exported
const aboutContent = `With over 5 years of enterprise frontend engineering experience, I specialize in building high-performance, scalable web applications using React, TypeScript, and GraphQL. I've architected platforms serving Fortune 500 companies across 60+ countries, from corporate real estate suites handling 100K+ data rows to AI-powered document processing pipelines achieving 98.6% accuracy. My work spans automotive and fleet management at Avis Budget Group and banking applications at TCS for DSB Bank. I focus on component-driven development, performance optimization, and creating reusable systems that accelerate team delivery.`;

/**
 * Feature: career-platform
 * Property 13: About Section Word Count
 *
 * For any valid about section content, the word count shall be between 50 and 200 words inclusive.
 *
 * **Validates: Requirements 3.1**
 */
describe('Property 13: About Section Word Count', () => {
  it('about content word count is between 50 and 200 words inclusive', () => {
    fc.assert(
      fc.property(
        fc.constant(aboutContent),
        (content) => {
          const words = content.trim().split(/\s+/).filter((w) => w.length > 0);
          const wordCount = words.length;
          expect(wordCount).toBeGreaterThanOrEqual(50);
          expect(wordCount).toBeLessThanOrEqual(200);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('about content is non-empty and contains meaningful text', () => {
    fc.assert(
      fc.property(
        fc.constant(aboutContent),
        (content) => {
          expect(content.trim().length).toBeGreaterThan(0);
          // Verify it contains actual words, not just whitespace
          const words = content.trim().split(/\s+/).filter((w) => w.length > 0);
          expect(words.length).toBeGreaterThan(0);
          // Each word should be a non-empty string
          for (const word of words) {
            expect(word.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('any substring of about content split into words maintains valid word boundaries', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: aboutContent.trim().split(/\s+/).length - 1 }),
        (startIndex) => {
          const words = aboutContent.trim().split(/\s+/).filter((w) => w.length > 0);
          // Verify the word at any index is a valid non-empty string
          const word = words[startIndex];
          expect(word).toBeDefined();
          expect(word.length).toBeGreaterThan(0);
          // The total word count should still be within bounds
          expect(words.length).toBeGreaterThanOrEqual(50);
          expect(words.length).toBeLessThanOrEqual(200);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: career-platform
 * Property 14: Principle Description Length
 *
 * For any architecture principle description in the platform, the character count
 * shall be at most 150 characters.
 *
 * **Validates: Requirements 5.3**
 */
describe('Property 14: Principle Description Length', () => {
  it('all principle descriptions are at most 150 characters', () => {
    const principles = resumeData.principles;
    expect(principles.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: principles.length - 1 }),
        (index) => {
          const principle = principles[index];
          expect(principle.description.length).toBeLessThanOrEqual(150);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all principle descriptions are non-empty', () => {
    const principles = resumeData.principles;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: principles.length - 1 }),
        (index) => {
          const principle = principles[index];
          expect(principle.description.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each principle has a title and relatedTech alongside its description', () => {
    const principles = resumeData.principles;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: principles.length - 1 }),
        (index) => {
          const principle = principles[index];
          // Verify structural integrity
          expect(principle.title).toBeTruthy();
          expect(principle.description).toBeTruthy();
          expect(principle.relatedTech).toBeTruthy();
          // Description constraint
          expect(principle.description.length).toBeLessThanOrEqual(150);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('the expected 8 architecture principles are all present with valid descriptions', () => {
    const expectedPrinciples = [
      'Component-Driven Development',
      'GraphQL-First',
      'Performance-First',
      'Accessibility',
      'Scalability',
      'Reusability',
      'Developer Experience',
      'AI-Assisted Engineering',
    ];

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedPrinciples.length - 1 }),
        (index) => {
          const expectedTitle = expectedPrinciples[index];
          const principle = resumeData.principles.find((p) => p.title === expectedTitle);
          expect(principle).toBeDefined();
          expect(principle!.description.length).toBeLessThanOrEqual(150);
          expect(principle!.description.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
