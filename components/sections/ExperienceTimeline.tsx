'use client';

import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { resumeData } from '@/lib/resume-data';

export default function ExperienceTimeline() {
  return (
    <section
      id="experience"
      aria-label="Professional Experience"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-heading font-bold text-text-primary tracking-tight mb-16 text-center"
        >
          Experience
        </motion.h2>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical connecting line - centered on desktop, left on mobile */}
          <div
            className="absolute left-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 top-0 bottom-0 w-px bg-border"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {resumeData.experience.map((entry, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={entry.id}
                  variants={slideUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`relative pl-12 lg:pl-0 lg:w-full lg:flex ${
                    isEven ? 'lg:justify-start' : 'lg:justify-end'
                  }`}
                >
                  {/* Timeline dot - left on mobile, centered on desktop */}
                  <div
                    className="absolute left-[10px] lg:left-1/2 lg:transform lg:-translate-x-1/2 top-6 w-3 h-3 rounded-full bg-primary-accent z-10"
                    aria-hidden="true"
                  />

                  {/* Entry card */}
                  <div
                    className={`w-full lg:w-[calc(50%-2rem)] rounded-xl bg-[rgba(26,34,52,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] p-6 md:p-8`}
                  >
                    {/* Company badge */}
                    <span className="inline-block bg-surface border border-border rounded-full px-3 py-1 text-xs text-primary-accent font-medium mb-3">
                      {entry.company}
                    </span>

                    {/* Role */}
                    <h3 className="text-card-title font-bold text-text-primary mb-1">
                      {entry.role}
                      {entry.client && (
                        <span className="text-sm text-text-secondary font-normal ml-2">
                          · {entry.client}
                        </span>
                      )}
                    </h3>

                    {/* Period */}
                    <p className="text-sm text-text-secondary mb-4">
                      {entry.period}
                    </p>

                    {/* Achievements */}
                    {entry.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {entry.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="text-sm text-text-secondary leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-accent"
                          >
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
