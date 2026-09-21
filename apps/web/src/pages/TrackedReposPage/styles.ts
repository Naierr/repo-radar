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

export const PageActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

/** The repositories a shared link is offering, listed so they can be read. */
export const SharedList = styled('ul')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(0, 0, 0, 2.25),
  display: 'grid',
  gap: theme.spacing(0.25),
}));
