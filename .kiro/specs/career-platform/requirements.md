# Requirements Document

## Introduction

A comprehensive career acceleration platform and personal portfolio for Ashutosh Jha, Senior Frontend Engineer. The platform is designed to convince recruiters, engineering managers, staff engineers, directors, and CTOs to schedule an interview within 30 seconds of visiting. Built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion, the site follows a dark-mode-first, premium editorial design with massive typography, minimal aesthetics, and enterprise-grade performance.

## Glossary

- **Platform**: The career acceleration portfolio web application built with Next.js App Router
- **Visitor**: Any person viewing the platform (recruiters, engineering managers, staff engineers, directors, CTOs)
- **Hero_Section**: The full-viewport landing area displaying name, photo, floating metrics, and CTAs
- **Impact_Dashboard**: The animated counters section showing quantified engineering achievements
- **Timeline**: The interactive chronological display of professional experience
- **Project_Card**: A featured project display component with engineering case study details
- **AI_Assistant**: The floating "Ask About Ashutosh" chatbot powered by Gemini Flash with RAG
- **Command_Palette**: The Ctrl+K triggered fuzzy search overlay inspired by Linear
- **Skill_Card**: An interactive premium card component displaying a technical skill
- **Blog_Engine**: The MDX-powered content system with categories, filters, and reading time
- **Design_System**: The token-based visual system (dark mode default, #000000 background, #FFFFFF primary text, #A1A1AA secondary text, #27272A borders, #09090B cards, #111113 muted surface)
- **Animation_System**: The Framer Motion-based animation layer supporting fade, scale, slide, hover, and stagger effects
- **Resume_Data**: The verified source of truth containing only achievements, metrics, and technologies from Ashutosh Jha's actual resume
- **PWA**: Progressive Web App capabilities including web manifest, service worker, and offline support
- **RSC**: React Server Components used for server-rendered content
- **Server_Actions**: Next.js Server Actions for form handling and mutations

## Requirements

### Requirement 1: Hero Section

**User Story:** As a visitor, I want to see a compelling full-viewport hero section with massive typography, a profile photo, floating impact metrics, and clear CTAs, so that I immediately understand Ashutosh's seniority and impact within seconds.

#### Acceptance Criteria

1. WHEN the Platform loads, THE Hero_Section SHALL render at full viewport height with the name "Ashutosh Jha" displayed in typography at minimum 8rem on desktop viewports and minimum 2.5rem on mobile viewports (below 768px)
2. WHEN the Platform loads, THE Hero_Section SHALL display a centered profile photo overlaid on the typography
3. WHEN the Platform loads, THE Hero_Section SHALL display metric badges positioned around the profile photo area showing "5+ Years", "60+ Countries", "100K+ Rows", and "45min→10sec", each entering with an Animation_System fade or slide animation
4. THE Hero_Section SHALL display three CTA buttons: "Download Resume", "View Projects", and "Contact"
5. WHEN a visitor clicks "Download Resume", THE Platform SHALL initiate a download of the resume PDF file
6. IF the resume PDF file is unavailable or the download fails, THEN THE Platform SHALL display an error message indicating the resume could not be downloaded
7. WHEN a visitor clicks "View Projects", THE Platform SHALL scroll to the Featured Projects section using smooth scroll behavior completing within 1 second
8. WHEN a visitor clicks "Contact", THE Platform SHALL scroll to the Contact section using smooth scroll behavior completing within 1 second
9. THE Hero_Section SHALL display the tagline "Senior Frontend Engineer" below the name

### Requirement 2: Impact Metrics Dashboard

**User Story:** As a visitor, I want to see animated counters displaying quantified engineering impact, so that I can quickly assess the scale of Ashutosh's contributions.

#### Acceptance Criteria

1. WHEN at least 50% of the Impact_Dashboard becomes visible in the viewport, THE Animation_System SHALL trigger count-up animations from zero to the final value for each metric, completing within 2 seconds, and SHALL trigger the animation only once per page load
2. THE Impact_Dashboard SHALL display only metrics traceable to Resume_Data: years of experience, countries served, data grid rows handled, and AI processing time reduction
3. WHEN the count-up animation completes, THE Impact_Dashboard SHALL hold the final values in a static display indefinitely until the page is navigated away or refreshed
4. THE Impact_Dashboard SHALL render metrics in a responsive grid layout displaying a single column on viewports below 768px and a multi-column layout of at least 2 columns on viewports 768px and above

### Requirement 3: About Section

**User Story:** As a visitor, I want to read a narrative-driven summary of Ashutosh's engineering focus, so that I understand the professional identity and specialization.

#### Acceptance Criteria

1. THE Platform SHALL display an About section containing a narrative summary of at least 50 words and no more than 200 words that communicates enterprise frontend engineering expertise, domains served, and years of experience
2. THE About section SHALL reference only technologies and experience present in Resume_Data
3. WHEN at least 20% of the About section becomes visible in the viewport, THE Animation_System SHALL apply a fade-in animation with a duration between 400ms and 800ms to the content
4. IF the About section content references a technology or achievement not present in Resume_Data, THEN THE Platform SHALL omit that reference from the displayed narrative

### Requirement 4: Technical Leadership Section

**User Story:** As a visitor, I want to understand Ashutosh's technical leadership contributions, so that I can assess architecture ownership and team impact.

#### Acceptance Criteria

1. THE Platform SHALL display a Technical Leadership section highlighting architecture ownership, frontend standards establishment, and shared component systems
2. THE Technical Leadership section SHALL reference the reusable component systems built across 5+ modules as documented in Resume_Data
3. THE Technical Leadership section SHALL reference Core Web Vitals optimization work on avis.com (Fortune 500, 60+ countries) as documented in Resume_Data
4. WHEN the Technical Leadership section scrolls into view, THE Animation_System SHALL apply staggered fade-in animations to each leadership pillar

### Requirement 5: Architecture Principles Section

**User Story:** As a visitor, I want to see the engineering principles Ashutosh follows, so that I can evaluate alignment with my team's engineering culture.

#### Acceptance Criteria

1. THE Platform SHALL display an Architecture Principles section listing: Component-Driven Development, GraphQL-First, Performance-First, Accessibility, Scalability, Reusability, Developer Experience, and AI-Assisted Engineering
2. WHEN a visitor hovers over a principle card on a pointer-enabled device, THE Animation_System SHALL apply a scale animation between 1.02x and 1.05x with a duration between 150ms and 300ms
3. THE Architecture Principles section SHALL present each principle with a description of no more than 150 characters connecting it to a specific technology or achievement in Resume_Data
4. THE Architecture Principles section SHALL render principle cards in a responsive grid layout adapting from a single column on viewports below 768px to a multi-column grid on wider viewports

### Requirement 6: Experience Timeline

**User Story:** As a visitor, I want to explore an interactive timeline of professional experience, so that I can understand career progression and role responsibilities.

#### Acceptance Criteria

1. THE Timeline SHALL display two roles in reverse chronological order: Software Development Engineer at Avis Budget Group (Oct 2023 – Present) and Frontend Developer at TCS (Oct 2020 – Mar 2023, Client: DSB Bank), with all entries in a collapsed state by default
2. WHEN a visitor clicks a collapsed timeline entry, THE Timeline SHALL expand that entry to show role details, responsibilities, and achievements from Resume_Data
3. WHEN a visitor clicks an already-expanded timeline entry, THE Timeline SHALL collapse that entry back to its summary state
4. THE Timeline SHALL render in a vertical layout with visual connectors between entries
5. WHEN the Timeline scrolls into view, THE Animation_System SHALL apply staggered fade-in animations to each entry with a delay of 150ms between consecutive entries

### Requirement 7: Featured Projects

**User Story:** As a visitor, I want to explore detailed engineering case studies of key projects, so that I can evaluate technical depth and problem-solving ability.

#### Acceptance Criteria

1. THE Platform SHALL display Project_Cards for: Corporate Real Estate Platform, Avis.com Performance Optimization, and CIPHER AI Platform
2. THE CIPHER AI Platform Project_Card SHALL be visually distinguished as the flagship project by appearing first in display order and rendering at a larger card size than the other Project_Cards
3. WHEN a visitor clicks a Project_Card, THE Platform SHALL expand the card to display engineering details including tech stack, challenges, and outcomes traceable to Resume_Data
4. WHEN a visitor clicks a different Project_Card while another is expanded, THE Platform SHALL collapse the previously expanded Project_Card and expand the newly selected one
5. THE CIPHER Project_Card SHALL display: React, TypeScript, AWS Bedrock, Strands Agent SDK, 5-Agent Pipeline, 45 min → 10 sec processing time, and 98.6% accuracy
6. WHEN a visitor clicks the AI Project Explainer on a Project_Card, THE AI_Assistant SHALL provide a conversational explanation of the project's technical architecture within 5 seconds
7. IF the AI_Assistant is unavailable when a visitor clicks the AI Project Explainer, THEN THE Platform SHALL display an error message indicating the AI explanation is temporarily unavailable

### Requirement 8: AI Engineering Section

**User Story:** As a visitor, I want to see how Ashutosh integrates AI tools into engineering workflows, so that I can assess modern development practices.

#### Acceptance Criteria

1. THE Platform SHALL display an AI Engineering section listing each AI tool (ChatGPT, Claude, Amazon Q, and Kiro) with a corresponding workflow use case description derived from Resume_Data
2. THE AI Engineering section SHALL reference only AI tools listed in Resume_Data
3. THE AI Engineering section SHALL present at least one concrete workflow example per AI tool, each describing the engineering task enhanced and the outcome achieved, traceable to Resume_Data
4. WHEN the AI Engineering section scrolls into the viewport, THE Animation_System SHALL apply staggered fade-in animations to each tool entry

### Requirement 9: AI Assistant ("Ask About Ashutosh")

**User Story:** As a visitor, I want to ask questions about Ashutosh's experience and get instant AI-powered answers, so that I can quickly find specific information relevant to my hiring decision.

#### Acceptance Criteria

1. THE Platform SHALL display a floating AI_Assistant button accessible from all sections
2. WHEN a visitor clicks the AI_Assistant button, THE Platform SHALL open a chat interface that displays conversation history for the current browser session
3. WHEN a visitor submits a question of up to 500 characters, THE AI_Assistant SHALL respond using only information from Resume_Data via RAG retrieval
4. IF the AI_Assistant cannot find relevant information in Resume_Data, THEN THE AI_Assistant SHALL respond that the information is not available rather than generating unverified content
5. THE AI_Assistant SHALL use Gemini Flash as the language model backend
6. WHEN the AI_Assistant generates a response, THE AI_Assistant SHALL complete the response within 3 seconds for queries of up to 200 characters
7. IF the Gemini Flash API is unavailable or returns an error, THEN THE AI_Assistant SHALL display an error message indicating the service is temporarily unavailable and retain the visitor's question in the input field
8. IF a visitor submits an empty question or a question exceeding 500 characters, THEN THE AI_Assistant SHALL display a validation message indicating the allowed input length and SHALL NOT send the query to the backend

### Requirement 10: Command Palette

**User Story:** As a visitor, I want to use a keyboard-driven command palette to quickly navigate the site, so that I can find information efficiently without scrolling.

#### Acceptance Criteria

1. WHEN a visitor presses Ctrl+K (or Cmd+K on macOS), THE Command_Palette SHALL open as a centered overlay and place focus in the search input field
2. WHEN a visitor types in the Command_Palette, THE Command_Palette SHALL perform fuzzy search across all sections, projects, skills, and blog posts and display a maximum of 10 matching results
3. WHEN a visitor selects a search result by clicking it or pressing Enter on a highlighted result, THE Command_Palette SHALL navigate to the corresponding section or page and close the overlay
4. WHEN a visitor presses Escape or clicks outside, THE Command_Palette SHALL close and return focus to the previously focused element
5. THE Command_Palette SHALL display a visual hint indicating the Ctrl+K shortcut in the navigation area
6. WHILE the Command_Palette is open, THE Command_Palette SHALL support arrow key navigation (Up/Down) to move highlight between search results
7. IF the visitor's search query returns no matching results, THEN THE Command_Palette SHALL display a message indicating no results were found

### Requirement 11: Skills Display

**User Story:** As a visitor, I want to explore technical skills through premium interactive cards, so that I can quickly assess technology expertise without reading boring lists.

#### Acceptance Criteria

1. THE Platform SHALL display Skill_Cards for all technologies listed in Resume_Data: React.js, Redux, Context API, React Hooks, TypeScript, Material UI, Ag-Grid, Tailwind CSS, JavaScript (ES6+), HTML5, CSS3, GraphQL, REST APIs, Git, GitHub, Vite, Postman, AWS Bedrock, and Strands Agent SDK
2. WHEN a visitor hovers over a Skill_Card, THE Animation_System SHALL apply a scale transform (between 1.03 and 1.08) or elevation change within a transition duration of 200 to 400 milliseconds
3. THE Skill_Cards SHALL be organized by category with the following mapping: Frontend Frameworks (React.js, Redux, Context API, React Hooks, TypeScript), Styling (Material UI, Ag-Grid, Tailwind CSS, CSS3), Languages (JavaScript ES6+, HTML5), APIs (GraphQL, REST APIs), Tools (Git, GitHub, Vite, Postman), AI/ML (AWS Bedrock, Strands Agent SDK)
4. THE Skill_Cards SHALL render in a responsive grid with a minimum of 2 columns on viewports 320px and above, and a maximum of 6 columns on viewports 1280px and above
5. WHEN a visitor taps a Skill_Card on a touch device, THE Animation_System SHALL apply the same scale or elevation animation as the hover interaction

### Requirement 12: Blog Engine

**User Story:** As a visitor, I want to read technical blog posts with categories and filters, so that I can evaluate thought leadership and communication skills.

#### Acceptance Criteria

1. THE Blog_Engine SHALL render MDX content with support for custom React components, code blocks, images, and embedded media within post bodies
2. THE Blog_Engine SHALL display categories, reading time estimates (calculated at 200 words per minute, rounded to the nearest minute, minimum 1 minute), and publication dates for each post
3. THE Blog_Engine SHALL display posts in reverse chronological order by publication date on the blog listing page
4. WHEN a visitor selects a category filter, THE Blog_Engine SHALL display only posts matching the selected category while maintaining reverse chronological order
5. IF no posts match the selected category filter, THEN THE Blog_Engine SHALL display an empty state message indicating no posts are available for that category
6. THE Blog_Engine SHALL support syntax highlighting for code blocks with language-specific formatting
7. THE Blog_Engine SHALL generate static pages at build time using Next.js static generation

### Requirement 13: Contact Section

**User Story:** As a visitor, I want to find contact information and professional links in a premium layout, so that I can reach out to schedule an interview.

#### Acceptance Criteria

1. THE Platform SHALL display a Contact section with links to GitHub, LinkedIn, and Email, each with a visible label identifying the link destination
2. WHEN a visitor clicks the Resume Download button in the Contact section, THE Platform SHALL initiate a download of the resume PDF file
3. THE Contact section SHALL render with a minimum padding of 48px, visually distinct heading, and contact links grouped with consistent spacing between items
4. WHEN a visitor clicks the GitHub or LinkedIn link, THE Platform SHALL open the link in a new browser tab
5. WHEN a visitor clicks the Email link, THE Platform SHALL open the visitor's default email client with the recipient address pre-filled
6. IF the resume PDF file is unavailable during download, THEN THE Platform SHALL display an error message indicating the file could not be downloaded

### Requirement 14: Design System and Visual Identity

**User Story:** As a visitor, I want to experience a premium, dark-mode-first editorial design, so that the site communicates senior-level professionalism.

#### Acceptance Criteria

1. THE Design_System SHALL use dark mode as the default theme with background #000000, primary text #FFFFFF, secondary text #A1A1AA, borders #27272A, accent white only, cards #09090B, and muted surface #111113
2. WHEN a visitor activates the theme toggle, THE Platform SHALL switch between dark and light modes and persist the selected preference in local storage so that subsequent visits default to the last chosen mode
3. WHEN the Platform loads and no stored theme preference exists, THE Platform SHALL render in dark mode without a visible flash of light-mode content
4. THE Design_System SHALL use heading typography at a minimum of 3rem on mobile and 5rem on desktop, with letter-spacing no greater than -0.02em and line-height between 1.0 and 1.2 for headings
5. THE Animation_System SHALL constrain all animations to a duration between 150ms and 500ms using ease or ease-out easing, limited to fade, scale, slide, hover, and stagger effects
6. THE Design_System SHALL NOT use neon colors (saturation above 80% at full brightness), gaming-style decorative elements such as pixel art or glitch effects, or glassmorphism (blurred translucent layers)

### Requirement 15: Performance

**User Story:** As a visitor, I want the site to load instantly and feel responsive, so that I have a premium browsing experience regardless of device or network.

#### Acceptance Criteria

1. THE Platform SHALL achieve a Lighthouse Performance score greater than 95 when tested on the homepage using mobile device emulation with simulated 4G throttling
2. THE Platform SHALL achieve Lighthouse Accessibility score of 100, SEO score of 100, and Best Practices score of 100 when tested on the homepage using mobile device emulation
3. THE Platform SHALL implement code splitting and dynamic imports for below-the-fold sections including the Blog_Engine, AI_Assistant chat interface, and Command_Palette
4. THE Platform SHALL optimize all images using Next.js Image component, serving WebP or AVIF format, and ensuring no single image asset exceeds 200 KB in transferred size
5. THE Platform SHALL implement font optimization with font-display swap and subset loading
6. THE Platform SHALL utilize edge rendering via Vercel with a Time to First Byte (TTFB) of no more than 200 milliseconds for cached pages
7. THE Platform SHALL deliver an initial page load bundle size of no more than 200 KB of JavaScript (compressed/transferred) for the homepage

### Requirement 16: Accessibility

**User Story:** As a visitor using assistive technology, I want the site to be fully accessible, so that I can navigate and consume all content regardless of ability.

#### Acceptance Criteria

1. THE Platform SHALL meet WCAG 2.1 AA compliance across all sections as verified by automated accessibility testing tools reporting zero critical or serious violations
2. THE Platform SHALL use semantic HTML elements (header, nav, main, section, article, footer) in place of generic div elements wherever document structure or landmark regions are conveyed
3. THE Platform SHALL support keyboard navigation for all interactive elements using Tab and Shift+Tab for focus movement, Enter or Space for activation, Escape for dismissing overlays, and Arrow keys for navigating within composite widgets
4. THE Platform SHALL provide ARIA labels on all interactive elements that lack visible text, ARIA roles on custom widgets that have no native HTML semantic equivalent, and alt text on all non-decorative images
5. WHEN a visitor has reduced motion preferences enabled, THE Animation_System SHALL replace all motion-based animations (fade, scale, slide, stagger) with immediate state changes or opacity-only transitions using the prefers-reduced-motion media query
6. THE Platform SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text (below 18pt regular or 14pt bold) and 3:1 for large text (18pt regular or 14pt bold and above) in both dark and light theme modes
7. THE Platform SHALL display a visible focus indicator with a minimum 2px outline on all interactive elements when navigated via keyboard
8. THE Platform SHALL provide a skip-to-main-content link as the first focusable element on each page, visible on keyboard focus, that moves focus to the main content area

### Requirement 17: SEO and Metadata

**User Story:** As a visitor finding the site through search, I want proper metadata and structured data, so that search engines accurately represent the site in results.

#### Acceptance Criteria

1. THE Platform SHALL include Open Graph metadata on every page containing at minimum: og:title, og:description, og:image (minimum 1200×630 pixels), og:url, and og:type
2. THE Platform SHALL include Twitter Card metadata on every page containing at minimum: twitter:card (set to "summary_large_image"), twitter:title, and twitter:description
3. THE Platform SHALL generate a robots.txt file that permits crawling of all public pages and disallows crawling of API routes and internal asset paths
4. THE Platform SHALL generate a sitemap.xml file following the XML Sitemap protocol that lists all public pages including individual blog post URLs, with each entry containing a lastmod date
5. THE Platform SHALL include JSON-LD structured data using schema.org Person schema (with name, jobTitle, url, and sameAs linking to GitHub and LinkedIn) and WebSite schema (with name, url, and potentialAction for search)
6. THE Platform SHALL include a unique meta title (maximum 60 characters) and meta description (maximum 160 characters) for each page, where each title contains the page topic and the site name
7. THE Platform SHALL include a canonical URL link element on every page to prevent duplicate content indexing

### Requirement 18: Progressive Web App

**User Story:** As a visitor, I want to install the site as a PWA and access it offline, so that I can review Ashutosh's portfolio without an internet connection.

#### Acceptance Criteria

1. THE PWA SHALL include a valid web manifest containing app name "Ashutosh Jha Portfolio", at least two icon sizes (192x192 and 512x512 in PNG format), theme color matching the Design_System background, and display mode set to "standalone"
2. THE PWA SHALL register a service worker that caches static assets (CSS, JavaScript bundles, fonts, and images) on install, and caches page content using a network-first strategy for previously visited pages
3. WHEN the browser fires the beforeinstallprompt event, THE Platform SHALL present an install option to the visitor
4. WHEN the visitor is offline, THE PWA SHALL serve cached content for previously visited pages with cached assets remaining valid for up to 7 days since last network fetch
5. WHEN the visitor is offline and requests uncached content, THE PWA SHALL display an offline fallback page that indicates the visitor is offline and provides navigation links to cached pages
6. WHEN a new service worker version is available, THE PWA SHALL notify the visitor that updated content is available and apply the update on the next page navigation

### Requirement 19: Navigation

**User Story:** As a visitor, I want minimal, clear navigation, so that I can move between sections without distraction.

#### Acceptance Criteria

1. THE Platform SHALL display a navigation menu containing links to: About, Experience, Projects, Skills, Blog, and Contact sections, plus the Command_Palette shortcut hint
2. THE Platform SHALL include a theme toggle in the navigation area
3. WHEN a visitor scrolls down past the Hero_Section, THE navigation SHALL remain visible at the top of the viewport using sticky positioning
4. WHEN a visitor clicks a navigation link, THE Platform SHALL smooth-scroll to the target section within 800 milliseconds
5. WHEN the viewport width is below 768px, THE navigation SHALL collapse into a hamburger menu icon
6. WHEN a visitor taps the hamburger menu icon, THE Platform SHALL expand the mobile navigation menu displaying all navigation links
7. WHEN a visitor selects a link or taps outside the mobile menu, THE Platform SHALL close the mobile navigation menu

### Requirement 20: Content Integrity

**User Story:** As a visitor, I want all displayed information to be accurate and verifiable, so that I can trust the claims made on the platform.

#### Acceptance Criteria

1. THE Platform SHALL display only metrics, technologies, achievements, and experience that are either verbatim from or directly paraphrased from Resume_Data, such that each claim can be traced to a specific entry in Resume_Data
2. THE Platform SHALL NOT display invented certifications, fabricated metrics, or technologies not present in Resume_Data
3. WHEN a visitor submits a question, THE AI_Assistant SHALL generate responses using only information retrievable from Resume_Data and SHALL NOT extrapolate, infer, or fabricate details beyond what Resume_Data contains
4. THE Platform SHALL attribute the education as B.Tech, Computer Science & Engineering, Lovely Professional University (2016-2020)
5. IF any section displays a quantified metric (percentage, count, duration, or comparison), THEN THE Platform SHALL ensure that metric corresponds to a specific value documented in Resume_Data

### Requirement 21: Career Story Generator

**User Story:** As a visitor, I want to generate a tailored career narrative for Ashutosh based on a specific role or company context, so that I can quickly assess fit for my open position.

#### Acceptance Criteria

1. WHEN a visitor provides a target role or company context via a text input field of 1 to 500 characters, THE Platform SHALL generate a career narrative of 150 to 800 words that highlights Resume_Data achievements relevant to the specified role or company
2. IF the visitor's query references technologies or experience not in Resume_Data, THEN THE Platform SHALL omit those references rather than fabricating relevance and SHALL indicate which requested areas are not represented in Ashutosh's background
3. THE Career Story Generator SHALL complete narrative generation within 5 seconds
4. IF the visitor submits an empty input or an input shorter than 2 characters, THEN THE Platform SHALL display an error message indicating that a role or company context is required and SHALL NOT initiate narrative generation
5. IF Resume_Data contains no experience relevant to the visitor's specified role or company context, THEN THE Platform SHALL display a message indicating insufficient matching experience rather than generating an unrelated narrative

### Requirement 22: Responsive Design

**User Story:** As a visitor on any device, I want the platform to render correctly across all screen sizes, so that I have a consistent premium experience on mobile, tablet, and desktop.

#### Acceptance Criteria

1. THE Platform SHALL render on viewports from 320px to 2560px width without horizontal overflow, content truncation, or overlapping interactive elements
2. THE Platform SHALL use responsive typography that scales between a minimum body font size of 14px at the 320px viewport and a maximum body font size of 18px at the 1280px viewport, using the breakpoints: mobile (320px–767px), tablet (768px–1023px), and desktop (1024px and above)
3. THE Platform SHALL adapt grid layouts from single column on mobile (below 768px) to two columns on tablet (768px–1023px) and to a maximum of three or more columns on desktop (1024px and above)
4. THE Hero_Section SHALL display the name typography at a minimum of 2.5rem on mobile viewports and scale up to 8rem on desktop viewports, maintaining full visibility of all hero content (name, tagline, photo, metric badges, and CTAs) without requiring horizontal scrolling
5. WHILE the viewport width is below 768px, THE Platform SHALL render all interactive elements (buttons, links, cards) with a minimum touch target size of 44×44 pixels
