import { createTheme } from '@mui/material/styles';

import { shadow, radius } from '../tokens/shape';
import { darkColors, lightColors } from '../tokens/semantic';
import { fontFamily, fontWeight } from '../tokens/typography';
import type {} from './augmentation';
import { COLOR_SCHEME_ATTRIBUTE } from './colorScheme';
import { components } from './overrides';
import { buildPalette } from './palette';

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: COLOR_SCHEME_ATTRIBUTE,
    cssVarPrefix: 'rr',
  },
  colorSchemes: {
    light: { palette: buildPalette(lightColors, shadow.light.overlay) },
    dark: { palette: buildPalette(darkColors, shadow.dark.overlay) },
  },
  shape: { borderRadius: radius.md },
  typography: {
    fontFamily: fontFamily.sans,
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: fontWeight.semibold,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: fontWeight.semibold,
      letterSpacing: '-0.025em',
      lineHeight: 1.15,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: fontWeight.semibold,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
    },
    h4: { fontSize: '1.25rem', fontWeight: fontWeight.semibold },
    h5: { fontSize: '1rem', fontWeight: fontWeight.semibold },
    h6: { fontSize: '0.875rem', fontWeight: fontWeight.semibold },
    subtitle1: { fontSize: '1rem', fontWeight: fontWeight.medium },
    subtitle2: { fontSize: '0.875rem', fontWeight: fontWeight.semibold },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
    button: { fontSize: '0.875rem', textTransform: 'none' },
  },
  components,
});
