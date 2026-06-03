import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredTheme, setStoredTheme, themeConfig } from './theme';
import type { Theme } from './theme';

describe('Theme utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStoredTheme', () => {
    it('returns null when no theme is stored', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('returns "dark" when dark theme is stored', () => {
      localStorage.setItem('theme-preference', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns "light" when light theme is stored', () => {
      localStorage.setItem('theme-preference', 'light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns null for invalid stored values', () => {
      localStorage.setItem('theme-preference', 'invalid');
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe('setStoredTheme', () => {
    it('stores dark theme in localStorage', () => {
      setStoredTheme('dark');
      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });

    it('stores light theme in localStorage', () => {
      setStoredTheme('light');
      expect(localStorage.getItem('theme-preference')).toBe('light');
    });

    it('round-trips correctly for dark theme', () => {
      setStoredTheme('dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('round-trips correctly for light theme', () => {
      setStoredTheme('light');
      expect(getStoredTheme()).toBe('light');
    });
  });

  describe('themeConfig', () => {
    it('has dark theme with correct colors', () => {
      expect(themeConfig.dark.background).toBe('#000000');
      expect(themeConfig.dark.foreground).toBe('#FFFFFF');
      expect(themeConfig.dark.secondary).toBe('#A1A1AA');
      expect(themeConfig.dark.border).toBe('#27272A');
      expect(themeConfig.dark.card).toBe('#09090B');
      expect(themeConfig.dark.muted).toBe('#111113');
    });

    it('has light theme with correct colors', () => {
      expect(themeConfig.light.background).toBe('#FFFFFF');
      expect(themeConfig.light.foreground).toBe('#09090B');
      expect(themeConfig.light.secondary).toBe('#65656D');
      expect(themeConfig.light.border).toBe('#E4E4E7');
      expect(themeConfig.light.card).toBe('#F4F4F5');
      expect(themeConfig.light.muted).toBe('#FAFAFA');
    });

    it('has both dark and light themes defined', () => {
      const themes: Theme[] = ['dark', 'light'];
      for (const theme of themes) {
        expect(themeConfig[theme]).toBeDefined();
        expect(themeConfig[theme].background).toBeDefined();
        expect(themeConfig[theme].foreground).toBeDefined();
        expect(themeConfig[theme].secondary).toBeDefined();
        expect(themeConfig[theme].border).toBeDefined();
        expect(themeConfig[theme].card).toBeDefined();
        expect(themeConfig[theme].muted).toBeDefined();
      }
    });
  });
});
