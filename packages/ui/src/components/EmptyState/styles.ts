import { styled } from '@mui/material/styles';

import { radius } from '../../tokens/shape';

export const EmptyStateRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(6, 3),
  textAlign: 'center',
}));

export const EmptyStateIcon = styled('div')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: 48,
  height: 48,
  marginBottom: theme.spacing(1),
  borderRadius: radius.full,
  color: theme.vars.palette.accent.fg,
  backgroundColor: theme.vars.palette.accent.subtle,
  boxShadow: `0 0 0 6px ${theme.vars.palette.canvas.subtle}, 0 0 0 7px ${theme.vars.palette.border.muted}`,
}));

export const EmptyStateDescription = styled('div')(({ theme }) => ({
  maxWidth: 420,
  color: theme.vars.palette.fg.muted,
}));

export const EmptyStateAction = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1.5),
}));
