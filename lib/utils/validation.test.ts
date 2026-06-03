import { describe, it, expect } from 'vitest';
import { validateChatInput, validateCareerStoryInput } from './validation';

describe('validateChatInput', () => {
  it('rejects empty string', () => {
    const result = validateChatInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Message cannot be empty');
  });

  it('rejects whitespace-only string', () => {
    const result = validateChatInput('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Message cannot be empty');
  });

  it('rejects string exceeding 500 characters', () => {
    const longInput = 'a'.repeat(501);
    const result = validateChatInput(longInput);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Message must be 500 characters or less');
  });

  it('accepts valid input of 1 character', () => {
    const result = validateChatInput('a');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts valid input of exactly 500 characters', () => {
    const result = validateChatInput('a'.repeat(500));
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts normal message', () => {
    const result = validateChatInput('What is your experience with React?');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('validateCareerStoryInput', () => {
  it('rejects empty string', () => {
    const result = validateCareerStoryInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('A role or company context is required');
  });

  it('rejects whitespace-only string', () => {
    const result = validateCareerStoryInput('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('A role or company context is required');
  });

  it('rejects input shorter than 2 characters (trimmed)', () => {
    const result = validateCareerStoryInput('a');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Input must be at least 2 characters');
  });

  it('rejects string exceeding 500 characters', () => {
    const longInput = 'a'.repeat(501);
    const result = validateCareerStoryInput(longInput);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Input must be 500 characters or less');
  });

  it('accepts valid input of exactly 2 characters', () => {
    const result = validateCareerStoryInput('ab');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts valid input of exactly 500 characters', () => {
    const result = validateCareerStoryInput('a'.repeat(500));
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts normal role description', () => {
    const result = validateCareerStoryInput('Frontend Engineer at Google');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
