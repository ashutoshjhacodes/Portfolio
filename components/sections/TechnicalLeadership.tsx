'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHoverElevation } from '@/lib/animations';

/**
 * Leadership areas showcasing technical leadership capabilities.
 * Each area features an icon, title, and impact-focused description.
 */
const leadershipAreas = [
  {
    id: 'architecture-design',
    title: 'Architecture Design',
    description:
      'Designing scalable frontend architectures for enterprise platforms serving 60+ countries',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'team-enablement',
    title: 'Team Enablement',
    description:
      'Building shared component libraries and establishing coding standards across 5+ modules',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="8" cy="22" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="22" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 12L23 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'performance-engineering',
    title: 'Performance Engineering',
    description:
      'Optimizing Core Web Vitals and implementing high-performance data grids at 100K+ rows',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M13 4L7 18H15L13 28L25 14H17L19 4H13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    description:
      'Orchestrating multi-agent AI pipelines and integrating AI tools into development workflows',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M16 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 22V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 16H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 16H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7.5 7.5L11.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20.5 20.5L24.5 24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7.5 24.5L11.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20.5 11.5L24.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function TechnicalLeadership() {
  return (
    <section
      id="technical-leadership"
      aria-label="Technical Leadership"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-heading font-bold text-text-primary tracking-tight mb-12 text-center">
          Technical Leadership
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {leadershipAreas.map((area) => (
            <motion.div
              key={area.id}
              variants={staggerItem}
              whileHover={cardHoverElevation}
              className="bg-[rgba(26,34,52,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] rounded-xl p-6"
            >
              <div className="text-primary-accent w-8 h-8">
                {area.icon}
              </div>
              <h3 className="text-card-title font-bold text-text-primary mt-4">
                {area.title}
              </h3>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                {area.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
