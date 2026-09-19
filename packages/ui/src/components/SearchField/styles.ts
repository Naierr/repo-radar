import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { motion, radius } from '../../tokens/shape';
import { fontFamily, fontWeight } from '../../tokens/typography';

export const SearchInput = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'fieldSize',
})<{ fieldSize: 'md' | 'lg' }>(({ theme, fieldSize }) => ({
  '& .MuiInputBase-root': {
    minHeight: fieldSize === 'lg' ? 48 : 36,
    fontSize: fieldSize === 'lg' ? '1rem' : '0.875rem',
    backgroundColor: theme.vars.palette.canvas.overlay,
  },
  '& input::-webkit-search-cancel-button': { display: 'none' },
}));

// Drawn as a keycap: a thicker bottom edge gives it depth, and a line-height
// of 1 keeps the glyph centred (an inherited line-height pushed it down).
// Hidden where it can't help: once the field has focus, and on touch screens
// that have no "/" key.
export const ShortcutHint = styled('kbd')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 22,
  height: 22,
  padding: '0 6px',
  fontFamily: fontFamily.mono,
  fontSize: '0.75rem',
  fontWeight: fontWeight.medium,
  lineHeight: 1,
  color: theme.vars.palette.fg.muted,
  backgroundColor: theme.vars.palette.canvas.subtle,
  border: `1px solid ${theme.vars.palette.border.default}`,
  borderBottomWidth: 2,
  borderRadius: radius.sm,
  userSelect: 'none',
  transition: `opacity ${motion.fast} ${motion.easing}`,
  '.Mui-focused &': { opacity: 0 },
  '@media (hover: none), (pointer: coarse)': { display: 'none' },
}));
