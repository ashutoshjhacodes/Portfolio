export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates chat input.
 * Rules: reject empty, whitespace-only, or >500 characters.
 */
export function validateChatInput(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (input.length > 500) {
    return { valid: false, error: 'Message must be 500 characters or less' };
  }

  return { valid: true };
}

/**
 * Validates career story input.
 * Rules: reject empty, whitespace-only, <2 characters, or >500 characters.
 */
export function validateCareerStoryInput(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: 'A role or company context is required' };
  }

  if (input.trim().length < 2) {
    return { valid: false, error: 'Input must be at least 2 characters' };
  }

  if (input.length > 500) {
    return { valid: false, error: 'Input must be 500 characters or less' };
  }

  return { valid: true };
}
