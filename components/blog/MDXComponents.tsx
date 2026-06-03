import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';
import React from 'react';

/**
 * Custom code block component with dark background and syntax highlighting styling.
 */
function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const language = className?.replace('language-', '') || '';
  const isInline = !className;

  if (isInline) {
    return (
      <code
        className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-zinc-200"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <code
      className={`block font-mono text-sm ${className || ''}`}
      data-language={language}
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * Pre block wrapper for code blocks with dark background and padding.
 */
function Pre({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm leading-relaxed border border-zinc-800"
      {...props}
    >
      {children}
    </pre>
  );
}

/**
 * Custom image component using Next.js Image for optimization.
 */
function MDXImage({
  src,
  alt,
  width,
  height,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  const imgWidth = width ? Number(width) : 800;
  const imgHeight = height ? Number(height) : 450;

  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt || ''}
        width={imgWidth}
        height={imgHeight}
        className="rounded-lg w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-zinc-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Custom link component with underline and hover effect.
 */
function MDXLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http');

  return (
    <a
      href={href}
      className="text-white underline underline-offset-4 decoration-zinc-500 hover:decoration-white transition-colors duration-200"
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Heading components with proper sizing and anchor links.
 */
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const sizes: Record<number, string> = {
    1: 'text-4xl md:text-5xl font-bold mt-12 mb-6',
    2: 'text-3xl md:text-4xl font-bold mt-10 mb-4',
    3: 'text-2xl md:text-3xl font-semibold mt-8 mb-3',
    4: 'text-xl md:text-2xl font-semibold mt-6 mb-2',
    5: 'text-lg md:text-xl font-medium mt-4 mb-2',
    6: 'text-base md:text-lg font-medium mt-4 mb-2',
  };

  const HeadingComponent = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id =
      typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        : undefined;

    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <Tag
        id={id}
        className={`${sizes[level]} text-white tracking-tight`}
        {...(props as Record<string, unknown>)}
      >
        {id && (
          <a
            href={`#${id}`}
            className="absolute -ml-8 opacity-0 hover:opacity-100 text-zinc-500 hover:text-white transition-opacity"
            aria-label={`Link to ${typeof children === 'string' ? children : 'section'}`}
          >
            #
          </a>
        )}
        {children}
      </Tag>
    );
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

/**
 * Custom MDX component mappings for the blog engine.
 * Provides styled code blocks, optimized images, styled links, and headings with anchors.
 */
export const mdxComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  code: CodeBlock,
  pre: Pre,
  img: MDXImage as unknown as React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>,
  a: MDXLink,
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 text-zinc-300 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc text-zinc-300 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal text-zinc-300 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-zinc-700 pl-4 italic text-zinc-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-zinc-800" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-zinc-300" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-zinc-700 bg-zinc-800 px-4 py-2 text-left font-semibold text-white"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-zinc-800 px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

export default mdxComponents;
