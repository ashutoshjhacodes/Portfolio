import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
  it('returns 1 minute for empty content', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('returns 1 minute for very short content', () => {
    expect(calculateReadingTime('Hello world')).toBe(1);
  });

  it('returns 1 minute for content under 100 words', () => {
    const words = Array(50).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(1);
  });

  it('returns 1 minute for exactly 200 words', () => {
    const words = Array(200).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(1);
  });

  it('returns 2 minutes for 300 words', () => {
    const words = Array(300).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('returns 5 minutes for 1000 words', () => {
    const words = Array(1000).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(5);
  });

  it('handles content with multiple whitespace types', () => {
    const content = 'word\tword\nword  word\r\nword';
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('handles content with leading/trailing whitespace', () => {
    const words = '  ' + Array(400).fill('word').join(' ') + '  ';
    expect(calculateReadingTime(words)).toBe(2);
  });
});
