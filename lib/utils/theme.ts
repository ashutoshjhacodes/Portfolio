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
    secondary: '#65656D';
    border: '#E4E4E7';
    card: '#F4F4F5';
    muted: '#FAFAFA';
  };
}

export const themeConfig: ThemeConfig = {
  dark: {
    background: '#000000',
    foreground: '#FFFFFF',
    secondary: '#A1A1AA',
    border: '#27272A',
    card: '#09090B',
    muted: '#111113',
  },
  light: {
    background: '#FFFFFF',
    foreground: '#09090B',
    secondary: '#65656D',
    border: '#E4E4E7',
    card: '#F4F4F5',
    muted: '#FAFAFA',
  },
};

const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Retrieves the stored theme preference from localStorage.
 * Returns null if no preference is stored or if localStorage is unavailable.
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Stores the theme preference in localStorage.
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
