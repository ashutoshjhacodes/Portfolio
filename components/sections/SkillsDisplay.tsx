'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { resumeData } from '@/lib/resume-data';

export default function SkillsDisplay() {
  return (
    <section
      id="skills"
      aria-label="Technical Skills"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-heading font-bold text-text-primary tracking-tight mb-12 text-center">
          Technical Skills
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resumeData.skills.map((category) => (
            <motion.div
              key={category.category}
              variants={staggerItem}
              className="bg-[rgba(26,34,52,0.6)] backdrop-blur border border-[rgba(255,255,255,0.08)] rounded-xl p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary hover:bg-primary-accent/10 hover:border-primary-accent hover:text-primary-accent transition-all duration-300 cursor-default"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
