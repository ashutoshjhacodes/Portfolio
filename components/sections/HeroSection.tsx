'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { resumeData } from '@/lib/resume-data';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';
import GradientMeshBackground from '@/components/ui/GradientMeshBackground';
import FloatingParticles from '@/components/ui/FloatingParticles';

const PROFILE_IMAGE_PATH = '/images/Ashutosh.png';

/** Badge display values for hero section */
const heroBadges = [
  { label: 'Bangalore, India', icon: '📍', delay: 0 },
  { label: '5+ Years', icon: '⚡', delay: 0.15 },
  { label: 'Avis Budget Group', icon: '🏢', delay: 0.3 },
];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleDownloadResume = useCallback(async () => {
    setDownloadError(null);
    try {
      const response = await fetch('/Ashutosh_India.pdf', { method: 'HEAD' });
      if (!response.ok) {
        setDownloadError('Resume could not be downloaded. Please try again later.');
        return;
      }
      const link = document.createElement('a');
      link.href = '/Ashutosh_India.pdf';
      link.download = 'Ashutosh_India.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setDownloadError('Resume could not be downloaded. Please try again later.');
    }
  }, []);

  const handleSmoothScroll = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const badgeVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : delay,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 sm:px-6 lg:px-8"
    >
      {/* Animated gradient mesh background */}
      <GradientMeshBackground />

      {/* Floating particles with minimal density */}
      <FloatingParticles />

      {/* Content container */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 sm:px-8 lg:px-16 md:flex-row md:items-center md:justify-between"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Left content */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Name - Hero Typography */}
          <motion.h1
            className="text-hero font-heading font-bold tracking-tight text-text-primary"
            variants={fadeIn}
          >
            {resumeData.personal.name}
          </motion.h1>

          {/* Professional Title */}
          <motion.p
            className="mt-4 text-xl text-text-secondary sm:text-2xl md:text-3xl"
            variants={slideUp}
          >
            {resumeData.personal.title}
          </motion.p>

          {/* Value Proposition Subtitle */}
          {resumeData.personal.subtitle && (
            <motion.p
              className="mt-3 max-w-xl text-base text-text-secondary sm:text-lg"
              variants={slideUp}
            >
              {resumeData.personal.subtitle}
            </motion.p>
          )}

          {/* Badges: Location, Experience, Company */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            aria-label="Professional highlights"
          >
            {heroBadges.map((badge) => (
              <motion.span
                key={badge.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary"
                custom={badge.delay}
                variants={badgeVariants}
              >
                <span aria-hidden="true">{badge.icon}</span>
                {badge.label}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            variants={slideUp}
          >
            <button
              onClick={() => handleSmoothScroll('projects')}
              className="touch-target inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-accent to-secondary-accent px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-primary-accent/25 hover:brightness-110 sm:text-base"
              aria-label="View projects"
            >
              View Projects
            </button>

            <button
              onClick={() => handleSmoothScroll('contact')}
              className="touch-target inline-flex items-center justify-center rounded-full border border-border bg-transparent px-8 py-3 text-sm font-semibold text-text-primary transition-colors duration-300 hover:border-primary-accent hover:text-primary-accent sm:text-base"
              aria-label="Get in touch"
            >
              Get In Touch
            </button>

            <button
              onClick={handleDownloadResume}
              className="touch-target inline-flex items-center justify-center px-4 py-3 text-sm text-text-secondary underline transition-colors duration-300 hover:text-primary-accent sm:text-base"
              aria-label="Download resume as PDF"
            >
              Download Resume
            </button>
          </motion.div>

          {/* Download Error Message */}
          {downloadError && (
            <motion.p
              className="mt-4 text-sm text-red-400"
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {downloadError}
            </motion.p>
          )}
        </div>

        {/* Right side - Profile Image with gradient border ring */}
        <motion.div
          className="flex-shrink-0"
          variants={fadeIn}
        >
          <div className="relative">
            {/* Gradient border ring */}
            <div
              className="rounded-full bg-gradient-to-r from-primary-accent to-secondary-accent p-1"
            >
              <div className="relative h-48 w-48 overflow-hidden rounded-full bg-background sm:h-56 sm:w-56 lg:h-72 lg:w-72">
                {!imageError ? (
                  <Image
                    src={PROFILE_IMAGE_PATH}
                    alt={`Profile photo of ${resumeData.personal.name}`}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 288px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-card text-4xl font-bold text-text-secondary"
                    aria-label={`Profile photo placeholder for ${resumeData.personal.name}`}
                  >
                    {resumeData.personal.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
