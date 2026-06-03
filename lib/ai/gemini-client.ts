// lib/ai/gemini-client.ts
// Gemini Flash API client for AI Assistant and Career Story Generator.
// Uses the Google Generative AI SDK with environment-based API key configuration.

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.5-flash';

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
};

const SYSTEM_PROMPT = `You are an AI assistant for Ashutosh Jha's career portfolio. You answer questions about Ashutosh's professional experience, skills, projects, and achievements.

IMPORTANT RULES:
1. ONLY use the provided context to answer questions. Do NOT make up or infer information beyond what is given.
2. If the context does not contain relevant information to answer the question, say "I don't have information about that in Ashutosh's resume data."
3. Be concise, professional, and helpful.
4. Do not fabricate certifications, metrics, or technologies not present in the context.
5. When referencing achievements, use the exact data provided in the context.`;

/**
 * Generates a response using Gemini Flash with the provided context.
 * The model is constrained to only use information from the provided context.
 *
 * @param prompt - The user's question or input
 * @param context - The relevant resume data context retrieved via RAG
 * @returns The generated response text, or an error message string on failure
 */
export async function generateResponse(prompt: string, context: string): Promise<string> {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPT,
    });

    const userMessage = `Context from Ashutosh Jha's resume:\n${context}\n\nQuestion: ${prompt}`;

    const result = await model.generateContent(userMessage);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return 'I was unable to generate a response. Please try again.';
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return 'AI service is not configured. Please set up the API key.';
      }
      if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
        return 'Gemini quota or rate limit reached. Please try again later.';
      }
      return `AI service is temporarily unavailable. Please try again later.`;
    }
    return 'An unexpected error occurred. Please try again later.';
  }
}
