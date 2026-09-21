import { styled } from '@repo-radar/ui';

const CONTROL_RADIUS = 7;

export const SortGroup = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  gap: 2,
  padding: 2,
  border: `1px solid ${theme.vars.palette.border.default}`,
  borderRadius: CONTROL_RADIUS,
  backgroundColor: theme.vars.palette.canvas.inset,
}));

/** Pressed state comes from `aria-pressed`, so the ARIA is the styling hook. */
export const SortOption = styled('button')(({ theme }) => ({
  padding: theme.spacing(0.375, 1),
  border: 0,
  borderRadius: CONTROL_RADIUS - 2,
  backgroundColor: 'transparent',
  color: theme.vars.palette.fg.muted,
  fontSize: '0.75rem',
  fontWeight: 500,
  cursor: 'pointer',
  '&:hover': { color: theme.vars.palette.fg.default },
  '&[aria-pressed="true"]': {
    backgroundColor: theme.vars.palette.canvas.overlay,
    color: theme.vars.palette.fg.default,
    boxShadow: `inset 0 0 0 1px ${theme.vars.palette.border.default}`,
  },
}));
