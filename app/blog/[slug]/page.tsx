import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog/mdx';
import { MDXRemote } from '@/components/blog/MDXRemote';

interface BlogPostPageProps {
  params: { slug: string };
}

/**
 * Generate static paths for all blog posts at build time.
 */
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate metadata for each blog post for SEO.
 */
export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://ashutoshjha.dev/blog/${params.slug}`,
    },
    openGraph: {
      title: `${post.title} | Ashutosh Jha`,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      title: `${post.title} | Ashutosh Jha`,
      description: post.description,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-section">
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-secondary">
          <span className="rounded-full bg-muted px-3 py-1 font-medium">
            {post.category}
          </span>
          <span>{post.readingTime} min read</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>{formattedDate}</time>
        </div>

        <h1 className="text-heading-sm font-heading font-bold text-foreground tracking-tight">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-secondary">
          {post.description}
        </p>
      </header>

      <div className="prose-custom">
        <MDXRemote source={post.content} />
      </div>

      <footer className="mt-16 border-t border-border pt-8">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-secondary hover:text-foreground transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to all posts
        </a>
      </footer>
    </article>
  );
}
