# Implementation Plan: Career Platform

## Overview

A comprehensive career acceleration platform and personal portfolio for Ashutosh Jha, built with Next.js 14+ App Router, TypeScript, Tailwind CSS, and Framer Motion. The implementation is broken into incremental steps: project scaffolding, data layer, core UI components, interactive features, AI integration, blog engine, PWA/SEO, and final wiring with testing.

## Tasks

- [x] 1. Project scaffolding and core infrastructure
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript, Tailwind CSS, and App Router
    - Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router, and src disabled
    - Install dependencies: `framer-motion`, `@ducanh2912/next-pwa`, `fuse.js`, `@next/mdx`, `@next/bundle-analyzer`
    - Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `playwright`, `@axe-core/playwright`
    - Configure `next.config.mjs` with MDX support and PWA plugin
    - Configure `tailwind.config.ts` with design system tokens (dark/light theme colors, typography scale, spacing)
    - Create `styles/globals.css` with Tailwind directives and CSS custom properties for the design system
    - Create `tsconfig.json` path aliases for `@/components`, `@/lib`, `@/content`
    - _Requirements: 14.1, 14.4, 14.6, 15.1, 15.5_

  - [x] 1.2 Create project directory structure and core type definitions
    - Create folder structure: `app/`, `components/sections/`, `components/ui/`, `components/layout/`, `components/features/`, `components/blog/`, `lib/`, `lib/ai/`, `lib/blog/`, `lib/utils/`, `content/blog/`, `public/icons/`, `public/images/`, `public/fonts/`
    - Create `lib/resume-data.ts` with all TypeScript interfaces (`ResumeData`, `ImpactMetric`, `Experience`, `Project`, `SkillCategory`, `Skill`, `AITool`, `ArchitecturePrinciple`, `Education`)
    - Populate `resume-data.ts` with concrete data from the resume PDF
    - _Requirements: 20.1, 20.2, 20.4, 20.5_

  - [x] 1.3 Set up animation system and utility libraries
    - Create `lib/animations.ts` with Framer Motion variants: `fadeIn`, `slideUp`, `scaleIn`, `staggerContainer`, `hoverScale`
    - Implement `useReducedMotion` hook that respects `prefers-reduced-motion`
    - Create `lib/utils/theme.ts` with `getStoredTheme`, `setStoredTheme`, and theme config for dark/light modes
    - Create `lib/utils/validation.ts` with input validation functions for chat (1-500 chars) and career story (2-500 chars)
    - _Requirements: 14.5, 16.5, 14.2_

  - [x] 1.4 Write property tests for animation bounds and theme persistence
    - **Property 10: Animation Duration Bounds** - Verify all animation variants have duration between 150ms and 500ms with ease/easeOut easing
    - **Property 9: Theme Persistence Round-Trip** - Verify storing and retrieving theme returns identical value
    - **Validates: Requirements 14.5, 14.2**

  - [x] 1.5 Write property tests for input validation
    - **Property 3: Input Validation Rejection** - Verify empty, whitespace-only, >500 char (chat), and <2 char (career story) inputs are rejected
    - **Validates: Requirements 9.8, 21.4**

- [x] 2. Layout, navigation, and design system
  - [x] 2.1 Create root layout with theme provider, fonts, and metadata
    - Create `app/layout.tsx` as RSC with HTML lang attribute, theme class on body, font loading with `font-display: swap`
    - Implement theme provider that reads localStorage on mount, defaults to dark mode, prevents flash of light content using a blocking script
    - Add JSON-LD structured data (Person schema, WebSite schema) in the root layout
    - Add global Open Graph and Twitter Card metadata defaults
    - _Requirements: 14.1, 14.3, 17.1, 17.2, 17.5_

  - [x] 2.2 Implement Navigation component with sticky positioning and mobile menu
    - Create `components/layout/Navigation.tsx` as a client component with sticky positioning after Hero
    - Include links: About, Experience, Projects, Skills, Blog, Contact
    - Add Command Palette shortcut hint (Ctrl+K / Cmd+K)
    - Add theme toggle button
    - Implement hamburger menu for viewports below 768px
    - Create `components/layout/MobileMenu.tsx` with full-screen overlay, close on link select or outside tap
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

  - [x] 2.3 Implement SkipToContent and Footer components
    - Create `components/layout/SkipToContent.tsx` as the first focusable element, visible on keyboard focus, links to `#main-content`
    - Create `components/layout/Footer.tsx` with copyright and social links
    - _Requirements: 16.8, 16.2_

  - [x] 2.4 Write property tests for color contrast compliance
    - **Property 11: Color Contrast Compliance** - Verify all text/background color pairs meet 4.5:1 for normal text and 3:1 for large text
    - **Validates: Requirements 16.6**

- [x] 3. Hero section and Impact Dashboard
  - [x] 3.1 Implement HeroSection component
    - Create `components/sections/HeroSection.tsx` as a client component with full viewport height
    - Display "Ashutosh Jha" in massive typography (min 8rem desktop, 2.5rem mobile)
    - Display "Senior Frontend Engineer" tagline below name
    - Add centered profile photo overlaid on typography
    - Add floating metric badges ("5+ Years", "60+ Countries", "100K+ Rows", "45min→10sec") with fade/slide animations
    - Add three CTA buttons: "Download Resume" (triggers PDF download with error handling), "View Projects" (smooth scroll), "Contact" (smooth scroll)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 22.4_

  - [x] 3.2 Implement ImpactDashboard component with animated counters
    - Create `components/sections/ImpactDashboard.tsx` as a client component
    - Create `components/ui/AnimatedCounter.tsx` that counts from 0 to target value over 2 seconds
    - Use IntersectionObserver (50% threshold) to trigger animation once per page load
    - Display metrics from resume-data only: years experience, countries served, data grid rows, AI processing time
    - Implement responsive grid (1 column < 768px, multi-column >= 768px)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.3 Write property test for content integrity
    - **Property 1: Content Integrity** - Verify all displayed metrics, technologies, and achievements trace to ResumeData
    - **Validates: Requirements 2.2, 3.2, 3.4, 8.2, 20.1, 20.2, 20.5**

- [x] 4. Content sections (About, Technical Leadership, Architecture Principles)
  - [x] 4.1 Implement AboutSection component
    - Create `components/sections/AboutSection.tsx` with narrative summary (50-200 words)
    - Content references only technologies and experience from Resume_Data
    - Apply fade-in animation when 20% visible (400-800ms duration)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 4.2 Implement TechnicalLeadership component
    - Create `components/sections/TechnicalLeadership.tsx` highlighting architecture ownership, frontend standards, shared component systems
    - Reference reusable component systems across 5+ modules
    - Reference Core Web Vitals optimization on avis.com (Fortune 500, 60+ countries)
    - Apply staggered fade-in animations on scroll
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.3 Implement ArchitecturePrinciples component
    - Create `components/sections/ArchitecturePrinciples.tsx` with 8 principle cards
    - Each principle has description <= 150 characters connected to a technology/achievement
    - Hover animation: scale 1.02-1.05x, duration 150-300ms
    - Responsive grid: single column < 768px, multi-column on wider viewports
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 4.4 Write property tests for about word count and principle description length
    - **Property 13: About Section Word Count** - Verify about content is 50-200 words
    - **Property 14: Principle Description Length** - Verify all principle descriptions are <= 150 characters
    - **Validates: Requirements 3.1, 5.3**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Experience Timeline and Featured Projects
  - [x] 6.1 Implement ExperienceTimeline component
    - Create `components/sections/ExperienceTimeline.tsx` as a client component
    - Display two roles in reverse chronological order: Avis Budget Group (Oct 2023 – Present), TCS (Oct 2020 – Mar 2023, Client: DSB Bank)
    - All entries collapsed by default; click to expand/collapse showing responsibilities and achievements from Resume_Data
    - Vertical layout with visual connectors between entries
    - Staggered fade-in animations with 150ms delay between entries
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.2 Implement FeaturedProjects component with expandable cards
    - Create `components/sections/FeaturedProjects.tsx` as a client component
    - Display Project_Cards for: CIPHER AI Platform (flagship, larger, first), Corporate Real Estate Platform, Avis.com Performance Optimization
    - Click to expand showing tech stack, challenges, outcomes from Resume_Data
    - Only one card expanded at a time (clicking another collapses the previous)
    - CIPHER card displays: React, TypeScript, AWS Bedrock, Strands Agent SDK, 5-Agent Pipeline, 45min→10sec, 98.6% accuracy
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Skills Display and AI Engineering section
  - [-] 7.1 Implement SkillsDisplay component with interactive cards
    - Create `components/sections/SkillsDisplay.tsx` as a client component
    - Create `components/ui/SkillCard.tsx` with hover/tap scale animation (1.03-1.08x, 200-400ms)
    - Display ALL skills from Resume_Data organized by category: Frontend Frameworks, Styling, Languages, APIs, Tools, AI/ML
    - Responsive grid: min 2 columns at 320px, max 6 columns at 1280px+
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [-] 7.2 Implement AIEngineering section
    - Create `components/sections/AIEngineering.tsx` listing ChatGPT, Claude, Amazon Q, Kiro
    - Each tool has workflow use case and outcome from Resume_Data
    - Staggered fade-in animations on scroll
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 7.3 Write property test for skills categorization completeness
    - **Property 5: Skills Categorization Completeness** - Verify rendered skills exactly match Resume_Data skills with correct categories
    - **Validates: Requirements 11.1, 11.3**

- [ ] 8. Contact section and responsive design validation
  - [-] 8.1 Implement ContactSection component
    - Create `components/sections/ContactSection.tsx` with GitHub, LinkedIn, Email links
    - GitHub/LinkedIn open in new tab; Email opens default mail client
    - Resume download button with error handling for unavailable PDF
    - Minimum 48px padding, visually distinct heading, consistent spacing
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ] 8.2 Compose home page with all sections and responsive layout
    - Create `app/page.tsx` as RSC composing all section components in order: Hero, Impact Dashboard, About, Technical Leadership, Architecture Principles, Experience Timeline, Featured Projects, AI Engineering, Skills, Contact
    - Add `id` attributes for smooth scroll navigation targets
    - Ensure responsive layouts: 320px-2560px without overflow, responsive typography (14px-18px body), touch targets >= 44x44px on mobile
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Blog Engine
  - [ ] 10.1 Set up MDX processing and blog utilities
    - Create `lib/blog/mdx.ts` with functions to get all posts, get post by slug, sort posts by date descending
    - Create `lib/blog/reading-time.ts` with `calculateReadingTime` function: `Math.max(1, Math.round(wordCount / 200))`
    - Create `components/blog/MDXComponents.tsx` with custom component mappings for code blocks (with syntax highlighting), images, and embedded media
    - _Requirements: 12.1, 12.2, 12.6, 12.7_

  - [ ] 10.2 Implement blog listing and post pages
    - Create `app/blog/page.tsx` as RSC displaying posts in reverse chronological order with categories, reading time, publication dates
    - Create `components/blog/BlogCard.tsx` for post previews
    - Create `components/blog/CategoryFilter.tsx` for category filtering with empty state message
    - Create `app/blog/[slug]/page.tsx` as RSC rendering MDX content with static generation
    - Create a sample blog post in `content/blog/` to validate the engine
    - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.7_

  - [ ] 10.3 Write property tests for blog engine
    - **Property 6: Reading Time Calculation** - Verify reading time equals `Math.max(1, Math.round(wordCount / 200))`
    - **Property 7: Blog Post Chronological Ordering** - Verify posts sorted in strictly descending date order
    - **Property 8: Category Filter Correctness** - Verify filtered posts all match category and no matching posts are excluded
    - **Validates: Requirements 12.2, 12.3, 12.4**

- [ ] 11. AI Assistant and Career Story Generator
  - [ ] 11.1 Implement Gemini Flash client and RAG retrieval
    - Create `lib/ai/gemini-client.ts` with Gemini Flash API client setup
    - Create `lib/ai/rag-retrieval.ts` with `retrieveContext` function that searches Resume_Data sections by relevance and returns matching context with confidence score
    - Implement confidence threshold: below threshold returns "information not available" response
    - _Requirements: 9.3, 9.4, 9.5, 20.3_

  - [ ] 11.2 Implement AI Assistant chat API route and UI
    - Create `app/api/chat/route.ts` (Edge Runtime) with input validation (1-500 chars), RAG retrieval, Gemini Flash call, structured error responses
    - Implement retry with exponential backoff (max 2 retries) on API failure
    - Create `components/features/AIAssistant.tsx` with floating button, chat interface, session history, loading states, error handling
    - Retain user's question on API failure; show "temporarily unavailable" message
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [ ] 11.3 Implement Career Story Generator API route and UI
    - Create `app/api/career-story/route.ts` (Edge Runtime) with input validation (2-500 chars), Resume_Data context injection, Gemini Flash call
    - Generate 150-800 word narrative; omit technologies not in Resume_Data; indicate unrepresented areas
    - Handle insufficient matching experience with appropriate message
    - Create `components/features/CareerStoryGenerator.tsx` with text input, generate button, narrative display, loading/error states
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

  - [ ] 11.4 Write property tests for RAG retrieval and search
    - **Property 2: RAG Retrieval Constraint** - Verify retrieval returns only context from Resume_Data
    - **Property 4: Fuzzy Search Result Bound** - Verify command palette search returns at most 10 results referencing valid entries
    - **Validates: Requirements 9.3, 20.3, 10.2**

- [ ] 12. Command Palette and search
  - [ ] 12.1 Implement Command Palette with fuzzy search
    - Create `lib/search-index.ts` with Fuse.js configuration indexing all sections, projects, skills, and blog posts
    - Create `components/features/CommandPalette.tsx` with Ctrl+K/Cmd+K trigger, centered overlay, search input auto-focus
    - Implement fuzzy search returning max 10 results
    - Support arrow key navigation (Up/Down), Enter to select, Escape to close
    - Return focus to previously focused element on close
    - Display "no results found" message for empty results
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. SEO, PWA, and performance optimization
  - [ ] 14.1 Implement SEO metadata, sitemap, and robots
    - Create `app/sitemap.ts` generating XML sitemap with all public pages and blog posts with lastmod dates
    - Create `app/robots.ts` permitting public pages, disallowing API routes and internal assets
    - Add canonical URL link elements to all pages
    - Ensure unique meta titles (max 60 chars) and descriptions (max 160 chars) per page
    - _Requirements: 17.3, 17.4, 17.6, 17.7_

  - [ ] 14.2 Implement PWA manifest and service worker
    - Create `app/manifest.ts` with app name, icons (192x192, 512x512 PNG), theme color #000000, display standalone
    - Configure `@ducanh2912/next-pwa` in `next.config.mjs` for service worker generation
    - Implement network-first caching strategy for pages, cache-first for static assets
    - Create offline fallback page with navigation to cached pages
    - Handle `beforeinstallprompt` event to present install option
    - Handle service worker updates with user notification
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ] 14.3 Performance optimization and code splitting
    - Implement dynamic imports for below-the-fold sections: AIAssistant, CommandPalette, CareerStoryGenerator, Blog components
    - Optimize images with Next.js Image component (WebP/AVIF, max 200KB per image)
    - Configure font optimization with font-display swap and subset loading
    - Verify initial JS bundle <= 200KB compressed for homepage
    - _Requirements: 15.1, 15.3, 15.4, 15.5, 15.7_

  - [ ] 14.4 Write property tests for meta content length bounds
    - **Property 12: Meta Content Length Bounds** - Verify all page titles <= 60 chars and descriptions <= 160 chars
    - **Validates: Requirements 17.6**

- [ ] 15. Accessibility compliance
  - [ ] 15.1 Implement full accessibility across all components
    - Audit and add semantic HTML elements (header, nav, main, section, article, footer) replacing generic divs
    - Add ARIA labels on all interactive elements lacking visible text, ARIA roles on custom widgets
    - Add alt text on all non-decorative images
    - Ensure visible focus indicators (min 2px outline) on all interactive elements
    - Ensure keyboard navigation: Tab/Shift+Tab for focus, Enter/Space for activation, Escape for overlays, Arrow keys for composite widgets
    - Verify minimum touch targets (44x44px) on mobile
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.6, 16.7, 16.8_

- [ ] 16. Final integration and wiring
  - [ ] 16.1 Wire AI Project Explainer into Featured Projects
    - Add "AI Project Explainer" button to each Project_Card
    - On click, open AI Assistant with pre-filled context about the project
    - Handle AI unavailable state with error message
    - _Requirements: 7.6, 7.7_

  - [ ] 16.2 Wire theme toggle functionality end-to-end
    - Connect ThemeToggle component to theme provider
    - Ensure dark/light switch persists to localStorage and applies immediately
    - Verify no flash of wrong theme on page load
    - _Requirements: 14.2, 14.3_

  - [ ] 16.3 Final responsive design pass and cross-section integration
    - Verify all sections render correctly at 320px, 768px, 1024px, 1440px, 2560px
    - Verify smooth scroll navigation between all sections completes within 800ms
    - Verify all interactive elements have proper touch targets on mobile
    - Ensure no horizontal overflow at any viewport width
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 19.4_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All content displayed must trace back to `resume-data.ts` (the single source of truth)
- The design uses TypeScript throughout; all implementations use TypeScript with strict mode
- Framer Motion animations must respect `prefers-reduced-motion`
- AI features (Assistant, Career Story) degrade gracefully when Gemini API is unavailable

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "1.5", "2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4"] },
    { "id": 4, "tasks": ["3.1", "3.2"] },
    { "id": 5, "tasks": ["3.3", "4.1", "4.2", "4.3"] },
    { "id": 6, "tasks": ["4.4", "6.1", "6.2"] },
    { "id": 7, "tasks": ["7.1", "7.2", "8.1"] },
    { "id": 8, "tasks": ["7.3", "8.2"] },
    { "id": 9, "tasks": ["10.1", "11.1"] },
    { "id": 10, "tasks": ["10.2", "11.2", "11.3"] },
    { "id": 11, "tasks": ["10.3", "11.4", "12.1"] },
    { "id": 12, "tasks": ["14.1", "14.2", "14.3"] },
    { "id": 13, "tasks": ["14.4", "15.1"] },
    { "id": 14, "tasks": ["16.1", "16.2", "16.3"] }
  ]
}
```
