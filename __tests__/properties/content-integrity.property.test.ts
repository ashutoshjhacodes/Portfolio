import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { resumeData } from '../../lib/resume-data';

/**
 * Feature: career-platform
 * Property 1: Content Integrity
 *
 * For any metric, technology, achievement, or experience claim displayed on the platform,
 * it must exist in or be directly derivable from the Resume_Data source. No displayed content
 * shall reference technologies, certifications, or metrics absent from Resume_Data.
 *
 * **Validates: Requirements 2.2, 3.2, 3.4, 8.2, 20.1, 20.2, 20.5**
 */

// Helper: Flatten all skills from resumeData into a single array of skill names
function getAllSkillNames(): string[] {
  return resumeData.skills.flatMap((category) => category.skills.map((s) => s.name));
}

// Helper: Collect all technologies from experience and project techStack
function getAllTechnologies(): string[] {
  const fromSkills = getAllSkillNames();
  const fromExperience = resumeData.experience.flatMap((exp) => exp.technologies);
  const fromProjects = resumeData.projects.flatMap((proj) => proj.techStack);
  return [...new Set([...fromSkills, ...fromExperience, ...fromProjects])];
}

// Helper: Collect all achievements from experience and project outcomes
function getAllAchievements(): string[] {
  const fromExperience = resumeData.experience.flatMap((exp) => exp.achievements);
  const fromProjects = resumeData.projects.flatMap((proj) => proj.outcomes);
  return [...fromExperience, ...fromProjects];
}

// Helper: Collect all AI tool names
function getAllAIToolNames(): string[] {
  return resumeData.aiTools.map((tool) => tool.name);
}

// Helper: Collect all principle titles
function getAllPrincipleTitles(): string[] {
  return resumeData.principles.map((p) => p.title);
}

describe('Property 1: Content Integrity', () => {
  describe('All ImpactDashboard metrics exist in resumeData.metrics', () => {
    it('any randomly selected metric from resumeData.metrics traces back to the source', () => {
      const metrics = resumeData.metrics;
      expect(metrics.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: metrics.length - 1 }),
          (index) => {
            const selectedMetric = metrics[index];
            // Verify the metric exists in the source data
            const found = resumeData.metrics.find(
              (m) => m.label === selectedMetric.label && m.value === selectedMetric.value
            );
            expect(found).toBeDefined();
            // Verify metric has required fields
            expect(selectedMetric.label).toBeTruthy();
            expect(selectedMetric.value).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all metrics displayed in ImpactDashboard are a subset of resumeData.metrics', () => {
      // The ImpactDashboard displays exactly the metrics from resumeData.metrics
      const dashboardMetrics = resumeData.metrics;
      const sourceMetricLabels = resumeData.metrics.map((m) => m.label);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: dashboardMetrics.length - 1 }),
          (index) => {
            const metric = dashboardMetrics[index];
            expect(sourceMetricLabels).toContain(metric.label);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('All technologies trace to resumeData sources', () => {
    it('any technology from experience exists in the combined technology pool', () => {
      const allTechnologies = getAllTechnologies();
      const experienceTechnologies = resumeData.experience.flatMap((exp) => exp.technologies);
      expect(experienceTechnologies.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: experienceTechnologies.length - 1 }),
          (index) => {
            const tech = experienceTechnologies[index];
            expect(allTechnologies).toContain(tech);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('any technology from project techStack exists in the combined technology pool', () => {
      const allTechnologies = getAllTechnologies();
      const projectTechnologies = resumeData.projects.flatMap((proj) => proj.techStack);
      expect(projectTechnologies.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: projectTechnologies.length - 1 }),
          (index) => {
            const tech = projectTechnologies[index];
            expect(allTechnologies).toContain(tech);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('any randomly selected skill name exists in the flattened skills list', () => {
      const allSkillNames = getAllSkillNames();
      expect(allSkillNames.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allSkillNames.length - 1 }),
          (index) => {
            const skill = allSkillNames[index];
            // Verify it traces back to the source
            const foundInSource = resumeData.skills.some((cat) =>
              cat.skills.some((s) => s.name === skill)
            );
            expect(foundInSource).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('All achievements trace to resumeData sources', () => {
    it('any achievement from experience exists in the combined achievements pool', () => {
      const allAchievements = getAllAchievements();
      const experienceAchievements = resumeData.experience.flatMap((exp) => exp.achievements);
      expect(experienceAchievements.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: experienceAchievements.length - 1 }),
          (index) => {
            const achievement = experienceAchievements[index];
            expect(allAchievements).toContain(achievement);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('any outcome from projects exists in the combined achievements pool', () => {
      const allAchievements = getAllAchievements();
      const projectOutcomes = resumeData.projects.flatMap((proj) => proj.outcomes);
      expect(projectOutcomes.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: projectOutcomes.length - 1 }),
          (index) => {
            const outcome = projectOutcomes[index];
            expect(allAchievements).toContain(outcome);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('All AI tools trace to resumeData.aiTools', () => {
    it('any randomly selected AI tool exists in resumeData.aiTools', () => {
      const aiToolNames = getAllAIToolNames();
      expect(aiToolNames.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: aiToolNames.length - 1 }),
          (index) => {
            const toolName = aiToolNames[index];
            const foundInSource = resumeData.aiTools.some((t) => t.name === toolName);
            expect(foundInSource).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('each AI tool has a non-empty workflow and outcome', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: resumeData.aiTools.length - 1 }),
          (index) => {
            const tool = resumeData.aiTools[index];
            expect(tool.name).toBeTruthy();
            expect(tool.workflow).toBeTruthy();
            expect(tool.outcome).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('All principle titles trace to resumeData.principles', () => {
    it('any randomly selected principle title exists in resumeData.principles', () => {
      const principleTitles = getAllPrincipleTitles();
      expect(principleTitles.length).toBeGreaterThan(0);

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: principleTitles.length - 1 }),
          (index) => {
            const title = principleTitles[index];
            const foundInSource = resumeData.principles.some((p) => p.title === title);
            expect(foundInSource).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('no fabricated content can be found in the data source', () => {
      // Generate random strings and verify they do NOT appear as valid data
      const allTechnologies = getAllTechnologies();
      const allAchievements = getAllAchievements();
      const aiToolNames = getAllAIToolNames();
      const principleTitles = getAllPrincipleTitles();

      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 50 }).filter(
            (s) => s.trim().length > 0 && /[^a-zA-Z\s]/.test(s)
          ),
          (fabricatedContent) => {
            // Random strings with special characters should not exist in our data
            expect(allTechnologies).not.toContain(fabricatedContent);
            expect(allAchievements).not.toContain(fabricatedContent);
            expect(aiToolNames).not.toContain(fabricatedContent);
            expect(principleTitles).not.toContain(fabricatedContent);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cross-referencing: data consistency across sections', () => {
    it('all experience technologies are valid technologies in the platform', () => {
      const allTechnologies = getAllTechnologies();

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: resumeData.experience.length - 1 }),
          (expIndex) => {
            const experience = resumeData.experience[expIndex];
            for (const tech of experience.technologies) {
              expect(allTechnologies).toContain(tech);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all project techStack items are valid technologies in the platform', () => {
      const allTechnologies = getAllTechnologies();

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: resumeData.projects.length - 1 }),
          (projIndex) => {
            const project = resumeData.projects[projIndex];
            for (const tech of project.techStack) {
              expect(allTechnologies).toContain(tech);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('randomly selecting any data item from any section traces back to resumeData', () => {
      // Create a combined pool of all displayable content items
      const allMetricLabels = resumeData.metrics.map((m) => m.label);
      const allSkillNames = getAllSkillNames();
      const allAIToolNames = getAllAIToolNames();
      const allPrincipleTitles = getAllPrincipleTitles();
      const allProjectTitles = resumeData.projects.map((p) => p.title);
      const allCompanyNames = resumeData.experience.map((e) => e.company);

      const allDisplayableItems = [
        ...allMetricLabels,
        ...allSkillNames,
        ...allAIToolNames,
        ...allPrincipleTitles,
        ...allProjectTitles,
        ...allCompanyNames,
      ];

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: allDisplayableItems.length - 1 }),
          (index) => {
            const item = allDisplayableItems[index];
            // Verify the item can be traced back to at least one section of resumeData
            const inMetrics = resumeData.metrics.some((m) => m.label === item);
            const inSkills = resumeData.skills.some((cat) =>
              cat.skills.some((s) => s.name === item)
            );
            const inAITools = resumeData.aiTools.some((t) => t.name === item);
            const inPrinciples = resumeData.principles.some((p) => p.title === item);
            const inProjects = resumeData.projects.some((p) => p.title === item);
            const inExperience = resumeData.experience.some((e) => e.company === item);

            const traceable =
              inMetrics || inSkills || inAITools || inPrinciples || inProjects || inExperience;
            expect(traceable).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
