import { styled } from '@mui/material/styles';

import { radius } from '../../tokens/shape';
import type { ICounterLabelProps } from './types';

export const CounterRoot = styled('span', {
  shouldForwardProp: (prop) => prop !== 'tone',
})<Required<Pick<ICounterLabelProps, 'tone'>>>(({ theme, tone }) => ({
  display: 'inline-grid',
  placeItems: 'center',
  minWidth: 20,
  height: 20,
  padding: '0 6px',
  borderRadius: radius.full,
  fontSize: '0.75rem',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  color:
    tone === 'accent'
      ? theme.vars.palette.accent.fg
      : theme.vars.palette.fg.default,
  backgroundColor:
    tone === 'accent'
      ? theme.vars.palette.accent.subtle
      : theme.vars.palette.canvas.hover,
}));
