import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getAllPosts, getPostBySlug, getAllCategories, getPostsByCategory } from './mdx';

// Create a temporary blog directory for testing
const TEST_BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const samplePost1 = `---
title: First Post
description: A first test post
category: Engineering
publishedAt: 2024-06-15
tags: [React, TypeScript]
featured: true
---

This is the content of the first post with enough words to test reading time calculation.`;

const samplePost2 = `---
title: Second Post
description: A second test post
category: Design
publishedAt: 2024-08-20
tags: [CSS, Tailwind]
featured: false
---

This is the content of the second post which was published later than the first one.`;

const samplePost3 = `---
title: Third Post
description: A third test post
category: Engineering
publishedAt: 2024-03-10
tags: [Node.js]
featured: false
---

This is the content of the third post which was published earliest of all three posts.`;

describe('Blog MDX utilities', () => {
  const testFiles: string[] = [];

  beforeEach(() => {
    // Ensure the blog directory exists
    if (!fs.existsSync(TEST_BLOG_DIR)) {
      fs.mkdirSync(TEST_BLOG_DIR, { recursive: true });
    }

    // Write test posts
    const files = [
      { name: 'first-post.mdx', content: samplePost1 },
      { name: 'second-post.mdx', content: samplePost2 },
      { name: 'third-post.mdx', content: samplePost3 },
    ];

    for (const file of files) {
      const filePath = path.join(TEST_BLOG_DIR, file.name);
      fs.writeFileSync(filePath, file.content, 'utf-8');
      testFiles.push(filePath);
    }
  });

  afterEach(() => {
    // Clean up test files
    for (const file of testFiles) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }
    testFiles.length = 0;
  });

  describe('getAllPosts', () => {
    it('returns all MDX posts from the blog directory', () => {
      const posts = getAllPosts();
      // At least our 3 test posts (there may be the sample post too)
      expect(posts.length).toBeGreaterThanOrEqual(3);
    });

    it('sorts posts by date descending (most recent first)', () => {
      const posts = getAllPosts();
      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].publishedAt).getTime();
        const nextDate = new Date(posts[i + 1].publishedAt).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it('parses frontmatter correctly', () => {
      const posts = getAllPosts();
      const firstPost = posts.find((p) => p.slug === 'first-post');
      expect(firstPost).toBeDefined();
      expect(firstPost!.title).toBe('First Post');
      expect(firstPost!.description).toBe('A first test post');
      expect(firstPost!.category).toBe('Engineering');
      expect(firstPost!.publishedAt).toBe('2024-06-15');
    });

    it('calculates reading time for each post', () => {
      const posts = getAllPosts();
      for (const post of posts) {
        expect(post.readingTime).toBeGreaterThanOrEqual(1);
        expect(typeof post.readingTime).toBe('number');
      }
    });

    it('includes content without frontmatter', () => {
      const posts = getAllPosts();
      const firstPost = posts.find((p) => p.slug === 'first-post');
      expect(firstPost!.content).not.toContain('---');
      expect(firstPost!.content).toContain('first post');
    });
  });

  describe('getPostBySlug', () => {
    it('returns a post when slug matches a file', () => {
      const post = getPostBySlug('first-post');
      expect(post).not.toBeNull();
      expect(post!.slug).toBe('first-post');
      expect(post!.title).toBe('First Post');
    });

    it('returns null for non-existent slug', () => {
      const post = getPostBySlug('non-existent-post');
      expect(post).toBeNull();
    });
  });

  describe('getAllCategories', () => {
    it('returns unique categories sorted alphabetically', () => {
      const categories = getAllCategories();
      expect(categories).toContain('Engineering');
      expect(categories).toContain('Design');
      // Verify sorted
      for (let i = 0; i < categories.length - 1; i++) {
        expect(categories[i].localeCompare(categories[i + 1])).toBeLessThanOrEqual(0);
      }
    });

    it('does not contain duplicates', () => {
      const categories = getAllCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe('getPostsByCategory', () => {
    it('returns only posts matching the category', () => {
      const posts = getPostsByCategory('Engineering');
      expect(posts.length).toBeGreaterThanOrEqual(2);
      for (const post of posts) {
        expect(post.category).toBe('Engineering');
      }
    });

    it('returns empty array for non-existent category', () => {
      const posts = getPostsByCategory('NonExistent');
      expect(posts).toEqual([]);
    });

    it('maintains reverse chronological order', () => {
      const posts = getPostsByCategory('Engineering');
      for (let i = 0; i < posts.length - 1; i++) {
        const currentDate = new Date(posts[i].publishedAt).getTime();
        const nextDate = new Date(posts[i + 1].publishedAt).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });
});
