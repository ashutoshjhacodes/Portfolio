'use client';

// components/features/CareerStoryGenerator.tsx
// Career Story Generator with premium styling, gradient button, animated result card,
// and loading/error states.
// Requirements: 11.1, 11.2, 11.3, 11.4, 11.5

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideUp, useReducedMotion } from '@/lib/animations';
import { validateCareerStoryInput } from '@/lib/utils/validation';

interface CareerStoryResult {
  narrative: string;
  wordCount: number;
  unrepresentedAreas: string[];
}

export default function CareerStoryGenerator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CareerStoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const prefersReducedMotion = useReducedMotion();

  const handleGenerate = useCallback(async () => {
    setValidationError(null);
    setError(null);
    setResult(null);

    // Validate input (2-500 characters)
    const validation = validateCareerStoryInput(input);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/career-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: input.trim() }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 200) {
        setError(data.error || 'Career story generation is temporarily unavailable');
        return;
      }

      // Handle insufficient experience response (comes as 200 with error code)
      if (data.code === 'INSUFFICIENT_EXPERIENCE') {
        setError(data.error);
        return;
      }

      // Success - display narrative
      setResult({
        narrative: data.narrative,
        wordCount: data.wordCount,
        unrepresentedAreas: data.unrepresentedAreas || [],
      });
    } catch {
      setError('Career story generation is temporarily unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <section id="career-story" className="w-full" aria-labelledby="career-story-heading">
      <motion.div
        {...(prefersReducedMotion ? {} : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.2 }, variants: slideUp })}
        className="mx-auto max-w-3xl glass-card border-t-2 border-t-primary-accent p-6 md:p-8"
      >
        <h2
          id="career-story-heading"
          className="mb-4 text-heading font-bold text-text-primary tracking-tight"
        >
          Career Story Generator
        </h2>
        <p className="mb-8 text-text-secondary text-base">
          Powered by AI — enter a target role or company to generate a tailored career narrative showcasing relevant experience.
        </p>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <label htmlFor="career-story-input" className="sr-only">
                Role or company context
              </label>
              <textarea
                id="career-story-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setValidationError(null);
                  setError(null);
                }}
                placeholder="e.g., Senior Frontend Engineer at Stripe, React Lead at Netflix..."
                className="w-full min-h-[120px] bg-[rgba(26,34,52,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 text-text-primary placeholder-text-secondary/50 focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/20 focus:outline-none transition-colors resize-y"
                disabled={isLoading}
                maxLength={500}
                aria-describedby="career-story-char-count"
                aria-invalid={!!validationError}
              />
              <div className="mt-2 flex items-center justify-between">
                <span id="career-story-char-count" className="text-xs text-text-secondary">
                  {input.length}/500 characters
                </span>
                {validationError && (
                  <span className="text-xs text-yellow-400" role="alert">
                    {validationError}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-semibold rounded-full px-8 py-3 hover:brightness-110 hover:shadow-lg hover:shadow-primary-accent/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-background whitespace-nowrap"
                aria-label="Generate career story"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Story'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-[rgba(26,34,52,0.6)] backdrop-blur-[12px] border border-red-500/30 rounded-xl p-4"
              role="alert"
            >
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-[rgba(26,34,52,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] rounded-xl p-6"
              aria-label="Generating career narrative"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-primary-accent/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-secondary-accent/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm text-text-secondary">Generating tailored career narrative...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-[rgba(26,34,52,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] rounded-xl p-6"
            >
              {/* Result heading */}
              <h3 className="text-text-primary font-bold text-lg mb-4">Your Career Story</h3>

              {/* Word count badge */}
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(26,34,52,0.8)] px-3 py-1 text-xs text-text-secondary">
                  {result.wordCount} words
                </span>
                {result.unrepresentedAreas.length > 0 && (
                  <span className="rounded-full border border-yellow-800/50 bg-yellow-900/20 px-3 py-1 text-xs text-yellow-400">
                    Some areas not in resume
                  </span>
                )}
              </div>

              {/* Narrative content */}
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {result.narrative}
                </p>
              </div>

              {/* Unrepresented areas notice */}
              {result.unrepresentedAreas.length > 0 && (
                <div className="mt-4 rounded-lg border border-yellow-800/30 bg-yellow-900/10 p-3">
                  <p className="text-xs text-yellow-400">
                    <strong>Note:</strong> The following areas from your query are not represented in Ashutosh&apos;s background:{' '}
                    {result.unrepresentedAreas.join(', ')}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
