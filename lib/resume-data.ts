// lib/resume-data.ts
// Single source of truth for all content displayed on the platform.
// All data is sourced exclusively from Ashutosh Jha's verified resume (Ashutosh_India.pdf).

export interface Education {
  degree: string;
  field: string;
  institution: string;
  period: string;
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
  description?: string;
  role?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Skill {
  name: string;
  category: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
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

export interface ResumeData {
  personal: {
    name: string;
    title: string;
    subtitle?: string;
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

export const resumeData: ResumeData = {
  personal: {
    name: "Ashutosh Jha",
    title: "Frontend Engineer",
    subtitle: "Building scalable frontend architecture for enterprise platforms — performance, AI, and design systems.",
    email: "jashutosh498@gmail.com",
    github: "https://github.com/ashutoshjhacodes",
    linkedin: "https://linkedin.com/in/mrjha",
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
      responsibilities: [
        "Led end-to-end frontend for Corporate Real Estate suite (Lease, Location, Airport, Finance) — architecture through production on a Fortune 500 global platform serving 60+ countries",
        "Built shared component library (hooks, modals, form utils) across 5+ enterprise modules, cutting duplicate implementation by ~30%",
        "Built Ag-Grid tables stable at 100K+ rows with server-side pagination, filtering & CSV export",
        "Optimised avis.com Core Web Vitals (LCP, CLS, FID) via code-splitting, lazy loading & asset delivery",
        "Integrated GraphQL & REST APIs across modules; contributed to Fleet Management dashboards & process automation",
        "Accelerated delivery using AI tools (Claude, ChatGPT, Amazon Q, Kiro) for code generation, debugging & PR reviews",
      ],
      achievements: [
        "Improved Core Web Vitals scores across avis.com serving 60+ countries",
        "Architected reusable component library shared across 5+ product modules, cutting duplication by ~30%",
        "Implemented high-performance data grids handling 100K+ rows with server-side pagination",
        "Reduced page load times through code splitting and lazy loading strategies",
      ],
      technologies: [
        "React.js",
        "TypeScript",
        "GraphQL",
        "Ag-Grid",
        "Material UI",
        "REST APIs",
        "Vite",
        "Git",
      ],
    },
    {
      id: "tcs",
      company: "TCS",
      role: "Frontend Developer",
      period: "Oct 2020 – Mar 2023",
      client: "DSB Bank",
      responsibilities: [
        "Built 8+ business-critical banking web apps for DSB Bank",
        "Integrated ServiceNow automating 5+ manual processes and reducing resolution time across key banking workflows",
        "Developed 10+ reusable React components across 3 apps, cutting per-feature delivery by ~20%",
        "Owned full release cycles — sprint planning through UAT & production across 3 major releases",
      ],
      achievements: [
        "Delivered 8+ business-critical banking web applications",
        "Automated 5+ manual processes via ServiceNow integration, reducing resolution time",
        "Built 10+ reusable React components cutting per-feature delivery by ~20%",
        "Awarded Best Team Award & On-the-Spot Award for high-impact contributions on critical production releases",
      ],
      technologies: [
        "React.js",
        "JavaScript (ES6+)",
        "ServiceNow",
        "REST APIs",
        "HTML5",
        "CSS3",
        "Git",
      ],
    },
  ],
  projects: [
    {
      id: "cipher",
      title: "CIPHER AI Platform",
      isFlagship: true,
      description: "AI-powered fleet damage assessment platform reducing processing from 45 minutes to 10 seconds",
      role: "Lead Frontend Engineer — built 30+ React/TS components in 48 hours",
      techStack: ["React", "TypeScript", "AWS Bedrock", "Strands Agent SDK"],
      challenges: [
        "Processing complex fleet damage documents that previously took 45 minutes manually",
        "Orchestrating a 5-agent AWS Bedrock pipeline for accurate data extraction",
        "Achieving 98.6% accuracy across diverse document formats",
        "Delivering 30+ React/TS components in 48 hours during hackathon",
      ],
      outcomes: [
        "5-Agent Pipeline architecture for fleet damage assessment",
        "45 min → 10 sec processing time reduction",
        "98.6% accuracy in automated data extraction",
        "80%+ reduction in per-assessment operational cost",
        "Fleet-wide damage analysis across 1,000s of vehicles",
      ],
      metrics: {
        processingTime: "45min→10sec",
        accuracy: "98.6%",
        agents: "5",
        costReduction: "80%+",
      },
    },
    {
      id: "real-estate",
      title: "Corporate Real Estate Platform",
      isFlagship: false,
      description: "Enterprise real estate management suite for Fortune 500 global operations across 60+ countries",
      role: "Lead Frontend Architect — designed scalable component library",
      techStack: ["React.js", "TypeScript", "GraphQL", "Ag-Grid", "Material UI", "REST APIs"],
      challenges: [
        "Managing complex state for multi-module enterprise suite (Lease, Location, Airport, Finance)",
        "Building data grids stable at 100K+ rows with server-side pagination and filtering",
        "Creating shared component library across 5+ enterprise modules",
      ],
      outcomes: [
        "End-to-end frontend for Corporate Real Estate suite serving Fortune 500 platform across 60+ countries",
        "Shared component library cutting duplicate implementation by ~30%",
        "High-performance Ag-Grid tables handling 100K+ rows with CSV export",
      ],
    },
    {
      id: "avis-perf",
      title: "Avis.com Performance Optimization",
      isFlagship: false,
      description: "Core Web Vitals optimization for a global car rental platform serving millions of users",
      role: "Performance Engineer — code splitting, lazy loading, asset delivery",
      techStack: ["React.js", "TypeScript", "Vite", "Tailwind CSS"],
      challenges: [
        "Optimizing Core Web Vitals (LCP, CLS, FID) for a Fortune 500 website serving 60+ countries",
        "Implementing code splitting and lazy loading for a large-scale enterprise application",
        "Improving asset delivery for millions of global users",
      ],
      outcomes: [
        "Measurably faster Core Web Vitals across 60+ country deployments",
        "Reduced initial bundle size through strategic code splitting and lazy loading",
        "Improved asset delivery performance for millions of global users",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend Frameworks",
      skills: [
        { name: "React.js", category: "Frontend Frameworks" },
        { name: "Redux", category: "Frontend Frameworks" },
        { name: "Context API", category: "Frontend Frameworks" },
        { name: "React Hooks", category: "Frontend Frameworks" },
        { name: "TypeScript", category: "Frontend Frameworks" },
      ],
    },
    {
      category: "Styling",
      skills: [
        { name: "Material UI", category: "Styling" },
        { name: "Ag-Grid", category: "Styling" },
        { name: "Tailwind CSS", category: "Styling" },
        { name: "CSS3", category: "Styling" },
      ],
    },
    {
      category: "Languages",
      skills: [
        { name: "JavaScript (ES6+)", category: "Languages" },
        { name: "HTML5", category: "Languages" },
      ],
    },
    {
      category: "APIs",
      skills: [
        { name: "GraphQL", category: "APIs" },
        { name: "REST APIs", category: "APIs" },
      ],
    },
    {
      category: "Tools",
      skills: [
        { name: "Git", category: "Tools" },
        { name: "GitHub", category: "Tools" },
        { name: "Vite", category: "Tools" },
        { name: "Postman", category: "Tools" },
      ],
    },
    {
      category: "AI/ML",
      skills: [
        { name: "AWS Bedrock", category: "AI/ML" },
        { name: "Strands Agent SDK", category: "AI/ML" },
      ],
    },
  ],
  aiTools: [
    {
      name: "ChatGPT",
      workflow: "Code generation and rapid prototyping for React components",
      outcome: "Accelerated component development and boilerplate generation",
    },
    {
      name: "Claude",
      workflow: "Architecture design reviews and complex debugging sessions",
      outcome: "Improved system design decisions and faster bug resolution",
    },
    {
      name: "Amazon Q",
      workflow: "AWS service integration and Bedrock pipeline development",
      outcome: "Streamlined CIPHER AI Platform's 5-agent pipeline architecture",
    },
    {
      name: "Kiro",
      workflow: "Spec-driven development with automated task planning and PR reviews",
      outcome: "Enhanced development workflow with AI-powered project scaffolding",
    },
  ],
  principles: [
    {
      title: "Component-Driven Development",
      description: "Build UIs from small, reusable components shared across 5+ modules for consistency and speed.",
      relatedTech: "React.js",
    },
    {
      title: "GraphQL-First",
      description: "Adopt GraphQL for efficient data fetching, reducing over-fetching in enterprise banking apps.",
      relatedTech: "GraphQL",
    },
    {
      title: "Performance-First",
      description: "Optimize Core Web Vitals with code splitting, virtualization, and lazy loading strategies.",
      relatedTech: "Vite",
    },
    {
      title: "Accessibility",
      description: "Ensure WCAG 2.1 AA compliance with semantic HTML, ARIA labels, and keyboard navigation.",
      relatedTech: "HTML5",
    },
    {
      title: "Scalability",
      description: "Architect systems handling 100K+ data rows and serving 60+ countries without degradation.",
      relatedTech: "Ag-Grid",
    },
    {
      title: "Reusability",
      description: "Create shared component libraries and design systems that accelerate team delivery.",
      relatedTech: "Material UI",
    },
    {
      title: "Developer Experience",
      description: "Establish coding standards, review processes, and tooling that boost team productivity.",
      relatedTech: "TypeScript",
    },
    {
      title: "AI-Assisted Engineering",
      description: "Integrate AI tools into workflows for code generation, reviews, and architecture planning.",
      relatedTech: "AWS Bedrock",
    },
  ],
};

export default resumeData;
