import { styled } from '@mui/material/styles';

import { radius } from '../../tokens/shape';

export const PanelRoot = styled('section')(({ theme }) => ({
  position: 'relative',
  border: `1px solid ${theme.vars.palette.border.default}`,
  borderRadius: radius.lg,
  backgroundColor: theme.vars.palette.canvas.overlay,
  overflow: 'hidden',
}));

export const PanelHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.vars.palette.border.default}`,
  backgroundColor: theme.vars.palette.canvas.subtle,
}));

export const PanelActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const PanelBody = styled('div', {
  shouldForwardProp: (prop) => prop !== 'disablePadding',
})<{ disablePadding: boolean }>(({ theme, disablePadding }) => ({
  padding: disablePadding ? 0 : theme.spacing(2),
}));
