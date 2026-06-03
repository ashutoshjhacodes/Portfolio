// app/api/career-story/route.ts
// Career Story Generator endpoint using Edge Runtime.
// Generates a tailored career narrative (150-800 words) based on role/company context
// using Resume_Data and Gemini Flash.

import { validateCareerStoryInput } from '@/lib/utils/validation';
import { retrieveContext, CONFIDENCE_THRESHOLD } from '@/lib/ai/rag-retrieval';
import { resumeData } from '@/lib/resume-data';

export const runtime = 'edge';

interface CareerStoryRequest {
  context: string; // 2-500 characters: role or company context
}

interface CareerStoryResponse {
  narrative: string;
  wordCount: number;
  unrepresentedAreas: string[];
}

interface CareerStoryErrorResponse {
  error: string;
  code: string;
}

const CAREER_STORY_SYSTEM_PROMPT = `You are a career narrative generator for Ashutosh Jha's portfolio. Generate a professional career narrative (150-800 words) tailored to the specified role or company context.

IMPORTANT RULES:
1. ONLY reference technologies, achievements, and experience present in the provided context from Resume_Data.
2. If the context mentions technologies or experience NOT in the provided data, explicitly state: "Note: [technology/area] is not represented in Ashutosh's background."
3. Generate a cohesive narrative highlighting relevant achievements and skills.
4. Keep the narrative between 150 and 800 words.
5. Use a professional, compelling tone suitable for recruiter communication.
6. Do NOT fabricate or infer experience beyond what is provided in the context.
7. Focus on quantified achievements and concrete outcomes where available.`;

/**
 * Builds a comprehensive context string from the resume data for narrative generation.
 */
function buildFullResumeContext(): string {
  const sections: string[] = [];

  // Personal info
  sections.push(`Name: ${resumeData.personal.name}`);
  sections.push(`Title: ${resumeData.personal.title}`);
  sections.push(`Education: ${resumeData.personal.education.degree} in ${resumeData.personal.education.field} from ${resumeData.personal.education.institution} (${resumeData.personal.education.period})`);

  // Experience
  for (const exp of resumeData.experience) {
    const expLines = [
      `\nExperience: ${exp.role} at ${exp.company} (${exp.period})`,
      exp.client ? `Client: ${exp.client}` : '',
      exp.responsibilities.length > 0 ? `Responsibilities:\n- ${exp.responsibilities.join('\n- ')}` : '',
      exp.achievements.length > 0 ? `Achievements:\n- ${exp.achievements.join('\n- ')}` : '',
      exp.technologies.length > 0 ? `Technologies: ${exp.technologies.join(', ')}` : '',
    ];
    sections.push(expLines.filter(Boolean).join('\n'));
  }

  // Projects
  for (const project of resumeData.projects) {
    const projLines = [
      `\nProject: ${project.title}${project.isFlagship ? ' (Flagship)' : ''}`,
      project.techStack.length > 0 ? `Tech Stack: ${project.techStack.join(', ')}` : '',
      project.outcomes.length > 0 ? `Outcomes:\n- ${project.outcomes.join('\n- ')}` : '',
      project.metrics ? `Metrics: ${Object.entries(project.metrics).map(([k, v]) => `${k}: ${v}`).join(', ')}` : '',
    ];
    sections.push(projLines.filter(Boolean).join('\n'));
  }

  // Skills
  const allSkills = resumeData.skills.flatMap(cat => cat.skills.map(s => s.name));
  sections.push(`\nAll Technologies: ${allSkills.join(', ')}`);

  // Metrics
  sections.push(`\nImpact Metrics: ${resumeData.metrics.map(m => `${m.label}: ${m.value}`).join(', ')}`);

  return sections.join('\n');
}

/**
 * Extracts all known technologies from Resume_Data for validation.
 */
function getKnownTechnologies(): Set<string> {
  const techs = new Set<string>();
  for (const cat of resumeData.skills) {
    for (const skill of cat.skills) {
      techs.add(skill.name.toLowerCase());
    }
  }
  for (const exp of resumeData.experience) {
    for (const tech of exp.technologies) {
      techs.add(tech.toLowerCase());
    }
  }
  for (const project of resumeData.projects) {
    for (const tech of project.techStack) {
      techs.add(tech.toLowerCase());
    }
  }
  return techs;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    let body: CareerStoryRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid request body', code: 'INVALID_REQUEST' } satisfies CareerStoryErrorResponse,
        { status: 400 }
      );
    }

    const { context } = body;

    // Validate input (2-500 characters)
    const validation = validateCareerStoryInput(context);
    if (!validation.valid) {
      return Response.json(
        { error: validation.error || 'Invalid input', code: 'VALIDATION_ERROR' } satisfies CareerStoryErrorResponse,
        { status: 400 }
      );
    }

    // Retrieve relevant context via RAG to check if we have matching experience
    const ragContext = retrieveContext(context, resumeData);

    // If confidence is very low, return insufficient matching experience message
    if (ragContext.confidence < CONFIDENCE_THRESHOLD) {
      return Response.json(
        {
          error: "Ashutosh's resume does not contain sufficient experience matching the specified role or company context. The career narrative cannot be generated for this query.",
          code: 'INSUFFICIENT_EXPERIENCE',
        } satisfies CareerStoryErrorResponse,
        { status: 200 }
      );
    }

    // Build context for generation - use full resume with relevance hints
    const fullContext = buildFullResumeContext();

    // Identify potential unrepresented areas from the user's query
    const knownTechs = getKnownTechnologies();
    const queryTokens = context.toLowerCase().split(/\s+/);
    const unrepresentedAreas: string[] = [];

    // Common technology keywords that might be queried but not in resume
    const techKeywords = queryTokens.filter(token =>
      token.length > 2 &&
      !knownTechs.has(token) &&
      /^[a-z]/.test(token) &&
      !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'role', 'company', 'engineer', 'developer', 'senior', 'lead', 'manager', 'position', 'team', 'work', 'looking', 'need', 'want', 'like'].includes(token)
    );

    // Call Gemini Flash for narrative generation
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'AI service is not configured', code: 'SERVICE_NOT_CONFIGURED' } satisfies CareerStoryErrorResponse,
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: CAREER_STORY_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `Target role/company context: "${context}"

Resume Data:
${fullContext}

${techKeywords.length > 0 ? `Note: The following technologies/areas from the query are NOT present in Ashutosh's resume: ${techKeywords.join(', ')}. Please indicate these as unrepresented areas in the narrative.` : ''}

Generate a career narrative (150-800 words) highlighting how Ashutosh's experience aligns with this role/company. Only reference technologies and achievements present in the resume data above.`;

    const result = await model.generateContent(prompt);
    const narrative = result.response.text();

    if (!narrative) {
      return Response.json(
        { error: 'Failed to generate narrative. Please try again.', code: 'GENERATION_FAILED' } satisfies CareerStoryErrorResponse,
        { status: 500 }
      );
    }

    // Count words in the generated narrative
    const wordCount = narrative.split(/\s+/).filter(w => w.length > 0).length;

    return Response.json(
      {
        narrative,
        wordCount,
        unrepresentedAreas: techKeywords,
      } satisfies CareerStoryResponse,
      { status: 200 }
    );
  } catch (error) {
    const isConfigError = error instanceof Error && error.message.includes('API_KEY');
    const isQuotaError = error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('quota'));

    return Response.json(
      {
        error: isConfigError
          ? 'AI service is not configured'
          : isQuotaError
            ? 'Gemini quota or rate limit reached. Please try again later.'
            : 'Career story generation is temporarily unavailable. Please try again later.',
        code: isConfigError ? 'SERVICE_NOT_CONFIGURED' : isQuotaError ? 'QUOTA_EXCEEDED' : 'SERVICE_UNAVAILABLE',
      } satisfies CareerStoryErrorResponse,
      { status: isQuotaError ? 429 : 503 }
    );
  }
}
