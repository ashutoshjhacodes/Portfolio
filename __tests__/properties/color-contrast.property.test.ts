import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { themeConfig } from '@/lib/utils/theme';

/**
 * Feature: career-platform
 * Property 11: Color Contrast Compliance
 *
 * For any text color and background color pair used in the Design System
 * (both dark and light themes), the contrast ratio shall be at least 4.5:1
 * for normal text (below 18pt regular or 14pt bold) and at least 3:1 for
 * large text (18pt regular or 14pt bold and above).
 *
 * **Validates: Requirements 16.6**
 */

/**
 * Convert a hex color string to RGB values (0-255).
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

/**
 * Linearize an sRGB channel value (0-255) to linear RGB (0-1).
 * Uses the WCAG 2.1 relative luminance formula.
 */
function linearize(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance of a color per WCAG 2.1.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate contrast ratio between two colors per WCAG 2.1.
 * Contrast ratio = (L1 + 0.05) / (L2 + 0.05) where L1 >= L2
 */
function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * All text/background color pairs in the design system.
 * Each pair includes the text color, background color, description, and text size category.
 */
interface ColorPair {
  textColor: string;
  bgColor: string;
  description: string;
  textSize: 'normal' | 'large';
}

const darkThemePairs: ColorPair[] = [
  {
    textColor: themeConfig.dark.foreground,
    bgColor: themeConfig.dark.background,
    description: 'Dark: Primary text (#FFFFFF) on background (#000000)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.dark.secondary,
    bgColor: themeConfig.dark.background,
    description: 'Dark: Secondary text (#A1A1AA) on background (#000000)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.dark.foreground,
    bgColor: themeConfig.dark.card,
    description: 'Dark: Primary text (#FFFFFF) on card (#09090B)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.dark.secondary,
    bgColor: themeConfig.dark.card,
    description: 'Dark: Secondary text (#A1A1AA) on card (#09090B)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.dark.foreground,
    bgColor: themeConfig.dark.muted,
    description: 'Dark: Primary text (#FFFFFF) on muted (#111113)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.dark.secondary,
    bgColor: themeConfig.dark.muted,
    description: 'Dark: Secondary text (#A1A1AA) on muted (#111113)',
    textSize: 'normal',
  },
];

const lightThemePairs: ColorPair[] = [
  {
    textColor: themeConfig.light.foreground,
    bgColor: themeConfig.light.background,
    description: 'Light: Primary text (#09090B) on background (#FFFFFF)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.light.secondary,
    bgColor: themeConfig.light.background,
    description: 'Light: Secondary text (#6E6E76) on background (#FFFFFF)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.light.foreground,
    bgColor: themeConfig.light.card,
    description: 'Light: Primary text (#09090B) on card (#F4F4F5)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.light.secondary,
    bgColor: themeConfig.light.card,
    description: 'Light: Secondary text (#6E6E76) on card (#F4F4F5)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.light.foreground,
    bgColor: themeConfig.light.muted,
    description: 'Light: Primary text (#09090B) on muted (#FAFAFA)',
    textSize: 'normal',
  },
  {
    textColor: themeConfig.light.secondary,
    bgColor: themeConfig.light.muted,
    description: 'Light: Secondary text (#6E6E76) on muted (#FAFAFA)',
    textSize: 'normal',
  },
];

const allColorPairs: ColorPair[] = [...darkThemePairs, ...lightThemePairs];

describe('Feature: career-platform, Property 11: Color Contrast Compliance', () => {
  it('all normal text color pairs meet WCAG AA minimum contrast ratio of 4.5:1', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allColorPairs.filter((p) => p.textSize === 'normal')),
        (pair) => {
          const ratio = contrastRatio(pair.textColor, pair.bgColor);
          expect(
            ratio,
            `${pair.description} has contrast ratio ${ratio.toFixed(2)}:1, expected >= 4.5:1`
          ).toBeGreaterThanOrEqual(4.5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all large text color pairs meet WCAG AA minimum contrast ratio of 3:1', () => {
    // All pairs should also pass the large text threshold (which is less strict)
    fc.assert(
      fc.property(
        fc.constantFrom(...allColorPairs),
        (pair) => {
          const ratio = contrastRatio(pair.textColor, pair.bgColor);
          const minRatio = pair.textSize === 'large' ? 3 : 4.5;
          expect(
            ratio,
            `${pair.description} has contrast ratio ${ratio.toFixed(2)}:1, expected >= ${minRatio}:1`
          ).toBeGreaterThanOrEqual(minRatio);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('dark theme primary text on background achieves maximum contrast (~21:1)', () => {
    fc.assert(
      fc.property(
        fc.constant({
          text: themeConfig.dark.foreground,
          bg: themeConfig.dark.background,
        }),
        ({ text, bg }) => {
          const ratio = contrastRatio(text, bg);
          // White on black should be exactly 21:1
          expect(ratio).toBeCloseTo(21, 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('light theme primary text on background achieves near-maximum contrast (~19.9:1)', () => {
    fc.assert(
      fc.property(
        fc.constant({
          text: themeConfig.light.foreground,
          bg: themeConfig.light.background,
        }),
        ({ text, bg }) => {
          const ratio = contrastRatio(text, bg);
          // #09090B on #FFFFFF should be very high contrast (near 20:1)
          expect(ratio).toBeGreaterThan(19);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('contrast ratio calculation is symmetric (order of colors does not matter)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allColorPairs),
        (pair) => {
          const ratio1 = contrastRatio(pair.textColor, pair.bgColor);
          const ratio2 = contrastRatio(pair.bgColor, pair.textColor);
          expect(ratio1).toBeCloseTo(ratio2, 10);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('contrast ratio is always >= 1 for any color pair', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allColorPairs),
        (pair) => {
          const ratio = contrastRatio(pair.textColor, pair.bgColor);
          expect(ratio).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all design system color pairs exceed the large text threshold of 3:1', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...allColorPairs),
        (pair) => {
          const ratio = contrastRatio(pair.textColor, pair.bgColor);
          expect(
            ratio,
            `${pair.description} has contrast ratio ${ratio.toFixed(2)}:1, expected >= 3:1 for large text`
          ).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });
});
