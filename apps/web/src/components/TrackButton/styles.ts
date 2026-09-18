import { Button, styled } from '@repo-radar/ui';

// The pressed state is styled from `aria-pressed`, so looks and semantics can't disagree.
export const ToggleButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  '&[aria-pressed="true"]': {
    '--variant-outlinedColor': theme.vars.palette.accent.fg,
    '--variant-outlinedBg': theme.vars.palette.accent.subtle,
    '--variant-outlinedBorder': theme.vars.palette.accent.muted,
  },
}));
