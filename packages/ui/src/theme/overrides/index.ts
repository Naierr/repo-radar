import type { Components, Theme } from '@mui/material/styles';

import { baseOverrides } from './base';
import { controlOverrides } from './controls';
import { feedbackOverrides } from './feedback';
import { surfaceOverrides } from './surfaces';

// Every override reads `theme.vars`, so a rule follows the active colour
// scheme through CSS variables instead of re-rendering per scheme.
export const components: Components<Theme> = {
  ...baseOverrides,
  ...controlOverrides,
  ...surfaceOverrides,
  ...feedbackOverrides,
};
