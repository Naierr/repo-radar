import { styled } from '@repo-radar/ui';

/**
 * Coloured from a data attribute rather than a prop, so the direction is
 * readable in the DOM and the styling has one source.
 */
export const DeltaChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  fontSize: '0.75rem',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
  '&[data-direction="up"]': { color: theme.vars.palette.tone.success.fg },
  '&[data-direction="down"]': { color: theme.vars.palette.tone.danger.fg },
}));
