import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateChatInput, validateCareerStoryInput } from '../../lib/utils/validation';

/**
 * Feature: career-platform
 * Property 3: Input Validation Rejection
 *
 * For any string that is empty, composed entirely of whitespace, exceeds 500 characters
 * (for chat input), or is shorter than 2 characters (for career story input), the respective
 * validation function shall reject the input and return an appropriate error without
 * initiating a backend request.
 *
 * **Validates: Requirements 9.8, 21.4**
 */

describe('Property 3: Input Validation Rejection', () => {
  describe('validateChatInput', () => {
    it('rejects empty strings', () => {
      fc.assert(
        fc.property(fc.constant(''), (input) => {
          const result = validateChatInput(input);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects whitespace-only strings of arbitrary length', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r', '\f', '\v'), { minLength: 1, maxLength: 1000 }),
          (input) => {
            const result = validateChatInput(input);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects strings exceeding 500 characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 501, maxLength: 2000 }).filter((s) => s.trim().length > 0),
          (input) => {
            const result = validateChatInput(input);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accepts valid strings of 1-500 characters with non-whitespace content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
          (input) => {
            const result = validateChatInput(input);
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('validateCareerStoryInput', () => {
    it('rejects empty strings', () => {
      fc.assert(
        fc.property(fc.constant(''), (input) => {
          const result = validateCareerStoryInput(input);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('rejects whitespace-only strings of arbitrary length', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r', '\f', '\v'), { minLength: 1, maxLength: 1000 }),
          (input) => {
            const result = validateCareerStoryInput(input);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects strings shorter than 2 characters when trimmed', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length === 1),
          (input) => {
            const result = validateCareerStoryInput(input);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects strings exceeding 500 characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 501, maxLength: 2000 }).filter((s) => s.trim().length >= 2),
          (input) => {
            const result = validateCareerStoryInput(input);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accepts valid strings of 2-500 trimmed characters with non-whitespace content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 2, maxLength: 500 }).filter((s) => s.trim().length >= 2 && s.length <= 500),
          (input) => {
            const result = validateCareerStoryInput(input);
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
