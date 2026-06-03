import Fuse, { IFuseOptions } from 'fuse.js';
import { resumeData } from './resume-data';

export interface SearchResult {
  id: string;
  title: string;
  section: string;
  type: 'section' | 'project' | 'skill' | 'blog';
  href: string;
}

/**
 * Builds the search index from resume data and page sections.
 * Indexes all sections, projects, skills, and blog posts.
 */
function buildSearchIndex(): SearchResult[] {
  const items: SearchResult[] = [];

  // 1. Index all page sections
  const sections = [
    { id: 'section-about', title: 'About', section: 'Navigation', href: '#about' },
    { id: 'section-experience', title: 'Experience', section: 'Navigation', href: '#experience' },
    { id: 'section-projects', title: 'Projects', section: 'Navigation', href: '#projects' },
    { id: 'section-skills', title: 'Skills', section: 'Navigation', href: '#skills' },
    { id: 'section-ai-engineering', title: 'AI Engineering', section: 'Navigation', href: '#ai-engineering' },
    { id: 'section-contact', title: 'Contact', section: 'Navigation', href: '#contact' },
  ];
  items.push(...sections.map((s) => ({ ...s, type: 'section' as const })));

  // 2. Index all projects from resumeData
  for (const project of resumeData.projects) {
    items.push({
      id: `project-${project.id}`,
      title: project.title,
      section: 'Projects',
      type: 'project',
      href: '#projects',
    });
  }

  // 3. Index all skills from resumeData
  for (const category of resumeData.skills) {
    for (const skill of category.skills) {
      items.push({
        id: `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: skill.name,
        section: category.category,
        type: 'skill',
        href: '#skills',
      });
    }
  }

  return items;
}

// Build the static search index (sections, projects, skills)
const staticItems = buildSearchIndex();

// Fuse.js configuration for fuzzy matching
const fuseOptions: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'section', weight: 0.3 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 1,
};

/**
 * Performs fuzzy search across all indexed items.
 * Returns at most 10 results.
 *
 * @param query - The search query string
 * @param blogPosts - Optional array of blog posts to include in the search
 * @returns Array of SearchResult items (max 10)
 */
export function search(
  query: string,
  blogPosts?: Array<{ slug: string; title: string; category: string }>
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  // Build full index including blog posts if provided
  let allItems = [...staticItems];

  if (blogPosts && blogPosts.length > 0) {
    const blogItems: SearchResult[] = blogPosts.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      section: post.category,
      type: 'blog' as const,
      href: `/blog/${post.slug}`,
    }));
    allItems = [...allItems, ...blogItems];
  }

  const fuse = new Fuse(allItems, fuseOptions);
  const results = fuse.search(query, { limit: 10 });

  return results.map((result) => result.item);
}

/**
 * Returns all indexed items (useful for displaying default suggestions).
 */
export function getAllSearchItems(
  blogPosts?: Array<{ slug: string; title: string; category: string }>
): SearchResult[] {
  let allItems = [...staticItems];

  if (blogPosts && blogPosts.length > 0) {
    const blogItems: SearchResult[] = blogPosts.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      section: post.category,
      type: 'blog' as const,
      href: `/blog/${post.slug}`,
    }));
    allItems = [...allItems, ...blogItems];
  }

  return allItems;
}
