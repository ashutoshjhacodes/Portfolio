/**
 * Calculates the estimated reading time for a given content string.
 * Based on an average reading speed of 200 words per minute.
 *
 * @param content - The text content to calculate reading time for
 * @returns The estimated reading time in minutes (minimum 1)
 */
export function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.round(wordCount / 200));
}
