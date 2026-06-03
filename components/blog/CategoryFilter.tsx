'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
  activeCategory?: string;
}

/**
 * Client component for filtering blog posts by category.
 * Uses URL search params for category state so it works with RSC.
 */
export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCategoryClick(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (category === null || category === activeCategory) {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : '/blog');
  }

  return (
    <nav aria-label="Blog categories" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <button
            onClick={() => handleCategoryClick(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              !activeCategory
                ? 'bg-foreground text-background'
                : 'bg-muted text-secondary hover:text-foreground'
            }`}
            aria-pressed={!activeCategory}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => handleCategoryClick(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeCategory === category
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-secondary hover:text-foreground'
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
