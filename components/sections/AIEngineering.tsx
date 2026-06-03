'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHoverElevation } from '@/lib/animations';
import { resumeData } from '@/lib/resume-data';

function getToolIcon(toolName: string) {
  switch (toolName) {
    case 'ChatGPT':
      // Chat bubble icon
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-accent"
          aria-hidden="true"
        >
          <path
            d="M6 8C6 6.89543 6.89543 6 8 6H24C25.1046 6 26 6.89543 26 8V20C26 21.1046 25.1046 22 24 22H18L12 27V22H8C6.89543 22 6 21.1046 6 20V8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          <circle cx="16" cy="14" r="1.5" fill="currentColor" />
          <circle cx="20" cy="14" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'Claude':
      // Brain/sparkle icon
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-accent"
          aria-hidden="true"
        >
          <path
            d="M16 4L18 10L24 8L20 14L26 16L20 18L24 24L18 22L16 28L14 22L8 24L12 18L6 16L12 14L8 8L14 10L16 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'Amazon Q':
      // Cloud icon
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-accent"
          aria-hidden="true"
        >
          <path
            d="M8 22C5.79086 22 4 20.2091 4 18C4 15.7909 5.79086 14 8 14C8 10.6863 10.6863 8 14 8C16.7614 8 19.1154 9.88457 19.7961 12.4023C20.1752 12.1421 20.6219 12 21.1 12C22.7016 12 24 13.2984 24 14.9C24 15.0672 23.9871 15.2314 23.9621 15.3917C26.2459 15.9353 28 17.9648 28 20.4C28 23.2719 25.7614 25.6 23 25.6H9C8.66667 25.6 8.33333 25.5333 8 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'Kiro':
      // Code brackets icon
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-accent"
          aria-hidden="true"
        >
          <path
            d="M10 8L5 16L10 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 8L27 16L22 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 6L14 26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function AIEngineering() {
  const { aiTools } = resumeData;

  return (
    <section
      id="ai-engineering"
      aria-label="AI Engineering"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          variants={staggerItem}
          className="text-heading font-bold text-text-primary tracking-tight text-center mb-12"
        >
          AI Engineering
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {aiTools.map((tool) => (
            <motion.div
              key={tool.name}
              variants={staggerItem}
              whileHover={cardHoverElevation}
              className="bg-gradient-to-br from-[rgba(20,184,166,0.05)] to-[rgba(59,130,246,0.05)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 hover:border-primary-accent/30 transition-all duration-300"
              role="article"
              aria-label={tool.name}
            >
              {getToolIcon(tool.name)}

              <h3 className="text-card-title font-semibold text-text-primary mt-3">
                {tool.name}
              </h3>

              <div className="mt-3">
                <span className="text-xs uppercase tracking-wider text-primary-accent font-semibold">
                  Workflow
                </span>
                <p className="text-sm text-text-secondary mt-1">
                  {tool.workflow}
                </p>
              </div>

              <div className="mt-2">
                <span className="text-xs uppercase tracking-wider text-primary-accent font-semibold">
                  Outcome
                </span>
                <p className="text-sm text-text-secondary mt-1">
                  {tool.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
