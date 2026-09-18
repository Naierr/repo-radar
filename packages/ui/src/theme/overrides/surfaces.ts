import type { Components, Theme } from '@mui/material/styles';

import { radius } from '../../tokens/shape';
import { fontWeight } from '../../tokens/typography';

export const surfaceOverrides: Components<Theme> = {
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: 'none' },
      outlined: ({ theme }) => ({
        borderColor: theme.vars.palette.border.default,
      }),
    },
  },

  // Menus and popovers portal out of the tree, so they are styled here —
  // never from the page that opens them.
  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }) => ({
        marginTop: 4,
        border: `1px solid ${theme.vars.palette.border.default}`,
        borderRadius: radius.lg,
        boxShadow: theme.vars.palette.shadow.overlay,
      }),
    },
  },

  MuiMenu: {
    styleOverrides: { list: { padding: 6 } },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 32,
        gap: 8,
        borderRadius: radius.md,
        fontSize: '0.875rem',
        '&:hover': { backgroundColor: theme.vars.palette.canvas.hover },
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: theme.vars.palette.accent.subtle,
        },
      }),
    },
  },

  MuiTooltip: {
    defaultProps: { arrow: true, enterDelay: 300 },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.vars.palette.tooltip.bg,
        color: theme.vars.palette.tooltip.fg,
        fontSize: '0.75rem',
        fontWeight: fontWeight.medium,
        padding: '4px 8px',
        borderRadius: radius.md,
      }),
      arrow: ({ theme }) => ({ color: theme.vars.palette.tooltip.bg }),
    },
  },

  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        color: theme.vars.palette.tooltip.fg,
        backgroundColor: theme.vars.palette.tooltip.bg,
        boxShadow: theme.vars.palette.shadow.overlay,
      }),
      action: ({ theme }) => ({ color: theme.vars.palette.accent.fg }),
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.vars.palette.border.muted}`,
      }),
    },
  },
};
