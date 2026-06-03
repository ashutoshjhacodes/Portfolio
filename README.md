# Ashutosh Jha — Portfolio

Personal portfolio website for Ashutosh Jha, Senior Frontend Engineer. Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Testing:** Vitest + React Testing Library + fast-check (property-based)
- **AI Features:** Google Generative AI (Gemini)
- **PWA:** next-pwa
- **Blog:** MDX

## Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm 9+

## Getting Started

```bash
# Clone the repository
git clone https://github.com/ashutoshjhacodes/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run analyze` | Analyze bundle size |

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API key (required for AI features)
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

The AI-powered Career Story Generator and Chat features require a valid Gemini API key. The site works without it — those features will show an error state.

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes (career-story, chat)
│   ├── blog/              # Blog pages
│   └── page.tsx           # Home page
├── components/
│   ├── features/          # Interactive features (AI Assistant, Career Story, etc.)
│   ├── layout/            # Layout components (Navigation, Footer)
│   ├── sections/          # Page sections (Hero, Impact, Projects, etc.)
│   └── ui/                # Reusable UI components
├── content/blog/          # MDX blog posts
├── lib/                   # Utilities, data, and AI client
│   ├── ai/               # Gemini client and RAG retrieval
│   ├── blog/             # Blog MDX utilities
│   ├── resume-data.ts    # Single source of truth for all content
│   └── animations.ts     # Framer Motion animation variants
├── styles/globals.css     # Global styles and design tokens
└── tailwind.config.ts     # Tailwind configuration
```

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"**
4. Import your repository
5. Vercel auto-detects Next.js — no configuration needed
6. Add environment variables:
   - `GOOGLE_GENERATIVE_AI_API_KEY` — your Gemini API key
7. Click **"Deploy"**

Your site will be live at `your-project.vercel.app` within minutes.

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time — follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option 3: Git-based Auto Deployment

Once connected to Vercel, every push to `main` triggers an automatic production deployment. Pull requests get preview deployments.

### Custom Domain

1. In Vercel Dashboard → your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `ashutoshjha.dev`)
3. Update DNS records as instructed by Vercel
4. SSL is provisioned automatically

### Environment Variables on Vercel

Go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Gemini API key | Production, Preview |

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx vitest run path/to/test.ts
```

## License

Private — All rights reserved.
