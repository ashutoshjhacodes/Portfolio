import fs from 'fs';
import path from 'path';
import { calculateReadingTime } from './reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  content: string; // raw MDX content
}

interface Frontmatter {
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  tags?: string[];
  featured?: boolean;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Parses frontmatter from MDX file content.
 * Expects YAML frontmatter delimited by --- markers.
 */
function parseFrontmatter(fileContent: string): {
  frontmatter: Frontmatter;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatterBlock = match[1];
  const content = match[2];

  const frontmatter: Record<string, unknown> = {};

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value: unknown = line.slice(colonIndex + 1).trim();

    // Handle array values (e.g., tags: [item1, item2])
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''));
    }
    // Handle boolean values
    else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    // Handle quoted strings
    else if (
      typeof value === 'string' &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return {
    frontmatter: frontmatter as unknown as Frontmatter,
    content,
  };
}

/**
 * Reads all MDX blog posts from the content/blog/ directory.
 * Parses frontmatter, calculates reading time, and returns posts
 * sorted by publication date in descending order (most recent first).
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

  const posts: BlogPost[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const { frontmatter, content } = parseFrontmatter(fileContent);

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      category: frontmatter.category,
      publishedAt: frontmatter.publishedAt,
      readingTime: calculateReadingTime(content),
      content,
    };
  });

  // Sort by date descending (most recent first)
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Gets a single blog post by its slug (filename without .mdx extension).
 * Returns null if the post doesn't exist.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, content } = parseFrontmatter(fileContent);

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    category: frontmatter.category,
    publishedAt: frontmatter.publishedAt,
    readingTime: calculateReadingTime(content),
    content,
  };
}

/**
 * Returns all unique categories from all blog posts.
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

/**
 * Filters posts by category, maintaining reverse chronological order.
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category === category);
}
