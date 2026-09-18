import '@fontsource-variable/geist/index.css';
import '@fontsource-variable/geist-mono/index.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import {
  COLOR_MODE,
  COLOR_MODE_STORAGE_KEY,
  COLOR_SCHEME_STORAGE_KEY,
} from '../../theme/colorScheme';
import { theme } from '../../theme/theme';
import type { IThemeProviderProps } from './types';

/** Mounts the theme, both colour schemes, the fonts and the CSS baseline once. */
const ThemeProvider: React.FC<IThemeProviderProps> = ({
  children,
  defaultMode = COLOR_MODE.SYSTEM,
}) => (
  <MuiThemeProvider
    theme={theme}
    defaultMode={defaultMode}
    modeStorageKey={COLOR_MODE_STORAGE_KEY}
    colorSchemeStorageKey={COLOR_SCHEME_STORAGE_KEY}
    disableTransitionOnChange
  >
    <CssBaseline enableColorScheme />
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;
