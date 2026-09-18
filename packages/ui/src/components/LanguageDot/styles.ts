import { styled } from '@mui/material/styles';

import { radius } from '../../tokens/shape';

export const LanguageRoot = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  fontSize: '0.8125rem',
  color: theme.vars.palette.fg.muted,
  whiteSpace: 'nowrap',
}));

export const Dot = styled('span', {
  shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor: string }>(({ theme, dotColor }) => ({
  width: 10,
  height: 10,
  flexShrink: 0,
  borderRadius: radius.full,
  backgroundColor: dotColor,
  boxShadow: `inset 0 0 0 1px ${theme.vars.palette.border.muted}`,
}));
