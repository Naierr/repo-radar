import { LinearProgress, styled } from '@repo-radar/ui';

export const ResultList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const SkeletonRows = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const SkeletonRow = styled('li')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.vars.palette.border.muted}`,
}));

export const SkeletonLines = styled('div')({ flex: 1 });

export const TopProgress = styled(LinearProgress)({
  position: 'absolute',
  insetInline: 0,
  top: 0,
});

export const PaginationBar = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.vars.palette.border.muted}`,
}));
