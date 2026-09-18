import { styled } from '@mui/material/styles';

export const MetricRoot = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 0,
  fontSize: '0.8125rem',
  color: theme.vars.palette.fg.muted,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}));

export const MetricIcon = styled('span')({
  display: 'inline-flex',
  flexShrink: 0,
});

export const MetricValue = styled('span')(({ theme }) => ({
  color: theme.vars.palette.fg.default,
  fontWeight: 500,
}));
