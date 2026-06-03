// lib/ai/gemini-client.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateResponse } from './gemini-client';

describe('generateResponse', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns error message when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_AI_API_KEY;
    const result = await generateResponse('test question', 'test context');
    expect(result).toContain('not configured');
  });

  it('returns error message when neither GEMINI_API_KEY nor GOOGLE_AI_API_KEY is set', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_AI_API_KEY;
    const result = await generateResponse('test question', 'test context');
    expect(result).toContain('not configured');
  });

  it('returns a string response', async () => {
    // Without a valid API key, it should return an error message string
    delete process.env.GEMINI_API_KEY;
    const result = await generateResponse('What skills do you have?', 'Skills: React, TypeScript');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles empty prompt gracefully', async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await generateResponse('', 'Some context');
    expect(typeof result).toBe('string');
  });

  it('handles empty context gracefully', async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await generateResponse('What do you know?', '');
    expect(typeof result).toBe('string');
  });
});
