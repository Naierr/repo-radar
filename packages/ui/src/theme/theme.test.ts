import { describe, expect, it } from 'vitest';

import { darkColors, lightColors } from '../tokens/semantic';
import type { ISemanticColors } from '../tokens/semantic';

const WCAG_AA_TEXT = 4.5;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const leafPaths = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? leafPaths(child as object, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const channelToLinear = (channel: number): number => {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string): number => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((start) =>
    channelToLinear(Number.parseInt(hex.slice(start, start + 2), 16)),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foreground: string, background: string): number => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
};

type Pick2 = (colors: ISemanticColors) => [string, string];

// Every text role against every surface it is drawn on.
const READABLE_PAIRS: [string, Pick2][] = [
  ...(['default', 'muted', 'subtle'] as const).flatMap(
    (role): [string, Pick2][] => [
      [`fg.${role} on canvas.default`, (c) => [c.fg[role], c.canvas.default]],
      [`fg.${role} on canvas.overlay`, (c) => [c.fg[role], c.canvas.overlay]],
    ],
  ),
  ...(['success', 'attention', 'danger'] as const).map(
    (tone): [string, Pick2] => [
      `${tone}.fg on canvas.overlay`,
      (c) => [c[tone].fg, c.canvas.overlay],
    ],
  ),
  ['accent.fg on canvas.overlay', (c) => [c.accent.fg, c.canvas.overlay]],
  ['accent.fg on canvas.default', (c) => [c.accent.fg, c.canvas.default]],
  [
    'fg.onEmphasis on accent.emphasis',
    (c) => [c.fg.onEmphasis, c.accent.emphasis],
  ],
  ['tooltip.fg on tooltip.bg', (c) => [c.tooltip.fg, c.tooltip.bg]],
  // The gradient paints headline text, so every stop has to clear the bar on
  // its own — a bright stop that only suits the dark canvas is a real failure.
  ...(['from', 'via', 'to'] as const).map((stop): [string, Pick2] => [
    `gradient.${stop} on canvas.default`,
    (c) => [c.gradient[stop], c.canvas.default],
  ]),
];

describe('semantic colour tokens', () => {
  it('define the same roles in both colour schemes', () => {
    expect(leafPaths(darkColors)).toEqual(leafPaths(lightColors));
  });

  describe.each([
    ['light', lightColors],
    ['dark', darkColors],
  ])('%s scheme', (_scheme, colors) => {
    it.each(READABLE_PAIRS)('%s meets WCAG AA', (_pair, pick) => {
      const [foreground, background] = pick(colors);

      expect(foreground).toMatch(HEX_COLOR);
      expect(background).toMatch(HEX_COLOR);
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(
        WCAG_AA_TEXT,
      );
    });
  });
});
