// lib/ai/rag-retrieval.ts
// RAG (Retrieval-Augmented Generation) context retrieval from resume data.
// Searches across all Resume_Data sections by keyword relevance and returns
// matching context with a confidence score.

import { ResumeData } from '@/lib/resume-data';

export interface RAGContext {
  relevantSections: string[];
  confidence: number;
}

/** Confidence threshold below which the caller should return "information not available" */
export const CONFIDENCE_THRESHOLD = 0.3;

/** Maximum number of relevant sections to return */
const MAX_SECTIONS = 5;

/**
 * Retrieves relevant context from resume data based on the user's query.
 * Uses keyword matching and relevance scoring to find matching sections.
 *
 * @param query - The user's question or search query
 * @param resumeData - The complete resume data to search through
 * @returns RAGContext with relevant sections and confidence score (0-1)
 */
export function retrieveContext(query: string, resumeData: ResumeData): RAGContext {
  if (!query || !query.trim()) {
    return { relevantSections: [], confidence: 0 };
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = tokenize(normalizedQuery);

  if (queryTokens.length === 0) {
    return { relevantSections: [], confidence: 0 };
  }

  const scoredSections: ScoredSection[] = [];

  // Search experience sections
  for (const exp of resumeData.experience) {
    const text = buildExperienceText(exp);
    const score = calculateRelevanceScore(queryTokens, text);
    if (score > 0) {
      scoredSections.push({ text: formatExperienceSection(exp), score });
    }
  }

  // Search projects sections
  for (const project of resumeData.projects) {
    const text = buildProjectText(project);
    const score = calculateRelevanceScore(queryTokens, text);
    if (score > 0) {
      scoredSections.push({ text: formatProjectSection(project), score });
    }
  }

  // Search skills sections
  for (const category of resumeData.skills) {
    const text = buildSkillCategoryText(category);
    const score = calculateRelevanceScore(queryTokens, text);
    if (score > 0) {
      scoredSections.push({ text: formatSkillSection(category), score });
    }
  }

  // Search metrics
  const metricsText = buildMetricsText(resumeData.metrics);
  const metricsScore = calculateRelevanceScore(queryTokens, metricsText);
  if (metricsScore > 0) {
    scoredSections.push({ text: formatMetricsSection(resumeData.metrics), score: metricsScore });
  }

  // Search principles
  for (const principle of resumeData.principles) {
    const text = buildPrincipleText(principle);
    const score = calculateRelevanceScore(queryTokens, text);
    if (score > 0) {
      scoredSections.push({ text: formatPrincipleSection(principle), score });
    }
  }

  // Search AI tools
  for (const tool of resumeData.aiTools) {
    const text = buildAIToolText(tool);
    const score = calculateRelevanceScore(queryTokens, text);
    if (score > 0) {
      scoredSections.push({ text: formatAIToolSection(tool), score });
    }
  }

  // Search personal/education info
  const personalText = buildPersonalText(resumeData.personal);
  const personalScore = calculateRelevanceScore(queryTokens, personalText);
  if (personalScore > 0) {
    scoredSections.push({ text: formatPersonalSection(resumeData.personal), score: personalScore });
  }

  // Sort by score descending and take top sections
  scoredSections.sort((a, b) => b.score - a.score);
  const topSections = scoredSections.slice(0, MAX_SECTIONS);

  // Calculate overall confidence as the average of top section scores, normalized
  const confidence = topSections.length > 0
    ? Math.min(1, topSections.reduce((sum, s) => sum + s.score, 0) / topSections.length)
    : 0;

  return {
    relevantSections: topSections.map(s => s.text),
    confidence,
  };
}

// --- Internal types ---

interface ScoredSection {
  text: string;
  score: number;
}

// --- Tokenization ---

/**
 * Tokenizes a string into meaningful keywords, removing common stop words.
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'and', 'but', 'or',
    'not', 'no', 'nor', 'so', 'yet', 'both', 'either', 'neither', 'each',
    'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such',
    'than', 'too', 'very', 'just', 'about', 'what', 'which', 'who', 'whom',
    'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you',
    'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them',
    'their', 'how', 'when', 'where', 'why', 'tell', 'about', 'know',
  ]);

  return text
    .replace(/[^\w\s+#.]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.has(word));
}

// --- Relevance scoring ---

/**
 * Calculates a relevance score (0-1) for how well query tokens match the section text.
 * Uses a combination of exact match, partial match, and token coverage.
 */
function calculateRelevanceScore(queryTokens: string[], sectionText: string): number {
  const normalizedSection = sectionText.toLowerCase();
  const sectionTokens = new Set(tokenize(normalizedSection));

  let matchedTokens = 0;
  let partialMatches = 0;

  for (const token of queryTokens) {
    // Exact token match in section
    if (sectionTokens.has(token)) {
      matchedTokens++;
    }
    // Substring match (e.g., "react" matches "react.js")
    else if (normalizedSection.includes(token)) {
      partialMatches++;
    }
    // Check if any section token starts with the query token
    else {
      for (const sToken of Array.from(sectionTokens)) {
        if (sToken.startsWith(token) || token.startsWith(sToken)) {
          partialMatches += 0.5;
          break;
        }
      }
    }
  }

  const totalQueryTokens = queryTokens.length;
  if (totalQueryTokens === 0) return 0;

  // Weight exact matches more heavily than partial matches
  const score = (matchedTokens + partialMatches * 0.6) / totalQueryTokens;

  return Math.min(1, score);
}

// --- Text builders (for scoring) ---

function buildExperienceText(exp: { company: string; role: string; period: string; client?: string; responsibilities: string[]; achievements: string[]; technologies: string[] }): string {
  return [
    exp.company,
    exp.role,
    exp.period,
    exp.client || '',
    ...exp.responsibilities,
    ...exp.achievements,
    ...exp.technologies,
  ].join(' ');
}

function buildProjectText(project: { title: string; techStack: string[]; challenges: string[]; outcomes: string[]; metrics?: Record<string, string> }): string {
  return [
    project.title,
    ...project.techStack,
    ...project.challenges,
    ...project.outcomes,
    ...Object.values(project.metrics || {}),
  ].join(' ');
}

function buildSkillCategoryText(category: { category: string; skills: { name: string }[] }): string {
  return [category.category, ...category.skills.map(s => s.name)].join(' ');
}

function buildMetricsText(metrics: { label: string; value: string }[]): string {
  return metrics.map(m => `${m.label} ${m.value}`).join(' ');
}

function buildPrincipleText(principle: { title: string; description: string; relatedTech: string }): string {
  return `${principle.title} ${principle.description} ${principle.relatedTech}`;
}

function buildAIToolText(tool: { name: string; workflow: string; outcome: string }): string {
  return `${tool.name} ${tool.workflow} ${tool.outcome}`;
}

function buildPersonalText(personal: { name: string; title: string; email: string; education: { degree: string; field: string; institution: string; period: string } }): string {
  return `${personal.name} ${personal.title} education ${personal.education.degree} ${personal.education.field} ${personal.education.institution} ${personal.education.period} university degree background`;
}

// --- Section formatters (for output) ---

function formatExperienceSection(exp: { company: string; role: string; period: string; client?: string; responsibilities: string[]; achievements: string[]; technologies: string[] }): string {
  const lines = [
    `Experience: ${exp.role} at ${exp.company} (${exp.period})`,
    exp.client ? `Client: ${exp.client}` : '',
    exp.responsibilities.length > 0 ? `Responsibilities: ${exp.responsibilities.join('; ')}` : '',
    exp.achievements.length > 0 ? `Achievements: ${exp.achievements.join('; ')}` : '',
    exp.technologies.length > 0 ? `Technologies: ${exp.technologies.join(', ')}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function formatProjectSection(project: { title: string; techStack: string[]; challenges: string[]; outcomes: string[]; metrics?: Record<string, string> }): string {
  const lines = [
    `Project: ${project.title}`,
    project.techStack.length > 0 ? `Tech Stack: ${project.techStack.join(', ')}` : '',
    project.challenges.length > 0 ? `Challenges: ${project.challenges.join('; ')}` : '',
    project.outcomes.length > 0 ? `Outcomes: ${project.outcomes.join('; ')}` : '',
    project.metrics ? `Metrics: ${Object.entries(project.metrics).map(([k, v]) => `${k}: ${v}`).join(', ')}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function formatSkillSection(category: { category: string; skills: { name: string }[] }): string {
  return `Skills (${category.category}): ${category.skills.map(s => s.name).join(', ')}`;
}

function formatMetricsSection(metrics: { label: string; value: string }[]): string {
  return `Impact Metrics: ${metrics.map(m => `${m.label}: ${m.value}`).join(', ')}`;
}

function formatPrincipleSection(principle: { title: string; description: string; relatedTech: string }): string {
  return `Principle: ${principle.title} - ${principle.description} (Related: ${principle.relatedTech})`;
}

function formatAIToolSection(tool: { name: string; workflow: string; outcome: string }): string {
  return `AI Tool: ${tool.name} - Workflow: ${tool.workflow}. Outcome: ${tool.outcome}`;
}

function formatPersonalSection(personal: { name: string; title: string; email: string; education: { degree: string; field: string; institution: string; period: string } }): string {
  return `Personal: ${personal.name}, ${personal.title}. Education: ${personal.education.degree} in ${personal.education.field} from ${personal.education.institution} (${personal.education.period})`;
}
