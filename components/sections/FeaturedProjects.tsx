'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHoverElevation } from '@/lib/animations';
import { resumeData, Project } from '@/lib/resume-data';
import ProjectDetailModal from '@/components/ui/ProjectDetailModal';

/**
 * FeaturedProjects section displaying premium project cards in a grid layout.
 * CIPHER AI Platform is displayed first with a flagship indicator (accent border + badge).
 * Each card shows a visual placeholder area, problem statement, tech stack, and a "View Details" button.
 * Clicking "View Details" opens the ProjectDetailModal with full project data.
 *
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 14.3
 */
export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sort projects: flagship first, then others in original order
  const projects = [...resumeData.projects].sort((a, b) => {
    if (a.isFlagship && !b.isFlagship) return -1;
    if (!a.isFlagship && b.isFlagship) return 1;
    return 0;
  });

  return (
    <section
      id="projects"
      aria-label="Featured Projects"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          variants={staggerItem}
          className="text-heading font-bold text-text-primary tracking-tight mb-12 text-center"
        >
          Featured Projects
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              variants={staggerItem}
              whileHover={cardHoverElevation}
              className={`relative glass-card border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden transition-all hover:border-primary-accent/30 ${
                project.isFlagship ? 'border-l-4 border-l-primary-accent' : ''
              }`}
            >
              {/* Flagship badge */}
              {project.isFlagship && (
                <span className="absolute top-4 right-4 z-10 bg-primary-accent text-white text-xs px-2 py-1 rounded font-semibold">
                  Flagship
                </span>
              )}

              {/* Content area */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-card-title font-bold text-text-primary mb-2">
                  {project.title}
                </h3>

                {/* Project description */}
                {project.description && (
                  <p className="text-base text-text-secondary mb-3">
                    {project.description}
                  </p>
                )}

                {/* Role */}
                {project.role && (
                  <p className="text-sm text-primary-accent font-medium mb-4">
                    {project.role}
                  </p>
                )}

                {/* Impact outcomes (first 3) */}
                {project.outcomes.length > 0 && (
                  <ul className="mb-4 space-y-1.5">
                    {project.outcomes.slice(0, 3).map((outcome, i) => (
                      <li
                        key={i}
                        className="text-sm text-text-secondary leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-accent"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech stack chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block px-2 py-1 text-xs font-medium text-text-secondary bg-surface border border-[rgba(255,255,255,0.08)] rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action links */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-accent transition-colors"
                      aria-label={`GitHub repository for ${project.title}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-accent transition-colors"
                      aria-label={`Live demo for ${project.title}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>

                {/* View Details button */}
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-accent border border-primary-accent/30 rounded-lg hover:bg-primary-accent/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`View details for ${project.title}`}
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  View Details
                  <svg
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
