import { styled } from '@repo-radar/ui';
import { Link, NavLink } from 'react-router';

export const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  top: -48,
  zIndex: theme.zIndex.tooltip,
  padding: theme.spacing(1, 2),
  borderRadius: 6,
  color: theme.vars.palette.fg.onEmphasis,
  backgroundColor: theme.vars.palette.accent.emphasis,
  '&:focus': { top: theme.spacing(1) },
}));

export const Header = styled('header')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  borderBottom: `1px solid ${theme.vars.palette.border.muted}`,
  backgroundColor: `rgba(${theme.vars.palette.background.defaultChannel} / 0.72)`,
  backdropFilter: 'blur(12px) saturate(140%)',
}));

export const HeaderInner = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: theme.spacing(3),
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(0, 3),
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(0, 2) },
}));

export const Brand = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minHeight: 56,
  color: theme.vars.palette.fg.default,
  fontWeight: 650,
  fontSize: '1rem',
  letterSpacing: '-0.01em',
  textDecoration: 'none',
}));

export const Nav = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignSelf: 'stretch',
  gap: theme.spacing(0.5),
  [theme.breakpoints.down('sm')]: { order: 3, width: '100%' },
}));

export const NavItem = styled(NavLink)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minHeight: 48,
  padding: theme.spacing(0, 1.5),
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.vars.palette.fg.muted,
  textDecoration: 'none',
  transition: 'color 120ms',
  '&:hover': { color: theme.vars.palette.fg.default },
  '&[aria-current="page"]': {
    color: theme.vars.palette.fg.default,
    fontWeight: 600,
    '&::after': {
      content: '""',
      position: 'absolute',
      insetInline: theme.spacing(1),
      bottom: -1,
      height: 2,
      borderRadius: 2,
      backgroundColor: theme.vars.palette.accent.emphasis,
    },
  },
}));

export const HeaderActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginInlineStart: 'auto',
}));

export const Main = styled('main')(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(4, 3, 8),
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(3, 2, 6) },
}));

export const Footer = styled('footer')(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  fontSize: '0.75rem',
  color: theme.vars.palette.fg.subtle,
  borderTop: `1px solid ${theme.vars.palette.border.muted}`,
}));
