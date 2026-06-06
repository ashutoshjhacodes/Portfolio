import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { resumeData } from '../../lib/resume-data';

/**
 * Feature: career-platform
 * Property 5: Skills Categorization Completeness
 *
 * For any skill listed in Resume_Data, it shall appear in the skills display under its
 * designated category group. The set of rendered skills shall be exactly equal to the set
 * of skills in Resume_Data — no additions, no omissions.
 *
 * **Validates: Requirements 11.1, 11.3**
 */

// Helper: Flatten all skills from resumeData into a single array of skill names
function getAllSkillNames(): string[] {
  return resumeData.skills.flatMap((category) => category.skills.map((s) => s.name));
}

// Helper: Get all categories from resumeData
function getAllCategories(): string[] {
  return resumeData.skills.map((cat) => cat.category);
}

// Helper: Build a map from skill name -> expected category
function buildSkillToCategoryMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const category of resumeData.skills) {
    for (const skill of category.skills) {
      map.set(skill.name, category.category);
    }
  }
  return map;
}

// The expected skills and categories per Requirements 11.1, 11.3
const EXPECTED_SKILLS_BY_CATEGORY: Record<string, string[]> = {
  'Frontend Frameworks': ['React.js', 'Next.js', 'Redux', 'Context API', 'React Hooks', 'TypeScript'],
  'Styling': ['Material UI', 'Ag-Grid', 'Tailwind CSS', 'CSS3', 'Responsive Design', 'WCAG Accessibility'],
  'Languages': ['JavaScript (ES6+)', 'HTML5'],
  'APIs': ['GraphQL', 'REST APIs', 'Apollo Client', 'Node.js'],
  'Testing & DevOps': [
    'Jest',
    'React Testing Library',
    'AWS S3',
    'AWS Lambda',
    'Git',
    'GitHub',
    'CI/CD Pipelines',
    'Vite',
    'Webpack',
    'Postman',
    'Agile',
    'Scrum',
    'JIRA',
  ],
  'AI/ML': ['AWS Bedrock', 'Strands Agent SDK', 'Prompt Engineering', 'LLM Integration'],
};

describe('Property 5: Skills Categorization Completeness', () => {
  describe('The set of skills in Resume_Data is exactly the expected set (no additions, no omissions)', () => {
    it('resumeData.skills contains exactly all required skills from the specification', () => {
      const allExpectedSkills = Object.values(EXPECTED_SKILLS_BY_CATEGORY).flat().sort();
      const allActualSkills = getAllSkillNames().sort();

      // Exact equality: no additions and no omissions
      expect(allActualSkills).toEqual(allExpectedSkills);
    });

    it('resumeData.skills contains exactly the expected categories', () => {
      const expectedCategories = Object.keys(EXPECTED_SKILLS_BY_CATEGORY).sort();
      const actualCategories = getAllCategories().sort();

      expect(actualCategories).toEqual(expectedCategories);
    });

    it('the total skill count matches the expected count of 31', () => {
      const allSkillNames = getAllSkillNames();
      const expectedTotal = Object.values(EXPECTED_SKILLS_BY_CATEGORY).flat().length;
      expect(allSkillNames.length).toBe(expectedTotal);
      expect(allSkillNames.length).toBe(31);
    });
  });

  describe('Every skill in Resume_Data appears under its correct category', () => {
    it('any randomly selected skill has the correct category assignment', () => {
      const allSkills = resumeData.skills.flatMap((cat) => cat.skills);
      expect(allSkills.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allSkills.length - 1 }),
          (index) => {
            const skill = allSkills[index];
            // Verify the skill's category field matches the category group it belongs to
            const parentCategory = resumeData.skills.find((cat) =>
              cat.skills.some((s) => s.name === skill.name)
            );
            expect(parentCategory).toBeDefined();
            expect(skill.category).toBe(parentCategory!.category);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('any randomly selected skill maps to the expected category per specification', () => {
      const allSkills = resumeData.skills.flatMap((cat) => cat.skills);
      expect(allSkills.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allSkills.length - 1 }),
          (index) => {
            const skill = allSkills[index];
            // Verify against the specification's expected mapping
            const expectedCategory = Object.entries(EXPECTED_SKILLS_BY_CATEGORY).find(
              ([, skills]) => skills.includes(skill.name)
            );
            expect(expectedCategory).toBeDefined();
            expect(skill.category).toBe(expectedCategory![0]);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('No skill appears in multiple categories (uniqueness)', () => {
    it('any randomly selected skill name appears in exactly one category', () => {
      const allSkillNames = getAllSkillNames();
      expect(allSkillNames.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allSkillNames.length - 1 }),
          (index) => {
            const skillName = allSkillNames[index];
            // Count how many categories contain this skill
            const categoriesContainingSkill = resumeData.skills.filter((cat) =>
              cat.skills.some((s) => s.name === skillName)
            );
            expect(categoriesContainingSkill.length).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('the set of skills has no duplicates', () => {
      const allSkillNames = getAllSkillNames();
      const uniqueSkillNames = [...new Set(allSkillNames)];
      expect(allSkillNames.length).toBe(uniqueSkillNames.length);
    });
  });

  describe('Completeness: SkillsDisplay data layer renders all Resume_Data skills', () => {
    it('for any randomly selected category, all its expected skills are present', () => {
      const categories = resumeData.skills;
      expect(categories.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: categories.length - 1 }),
          (index) => {
            const category = categories[index];
            const expectedSkills = EXPECTED_SKILLS_BY_CATEGORY[category.category];
            expect(expectedSkills).toBeDefined();

            // Every expected skill must be present in the category
            const actualSkillNames = category.skills.map((s) => s.name);
            for (const expectedSkill of expectedSkills) {
              expect(actualSkillNames).toContain(expectedSkill);
            }

            // No extra skills beyond what's expected
            expect(actualSkillNames.length).toBe(expectedSkills.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('the SkillsDisplay component iterates over all resumeData.skills categories and skills', () => {
      // Verify the data structure used by SkillsDisplay (resumeData.skills) is complete
      // The component does: resumeData.skills.map(category => category.skills.map(skill => ...))
      const renderedSkills: string[] = [];
      for (const category of resumeData.skills) {
        for (const skill of category.skills) {
          renderedSkills.push(skill.name);
        }
      }

      const expectedAllSkills = Object.values(EXPECTED_SKILLS_BY_CATEGORY).flat().sort();
      expect(renderedSkills.sort()).toEqual(expectedAllSkills);
    });
  });

  describe('Bidirectional completeness: no additions and no omissions', () => {
    it('any skill in the expected set exists in Resume_Data', () => {
      const expectedAllSkills = Object.values(EXPECTED_SKILLS_BY_CATEGORY).flat();
      const skillToCategoryMap = buildSkillToCategoryMap();

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: expectedAllSkills.length - 1 }),
          (index) => {
            const expectedSkill = expectedAllSkills[index];
            // Verify it exists in Resume_Data
            expect(skillToCategoryMap.has(expectedSkill)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('any skill in Resume_Data exists in the expected set', () => {
      const allSkills = resumeData.skills.flatMap((cat) => cat.skills);
      const expectedAllSkills = Object.values(EXPECTED_SKILLS_BY_CATEGORY).flat();

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allSkills.length - 1 }),
          (index) => {
            const skill = allSkills[index];
            // Verify it exists in the expected specification set
            expect(expectedAllSkills).toContain(skill.name);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('fabricated skill names are not present in Resume_Data', () => {
      const allSkillNames = getAllSkillNames();

      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 30 }).filter(
            (s) => s.trim().length > 0 && /[^a-zA-Z\s\-\(\)\+\.]/.test(s)
          ),
          (fabricatedSkill) => {
            // Random strings with special characters should not match any real skill
            expect(allSkillNames).not.toContain(fabricatedSkill);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
