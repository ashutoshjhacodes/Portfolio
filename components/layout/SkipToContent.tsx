'use client';

/**
 * SkipToContent - Accessibility skip navigation link.
 * Positioned off-screen by default, becomes visible on keyboard focus.
 * Links to #main-content to allow keyboard users to bypass navigation.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
    >
      Skip to main content
    </a>
  );
}
