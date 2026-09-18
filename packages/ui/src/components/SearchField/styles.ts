import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { radius } from '../../tokens/shape';
import { fontFamily } from '../../tokens/typography';

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

export const ShortcutHint = styled('kbd')(({ theme }) => ({
  display: 'inline-grid',
  placeItems: 'center',
  minWidth: 20,
  height: 20,
  padding: '0 6px',
  fontFamily: fontFamily.mono,
  fontSize: '0.75rem',
  color: theme.vars.palette.fg.muted,
  border: `1px solid ${theme.vars.palette.border.default}`,
  borderRadius: radius.sm,
  backgroundColor: theme.vars.palette.canvas.subtle,
}));
