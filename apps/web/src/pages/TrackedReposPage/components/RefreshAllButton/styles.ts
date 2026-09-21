import { styled } from '@repo-radar/ui';

export const RefreshGroup = styled('div')({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

/** Why the button is off, in the open — not hidden behind a hover. */
export const BudgetNote = styled('p')(({ theme }) => ({
  margin: 0,
  maxWidth: '34ch',
  color: theme.vars.palette.tone.attention.fg,
  fontSize: '0.8125rem',
  lineHeight: 1.4,
  textAlign: 'right',
}));
