import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPosts, getAllCategories } from '@/lib/blog/mdx';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical articles on frontend architecture, React, TypeScript, and building scalable enterprise applications.',
  alternates: {
    canonical: 'https://ashutoshjha.dev/blog',
  },
  openGraph: {
    title: 'Blog | Ashutosh Jha',
    description:
      'Technical articles on frontend architecture, React, TypeScript, and building scalable enterprise applications.',
  },
  twitter: {
    title: 'Blog | Ashutosh Jha',
    description:
      'Technical articles on frontend architecture, React, TypeScript, and building scalable enterprise applications.',
  },
};

interface BlogPageProps {
  searchParams: { category?: string };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const activeCategory = searchParams.category;

  const filteredPosts = activeCategory
    ? allPosts.filter((post) => post.category === activeCategory)
    : allPosts;

  return (
    <div className="mx-auto max-w-4xl px-6 py-section">
      <header className="mb-12">
        <h1 className="text-heading-sm font-heading font-bold text-foreground mb-4">
          Blog
        </h1>
        <p className="text-lg text-secondary">
          Thoughts on frontend architecture, performance optimization, and
          building at scale.
        </p>
      </header>

      <Suspense fallback={null}>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
        />
      </Suspense>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-secondary text-lg">
            No posts found{activeCategory ? ` in "${activeCategory}"` : ''}.
          </p>
          <p className="text-secondary mt-2">
            Check back soon for new content.
          </p>
        </div>
      )}
    </div>
  );
}
