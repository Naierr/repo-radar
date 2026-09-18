export const radius = {
  sm: 4,
  md: 6,
  lg: 12,
  full: 9999,
} as const;

export const motion = {
  fast: '120ms',
  normal: '200ms',
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const shadow = {
  light: {
    overlay:
      '0 1px 3px rgba(18, 25, 38, 0.08), 0 8px 24px rgba(18, 25, 38, 0.12)',
  },
  dark: {
    overlay: '0 1px 3px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5)',
  },
} as const;
