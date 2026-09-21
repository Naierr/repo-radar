import { styled } from '@repo-radar/ui';

const TIP_RADIUS = 6;

export const TipsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(1.25),
  color: theme.vars.palette.fg.muted,
  fontSize: '0.8125rem',
  lineHeight: 1.6,
}));

export const TipButton = styled('button')(({ theme }) => ({
  padding: theme.spacing(0.25, 0.75),
  border: `1px solid ${theme.vars.palette.border.default}`,
  borderRadius: TIP_RADIUS,
  backgroundColor: theme.vars.palette.canvas.subtle,
  color: theme.vars.palette.fg.default,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.75rem',
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.vars.palette.canvas.hover },
}));
