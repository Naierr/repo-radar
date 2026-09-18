import type { AlertColor } from '@mui/material/Alert';
import type { Components, Theme } from '@mui/material/styles';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  InfoCircle,
} from '@untitledui/icons';

import { radar, signal } from '../../tokens/palette';
import { radius } from '../../tokens/shape';

const ALERT_ICON_SIZE = 18;

type Tone = keyof Theme['palette']['tone'];

const SEVERITY_TONES: [AlertColor, Tone][] = [
  ['error', 'danger'],
  ['warning', 'attention'],
  ['success', 'success'],
];

export const feedbackOverrides: Components<Theme> = {
  MuiAlert: {
    defaultProps: {
      iconMapping: {
        success: <CheckCircle size={ALERT_ICON_SIZE} aria-hidden />,
        info: <InfoCircle size={ALERT_ICON_SIZE} aria-hidden />,
        warning: <AlertTriangle size={ALERT_ICON_SIZE} aria-hidden />,
        error: <AlertCircle size={ALERT_ICON_SIZE} aria-hidden />,
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        fontSize: '0.8125rem',
        alignItems: 'center',
        border: '1px solid transparent',
        variants: [
          ...SEVERITY_TONES.map(([severity, tone]) => ({
            props: { severity },
            style: {
              color: theme.vars.palette.tone[tone].fg,
              backgroundColor: theme.vars.palette.tone[tone].subtle,
            },
          })),
          {
            props: { severity: 'info' },
            style: {
              color: theme.vars.palette.accent.fg,
              backgroundColor: theme.vars.palette.accent.subtle,
            },
          },
        ],
      }),
      icon: { color: 'inherit', opacity: 1, padding: 0 },
      message: { padding: '6px 0' },
      action: { paddingTop: 0 },
    },
  },

  MuiSkeleton: {
    defaultProps: { animation: 'wave' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.canvas.hover,
        borderRadius: radius.sm,
      }),
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: { height: 2, borderRadius: 1, backgroundColor: 'transparent' },
      bar: {
        background: `linear-gradient(90deg, ${radar[500]}, ${signal[400]})`,
      },
    },
  },
};
