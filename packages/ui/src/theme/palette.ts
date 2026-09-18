import type { PaletteOptions } from '@mui/material/styles';

import { nebula } from '../tokens/palette';
import type { ISemanticColors } from '../tokens/semantic';

/** Maps the semantic roles onto MUI's palette, plus our own roles on top. */
export const buildPalette = (
  colors: ISemanticColors,
  overlayShadow: string,
): PaletteOptions => ({
  primary: { main: colors.accent.emphasis, contrastText: colors.fg.onEmphasis },
  secondary: { main: nebula[500], contrastText: colors.fg.onEmphasis },
  // MUI paints these as text as often as fills, so they take the readable tone.
  success: { main: colors.success.fg },
  warning: { main: colors.attention.fg },
  error: { main: colors.danger.fg },
  info: { main: colors.accent.fg },
  background: {
    default: colors.canvas.default,
    paper: colors.canvas.overlay,
  },
  text: {
    primary: colors.fg.default,
    secondary: colors.fg.muted,
    disabled: colors.fg.subtle,
  },
  divider: colors.border.default,

  canvas: colors.canvas,
  fg: colors.fg,
  border: colors.border,
  accent: colors.accent,
  tone: {
    success: colors.success,
    attention: colors.attention,
    danger: colors.danger,
  },
  tooltip: colors.tooltip,
  starfield: colors.starfield,
  shadow: { overlay: overlayShadow },
});
