import { styled } from '@repo-radar/ui';

export const ItemRoot = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.vars.palette.border.muted}`,
  transition: 'background-color 120ms',
  '&:last-of-type': { borderBottom: 'none' },
  '&:hover': { backgroundColor: theme.vars.palette.canvas.subtle },
}));

export const ItemMain = styled('div')({ minWidth: 0, flex: 1 });

// Lines up under the repository name, past the avatar.
export const ItemMeta = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75, 2),
  marginTop: theme.spacing(1),
  paddingInlineStart: 44,
}));
