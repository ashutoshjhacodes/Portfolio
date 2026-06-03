# Design Document: Career Platform

## Overview

This design describes a comprehensive career acceleration platform and personal portfolio for Ashutosh Jha, built as a Next.js 14+ App Router application. The platform is a single-page application with a blog section, designed to convince senior engineering decision-makers to schedule an interview within 30 seconds of visiting.

The architecture prioritizes:
- **Performance**: Server-side rendering with React Server Components, code splitting, edge deployment
- **Premium UX**: Dark-mode-first editorial design with constrained Framer Motion animations
- **Content Integrity**: All displayed data sourced exclusively from verified resume data
- **AI Integration**: Gemini Flash-powered RAG chatbot for interactive Q&A
- **Accessibility**: WCAG 2.1 AA compliance with full keyboard navigation

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ App Router | RSC support, static generation, edge rendering, built-in image optimization |
| Styling | Tailwind CSS | Token-based design system, dark mode utilities, responsive breakpoints |
| Animation | Framer Motion | Declarative scroll-triggered animations, `whileInView`, stagger patterns |
| Blog | MDX with `@next/mdx` | Static generation, custom React components in markdown, code highlighting |
| AI Backend | Gemini Flash via Google AI SDK | Fast inference, cost-effective, suitable for RAG retrieval |
| PWA | `@ducanh2912/next-pwa` | Workbox-based service worker, App Router compatible |
| Search | Fuse.js | Client-side fuzzy search for command palette, zero-backend dependency |
| Deployment | Vercel Edge | TTFB < 200ms, automatic CDN, ISR support |

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Browser/PWA Shell]
        SW[Service Worker]
    end

    subgraph "Next.js App Router"
        subgraph "Pages (RSC)"
            Home[Home Page - RSC]
            Blog[Blog Listing - RSC]
            BlogPost[Blog Post - RSC]
        end
        subgraph "Client Islands"
            Hero[Hero Section]
            Timeline[Experience Timeline]
            Projects[Featured Projects]
            Skills[Skills Display]
            AI[AI Assistant]
            CMD[Command Palette]
            Nav[Navigation]
        end
        subgraph "API Routes"
            ChatAPI[/api/chat - Gemini Flash]
            StoryAPI[/api/career-story - Gemini Flash]
        end
    end

    subgraph "Data Layer"
        ResumeJSON[resume-data.json]
        MDXFiles[/content/blog/*.mdx]
        PDF[Ashutosh_India.pdf]
    end

    subgraph "External Services"
        Gemini[Google Gemini Flash API]
        Vercel[Vercel Edge Network]
    end

    Browser --> Home
    Browser --> Blog
    Browser --> BlogPost
    SW --> Browser
    Home --> Hero
    Home --> Timeline
    Home --> Projects
    Home --> Skills
    AI --> ChatAPI
    ChatAPI --> Gemini
    ChatAPI --> ResumeJSON
    StoryAPI --> Gemini
    StoryAPI --> ResumeJSON
    BlogPost --> MDXFiles
    Home --> PDF
```

### Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` (Home) | Static (SSG) | Content is static resume data, no dynamic content |
| `/blog` | Static (SSG) | Blog listing generated at build time |
| `/blog/[slug]` | Static (SSG) | Individual posts generated at build time |
| `/api/chat` | Edge Runtime | Low-latency AI responses |
| `/api/career-story` | Edge Runtime | Low-latency narrative generation |

### Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, theme provider)
│   ├── page.tsx                # Home page (RSC - composes all sections)
│   ├── blog/
│   │   ├── page.tsx            # Blog listing (RSC)
│   │   └── [slug]/
│   │       └── page.tsx        # Blog post (RSC)
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts       # AI Assistant endpoint
│   │   └── career-story/
│   │       └── route.ts       # Career Story Generator endpoint
│   ├── manifest.ts            # PWA manifest
│   ├── sitemap.ts             # Dynamic sitemap generation
│   └── robots.ts              # Robots.txt generation
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ImpactDashboard.tsx
│   │   ├── AboutSection.tsx
│   │   ├── TechnicalLeadership.tsx
│   │   ├── ArchitecturePrinciples.tsx
│   │   ├── ExperienceTimeline.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── AIEngineering.tsx
│   │   ├── SkillsDisplay.tsx
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── AnimatedCounter.tsx
│   │   └── SkillCard.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Footer.tsx
│   │   └── SkipToContent.tsx
│   ├── features/
│   │   ├── AIAssistant.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── CareerStoryGenerator.tsx
│   │   └── ThemeToggle.tsx
│   └── blog/
│       ├── BlogCard.tsx
│       ├── CategoryFilter.tsx
│       └── MDXComponents.tsx
├── lib/
│   ├── resume-data.ts         # Typed resume data export
│   ├── animations.ts          # Framer Motion animation variants
│   ├── search-index.ts        # Fuse.js search configuration
│   ├── ai/
│   │   ├── gemini-client.ts   # Gemini Flash client setup
│   │   └── rag-retrieval.ts   # RAG context retrieval from resume data
│   ├── blog/
│   │   ├── mdx.ts             # MDX processing utilities
│   │   └── reading-time.ts    # Reading time calculation
│   └── utils/
│       ├── theme.ts           # Theme management utilities
│       └── validation.ts      # Input validation helpers
├── content/
│   └── blog/                  # MDX blog posts
├── public/
│   ├── icons/                 # PWA icons (192x192, 512x512)
│   ├── images/                # Profile photo, OG images
│   ├── fonts/                 # Self-hosted font files
│   └── Ashutosh_India.pdf     # Resume PDF
├── styles/
│   └── globals.css            # Tailwind directives, CSS custom properties
├── tailwind.config.ts         # Design system tokens
├── next.config.mjs            # Next.js + PWA configuration
└── tsconfig.json
```

## Components and Interfaces

### Core Component Interfaces

```typescript
// lib/resume-data.ts
export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    github: string;
    linkedin: string;
    education: Education;
  };
  metrics: ImpactMetric[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  aiTools: AITool[];
  principles: ArchitecturePrinciple[];
}

export interface ImpactMetric {
  label: string;
  value: string;
  numericValue?: number;
  suffix?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  client?: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  isFlagship: boolean;
  techStack: string[];
  challenges: string[];
  outcomes: string[];
  metrics?: Record<string, string>;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  category: string;
}

export interface AITool {
  name: string;
  workflow: string;
  outcome: string;
}

export interface ArchitecturePrinciple {
  title: string;
  description: string; // max 150 chars
  relatedTech: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  period: string;
}
```

### Animation System Interface

```typescript
// lib/animations.ts
import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export const hoverScale = {
  scale: 1.04,
  transition: { duration: 0.2, ease: 'easeOut' },
};

// Respects prefers-reduced-motion
export function useReducedMotion(): boolean;
```

### AI Assistant Interface

```typescript
// API Route: /api/chat
export interface ChatRequest {
  message: string; // 1-500 characters
  sessionHistory: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  sources: string[]; // Resume data sections referenced
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// lib/ai/rag-retrieval.ts
export interface RAGContext {
  relevantSections: string[];
  confidence: number;
}

export function retrieveContext(query: string, resumeData: ResumeData): RAGContext;
```

### Command Palette Interface

```typescript
// components/features/CommandPalette.tsx
export interface SearchResult {
  id: string;
  title: string;
  section: string;
  type: 'section' | 'project' | 'skill' | 'blog';
  href: string;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}
```

### Blog Engine Interface

```typescript
// lib/blog/mdx.ts
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string; // ISO date
  readingTime: number; // minutes
  content: MDXContent;
}

export interface BlogListingProps {
  posts: BlogPost[];
  categories: string[];
  activeCategory?: string;
}

// lib/blog/reading-time.ts
export function calculateReadingTime(content: string): number;
// Formula: Math.max(1, Math.round(wordCount / 200))
```

### Theme System Interface

```typescript
// lib/utils/theme.ts
export type Theme = 'dark' | 'light';

export interface ThemeConfig {
  dark: {
    background: '#000000';
    foreground: '#FFFFFF';
    secondary: '#A1A1AA';
    border: '#27272A';
    card: '#09090B';
    muted: '#111113';
  };
  light: {
    background: '#FFFFFF';
    foreground: '#09090B';
    secondary: '#71717A';
    border: '#E4E4E7';
    card: '#F4F4F5';
    muted: '#FAFAFA';
  };
}

export function getStoredTheme(): Theme | null;
export function setStoredTheme(theme: Theme): void;
```

## Data Models

### Resume Data (Source of Truth)

The `resume-data.ts` file serves as the single source of truth for all content displayed on the platform. It is a statically typed JSON structure that maps directly to the resume PDF.

```typescript
// Concrete data structure (populated from Ashutosh_India.pdf)
const resumeData: ResumeData = {
  personal: {
    name: "Ashutosh Jha",
    title: "Senior Frontend Engineer",
    email: "<contact-email>",
    github: "<github-url>",
    linkedin: "<linkedin-url>",
    education: {
      degree: "B.Tech",
      field: "Computer Science & Engineering",
      institution: "Lovely Professional University",
      period: "2016-2020",
    },
  },
  metrics: [
    { label: "Years Experience", value: "5+", numericValue: 5, suffix: "+" },
    { label: "Countries Served", value: "60+", numericValue: 60, suffix: "+" },
    { label: "Data Grid Rows", value: "100K+", numericValue: 100000, suffix: "+" },
    { label: "AI Processing Time", value: "45min→10sec" },
  ],
  experience: [
    {
      id: "avis",
      company: "Avis Budget Group",
      role: "Software Development Engineer",
      period: "Oct 2023 – Present",
      responsibilities: [],
      achievements: [],
      technologies: [],
    },
    {
      id: "tcs",
      company: "TCS",
      role: "Frontend Developer",
      period: "Oct 2020 – Mar 2023",
      client: "DSB Bank",
      responsibilities: [],
      achievements: [],
      technologies: [],
    },
  ],
  projects: [
    {
      id: "cipher",
      title: "CIPHER AI Platform",
      isFlagship: true,
      techStack: ["React", "TypeScript", "AWS Bedrock", "Strands Agent SDK"],
      challenges: [],
      outcomes: ["5-Agent Pipeline", "45 min → 10 sec processing time", "98.6% accuracy"],
      metrics: { processingTime: "45min→10sec", accuracy: "98.6%" },
    },
    {
      id: "real-estate",
      title: "Corporate Real Estate Platform",
      isFlagship: false,
      techStack: [],
      challenges: [],
      outcomes: [],
    },
    {
      id: "avis-perf",
      title: "Avis.com Performance Optimization",
      isFlagship: false,
      techStack: [],
      challenges: [],
      outcomes: [],
    },
  ],
  skills: [
    { category: "Frontend Frameworks", skills: [
      { name: "React.js", category: "Frontend Frameworks" },
      { name: "Redux", category: "Frontend Frameworks" },
      { name: "Context API", category: "Frontend Frameworks" },
      { name: "React Hooks", category: "Frontend Frameworks" },
      { name: "TypeScript", category: "Frontend Frameworks" },
    ]},
    { category: "Styling", skills: [
      { name: "Material UI", category: "Styling" },
      { name: "Ag-Grid", category: "Styling" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "CSS3", category: "Styling" },
    ]},
    { category: "Languages", skills: [
      { name: "JavaScript (ES6+)", category: "Languages" },
      { name: "HTML5", category: "Languages" },
    ]},
    { category: "APIs", skills: [
      { name: "GraphQL", category: "APIs" },
      { name: "REST APIs", category: "APIs" },
    ]},
    { category: "Tools", skills: [
      { name: "Git", category: "Tools" },
      { name: "GitHub", category: "Tools" },
      { name: "Vite", category: "Tools" },
      { name: "Postman", category: "Tools" },
    ]},
    { category: "AI/ML", skills: [
      { name: "AWS Bedrock", category: "AI/ML" },
      { name: "Strands Agent SDK", category: "AI/ML" },
    ]},
  ],
  aiTools: [
    { name: "ChatGPT", workflow: "", outcome: "" },
    { name: "Claude", workflow: "", outcome: "" },
    { name: "Amazon Q", workflow: "", outcome: "" },
    { name: "Kiro", workflow: "", outcome: "" },
  ],
  principles: [
    { title: "Component-Driven Development", description: "", relatedTech: "" },
    { title: "GraphQL-First", description: "", relatedTech: "" },
    { title: "Performance-First", description: "", relatedTech: "" },
    { title: "Accessibility", description: "", relatedTech: "" },
    { title: "Scalability", description: "", relatedTech: "" },
    { title: "Reusability", description: "", relatedTech: "" },
    { title: "Developer Experience", description: "", relatedTech: "" },
    { title: "AI-Assisted Engineering", description: "", relatedTech: "" },
  ],
};
```

### Blog Post Frontmatter Schema

```yaml
---
title: string          # Post title
description: string    # Meta description (max 160 chars)
category: string       # Category for filtering
publishedAt: string    # ISO 8601 date (YYYY-MM-DD)
tags: string[]         # Optional tags
featured: boolean      # Optional featured flag
---
```

### PWA Manifest Data

```typescript
// app/manifest.ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ashutosh Jha Portfolio",
    short_name: "AJ Portfolio",
    description: "Career acceleration platform for Ashutosh Jha",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```

### SEO Structured Data

```typescript
// JSON-LD schemas embedded in root layout
interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: "Ashutosh Jha";
  jobTitle: "Senior Frontend Engineer";
  url: string;
  sameAs: [string, string]; // GitHub, LinkedIn
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: "Ashutosh Jha Portfolio";
  url: string;
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Content Integrity

*For any* metric, technology, achievement, or experience claim displayed on the platform, it must exist in or be directly derivable from the Resume_Data source. No displayed content shall reference technologies, certifications, or metrics absent from Resume_Data.

**Validates: Requirements 2.2, 3.2, 3.4, 8.2, 20.1, 20.2, 20.5**

### Property 2: RAG Retrieval Constraint

*For any* query submitted to the AI Assistant, the retrieval function shall return only context sections that exist within Resume_Data, and the generated response shall contain no claims not traceable to the retrieved context.

**Validates: Requirements 9.3, 20.3**

### Property 3: Input Validation Rejection

*For any* string that is empty, composed entirely of whitespace, exceeds 500 characters (for chat input), or is shorter than 2 characters (for career story input), the respective validation function shall reject the input and return an appropriate error without initiating a backend request.

**Validates: Requirements 9.8, 21.4**

### Property 4: Fuzzy Search Result Bound

*For any* search query string submitted to the Command Palette, the fuzzy search function shall return at most 10 results, and each result shall reference a valid section, project, skill, or blog post that exists in the search index.

**Validates: Requirements 10.2**

### Property 5: Skills Categorization Completeness

*For any* skill listed in Resume_Data, it shall appear in the skills display under its designated category group. The set of rendered skills shall be exactly equal to the set of skills in Resume_Data — no additions, no omissions.

**Validates: Requirements 11.1, 11.3**

### Property 6: Reading Time Calculation

*For any* blog post content string with a measurable word count, the reading time shall equal `Math.max(1, Math.round(wordCount / 200))` minutes, where word count is determined by splitting on whitespace.

**Validates: Requirements 12.2**

### Property 7: Blog Post Chronological Ordering

*For any* list of blog posts returned by the listing function, posts shall be sorted in strictly descending order by publication date (most recent first).

**Validates: Requirements 12.3**

### Property 8: Category Filter Correctness

*For any* category filter applied to a list of blog posts, all returned posts shall have a category field matching the selected filter, and no posts with a matching category shall be excluded from the results.

**Validates: Requirements 12.4**

### Property 9: Theme Persistence Round-Trip

*For any* theme value (dark or light), storing the theme preference and then retrieving it shall return the identical theme value. The stored preference shall persist across page reloads.

**Validates: Requirements 14.2**

### Property 10: Animation Duration Bounds

*For any* animation variant defined in the Animation System, its duration shall be between 150ms and 500ms inclusive, and its easing function shall be one of 'ease' or 'easeOut'.

**Validates: Requirements 14.5**

### Property 11: Color Contrast Compliance

*For any* text color and background color pair used in the Design System (both dark and light themes), the contrast ratio shall be at least 4.5:1 for normal text (below 18pt regular or 14pt bold) and at least 3:1 for large text (18pt regular or 14pt bold and above).

**Validates: Requirements 16.6**

### Property 12: Meta Content Length Bounds

*For any* page in the platform, the meta title shall be at most 60 characters and the meta description shall be at most 160 characters, with each title containing the page topic and site name.

**Validates: Requirements 17.6**

### Property 13: About Section Word Count

*For any* valid about section content, the word count shall be between 50 and 200 words inclusive.

**Validates: Requirements 3.1**

### Property 14: Principle Description Length

*For any* architecture principle description in the platform, the character count shall be at most 150 characters.

**Validates: Requirements 5.3**

### Property 15: Career Story Word Count

*For any* valid role/company input of 2 to 500 characters, the generated career narrative shall contain between 150 and 800 words.

**Validates: Requirements 21.1**

### Property 16: Career Story Content Integrity

*For any* generated career narrative, all referenced technologies, achievements, and experience claims shall be traceable to Resume_Data. Technologies or experience not present in Resume_Data shall be omitted, and the narrative shall indicate which requested areas are not represented.

**Validates: Requirements 21.2**

## Error Handling

### Error Categories and Strategies

| Category | Trigger | User-Facing Behavior | Technical Strategy |
|----------|---------|---------------------|-------------------|
| AI Service Unavailable | Gemini Flash API timeout/error | "AI assistant is temporarily unavailable" toast; input retained | Catch fetch errors, return structured error response, retry with exponential backoff (max 2 retries) |
| Resume Download Failure | PDF file missing or network error | "Resume could not be downloaded" inline message | Check file existence at build time; runtime: catch download errors |
| Input Validation | Empty, whitespace-only, or oversized input | Inline validation message below input field | Client-side validation before API call; server-side validation as backup |
| RAG No Context | Query has no relevant Resume_Data match | "I don't have information about that" response | Confidence threshold on retrieval; below threshold triggers fallback |
| Offline - Uncached | User offline requesting uncached page | Offline fallback page with navigation to cached pages | Service worker returns fallback HTML for uncached routes |
| Service Worker Update | New SW version detected | "Updated content available" notification banner | `skipWaiting` on user confirmation; update on next navigation |

### Error Boundary Strategy

```typescript
// Global error boundary in app/error.tsx
// Section-level error boundaries for isolated failures
// AI features degrade gracefully without breaking the page

// Hierarchy:
// 1. app/error.tsx - catches unhandled page-level errors
// 2. app/blog/error.tsx - blog-specific errors
// 3. Component-level try/catch for AI features
// 4. API route error responses with structured JSON
```

### Graceful Degradation

- **AI Assistant offline**: Chat button remains visible but shows "unavailable" state
- **Gemini API rate limited**: Queue requests, show loading state, timeout after 5s
- **Images fail to load**: Next.js Image placeholder (blur) remains visible
- **Fonts fail to load**: System font stack via font-display: swap
- **Service worker fails**: Site works as standard web app without offline support

## Testing Strategy

### Testing Approach

This platform uses a dual testing strategy combining property-based tests for universal correctness guarantees with example-based tests for specific UI behaviors and integration points.

### Property-Based Testing

**Library**: [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, integrates with Vitest)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: career-platform, Property {N}: {description}`

**Properties to implement**:

| Property | Module Under Test | Generator Strategy |
|----------|------------------|-------------------|
| 1: Content Integrity | `resume-data.ts` + section components | Generate random section renders, verify all content traces to ResumeData |
| 2: RAG Retrieval | `lib/ai/rag-retrieval.ts` | Generate random query strings, verify returned context is subset of ResumeData |
| 3: Input Validation | `lib/utils/validation.ts` | Generate strings of various lengths (0, 1, 500, 501, whitespace) |
| 4: Search Result Bound | `lib/search-index.ts` | Generate random query strings, verify result count <= 10 |
| 5: Skills Categorization | `components/sections/SkillsDisplay.tsx` | Enumerate all ResumeData skills, verify presence and category |
| 6: Reading Time | `lib/blog/reading-time.ts` | Generate random word-count strings, verify formula |
| 7: Blog Ordering | `lib/blog/mdx.ts` | Generate random post arrays with dates, verify sort order |
| 8: Category Filter | Blog listing logic | Generate random posts + category, verify filter correctness |
| 9: Theme Round-Trip | `lib/utils/theme.ts` | Generate theme values, verify localStorage round-trip |
| 10: Animation Bounds | `lib/animations.ts` | Enumerate all variants, verify duration/easing constraints |
| 11: Color Contrast | Design system tokens | Enumerate all color pairs, compute contrast ratio |
| 12: Meta Length | Metadata generation | Generate page metadata, verify length constraints |
| 13: About Word Count | About section content | Verify static content meets word count bounds |
| 14: Principle Length | Principles data | Enumerate all descriptions, verify char count |
| 15: Career Story Length | `/api/career-story` | Generate valid inputs, verify output word count (with mocked Gemini) |
| 16: Career Story Integrity | `/api/career-story` | Verify generated content references only ResumeData (with mocked Gemini) |

### Unit Tests (Example-Based)

**Framework**: Vitest + React Testing Library

**Coverage areas**:
- Component rendering (Hero, Timeline, Projects, Skills, Contact)
- Interactive behaviors (accordion expand/collapse, mobile menu toggle)
- Keyboard navigation (Command Palette arrow keys, Escape dismissal)
- Animation trigger conditions (IntersectionObserver thresholds)
- Error states (API failures, missing files)
- Accessibility (ARIA attributes, semantic HTML, skip link)

### Integration Tests

**Framework**: Playwright

**Coverage areas**:
- Full page load and navigation flow
- AI Assistant end-to-end conversation (with mocked Gemini)
- PWA install flow and offline behavior
- Responsive layout at 320px, 768px, 1024px, 1440px, 2560px
- Lighthouse CI scores (Performance > 95, Accessibility = 100, SEO = 100)
- Service worker caching and update flow

### Accessibility Testing

- **Automated**: axe-core via @axe-core/playwright on all pages
- **Manual**: Screen reader testing (VoiceOver, NVDA), keyboard-only navigation
- **Note**: Full WCAG 2.1 AA validation requires manual testing with assistive technologies and expert accessibility review

### Performance Testing

- **Bundle analysis**: `@next/bundle-analyzer` to verify < 200KB initial JS
- **Lighthouse CI**: Automated in CI pipeline
- **Web Vitals monitoring**: Vercel Analytics for real-user metrics

