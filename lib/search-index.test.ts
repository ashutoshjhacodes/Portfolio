import { describe, it, expect } from 'vitest';
import { search, getAllSearchItems, SearchResult } from './search-index';

describe('search-index', () => {
  describe('getAllSearchItems', () => {
    it('includes all page sections', () => {
      const items = getAllSearchItems();
      const sections = items.filter((item) => item.type === 'section');
      expect(sections.length).toBe(6);
      expect(sections.map((s) => s.title)).toContain('About');
      expect(sections.map((s) => s.title)).toContain('Experience');
      expect(sections.map((s) => s.title)).toContain('Projects');
      expect(sections.map((s) => s.title)).toContain('Skills');
      expect(sections.map((s) => s.title)).toContain('AI Engineering');
      expect(sections.map((s) => s.title)).toContain('Contact');
    });

    it('includes all projects from resumeData', () => {
      const items = getAllSearchItems();
      const projects = items.filter((item) => item.type === 'project');
      expect(projects.length).toBe(3);
      expect(projects.map((p) => p.title)).toContain('CIPHER AI Fleet Damage Intelligence Platform');
      expect(projects.map((p) => p.title)).toContain('Corporate Real Estate Platform');
      expect(projects.map((p) => p.title)).toContain('Avis.com Performance Optimization');
    });

    it('includes all skills from resumeData', () => {
      const items = getAllSearchItems();
      const skills = items.filter((item) => item.type === 'skill');
      // Skills are sourced from the latest CV-backed resumeData categories.
      expect(skills.length).toBe(31);
      expect(skills.map((s) => s.title)).toContain('React.js');
      expect(skills.map((s) => s.title)).toContain('TypeScript');
      expect(skills.map((s) => s.title)).toContain('GraphQL');
      expect(skills.map((s) => s.title)).toContain('AWS Bedrock');
    });

    it('includes blog posts when provided', () => {
      const blogPosts = [
        { slug: 'test-post', title: 'Test Blog Post', category: 'Engineering' },
      ];
      const items = getAllSearchItems(blogPosts);
      const blogs = items.filter((item) => item.type === 'blog');
      expect(blogs.length).toBe(1);
      expect(blogs[0].title).toBe('Test Blog Post');
      expect(blogs[0].href).toBe('/blog/test-post');
    });

    it('each item has required fields', () => {
      const items = getAllSearchItems();
      for (const item of items) {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.section).toBeTruthy();
        expect(['section', 'project', 'skill', 'blog']).toContain(item.type);
        expect(item.href).toBeTruthy();
      }
    });
  });

  describe('search', () => {
    it('returns empty array for empty query', () => {
      expect(search('')).toEqual([]);
      expect(search('   ')).toEqual([]);
    });

    it('returns at most 10 results', () => {
      // "a" should match many items
      const results = search('a');
      expect(results.length).toBeLessThanOrEqual(10);
    });

    it('finds sections by name', () => {
      const results = search('About');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title === 'About')).toBe(true);
    });

    it('finds projects by name', () => {
      const results = search('CIPHER');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title === 'CIPHER AI Fleet Damage Intelligence Platform')).toBe(true);
    });

    it('finds skills by name', () => {
      const results = search('React');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title === 'React.js')).toBe(true);
    });

    it('performs fuzzy matching', () => {
      const results = search('Typscript'); // typo
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title === 'TypeScript')).toBe(true);
    });

    it('each result references a valid type', () => {
      const results = search('React');
      for (const result of results) {
        expect(['section', 'project', 'skill', 'blog']).toContain(result.type);
      }
    });

    it('includes blog posts in search when provided', () => {
      const blogPosts = [
        { slug: 'scalable-arch', title: 'Building Scalable Architecture', category: 'Engineering' },
      ];
      const results = search('Scalable', blogPosts);
      expect(results.some((r) => r.type === 'blog')).toBe(true);
    });
  });
});
