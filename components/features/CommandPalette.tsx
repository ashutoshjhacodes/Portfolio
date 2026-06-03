'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { search, SearchResult } from '@/lib/search-index';

const typeIcons: Record<SearchResult['type'], string> = {
  section: '📄',
  project: '🚀',
  skill: '⚡',
  blog: '📝',
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Open/close handlers
  const openPalette = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    setQuery('');
    setResults([]);
    setActiveIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setActiveIndex(0);

    // Return focus to previously focused element
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      previousFocusRef.current.focus();
    }
  }, []);

  // Handle keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openPalette, closePalette]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the element is rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Perform search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }

    const searchResults = search(query);
    setResults(searchResults);
    setActiveIndex(0);
  }, [query]);

  // Handle result selection
  const handleSelect = useCallback(
    (result: SearchResult) => {
      closePalette();

      if (result.href.startsWith('#')) {
        // Scroll to section
        const target = document.querySelector(result.href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to page
        window.location.href = result.href;
      }
    },
    [closePalette]
  );

  // Handle keyboard navigation within the palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (results.length > 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closePalette();
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, results.length]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePalette();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          {/* Palette container */}
          <motion.div
            className="relative w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <svg
                className="h-5 w-5 text-[var(--secondary)] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search sections, projects, skills..."
                className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--secondary)] outline-none text-sm"
                aria-label="Search"
                aria-activedescendant={
                  results.length > 0 ? `command-palette-item-${activeIndex}` : undefined
                }
                aria-controls="command-palette-results"
                aria-expanded={results.length > 0}
                role="combobox"
                aria-autocomplete="list"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--secondary)] font-mono">
                Esc
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-72 overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[var(--secondary)]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {results.length > 0 && (
                <ul
                  ref={listRef}
                  id="command-palette-results"
                  role="listbox"
                  className="py-2"
                >
                  {results.map((result, index) => (
                    <li
                      key={result.id}
                      id={`command-palette-item-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        index === activeIndex
                          ? 'bg-[var(--muted)] text-[var(--foreground)]'
                          : 'text-[var(--secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                      }`}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span className="text-base shrink-0" aria-hidden="true">
                        {typeIcons[result.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-[var(--secondary)] truncate">
                          {result.section}
                        </div>
                      </div>
                      <span className="text-xs text-[var(--secondary)] capitalize shrink-0">
                        {result.type}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="flex items-center gap-4 border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--secondary)]">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border)] px-1 py-0.5 font-mono">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border)] px-1 py-0.5 font-mono">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border)] px-1 py-0.5 font-mono">esc</kbd>
                  close
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
