// lib/ai/rag-retrieval.test.ts
import { describe, it, expect } from 'vitest';
import { retrieveContext, CONFIDENCE_THRESHOLD, RAGContext } from './rag-retrieval';
import { resumeData } from '@/lib/resume-data';

describe('retrieveContext', () => {
  it('returns relevant sections for a query about React experience', () => {
    const result = retrieveContext('What is your experience with React?', resumeData);
    expect(result.relevantSections.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(CONFIDENCE_THRESHOLD);
    // Should find React-related content
    const combined = result.relevantSections.join(' ').toLowerCase();
    expect(combined).toContain('react');
  });

  it('returns relevant sections for a query about CIPHER project', () => {
    const result = retrieveContext('Tell me about the CIPHER AI Platform', resumeData);
    expect(result.relevantSections.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(CONFIDENCE_THRESHOLD);
    const combined = result.relevantSections.join(' ').toLowerCase();
    expect(combined).toContain('cipher');
  });

  it('returns relevant sections for a query about education', () => {
    const result = retrieveContext('What is your education background?', resumeData);
    expect(result.relevantSections.length).toBeGreaterThan(0);
    const combined = result.relevantSections.join(' ').toLowerCase();
    expect(combined).toContain('lovely professional university');
  });

  it('returns relevant sections for a query about AI tools', () => {
    const result = retrieveContext('What AI tools do you use?', resumeData);
    expect(result.relevantSections.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(CONFIDENCE_THRESHOLD);
    const combined = result.relevantSections.join(' ').toLowerCase();
    expect(combined).toMatch(/chatgpt|claude|amazon q|kiro/);
  });

  it('returns low confidence for completely unrelated queries', () => {
    const result = retrieveContext('quantum physics black holes', resumeData);
    expect(result.confidence).toBeLessThan(CONFIDENCE_THRESHOLD);
  });

  it('returns empty results for empty query', () => {
    const result = retrieveContext('', resumeData);
    expect(result.relevantSections).toHaveLength(0);
    expect(result.confidence).toBe(0);
  });

  it('returns empty results for whitespace-only query', () => {
    const result = retrieveContext('   ', resumeData);
    expect(result.relevantSections).toHaveLength(0);
    expect(result.confidence).toBe(0);
  });

  it('returns at most 5 relevant sections', () => {
    const result = retrieveContext('React TypeScript frontend development experience projects', resumeData);
    expect(result.relevantSections.length).toBeLessThanOrEqual(5);
  });

  it('returns confidence between 0 and 1', () => {
    const result = retrieveContext('GraphQL API integration', resumeData);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('finds skills by category name', () => {
    const result = retrieveContext('What are your frontend framework skills?', resumeData);
    expect(result.relevantSections.length).toBeGreaterThan(0);
    const combined = result.relevantSections.join(' ').toLowerCase();
    expect(combined).toMatch(/react|typescript|redux/);
  });

  it('finds metrics information', () => {
    const result = retrieveContext('How many years of experience do you have?', resumeData);
    expect(result.relevantSections.length).toBeGreaterThan(0);
    const combined = result.relevantSections.join(' ');
    expect(combined).toMatch(/5\+|years/i);
  });

  it('all returned sections are strings from resume data', () => {
    const result = retrieveContext('Tell me about your work at Avis', resumeData);
    for (const section of result.relevantSections) {
      expect(typeof section).toBe('string');
      expect(section.length).toBeGreaterThan(0);
    }
  });
});

describe('CONFIDENCE_THRESHOLD', () => {
  it('is set to 0.3', () => {
    expect(CONFIDENCE_THRESHOLD).toBe(0.3);
  });
});
