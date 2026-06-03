// app/api/chat/route.ts
// AI Assistant chat endpoint using Edge Runtime for low-latency responses.
// Implements input validation, RAG retrieval, Gemini Flash call, and retry with exponential backoff.

import { validateChatInput } from '@/lib/utils/validation';
import { retrieveContext, CONFIDENCE_THRESHOLD } from '@/lib/ai/rag-retrieval';
import { generateResponse } from '@/lib/ai/gemini-client';
import { resumeData } from '@/lib/resume-data';

export const runtime = 'edge';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatRequest {
  message: string;
  sessionHistory?: ChatMessage[];
}

interface ChatResponse {
  reply: string;
  sources: string[];
}

interface ChatErrorResponse {
  error: string;
  code: string;
}

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 500;

/**
 * Retries an async function with exponential backoff.
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @returns The result of the function call
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid request body', code: 'INVALID_REQUEST' } satisfies ChatErrorResponse,
        { status: 400 }
      );
    }

    const { message } = body;

    // Validate input (1-500 characters, not empty/whitespace-only)
    const validation = validateChatInput(message);
    if (!validation.valid) {
      return Response.json(
        { error: validation.error || 'Invalid input', code: 'VALIDATION_ERROR' } satisfies ChatErrorResponse,
        { status: 400 }
      );
    }

    // Retrieve relevant context from Resume_Data via RAG
    const ragContext = retrieveContext(message, resumeData);

    // If confidence is below threshold, return "information not available" response
    if (ragContext.confidence < CONFIDENCE_THRESHOLD) {
      return Response.json(
        {
          reply: "I don't have information about that in Ashutosh's resume data. I can only answer questions based on his verified professional experience, skills, and projects.",
          sources: [],
        } satisfies ChatResponse,
        { status: 200 }
      );
    }

    // Build context string from relevant sections
    const contextString = ragContext.relevantSections.join('\n\n');

    // Call Gemini Flash with retry and exponential backoff
    const reply = await withRetry(async () => {
      const response = await generateResponse(message, contextString);

      // If the response indicates a service error, throw to trigger retry
      if (response.includes('AI service is temporarily unavailable')) {
        throw new Error('Gemini API temporarily unavailable');
      }
      if (response.includes('AI service is not configured')) {
        throw new Error('Gemini API not configured');
      }

      return response;
    }, MAX_RETRIES);

    // Return structured response with reply and sources
    return Response.json(
      {
        reply,
        sources: ragContext.relevantSections.map(section => {
          // Extract the section identifier (first line or first few words)
          const firstLine = section.split('\n')[0];
          return firstLine.length > 80 ? firstLine.slice(0, 80) + '...' : firstLine;
        }),
      } satisfies ChatResponse,
      { status: 200 }
    );
  } catch (error) {
    // All retries exhausted or unexpected error
    const isConfigError = error instanceof Error && error.message.includes('not configured');

    return Response.json(
      {
        error: isConfigError
          ? 'AI service is not configured'
          : 'AI assistant is temporarily unavailable. Please try again later.',
        code: isConfigError ? 'SERVICE_NOT_CONFIGURED' : 'SERVICE_UNAVAILABLE',
      } satisfies ChatErrorResponse,
      { status: 503 }
    );
  }
}
