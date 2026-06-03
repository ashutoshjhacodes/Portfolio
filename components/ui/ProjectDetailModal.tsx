'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/resume-data';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap: get all focusable elements within the modal
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!modalRef.current) return [];
    const elements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return Array.from(elements);
  }, []);

  // Handle keyboard events (Escape to close, Tab trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, getFocusableElements]);

  // Focus management: focus modal on open, restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Delay focus to allow animation to start
      requestAnimationFrame(() => {
        modalRef.current?.focus();
      });
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              className="glass-card relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text-primary)]"
                aria-label="Close modal"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Project Title */}
              <h2
                id="project-modal-title"
                className="pr-10 text-[var(--font-card-title)] font-bold leading-tight text-[var(--text-primary)]"
                style={{ fontSize: 'var(--font-card-title)' }}
              >
                {project.title}
              </h2>

              {/* Tech Stack */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Challenges Section */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--primary-accent)]">
                  Challenges
                </h3>
                <ul className="mt-2 space-y-2">
                  {project.challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary-accent)]" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes Section */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary-accent)]">
                  Outcomes
                </h3>
                <ul className="mt-2 space-y-2">
                  {project.outcomes.map((outcome, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--secondary-accent)]" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics Section (optional) */}
              {project.metrics && Object.keys(project.metrics).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Impact Metrics
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[var(--surface)] p-3 text-center"
                      >
                        <div className="text-lg font-bold text-[var(--primary-accent)]">
                          {value}
                        </div>
                        <div className="mt-1 text-xs text-[var(--text-secondary)]">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
