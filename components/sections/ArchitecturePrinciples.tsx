'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHoverElevation } from '@/lib/animations';
import { resumeData } from '@/lib/resume-data';

export default function ArchitecturePrinciples() {
  return (
    <section
      id="architecture"
      aria-label="Architecture Principles"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-heading font-bold text-text-primary tracking-tight mb-12 text-center">
          Architecture Principles
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {resumeData.principles.map((principle) => (
            <motion.article
              key={principle.title}
              variants={staggerItem}
              whileHover={cardHoverElevation}
              className="flex flex-col bg-[rgba(26,34,52,0.6)] backdrop-blur border border-[rgba(255,255,255,0.06)] rounded-xl p-6 hover:border-primary-accent/40 transition-colors"
            >
              {/* Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary-accent"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>

              {/* Title */}
              <h3 className="text-card-title font-semibold text-text-primary mt-3">
                {principle.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary mt-2 line-clamp-3 flex-1">
                {principle.description}
              </p>

              {/* Tech badge */}
              <span className="mt-4 inline-block rounded-full bg-surface border border-border px-3 py-1 text-xs text-text-secondary self-start">
                {principle.relatedTech}
              </span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
