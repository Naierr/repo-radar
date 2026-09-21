import { styled } from '@repo-radar/ui';

export const RepoChoices = styled('div')({
  display: 'grid',
  maxHeight: 220,
  overflowY: 'auto',
});

/** The repository name beside its checkbox. */
export const ChoiceLabel = styled('span')({
  fontSize: '0.8125rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
});

export const CostLine = styled('p')(({ theme }) => ({
  margin: theme.spacing(1, 0, 0),
  color: theme.vars.palette.fg.muted,
  fontSize: '0.8125rem',
  fontVariantNumeric: 'tabular-nums',
}));

export const FailureLine = styled('p')(({ theme }) => ({
  margin: theme.spacing(1, 0, 0),
  color: theme.vars.palette.tone.danger.fg,
  fontSize: '0.8125rem',
  lineHeight: 1.5,
}));
