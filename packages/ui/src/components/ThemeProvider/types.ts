import type { ReactNode } from 'react';

import type { ColorMode } from '../../theme/colorScheme';

export interface IThemeProviderProps {
  children: ReactNode;
  /** Used until the user picks a mode. */
  defaultMode?: ColorMode;
}
