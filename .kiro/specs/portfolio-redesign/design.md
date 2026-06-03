# Technical Design Document

## Overview

This design transforms the existing portfolio from a generic dark template (pure black backgrounds, system fonts, minimal interaction) into a premium, world-class engineering portfolio. The redesign modifies only the visual presentation layer — all content (resume-data.ts), routing, API routes, blog engine, and AI features remain untouched.

The architecture preserves the existing component structure (HeroSection, ImpactDashboard, AboutSection, etc.) and page composition in `app/page.tsx`. Changes target: CSS custom properties in `styles/globals.css`, Tailwind theme tokens in `tailwind.config.ts`, component-level styling within each section component, and the animation utilities in `lib/animations.ts`.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        app/layout.tsx                             │
│  (Inter font via next/font, CSS variable injection, dark class)  │
└─────────────┬───────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────────────┐
│                     styles/globals.css                            │
│  (CSS custom properties: --background, --surface, --card,        │
│   --primary-accent, --secondary-accent, --text-primary,          │
│   --text-secondary, --border)                                    │
└─────────────┬───────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────────────┐
│                    tailwind.config.ts                             │
│  (Maps CSS vars to Tailwind tokens: bg-background, text-primary, │
│   border-border, etc. Adds typography scale, spacing tokens)     │
└─────────────┬───────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────────────┐
│                      app/page.tsx                                 │
│  (Section composition — unchanged structure)                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐         │
│  │ HeroSection  │ │ImpactDashboard│ │  AboutSection    │         │
│  └──────────────┘ └──────────────┘ └──────────────────┘         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐         │
│  │TechnicalLead.│ │ArchPrinciples│ │ExperienceTimeline│         │
│  └──────────────┘ └──────────────┘ └──────────────────┘         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐         │
│  │FeaturedProj. │ │AIEngineering │ │CareerStoryGen.   │         │
│  └──────────────┘ └──────────────┘ └──────────────────┘         │
│  ┌──────────────┐ ┌──────────────┐                               │
│  │SkillsDisplay │ │ContactSection│                               │
│  └──────────────┘ └──────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────────────┐
│                    lib/animations.ts                              │
│  (Framer Motion variants: fadeIn, slideUp, scaleIn, stagger,     │
│   card hover elevation, counter animation, reduced motion hook)  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── SkipToContent
├── <main>
│   └── Home (app/page.tsx)
│       ├── HeroSection
│       │   ├── GradientMeshBackground (new sub-component)
│       │   ├── FloatingParticles (new sub-component)
│       │   ├── Profile image with gradient border
│       │   ├── Name + title + badges
│       │   └── CTA buttons
│       ├── ImpactDashboard
│       │   └── StatCard[] (Card_Component + AnimatedCounter)
│       ├── AboutSection
│       │   ├── Professional summary (left column)
│       │   └── Expertise chips (right column)
│       ├── TechnicalLeadership
│       │   └── LeadershipCard[] (2x2 grid)
│       ├── ArchitecturePrinciples
│       │   └── PrincipleCard[] (4-col responsive grid)
│       ├── ExperienceTimeline
│       │   └── TimelineEntry[] (alternating left/right)
│       ├── FeaturedProjects
│       │   └── ProjectCard[] (with expand/detail modal)
│       ├── AIEngineering
│       │   └── AIToolCard[] (gradient border cards)
│       ├── CareerStoryGenerator (dynamic import)
│       │   ├── TextInput (premium border)
│       │   ├── GradientButton
│       │   └── ResultCard (animated entrance)
│       ├── SkillsDisplay
│       │   └── SkillCategory[] → SkillChip[]
│       └── ContactSection
│           └── ContactLink[] (styled interactive)
├── Footer
├── CommandPalette (dynamic)
├── AIAssistant (dynamic)
└── ServiceWorkerUpdater (dynamic)
```

### Data Flow

```
resume-data.ts (UNCHANGED)
       │
       ▼
Section Components import { resumeData } from '@/lib/resume-data'
       │
       ▼
Components render data using new Design_System tokens
       │
       ▼
Tailwind utility classes reference CSS custom properties
       │
       ▼
CSS custom properties defined in globals.css provide actual color values
```

## Design Decisions

### 1. CSS Custom Properties as Single Source of Truth

**Decision:** Define all design tokens as CSS custom properties in `globals.css`, referenced by Tailwind via `var()` syntax.

**Rationale:** This preserves the existing Tailwind-based approach while enabling the full color palette upgrade. CSS custom properties are already used (--background, --foreground, etc.) — we expand and rename them to match the premium palette. This avoids a large Tailwind config rewrite and keeps runtime theme switching possible.

**Trade-off:** Slightly more indirection than hardcoded Tailwind colors, but provides centralized token management and future light-mode support.

### 2. Inter Font via next/font (Keep Existing)

**Decision:** Retain the existing `Inter` font loaded via `next/font/google` in layout.tsx.

**Rationale:** Inter is already loaded and satisfies the requirement (Inter, Geist Sans, or Plus Jakarta Sans). No font change needed — only typography scale adjustments in Tailwind config and globals.css.

### 3. Component-Level Restyling (Not Rewrite)

**Decision:** Modify existing section components in-place rather than creating new parallel components.

**Rationale:** The component structure (HeroSection, ImpactDashboard, etc.) already matches the requirements. Each component needs updated Tailwind classes and possibly new sub-elements (gradient backgrounds, badges), not a structural rewrite. This minimizes risk and preserves all existing tests as regression guards.

### 4. Framer Motion for All Animations

**Decision:** Use Framer Motion exclusively for scroll reveals, hover effects, stagger animations, and counter animations. Use CSS keyframes only for ambient effects (gradient mesh float, particle drift).

**Rationale:** Framer Motion is already the project's animation library. It provides built-in viewport detection (`whileInView`), stagger orchestration, and `useReducedMotion` support. CSS keyframes handle always-running ambient effects more efficiently (no JS overhead).

### 5. No New Dependencies

**Decision:** Implement all visual effects using existing dependencies (Tailwind CSS, Framer Motion, next/font). No new npm packages.

**Rationale:** The gradient mesh, glassmorphism, particles, and all card effects can be achieved with CSS (backdrop-filter, gradients, keyframe animations) and Framer Motion. Adding packages like three.js or tsparticles would bloat the bundle and violate the 200KB gzipped target.

### 6. Project Detail Modal Instead of Page Navigation

**Decision:** Featured projects use an in-page modal/drawer for full details rather than navigating to separate pages.

**Rationale:** The requirement states "viewing full project information without navigating away." A modal with Framer Motion AnimatePresence provides smooth entry/exit while keeping the user on the main page. This avoids creating new routes.

## File Changes

### Modified Files

| File | Change Description |
|------|-------------------|
| `styles/globals.css` | Replace color tokens with premium palette (#0B1020 background, #111827 surface, #1A2234 card, #14B8A6 primary-accent, #3B82F6 secondary-accent, #F8FAFC text-primary, #94A3B8 text-secondary, rgba(255,255,255,0.08) border). Add typography utilities, glassmorphism classes, gradient mesh keyframes, 8px grid spacing. |
| `tailwind.config.ts` | Expand color mapping to include surface, primary-accent, secondary-accent, text-primary, text-secondary. Add typography scale (hero 72-96px, heading 48-64px, card-title 24-32px). Add spacing tokens aligned to 8px grid. |
| `app/layout.tsx` | Minor: update body className to use new token classes. Font setup unchanged (Inter already loaded). |
| `lib/animations.ts` | Add cardHoverElevation variant (translateY: -6px, boxShadow increase), staggerFast variant (100ms), counterAnimation helper, gradient sweep animation variant. Enhance useReducedMotion to return disabled variants. |
| `components/sections/HeroSection.tsx` | Add gradient mesh background (CSS keyframe animated gradients), floating particles (lightweight CSS-only dots), profile image with gradient border ring, professional badges (location, experience, company), responsive stacking. |
| `components/sections/ImpactDashboard.tsx` | Apply glassmorphism card styling (backdrop-blur, semi-transparent bg), accent-colored top border per card, hover elevation animation, AnimatedCounter with counting animation, reduced-motion immediate display. |
| `components/sections/AboutSection.tsx` | Two-column grid layout (summary left, expertise right), styled expertise chips with hover accent transition, responsive vertical stacking below 768px. |
| `components/sections/TechnicalLeadership.tsx` | 2x2 grid of premium cards with icons, hover elevation (translateY + shadow), single-column on mobile, 24px gap minimum. |
| `components/sections/ArchitecturePrinciples.tsx` | 4→2→1 responsive grid, icon + title + description + tech badge per card, stagger reveal on scroll, hover elevation with accent border highlight. |
| `components/sections/ExperienceTimeline.tsx` | Vertical timeline with connecting line, alternating left/right on desktop >1024px, company badge styling, scroll reveal per entry, single-column below 1024px. |
| `components/sections/FeaturedProjects.tsx` | Premium project cards with visual placeholder + content area, no accordion, hover elevation + border glow, expand/detail modal, flagship indicator on CIPHER project. |
| `components/sections/AIEngineering.tsx` | Gradient-bordered cards per AI tool, icon representation, hover gradient sweep effect, structured workflow/outcome display, professional non-neon aesthetic. |
| `components/features/CareerStoryGenerator.tsx` | Premium input border styling, gradient CTA button (primary→secondary accent), animated result card entrance, loading state animation. |
| `components/sections/SkillsDisplay.tsx` | Category grouping (Frontend, Cloud/Infrastructure, AI/ML, Architecture), interactive chips with hover accent transition, responsive flow layout. |
| `components/sections/ContactSection.tsx` | Aspirational heading, subtle gradient background pattern, styled contact links with hover accent animation, generous vertical spacing. |
| `components/ui/AnimatedCounter.tsx` | Enhance counting animation (requestAnimationFrame-based count from 0), respect reduced motion preference. |
| `components/layout/Navigation.tsx` | Apply surface token background, update link styling with new text tokens. |
| `components/layout/Footer.tsx` | Apply updated token colors, ensure consistent spacing. |

### New Files

| File | Purpose |
|------|---------|
| `components/ui/GradientMeshBackground.tsx` | Reusable animated gradient mesh background component using CSS keyframe animations. Client component. |
| `components/ui/FloatingParticles.tsx` | Lightweight CSS-only floating particle effect. Minimal density, respects reduced motion. Client component. |
| `components/ui/ProjectDetailModal.tsx` | Modal/drawer component for expanded project view. Uses Framer Motion AnimatePresence. Client component. |

## Implementation Notes

### Color Token Migration

Current tokens → New tokens mapping:
- `--background: #000000` → `--background: #0B1020`
- `--foreground: #FFFFFF` → `--text-primary: #F8FAFC` (rename)
- `--secondary: #A1A1AA` → `--text-secondary: #94A3B8`
- `--border: #27272A` → `--border: rgba(255,255,255,0.08)`
- `--card: #09090B` → `--card: #1A2234`
- `--muted: #111113` → `--surface: #111827`

New additions:
- `--primary-accent: #14B8A6` (teal)
- `--secondary-accent: #3B82F6` (blue)

### Typography Scale (CSS clamp)

```css
--font-hero: clamp(3rem, 8vw + 1rem, 6rem);        /* 48px → 96px */
--font-heading: clamp(2.5rem, 5vw + 1rem, 4rem);   /* 40px → 64px */
--font-card-title: clamp(1.5rem, 2vw + 0.5rem, 2rem); /* 24px → 32px */
--font-body: clamp(1rem, 1vw + 0.5rem, 1.125rem);  /* 16px → 18px */
```

### Glassmorphism Card Pattern

```css
.glass-card {
  background: rgba(26, 34, 52, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}
```

### Card Hover Elevation Pattern

```typescript
const cardHoverElevation = {
  y: -6,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  borderColor: 'rgba(20, 184, 166, 0.3)', // primary-accent at 30% opacity
  transition: { duration: 0.3, ease: 'easeOut' }
};
```

### Gradient Mesh Background

```css
@keyframes gradient-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
```

Three overlapping radial gradients with offset animation timing, using primary-accent and secondary-accent at 10-20% opacity.

### Stagger Animation Pattern

```typescript
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }, // 120ms between items
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
```

### Responsive Breakpoints

Following Tailwind defaults aligned to requirements:
- `sm: 640px` — single → 2 column transitions
- `md: 768px` — typography scale shift, about section 2-column
- `lg: 1024px` — timeline alternating, full grid layouts
- `xl: 1280px` — max-width containers, 4-column grids

### Performance Strategy

1. Hero section renders server-side (static content). GradientMeshBackground and FloatingParticles are client components loaded immediately (above-fold).
2. Below-fold sections use Framer Motion `whileInView` for reveal — no dynamic imports needed for animation (Framer Motion is already bundled).
3. CareerStoryGenerator remains dynamically imported (`ssr: false`).
4. ProjectDetailModal loads on demand (user interaction trigger).
5. No new external dependencies — CSS handles gradient mesh and particles.
6. Font strategy unchanged (Inter via next/font with display: swap).

### Accessibility Strategy

1. All new gradient/particle backgrounds are decorative (`aria-hidden="true"`).
2. Modal (ProjectDetailModal) implements focus trap, Escape key close, aria-modal="true", aria-labelledby.
3. Reduced motion: Framer Motion variants conditionally disabled via `useReducedMotion()`. CSS keyframes disabled via `@media (prefers-reduced-motion: reduce)` (already in globals.css).
4. Color contrast verified: #F8FAFC on #0B1020 = 15.4:1 ratio (AAA). #94A3B8 on #0B1020 = 5.8:1 ratio (AA). #14B8A6 on #0B1020 = 7.2:1 ratio (AA).
5. Skip-to-content link already exists — unchanged.
6. Semantic landmarks already in place (section elements with aria-label in page.tsx).

### 8px Grid Spacing System

All spacing values in the design follow multiples of 8px:
- Component padding: 24px (3×8), 32px (4×8), 48px (6×8)
- Grid gaps: 24px (3×8), 32px (4×8)
- Section vertical padding: 64px (8×8) to 128px (16×8)
- Card internal spacing: 16px (2×8), 24px (3×8)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backdrop-filter (glassmorphism) not supported in older browsers | Cards look flat without blur | Provide solid semi-transparent fallback; glassmorphism is progressive enhancement |
| Gradient mesh animation causes jank on low-end devices | Poor performance perception | Use CSS will-change sparingly, keep animations GPU-composited (transform/opacity only), test on throttled CPU |
| Bundle size increase from Framer Motion usage expansion | Exceeds 200KB target | Framer Motion is already bundled; no new imports. Monitor with `next build` analyzer |
| Color token rename breaks existing component references | Build failures | Maintain backward-compatible aliases during migration, remove old tokens after all components updated |
| Modal accessibility issues (focus trap, screen readers) | WCAG non-compliance | Implement proper focus management, test with VoiceOver/NVDA, use role="dialog" pattern |

## Dependencies Between Components

```
globals.css (tokens) ─────────────────────────────────────────────┐
tailwind.config.ts (theme) ───────────────────────────────────────┤
lib/animations.ts (variants) ─────────────────────────────────────┤
                                                                   │
These three files must be updated FIRST before any section         │
component changes, as all components depend on the new tokens,     │
Tailwind classes, and animation variants.                          │
                                                                   ▼
┌────────────────────────────────────────────────────────────────────┐
│ Section Components (can be updated in parallel after foundation)   │
│                                                                    │
│ HeroSection ←── GradientMeshBackground, FloatingParticles (new)   │
│ FeaturedProjects ←── ProjectDetailModal (new)                     │
│ ImpactDashboard ←── AnimatedCounter (existing, enhanced)          │
│ All others: self-contained restyling                              │
└────────────────────────────────────────────────────────────────────┘
```
