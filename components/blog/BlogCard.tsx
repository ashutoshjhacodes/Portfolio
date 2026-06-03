import Link from 'next/link';
import type { BlogPost } from '@/lib/blog/mdx';

interface BlogCardProps {
  post: BlogPost;
}

/**
 * Blog post preview card displaying title, description, category, reading time, and date.
 */
export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group rounded-card border border-border bg-card p-6 transition-colors duration-200 hover:border-secondary">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="mb-3 flex items-center gap-3 text-sm text-secondary">
          <span className="rounded-full bg-muted px-3 py-1 font-medium">
            {post.category}
          </span>
          <span>{post.readingTime} min read</span>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-foreground tracking-tight group-hover:text-secondary transition-colors duration-200">
          {post.title}
        </h2>

        <p className="mb-4 text-secondary line-clamp-2">
          {post.description}
        </p>

        <time dateTime={post.publishedAt} className="text-sm text-secondary">
          {formattedDate}
        </time>
      </Link>
    </article>
  );
}
