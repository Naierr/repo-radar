import { Avatar, Link, styled } from '@repo-radar/ui';

export const IdentityRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

export const OwnerAvatar = styled(Avatar)({
  width: 32,
  height: 32,
  flexShrink: 0,
});

export const RepoLink = styled(Link)({
  fontSize: '0.9375rem',
  wordBreak: 'break-word',
});

export const RepoName = styled('span')({ fontWeight: 600 });

export const Description = styled('p')(({ theme }) => ({
  margin: theme.spacing(0.5, 0, 0),
  fontSize: '0.8125rem',
  color: theme.vars.palette.fg.muted,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));
