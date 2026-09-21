import { styled } from '@repo-radar/ui';

export const RefreshGroup = styled('div')({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

/**
 * Why the button is off, in the open rather than behind a hover. Deliberately
 * muted: the disabled button already carries the state, and painting the
 * explanation in warning amber reads as "something is wrong" when nothing is —
 * GitHub's limit is a fact about the day, not a fault.
 */
export const BudgetNote = styled('p')(({ theme }) => ({
  margin: 0,
  maxWidth: '38ch',
  color: theme.vars.palette.fg.muted,
  fontSize: '0.8125rem',
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.45,
  textAlign: 'right',
}));
