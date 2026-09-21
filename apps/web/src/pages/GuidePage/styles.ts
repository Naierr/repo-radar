import { styled } from '@repo-radar/ui';

export const PageStack = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  maxWidth: '72ch',
}));

export const PageTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  color: theme.vars.palette.fg.default,
  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
}));

export const PageLead = styled('p')(({ theme }) => ({
  margin: theme.spacing(0.75, 0, 0),
  color: theme.vars.palette.fg.muted,
  fontSize: '1rem',
  lineHeight: 1.6,
}));

export const Prose = styled('div')(({ theme }) => ({
  color: theme.vars.palette.fg.muted,
  fontSize: '0.9375rem',
  lineHeight: 1.65,
  'p, ul': { margin: theme.spacing(0, 0, 1.5) },
  'p:last-child, ul:last-child': { marginBottom: 0 },
  ul: { paddingLeft: theme.spacing(2.5) },
  li: { marginBottom: theme.spacing(0.5) },
  strong: { color: theme.vars.palette.fg.default, fontWeight: 600 },
  code: {
    padding: '1px 5px',
    borderRadius: 5,
    border: `1px solid ${theme.vars.palette.border.default}`,
    backgroundColor: theme.vars.palette.canvas.subtle,
    color: theme.vars.palette.fg.default,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '0.8125rem',
  },
}));
