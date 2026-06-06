'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHoverElevation } from '@/lib/animations';
import { resumeData } from '@/lib/resume-data';

export default function ImpactDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="impact"
      aria-label="Impact Metrics Dashboard"
      className="w-full py-16 md:py-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-heading font-bold text-text-primary tracking-tight mb-12 text-center">
          Engineering Impact
        </h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {resumeData.metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={staggerItem}
              whileHover={cardHoverElevation}
              className={`flex min-h-[120px] w-full flex-col items-center justify-center rounded-xl bg-[rgba(26,34,52,0.6)] px-5 py-7 text-center backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] sm:w-[calc(50%-0.75rem)] md:px-6 md:py-8 lg:w-[calc(20%-1.6rem)] ${
                index % 2 === 0
                  ? 'border-t-2 border-t-primary-accent'
                  : 'border-t-2 border-t-secondary-accent'
              }`}
            >
              <span
                className={`mb-3 font-bold text-text-primary ${
                  metric.value.length > 8 ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
                }`}
              >
                <span>{metric.value}</span>
              </span>
              <span className="text-sm text-text-secondary">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
