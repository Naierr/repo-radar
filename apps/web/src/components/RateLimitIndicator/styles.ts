import { styled } from '@repo-radar/ui';

export type RateLimitTone = 'low' | 'out';

export const Indicator = styled('span', {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: RateLimitTone }>(({ theme, tone }) => {
  const color = {
    low: theme.vars.palette.tone.attention.fg,
    out: theme.vars.palette.tone.danger.fg,
  }[tone];

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    height: 28,
    padding: theme.spacing(0, 1.25),
    borderRadius: 999,
    fontSize: '0.75rem',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    color,
    border: `1px solid ${theme.vars.palette.border.default}`,
    backgroundColor: theme.vars.palette.canvas.overlay,
    cursor: 'default',
  };
});
