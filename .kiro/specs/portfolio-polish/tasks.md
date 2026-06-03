# Implementation Plan

## Overview

This task list implements the portfolio-polish bugfix using the exploratory bugfix workflow. Foundation changes (data, CSS, Tailwind config) are applied first, then component fixes in parallel, with property-based tests validating the fix and preservation of existing behavior.

## Task Dependency Graph

```json
{
  "waves": [
    ["1", "2"],
    ["3.1", "3.2", "3.3"],
    ["4.1", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "6.1", "6.2", "6.3"],
    ["7.1", "7.2"],
    ["8"]
  ]
}
```

## Tasks

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Visual Polish Defects (Contrast, Font Size, Semantic HTML, CTA Hierarchy, Placeholder Metrics)
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the 13 visual/UX bugs exist
  - **Scoped PBT Approach**: Scope properties to concrete failing cases for deterministic visual bugs
  - Test that text-secondary (#94A3B8) on background (#0B1020) contrast ratio ≥ 4.5:1 (from Bug Condition: component.textContrastRatio() < 4.5)
  - Test that body font size minimum is 16px — assert no body text uses clamp below 1rem (from Bug Condition: component.bodyFontSize() < 16)
  - Test that ImpactDashboard does not render "0+" placeholder values in initial DOM (from Bug Condition: component.hasPlaceholderMetrics())
  - Test that ContactSection primary CTAs (Email, Resume) have distinct styling from secondary CTAs (GitHub, LinkedIn) (from Bug Condition: component.ctaButtons().lacksHierarchy())
  - Test that page.tsx does not wrap components in redundant `<section>` elements creating nested landmarks (from Bug Condition: component.semanticHTML().isInvalid())
  - Test that HeroSection profile image has no infinite animation CSS properties (from Bug Condition: component.hasInfiniteAnimations())
  - Test that ExperienceTimeline dot left position matches vertical line center position (from Bug Condition: component.timelineDots().areMisaligned())
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bugs exist)
  - Document counterexamples found: contrast ratio ~4.2:1, font min 14px, "0+" in DOM, identical button styles, nested sections, infinite animation keyframes, dot offset 6px
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Dark Theme Palette, Section Order, Data Sourcing, Reduced Motion
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: globals.css defines --background: #0B1020, --primary-accent: #14B8A6, --secondary-accent: #3B82F6, --surface: #111827 on unfixed code
  - Observe: page.tsx renders sections in order: Hero → Impact → About → Technical Leadership → Architecture → Experience → Projects → AI Engineering → Career Story → Skills → Contact on unfixed code
  - Observe: components import and render data from `lib/resume-data.ts` with no hardcoded content strings on unfixed code
  - Observe: Framer Motion animations check `useReducedMotion` hook and disable when preference is set on unfixed code
  - Observe: Navigation smooth-scroll behavior and mobile menu toggle work correctly on unfixed code
  - Observe: glass-card utility class uses rgba(26,34,52,0.6) + backdrop-blur-[12px] + border rgba(255,255,255,0.08) on unfixed code
  - Write property-based test: for all section components, computed CSS custom properties for theme colors remain unchanged
  - Write property-based test: for all viewport widths (320-2560px), section rendering order matches expected sequence
  - Write property-based test: for all components, content strings are sourced from resume-data.ts imports (no hardcoded display text)
  - Write property-based test: when prefers-reduced-motion is set, no Framer Motion animations play
  - Verify all tests PASS on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3. Foundation layer fixes (data, globals, tailwind config)

  - [ ] 3.1 Update `lib/resume-data.ts` with enriched project data and improved copy
    - Add `description`, `role`, `githubUrl`, `liveUrl` optional fields to Project interface
    - Populate description, role, and links for each project entry
    - Update `resumeData.personal.title` to include a value proposition
    - Refine achievement strings to be outcome-driven (e.g., "Built scalable frontend architecture serving 60+ countries")
    - _Bug_Condition: component.copy().isGeneric() AND component.projectCards().lackContext()_
    - _Expected_Behavior: confident, specific, outcome-driven language; projects have description, role, impact, links_
    - _Preservation: All existing data fields remain unchanged; only new fields added_
    - _Requirements: 2.7, 2.13_

  - [ ] 3.2 Fix `styles/globals.css` contrast and font minimum
    - Update `--text-secondary` from `#94A3B8` to a value achieving ≥4.5:1 contrast on #0B1020 (e.g., `#B0BEC5` or `#A8B8CC`)
    - Adjust `--font-body` clamp minimum from 0.875rem to 1rem to enforce 16px body minimum
    - _Bug_Condition: component.textContrastRatio() < 4.5 AND component.bodyFontSize() < 16_
    - _Expected_Behavior: contrast ≥ 4.5:1 for all body text; minimum 16px body font_
    - _Preservation: Dark theme palette (#0B1020, #14B8A6, #3B82F6, #111827) unchanged_
    - _Requirements: 2.3, 3.1_

  - [ ] 3.3 Update `tailwind.config.ts` font size and spacing tokens
    - Change body-responsive fontSize from `clamp(0.875rem, 1.5vw, 1.125rem)` to `clamp(1rem, 1.5vw, 1.125rem)`
    - Add `section-tight` spacing token with `clamp(3rem, 6vh, 5rem)` for reduced vertical gaps
    - _Bug_Condition: component.bodyFontSize() < 16 AND component.sectionSpacing() > 96px_
    - _Expected_Behavior: 16px minimum body font; tighter section spacing available_
    - _Preservation: Existing tokens remain; only values updated and new tokens added_
    - _Requirements: 2.3, 2.4_

- [ ] 4. Page structure and layout fixes

  - [ ] 4.1 Fix `app/page.tsx` redundant section wrappers and spacing
    - Remove wrapping `<section>` elements from page.tsx since components declare their own `<section>`
    - Replace `py-section` with `py-16 md:py-20` or use new `section-tight` token for tighter layout
    - _Bug_Condition: component.semanticHTML().isInvalid() AND component.sectionSpacing() > 96px_
    - _Expected_Behavior: single section wrapper per content block; reduced spacing between sections_
    - _Preservation: Section rendering order unchanged; App Router structure preserved_
    - _Requirements: 2.4, 2.12, 3.3, 3.5_

- [ ] 5. Component fixes (sections)

  - [ ] 5.1 Fix `components/sections/HeroSection.tsx`
    - Add value proposition tagline between title and badges (sourced from resume-data.ts)
    - Remove continuous box-shadow pulse animation on profile image ring; use static gradient border or single entrance animation
    - Improve CTA hierarchy: "View Projects" as primary (gradient fill), "Get In Touch" as secondary (outlined), "Download Resume" as tertiary (text-link style)
    - Fix profile image sizing with proper `object-cover` positioning to prevent awkward cropping
    - _Bug_Condition: component.ctaButtons().lacksHierarchy() AND component.hasInfiniteAnimations() AND component.copy().isGeneric()_
    - _Expected_Behavior: clear CTA hierarchy; no infinite animations; outcome-driven value prop_
    - _Preservation: Content from resume-data.ts; Framer Motion reduced-motion support_
    - _Requirements: 2.1, 2.9, 2.11, 2.13, 3.4, 3.6_

  - [ ] 5.2 Fix `components/sections/ImpactDashboard.tsx`
    - Remove AnimatedCounter zero-state — display `metric.value` directly as initial render or hide until observer triggers
    - Increase label text size from `text-sm` to `text-base` for readability
    - _Bug_Condition: component.hasPlaceholderMetrics() AND component.bodyFontSize() < 16_
    - _Expected_Behavior: no "0+" placeholder visible; labels at minimum 16px_
    - _Preservation: Glass-card pattern; metric data from resume-data.ts_
    - _Requirements: 2.2, 2.3, 2.5, 3.2, 3.4_

  - [ ] 5.3 Fix `components/sections/ExperienceTimeline.tsx`
    - Fix dot alignment: unify `left-2.5` and `left-4` to centered position (e.g., `left-[15px]` or `left-4` with `transform -translate-x-1/2`)
    - Standardize entry spacing with consistent `gap-10` between timeline entries
    - _Bug_Condition: component.timelineDots().areMisaligned() AND component.cardStyles().areInconsistent()_
    - _Expected_Behavior: timeline dots centered on vertical line at all breakpoints; consistent entry spacing_
    - _Preservation: Timeline content from resume-data.ts; existing layout pattern_
    - _Requirements: 2.6, 2.5, 3.4_

  - [ ] 5.4 Fix `components/sections/FeaturedProjects.tsx`
    - Enrich card content: display project description/problem statement, role, quantified impact from `outcomes`, and action links (GitHub, live demo)
    - Remove gradient placeholder area; replace with concise problem statement
    - Add GitHub/Live Demo links from new `githubUrl`/`liveUrl` fields in resume-data.ts
    - _Bug_Condition: component.projectCards().lackContext()_
    - _Expected_Behavior: each project card shows description, role, tech stack, impact, and links_
    - _Preservation: Glass-card pattern; data from resume-data.ts; section order_
    - _Requirements: 2.7, 3.2, 3.4_

  - [ ] 5.5 Fix `components/sections/ContactSection.tsx`
    - Create CTA hierarchy: Email and Resume Download with gradient fill (primary), GitHub and LinkedIn with outlined style (secondary)
    - Reorder: place primary CTAs first in layout flow
    - _Bug_Condition: component.ctaButtons().lacksHierarchy()_
    - _Expected_Behavior: primary CTAs visually distinct from secondary CTAs_
    - _Preservation: All contact links remain functional; data from resume-data.ts_
    - _Requirements: 2.9, 3.4_

  - [ ] 5.6 Fix `components/features/CareerStoryGenerator.tsx`
    - Wrap in glass-card container with subtle accent border for visual distinction
    - Add descriptive sub-heading explaining the AI-powered interactive feature
    - _Bug_Condition: component.interactiveSection().isDisconnected()_
    - _Expected_Behavior: polished interactive feature with clear heading, visual distinction, smooth integration_
    - _Preservation: API contract (/api/career-story) unchanged; functionality identical_
    - _Requirements: 2.8, 3.8_

- [ ] 5.7 Fix `components/layout/SkipToContent.tsx` and skip-to-content styling
    - Ensure the link is visually hidden by default (off-screen or translated)
    - On keyboard focus, reveal it at top-left with high z-index (z-[9999])
    - Style it clearly: use bg-primary-accent text-white font-semibold px-4 py-3 rounded-md shadow-lg
    - Ensure href="#main-content" is correct (already present)
    - Verify `<main id="main-content">` exists in app/layout.tsx (already present)
    - Update `.skip-to-content` class in globals.css: use `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]` pattern or equivalent translate approach with clear styling
    - _Bug_Condition: skip-to-content link not properly hidden/revealed or poorly styled_
    - _Expected_Behavior: visually hidden by default; appears clearly at top-left on keyboard focus; links to #main-content_
    - _Preservation: Existing SkipToContent component structure; main id attribute_
    - _Requirements: 2.12_

- [ ] 6. UI component fixes (animations)

  - [ ] 6.1 Fix `components/ui/GradientMeshBackground.tsx`
    - Remove infinite loop animation; use static gradient or single fade-in on mount
    - _Bug_Condition: component.hasInfiniteAnimations()_
    - _Expected_Behavior: no continuous background animations consuming resources in idle state_
    - _Preservation: Reduced-motion support via useReducedMotion hook_
    - _Requirements: 2.11, 3.6_

  - [ ] 6.2 Fix `components/ui/FloatingParticles.tsx`
    - Remove infinite particle-float loop; make static or single-play entrance only
    - _Bug_Condition: component.hasInfiniteAnimations()_
    - _Expected_Behavior: only subtle, purposeful animations; no continuous resource consumption_
    - _Preservation: Reduced-motion support via useReducedMotion hook_
    - _Requirements: 2.11, 3.6_

  - [ ] 6.3 Optionally add `sectionEntrance` variant to `lib/animations.ts`
    - Add a `sectionEntrance` animation variant for consistent section fade-in behavior
    - Do NOT modify any existing exports — only add new variant
    - _Preservation: All existing animation variants and hooks unchanged_
    - _Requirements: 2.11_

- [ ] 7. Verify bug condition exploration test now passes

  - [ ] 7.1 Re-run bug condition exploration test
    - **Property 1: Expected Behavior** - Visual Polish Defects Resolved
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior for all 13 defect categories
    - When this test passes, it confirms: contrast ≥ 4.5:1, font ≥ 16px, no "0+" placeholders, CTA hierarchy present, no nested sections, no infinite animations, dots aligned
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms all bugs are fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13_

  - [ ] 7.2 Re-run preservation tests
    - **Property 2: Preservation** - Dark Theme Palette, Section Order, Data Sourcing, Reduced Motion
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm dark theme palette unchanged, section order preserved, data sourcing from resume-data.ts, reduced-motion support intact
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Run full test suite (vitest --run) and confirm all property tests, unit tests, and existing tests pass
  - Verify no TypeScript compilation errors across modified files
  - Ensure all tests still pass, ask the user if questions arise

## Notes

- Foundation tasks (3.1, 3.2, 3.3) must complete before component tasks since components depend on updated data fields, CSS variables, and Tailwind tokens
- Component section fixes (task 5) and UI animation fixes (task 6) can run in parallel after foundation is in place
- Page structure (task 4) depends on foundation but is independent of component fixes
- Property tests (tasks 1, 2) run BEFORE any implementation to establish baseline
- All content changes must source from `lib/resume-data.ts` — no hardcoded strings in components
