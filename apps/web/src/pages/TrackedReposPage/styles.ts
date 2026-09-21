import { styled } from '@repo-radar/ui';

export const PageStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const PageHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const PageTitle = styled('h1')(({ theme }) => ({
  ...theme.typography.h2,
  margin: 0,
}));

export const PageLead = styled('p')(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 0),
  color: theme.vars.palette.fg.muted,
}));

export const RowList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

/** The buttons and whatever has to be said about them, stacked. */
export const PageActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: { alignItems: 'stretch', width: '100%' },
}));

/** The buttons themselves, which stay on one line whatever is said below. */
export const ActionRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/** Select-all, and whichever control the current selection calls for. */
export const PanelTools = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));
