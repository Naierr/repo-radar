import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

import { radius } from '../../tokens/shape';

export const ConfirmRoot = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: 'min(440px, calc(100vw - 32px))',
    border: `1px solid ${theme.vars.palette.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: theme.vars.palette.canvas.overlay,
    backgroundImage: 'none',
  },
}));

export const ConfirmBody = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  padding: theme.spacing(2.5, 2.5, 1.5),
}));

export const ConfirmTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  color: theme.vars.palette.fg.default,
  fontSize: '1.0625rem',
  fontWeight: 600,
  lineHeight: 1.35,
}));

export const ConfirmText = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.vars.palette.fg.muted,
  fontSize: '0.875rem',
  lineHeight: 1.5,
}));

/** Facts rather than prose — set apart so they can be scanned. */
export const ConfirmDetails = styled('p')(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 0),
  padding: theme.spacing(1, 1.25),
  borderRadius: radius.md,
  border: `1px solid ${theme.vars.palette.border.muted}`,
  backgroundColor: theme.vars.palette.canvas.subtle,
  color: theme.vars.palette.fg.muted,
  fontSize: '0.8125rem',
  lineHeight: 1.5,
}));

export const ConfirmActions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2.5, 2.5),
}));
