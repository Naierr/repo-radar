import type { Components, Theme } from '@mui/material/styles';

export const baseOverrides: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      // The canvas colour sits on <html> and <body> stays transparent: a
      // painted body would cover the night sky layered beneath the content.
      html: {
        backgroundColor: theme.vars.palette.canvas.default,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      body: { backgroundColor: 'transparent' },
      '::selection': { backgroundColor: theme.vars.palette.accent.muted },
      ':focus-visible': {
        outline: `2px solid ${theme.vars.palette.accent.fg}`,
        outlineOffset: 2,
      },
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
        },
        // A view transition animates pseudo-elements the rule above cannot
        // reach, so reordering has to be silenced separately.
        '::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)':
          { animation: 'none !important' },
      },
    }),
  },

  // No ripples: state changes are colour transitions, as on GitHub.
  MuiButtonBase: { defaultProps: { disableRipple: true } },
};
