import { styled } from '@repo-radar/ui';

const TIP_RADIUS = 6;
const MIN_TARGET = 26;

// A span, not a div: the empty state renders its description inside a
// paragraph, and a div there is invalid HTML that React rejects.
export const TipsRoot = styled('span')(({ theme }) => ({
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
  // Big enough to hit with a thumb: WCAG 2.2's 24px minimum target.
  minHeight: MIN_TARGET,
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  border: `1px solid ${theme.vars.palette.border.default}`,
  borderRadius: TIP_RADIUS,
  backgroundColor: theme.vars.palette.canvas.subtle,
  color: theme.vars.palette.fg.default,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.75rem',
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.vars.palette.canvas.hover },
}));
