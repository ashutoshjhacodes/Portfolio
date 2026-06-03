'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

/**
 * About section with two-column layout:
 * Left column: Professional summary narrative
 * Right column: Expertise area chips/tags
 *
 * All technologies and experience referenced are sourced from Resume_Data.
 * Word count: ~95 words (within 50-200 range).
 */

const expertiseAreas = [
  'Enterprise Architecture',
  'Performance Optimization',
  'AI Engineering',
  'Technical Leadership',
  'Component Libraries',
  'Web Vitals',
];

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Ashutosh Jha"
      className="mx-auto max-w-6xl px-4 py-16 md:py-20 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          variants={staggerItem}
          className="mb-8 font-heading text-heading font-bold text-text-primary"
        >
          About
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          {/* Left column: Professional summary */}
          <motion.div variants={staggerItem}>
            <p className="text-body-responsive leading-relaxed text-text-secondary">
              With over{' '}
              <span className="font-medium text-text-primary">
                5 years of enterprise frontend engineering
              </span>{' '}
              experience, I specialize in building high-performance, scalable web
              applications using React, TypeScript, and GraphQL. I&apos;ve architected
              platforms serving Fortune 500 companies across 60+ countries, from
              corporate real estate suites handling 100K+ data rows to AI-powered
              document processing pipelines achieving 98.6% accuracy.
            </p>
            <p className="mt-4 text-body-responsive leading-relaxed text-text-secondary">
              My work spans automotive and fleet management at{' '}
              <span className="font-medium text-text-primary">Avis Budget Group</span>{' '}
              and banking applications at{' '}
              <span className="font-medium text-text-primary">TCS</span> for{' '}
              <span className="font-medium text-text-primary">DSB Bank</span>. I focus
              on component-driven development, performance optimization, and creating
              reusable systems that accelerate team delivery.
            </p>
          </motion.div>

          {/* Right column: Expertise chips */}
          <motion.div variants={staggerItem}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Core Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {expertiseAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors duration-300 hover:border-primary-accent hover:text-primary-accent"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
