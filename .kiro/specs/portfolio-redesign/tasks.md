# Implementation Plan: Portfolio Redesign

## Overview

Transform the existing portfolio from a generic dark template into a premium, world-class engineering portfolio. The implementation follows a foundation-first approach: update design tokens and animation utilities, then create new UI primitives, then restyle all section components in parallel. No new dependencies are added; all content, routing, and data remain unchanged.

## Tasks

- [x] 1. Foundation Layer — Design Tokens, Theme, and Animation Utilities
  - [x] 1.1 Update globals.css with premium color tokens and utility classes
    - Replace existing CSS custom properties with new palette: --background (#0B1020), --surface (#111827), --card (#1A2234), --primary-accent (#14B8A6), --secondary-accent (#3B82F6), --text-primary (#F8FAFC), --text-secondary (#94A3B8), --border (rgba(255,255,255,0.08))
    - Add typography scale CSS variables using clamp: --font-hero, --font-heading, --font-card-title, --font-body
    - Add glassmorphism utility class (.glass-card with backdrop-filter, semi-transparent bg, rgba border)
    - Add gradient mesh keyframe animation (@keyframes gradient-float with translate/scale transforms)
    - Add 8px grid spacing utilities
    - Add @media (prefers-reduced-motion: reduce) rules to disable keyframe animations
    - Maintain backward-compatible aliases for old token names during migration
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8, 2.5, 14.4, 19.1, 19.4, 19.6_

  - [x] 1.2 Update tailwind.config.ts with expanded theme tokens
    - Map new CSS custom properties to Tailwind color tokens: bg-background, bg-surface, bg-card, text-primary, text-secondary, border-border, accent-primary, accent-secondary
    - Add typography scale to fontFamily and fontSize extensions
    - Add spacing tokens aligned to 8px grid system
    - Add responsive breakpoints confirmation (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
    - _Requirements: 1.1, 1.5, 1.6, 2.1, 2.8, 15.3, 18.3, 19.6_

  - [x] 1.3 Enhance lib/animations.ts with new Framer Motion variants
    - Add cardHoverElevation variant (translateY: -6px, boxShadow increase, border color accent at 30% opacity)
    - Add staggerContainer and staggerItem variants (120ms stagger delay, fadeIn + slideUp children)
    - Add counterAnimation helper utility for animated number counting
    - Add gradient sweep animation variant for border effects
    - Enhance useReducedMotion hook to return disabled/static variants when motion is reduced
    - Keep all transition durations between 200ms and 500ms for interactive elements
    - _Requirements: 14.1, 14.2, 14.3, 14.5, 14.6, 14.7, 14.8_

- [x] 2. New UI Components
  - [x] 2.1 Create components/ui/GradientMeshBackground.tsx
    - Implement client component with 'use client' directive
    - Render three overlapping radial gradient divs with offset CSS keyframe animation timing
    - Use primary-accent and secondary-accent at 10-20% opacity
    - Add aria-hidden="true" for accessibility (decorative element)
    - Respect prefers-reduced-motion by disabling animation
    - _Requirements: 3.1, 14.4, 14.6, 16.6, 17.4_

  - [x] 2.2 Create components/ui/FloatingParticles.tsx
    - Implement client component with lightweight CSS-only floating dots
    - Use minimal particle density (avoid distraction)
    - Add aria-hidden="true" for accessibility
    - Disable animation when prefers-reduced-motion is active
    - _Requirements: 3.2, 14.6, 14.7, 16.6_

  - [x] 2.3 Create components/ui/ProjectDetailModal.tsx
    - Implement client component using Framer Motion AnimatePresence for enter/exit
    - Implement focus trap for accessibility (trap focus within modal when open)
    - Add Escape key handler to close modal
    - Apply aria-modal="true", role="dialog", aria-labelledby pointing to project title
    - Render project details: problem statement, solution, impact metrics, tech stack
    - Style with glassmorphism card pattern and design tokens
    - _Requirements: 9.5, 16.2, 16.5_

- [x] 3. Checkpoint — Foundation Verification
  - Ensure all foundation files compile without errors and existing tests still pass. Ask the user if questions arise.

- [x] 4. Hero and Impact Sections
  - [x] 4.1 Restyle components/sections/HeroSection.tsx
    - Integrate GradientMeshBackground as background layer
    - Integrate FloatingParticles with minimal density
    - Apply hero typography scale (72-96px responsive) to name
    - Style professional title, subtitle, and CTA buttons with accent gradients
    - Add location, experience, and company as styled badges
    - Apply gradient border ring effect to profile image
    - Implement responsive vertical stacking on mobile with reduced font sizes
    - Ensure no pure black background
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 15.6_

  - [x] 4.2 Restyle components/sections/ImpactDashboard.tsx
    - Apply glassmorphism card styling to each stat card (backdrop-blur, semi-transparent bg)
    - Add primary-accent or secondary-accent colored top border to each card
    - Implement card hover elevation animation using cardHoverElevation variant
    - Wire AnimatedCounter with counting animation (requestAnimationFrame count from 0)
    - Display final values immediately when reduced motion is active
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 14.5_

  - [x] 4.3 Enhance components/ui/AnimatedCounter.tsx
    - Implement requestAnimationFrame-based counting from 0 to target value
    - Respect useReducedMotion preference (show final value immediately)
    - Ensure smooth easing during count animation
    - _Requirements: 4.4, 4.5, 14.5, 14.6_

- [x] 5. Content Sections — About, Leadership, and Architecture
  - [x] 5.1 Restyle components/sections/AboutSection.tsx
    - Implement two-column grid layout: professional summary left, expertise indicators right
    - Style expertise areas as interactive chips/tags with hover accent transition
    - Apply text-secondary for body text, text-primary for emphasis
    - Stack columns vertically below 768px (mobile-first responsive)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 15.6_

  - [x] 5.2 Restyle components/sections/TechnicalLeadership.tsx
    - Implement 2x2 grid of premium cards on desktop
    - Add relevant icons to each leadership area card
    - Apply hover elevation animation (translateY + increased box-shadow)
    - Switch to single-column stacked layout on mobile
    - Ensure minimum 24px gap between cards
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 14.3_

  - [x] 5.3 Restyle components/sections/ArchitecturePrinciples.tsx
    - Implement responsive grid: 4 columns on xl, 2 columns on md, 1 column on mobile
    - Style each card with icon, short title, brief explanation, and tech badge
    - Add hover elevation with primary-accent border highlight
    - Implement stagger reveal animation on scroll using staggerContainer/staggerItem
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 14.2_

- [x] 6. Timeline, Projects, and AI Sections
  - [x] 6.1 Restyle components/sections/ExperienceTimeline.tsx
    - Render vertical timeline with visible connecting line (using accent or border color)
    - Display company name, role, duration, accomplishments per entry
    - Style company logo placeholder or badge for each entry
    - Implement scroll reveal animation per entry
    - Alternate entry placement left/right on desktop (>1024px)
    - Single-column layout below 1024px
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 14.1_

  - [x] 6.2 Restyle components/sections/FeaturedProjects.tsx
    - Style as premium cards with visual placeholder area + content area
    - Remove any accordion-style collapsed views
    - Display problem statement, solution, impact metrics, tech stack per card
    - Add hover elevation + border glow effects
    - Wire ProjectDetailModal for expand/detail view
    - Apply flagship indicator (accent border/badge) to CIPHER AI Platform project
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 14.3_

  - [x] 6.3 Restyle components/sections/AIEngineering.tsx
    - Style cards with subtle AI-themed gradient borders for each tool (ChatGPT, Claude, Amazon Q, Kiro)
    - Add modern icon or logo representation per AI tool
    - Implement hover gradient sweep or glow border animation
    - Display workflow and outcome information in structured format
    - Maintain professional tone — no neon/hacker aesthetics
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 19.2_

- [x] 7. Checkpoint — Section Components Verification
  - Ensure all section components render without errors and existing tests still pass. Ask the user if questions arise.

- [x] 8. Interactive and Skills Sections
  - [x] 8.1 Restyle components/features/CareerStoryGenerator.tsx
    - Apply premium border styling to text input area
    - Style submit button with gradient (primary-accent → secondary-accent)
    - Add entrance animation to result card using Framer Motion
    - Maintain consistent Card_Component styling with design system
    - Add loading state with subtle animation feedback
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 8.2 Restyle components/sections/SkillsDisplay.tsx
    - Group skills into clusters: Frontend, Cloud/Infrastructure, AI/ML, Architecture
    - Render each skill as interactive chip with hover accent-colored background/border
    - Visually distinguish categories using section sub-headings or grouped containers
    - Use responsive flow layout that wraps chips naturally
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 8.3 Restyle components/sections/ContactSection.tsx
    - Add prominent aspirational heading ("Let's Build Something Exceptional" or similar)
    - Add subtle background gradient pattern distinct from other sections
    - Style email, GitHub, LinkedIn links as interactive elements
    - Add hover accent color transition on links
    - Apply generous vertical spacing for visual breathing room
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 9. Navigation and Footer
  - [x] 9.1 Update components/layout/Navigation.tsx
    - Apply surface token background color
    - Update link styling with new text tokens (text-primary for active, text-secondary for inactive)
    - Ensure consistent glassmorphism or surface treatment
    - Maintain all existing functionality and accessibility
    - _Requirements: 1.3, 16.2, 16.4_

  - [x] 9.2 Update components/layout/Footer.tsx
    - Apply updated token colors (surface background, text-secondary for content)
    - Ensure consistent spacing using 8px grid system
    - Maintain all existing links and content
    - _Requirements: 1.3, 19.6_

- [x] 10. Layout and Integration
  - [x] 10.1 Update app/layout.tsx body className
    - Update body className to use new design token classes (bg-background, text-primary)
    - Verify Inter font setup remains unchanged
    - Ensure dark class and CSS variable injection still work correctly
    - _Requirements: 1.2, 2.1, 17.3, 18.1_

- [x] 11. Final Checkpoint — Full Verification
  - Ensure all tests pass, the application builds without errors (`next build`), and the visual redesign is consistent across all sections. Ask the user if questions arise.

## Notes

- No new npm dependencies are introduced — all effects use existing Tailwind CSS, Framer Motion, and CSS
- All existing content from resume-data.ts remains unchanged
- Existing test files serve as regression guards during restyling
- The foundation layer (tasks 1.1–1.3) MUST complete before section component updates
- GradientMeshBackground and FloatingParticles must exist before HeroSection restyling
- ProjectDetailModal must exist before FeaturedProjects restyling
- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["4.1", "4.2", "4.3", "5.1", "5.2", "5.3"] },
    { "id": 3, "tasks": ["6.1", "6.2", "6.3", "8.1", "8.2", "8.3"] },
    { "id": 4, "tasks": ["9.1", "9.2", "10.1"] }
  ]
}
```
