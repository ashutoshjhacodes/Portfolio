import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Existing tokens (backward compatibility)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        secondary: 'var(--secondary)',
        border: 'var(--border)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        // New premium palette tokens
        surface: 'var(--surface)',
        'primary-accent': 'var(--primary-accent)',
        'secondary-accent': 'var(--secondary-accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-sm': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-lg': ['clamp(3rem, 10vw, 8rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'hero': ['clamp(3rem, 8vw + 1rem, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'heading': ['clamp(2.5rem, 5vw + 1rem, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'card-title': ['clamp(1.5rem, 2vw + 0.5rem, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-responsive': ['clamp(1rem, 1.2vw + 0.25rem, 1.125rem)', { lineHeight: '1.6' }],
      },
      spacing: {
        'section': 'clamp(4rem, 10vh, 8rem)',
        'section-sm': 'clamp(2rem, 5vh, 4rem)',
        'section-tight': 'clamp(3rem, 6vh, 5rem)',
        // 8px grid system tokens
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '128': '128px',
      },
      borderRadius: {
        'card': '0.75rem',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease': 'ease',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
