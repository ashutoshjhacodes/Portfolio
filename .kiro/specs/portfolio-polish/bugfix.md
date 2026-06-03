# Bugfix Requirements Document

## Introduction

The portfolio website for Ashutosh Jha (Senior Frontend Engineer) has multiple visual, UX, accessibility, and responsiveness issues that prevent it from looking production-ready and premium. The site currently suffers from inconsistent spacing, poor readability, placeholder metrics, weak project cards, accessibility gaps, and unpolished interactive sections. This bugfix addresses all identified issues while preserving the dark theme, teal/cyan accent colors, card-based layout, and engineering-focused personality.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the hero section renders THEN the profile image area appears awkwardly cropped with no visual context around it, and the content hierarchy (name → title → value proposition → CTAs) is unclear

1.2 WHEN the Impact Dashboard section renders THEN it displays "0+" placeholder values via AnimatedCounter before intersection observer triggers, showing unfinished metrics to users who scroll quickly or have animations disabled

1.3 WHEN body text, tags, and labels render across sections THEN font sizes are too small (text-xs, text-sm without adequate line-height), contrast ratios fall below WCAG AA 4.5:1 for text-secondary (#94A3B8) on background (#0B1020), and tag elements are undersized for comfortable reading

1.4 WHEN the page renders with py-section spacing between all sections THEN vertical gaps are excessive, making the page feel disconnected and overly long without adding breathing room

1.5 WHEN cards render across ImpactDashboard, FeaturedProjects, SkillsDisplay, and ArchitecturePrinciples sections THEN padding, border-radius, hover states, icon alignment, title sizes, and description spacing are visually inconsistent between sections

1.6 WHEN the ExperienceTimeline renders THEN the timeline dot alignment is off-center on mobile (left-2.5 vs left-4 line), spacing between entries is inconsistent, and the alternating layout has alignment gaps on desktop

1.7 WHEN FeaturedProjects cards render THEN they only show a title, a single challenge line, tech chips, and a "View Details" button — missing problem context, role/contribution, impact summary, and direct links (GitHub/live demo)

1.8 WHEN the CareerStoryGenerator section renders in the page flow THEN it appears as an isolated block with no visual connection to surrounding sections, lacking a polished container, contextual introduction, or clear positioning as an interactive feature

1.9 WHEN the Contact/CTA section renders THEN buttons for Email, GitHub, LinkedIn, and Download Resume are styled identically without visual hierarchy, making primary actions (Email, Resume) indistinguishable from secondary actions

1.10 WHEN the site is viewed on mobile (<640px), tablet (640-1024px), or large desktop (>1280px) THEN elements overflow, text doesn't scale properly, cards stack without adequate spacing, and the hero layout breaks at intermediate breakpoints

1.11 WHEN users interact with the page THEN animations are inconsistent — some sections have no entrance animation, floating particles and gradient mesh run continuously consuming resources, and hover states vary between card types

1.12 WHEN navigating with keyboard or screen reader THEN semantic HTML structure is incomplete (sections wrapped redundantly in page.tsx), focus states are inconsistent, aria-labels are missing or redundant, and heading hierarchy has gaps

1.13 WHEN reading copy across the site THEN text contains vague claims ("building exceptional solutions"), generic descriptions, and lacks the confident, outcome-driven tone expected of a senior engineer's portfolio

### Expected Behavior (Correct)

2.1 WHEN the hero section renders THEN the system SHALL display a clear visual hierarchy: name (largest, bold), title below, a short value proposition statement, and distinct CTA buttons — with the profile image properly sized and framed without awkward cropping

2.2 WHEN the Impact Dashboard section renders THEN the system SHALL display actual metric values immediately (without showing "0+"), or hide the section entirely until real values are confirmed available, preventing placeholder states from being visible

2.3 WHEN body text, tags, and labels render THEN the system SHALL use minimum 16px (text-base) for body text, minimum 14px for labels/tags, adequate line-height (1.5+ for body), and all text-on-background combinations SHALL meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)

2.4 WHEN sections are laid out vertically THEN the system SHALL use reduced but consistent spacing (e.g., py-16 md:py-20 instead of py-section) that keeps the layout breathable without excessive gaps between content blocks

2.5 WHEN cards render across all sections THEN the system SHALL apply consistent design tokens: uniform padding (p-6), consistent border-radius (rounded-xl), matching hover elevation states, aligned icons/titles, and uniform description text spacing

2.6 WHEN the ExperienceTimeline renders THEN the system SHALL display properly aligned timeline dots centered on the vertical line at all breakpoints, consistent gap-8 or gap-10 between entries, and correct alternating card positioning on desktop

2.7 WHEN FeaturedProjects cards render THEN the system SHALL display each project with: problem statement, role/contribution summary, tech stack, quantified impact/outcomes, and clear action links (GitHub repo, live demo where applicable)

2.8 WHEN the CareerStoryGenerator section renders THEN the system SHALL present it as a polished interactive feature with a clear heading, contextual description, visual distinction from static content sections, and smooth integration into the page flow

2.9 WHEN the Contact/CTA section renders THEN the system SHALL display primary actions (Email Me, Download Resume) with filled/gradient button styling and secondary actions (GitHub, LinkedIn) with outlined styling, creating clear visual hierarchy

2.10 WHEN the site is viewed at any viewport width THEN the system SHALL render all content without overflow, with appropriate text scaling, proper card stacking with consistent gaps, and the hero layout SHALL adapt gracefully across mobile, tablet, and desktop breakpoints

2.11 WHEN users interact with the page THEN the system SHALL apply only subtle, purposeful animations: section fade-in on scroll (once), card hover elevation, and CTA hover effects — with no continuous background animations consuming resources in idle state

2.12 WHEN navigating with keyboard or screen reader THEN the system SHALL provide proper semantic HTML (single section wrapper per content block), visible focus-visible outlines on all interactive elements, meaningful aria-labels, and correct heading hierarchy (h1 → h2 → h3)

2.13 WHEN reading copy across the site THEN the system SHALL display confident, specific, outcome-driven language (e.g., "Built scalable frontend architecture serving 60+ countries" instead of "passionate about building solutions")

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the dark theme is active THEN the system SHALL CONTINUE TO use the existing color palette (background #0B1020, primary-accent #14B8A6, secondary-accent #3B82F6, surface #111827) without changes

3.2 WHEN the card-based layout structure renders THEN the system SHALL CONTINUE TO use glass-card styling with backdrop-blur, border opacity, and the established card container pattern across all sections

3.3 WHEN the site renders on desktop THEN the system SHALL CONTINUE TO display the existing sections in the current order: Hero, Impact, About, Technical Leadership, Architecture, Experience, Projects, AI Engineering, Career Story, Skills, Contact

3.4 WHEN data is displayed in sections THEN the system SHALL CONTINUE TO source all content from lib/resume-data.ts as the single source of truth, without hardcoding values in components

3.5 WHEN the Next.js App Router handles routing THEN the system SHALL CONTINUE TO use the existing app directory structure, server components for the page, and client components for interactive sections

3.6 WHEN Framer Motion is used for animations THEN the system SHALL CONTINUE TO respect prefers-reduced-motion by disabling animations for users who prefer reduced motion

3.7 WHEN the navigation renders THEN the system SHALL CONTINUE TO provide smooth-scroll to section anchors and the existing mobile menu behavior

3.8 WHEN the CareerStoryGenerator generates stories THEN the system SHALL CONTINUE TO call the /api/career-story endpoint with the same request/response contract and display results identically
