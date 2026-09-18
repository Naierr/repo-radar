import type { Components, Theme } from '@mui/material/styles';

import { radius } from '../../tokens/shape';
import { fontWeight } from '../../tokens/typography';
import { transition } from './transition';

export const controlOverrides: Components<Theme> = {
  // `outlined` is the default and reads as a quiet neutral button;
  // `contained` is the one accent action on a surface; `text` is a ghost.
  MuiButton: {
    defaultProps: { variant: 'outlined', disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        fontWeight: fontWeight.medium,
        whiteSpace: 'nowrap',
        transition: transition('background-color', 'border-color', 'color'),
        variants: [
          {
            props: { variant: 'outlined', color: 'primary' },
            style: {
              '--variant-outlinedColor': theme.vars.palette.fg.default,
              '--variant-outlinedBorder': theme.vars.palette.border.default,
              '--variant-outlinedBg': theme.vars.palette.canvas.subtle,
              '&:hover': {
                '--variant-outlinedBg': theme.vars.palette.canvas.hover,
                '--variant-outlinedBorder': theme.vars.palette.fg.subtle,
              },
            },
          },
          {
            props: { variant: 'text', color: 'primary' },
            style: {
              color: theme.vars.palette.fg.muted,
              '&:hover': {
                color: theme.vars.palette.fg.default,
                backgroundColor: theme.vars.palette.canvas.hover,
              },
            },
          },
        ],
      }),
      sizeSmall: { minHeight: 28, padding: '2px 10px', fontSize: '0.75rem' },
      sizeMedium: { minHeight: 32, padding: '4px 12px' },
      sizeLarge: { minHeight: 40, padding: '8px 16px' },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        color: theme.vars.palette.fg.muted,
        transition: transition('background-color', 'color'),
        '&:hover': {
          color: theme.vars.palette.fg.default,
          backgroundColor: theme.vars.palette.canvas.hover,
        },
      }),
      sizeSmall: { padding: 6 },
      sizeMedium: { padding: 8 },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        backgroundColor: theme.vars.palette.canvas.inset,
        transition: transition('box-shadow', 'border-color'),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.border.default,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.fg.subtle,
        },
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px ${theme.vars.palette.accent.muted}`,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.accent.emphasis,
          borderWidth: 1,
        },
      }),
    },
  },

  MuiLink: {
    defaultProps: { underline: 'hover' },
    styleOverrides: {
      root: ({ theme }) => ({ color: theme.vars.palette.accent.fg }),
    },
  },

  MuiPaginationItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        fontWeight: fontWeight.medium,
        '&.Mui-selected, &.Mui-selected:hover': {
          color: theme.vars.palette.fg.onEmphasis,
          backgroundColor: theme.vars.palette.accent.emphasis,
        },
      }),
    },
  },
};
