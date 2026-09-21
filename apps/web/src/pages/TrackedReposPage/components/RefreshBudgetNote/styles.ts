import { styled } from '@repo-radar/ui';

/**
 * Sits below the action row rather than inside it, so an explanation appearing
 * can never move the buttons it is explaining.
 */
export const BudgetNote = styled('p')(({ theme }) => ({
  margin: 0,
  maxWidth: '42ch',
  color: theme.vars.palette.fg.muted,
  fontSize: '0.8125rem',
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.45,
  textAlign: 'right',
  [theme.breakpoints.down('sm')]: { textAlign: 'left' },
}));
