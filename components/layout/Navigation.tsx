'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileMenu from './MobileMenu';
import ThemeToggle from '@/components/features/ThemeToggle';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '/blog', isPage: true },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Detect macOS for keyboard shortcut hint
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Show navigation after scrolling past the hero section
  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past ~90vh (hero section height)
      const heroHeight = window.innerHeight * 0.9;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Only handle hash links with smooth scroll
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // For page links (like /blog), let default navigation happen
    },
    []
  );

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="banner"
          >
            <nav
              className="section-container flex h-16 items-center justify-between"
              aria-label="Main navigation"
            >
              {/* Desktop nav links */}
              <ul className="hidden md:flex items-center gap-1" role="list">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Right side: Command Palette hint + Theme toggle + Mobile hamburger */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Command Palette shortcut hint */}
                <div
                  className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary"
                  aria-label={`Open command palette with ${isMac ? 'Command' : 'Control'} K`}
                >
                  <kbd className="font-mono text-text-primary">
                    {isMac ? '⌘' : 'Ctrl'}
                  </kbd>
                  <span>+</span>
                  <kbd className="font-mono text-text-primary">K</kbd>
                </div>

                {/* Theme toggle button */}
                <ThemeToggle />

                {/* Mobile hamburger button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary hover:text-primary-accent transition-colors duration-300 md:hidden touch-target"
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
