import { styled } from '@repo-radar/ui';

export const PageStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const Hero = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  maxWidth: 720,
  margin: '0 auto',
  padding: theme.spacing(6, 0, 1),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(3, 0, 0) },
}));

export const Eyebrow = styled('p')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  margin: 0,
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 999,
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.vars.palette.accent.fg,
  backgroundColor: theme.vars.palette.accent.subtle,
  border: `1px solid ${theme.vars.palette.accent.muted}`,
}));

export const HeroTitle = styled('h1')(({ theme }) => ({
  ...theme.typography.h1,
  margin: 0,
  [theme.breakpoints.down('sm')]: { fontSize: '2rem' },
}));

export const HeroLead = styled('p')(({ theme }) => ({
  ...theme.typography.subtitle1,
  margin: 0,
  maxWidth: 560,
  color: theme.vars.palette.fg.muted,
  fontWeight: 400,
}));

export const SearchBox = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));
