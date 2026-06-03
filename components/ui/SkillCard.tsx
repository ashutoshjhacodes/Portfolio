'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/animations';

interface SkillCardProps {
  name: string;
}

export default function SkillCard({ name }: SkillCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const hoverAnimation = prefersReducedMotion
    ? {}
    : { scale: 1.05, transition: { duration: 0.2, ease: 'easeOut' } };

  const tapAnimation = prefersReducedMotion
    ? {}
    : { scale: 1.05, transition: { duration: 0.2, ease: 'easeOut' } };

  return (
    <motion.div
      role="listitem"
      tabIndex={0}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      whileFocus={hoverAnimation}
      aria-label={`Skill: ${name}`}
      className="flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-3 rounded-lg bg-card border border-border cursor-default select-none"
    >
      <span className="text-sm font-medium text-foreground text-center">
        {name}
      </span>
    </motion.div>
  );
}
