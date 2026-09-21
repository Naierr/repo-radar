import { LinearProgress, styled } from '@repo-radar/ui';

export const RowRoot = styled('li')(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  gap: theme.spacing(1.5, 2),
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.vars.palette.border.muted}`,
  '&:last-of-type': { borderBottom: 'none' },
}));

/** The checkbox leads the row, where a selection control is looked for. */
export const RowSelect = styled('div')({
  alignSelf: 'start',
  // Lines the box up with the avatar rather than the row's padding edge.
  marginInlineStart: -9,
});

export const RowStats = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75, 2.5),
  marginTop: theme.spacing(1),
  paddingInlineStart: 44,
}));

export const RowActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
}));

export const RowFooter = styled('div')(({ theme }) => ({
  // Starts after the checkbox so it stays aligned with the text above it.
  gridColumn: '2 / -1',
  paddingInlineStart: 44,
  fontSize: '0.75rem',
  color: theme.vars.palette.fg.subtle,
  [theme.breakpoints.down('sm')]: { paddingInlineStart: 0 },
}));

export const RowProgress = styled(LinearProgress)({
  position: 'absolute',
  insetInline: 0,
  bottom: 0,
});
