import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import SkipToContent from '@/components/layout/SkipToContent';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

// Dynamic imports for below-the-fold client components (code splitting)
// These don't need SSR as they are interactive overlays/widgets.
// Loading is deferred to reduce initial JS bundle size (Req 15.3, 15.7).
const CommandPalette = dynamic(
  () => import('@/components/features/CommandPalette'),
  { ssr: false, loading: () => null }
);

const AIAssistant = dynamic(
  () => import('@/components/features/AIAssistant'),
  { ssr: false, loading: () => null }
);

const ServiceWorkerUpdater = dynamic(
  () => import('@/components/features/ServiceWorkerUpdater'),
  { ssr: false, loading: () => null }
);

const PWAInstallPrompt = dynamic(
  () => import('@/components/features/PWAInstallPrompt'),
  { ssr: false, loading: () => null }
);

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const SITE_URL = 'https://ashutoshjha.dev';
const SITE_NAME = 'Ashutosh Jha Portfolio';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ashutosh Jha | Frontend Engineer',
    template: '%s | Ashutosh Jha',
  },
  description:
    'Frontend Engineer with 5+ years building enterprise platforms at scale. React, TypeScript, GraphQL, and AI-powered solutions serving 60+ countries.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Ashutosh Jha | Frontend Engineer',
    description:
      'Frontend Engineer with 5+ years building enterprise platforms at scale. React, TypeScript, GraphQL, and AI-powered solutions serving 60+ countries.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ashutosh Jha - Frontend Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashutosh Jha | Frontend Engineer',
    description:
      'Frontend Engineer with 5+ years building enterprise platforms at scale. React, TypeScript, GraphQL, and AI-powered solutions serving 60+ countries.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ashutosh Jha',
  jobTitle: 'Frontend Engineer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/ashutoshjhacodes',
    'https://linkedin.com/in/mrjha',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// Blocking script that runs before paint to prevent flash of wrong theme.
// Reads localStorage and applies the "light" class if stored; otherwise stays dark (default).
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme-preference');
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-text-primary`}
      >
        <SkipToContent />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <CommandPalette />
        <AIAssistant />
        <ServiceWorkerUpdater />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
