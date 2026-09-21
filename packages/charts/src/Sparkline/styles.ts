import { styled } from '@repo-radar/ui';

/**
 * Hand-drawn rather than a charting library: fifty of these render per page,
 * and the whole graphic is one path.
 */
export const SparkSvg = styled('svg')(({ theme }) => ({
  display: 'block',
  overflow: 'visible',
  '& .spark-line': {
    fill: 'none',
    stroke: theme.vars.palette.accent.fg,
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  '& .spark-tip': { fill: theme.vars.palette.accent.fg },
}));
