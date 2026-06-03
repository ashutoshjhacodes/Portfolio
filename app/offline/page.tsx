'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        {/* Offline icon */}
        <div className="mb-8 flex justify-center">
          <svg
            className="h-24 w-24 text-[var(--secondary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          You&apos;re Offline
        </h1>

        <p className="mb-8 text-[var(--secondary)]">
          It looks like you&apos;ve lost your internet connection. Some pages you&apos;ve
          previously visited may still be available.
        </p>

        {/* Navigation to cached pages */}
        <nav aria-label="Cached pages navigation">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--secondary)]">
            Try these cached pages
          </h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className="block rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--foreground)]/20"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="block rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--foreground)]/20"
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--card)]"
          aria-label="Retry loading the page"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
}
