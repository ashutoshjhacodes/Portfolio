import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { mdxComponents } from './MDXComponents';

interface MDXRemoteProps {
  source: string;
}

/**
 * Async Server Component that compiles and renders MDX content at build time.
 * Uses @mdx-js/mdx evaluate to compile the MDX string into a React component.
 */
export async function MDXRemote({ source }: MDXRemoteProps) {
  const { default: MDXContent } = await evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
    development: false,
  } as Parameters<typeof evaluate>[1]);

  return <MDXContent components={mdxComponents} />;
}
