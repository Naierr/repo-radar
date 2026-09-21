import { describe, expect, it } from 'vitest';

import * as ui from './index';

// Pins the package's public surface: removing or renaming an export is a
// breaking change for the app, so it should be a deliberate diff here too.
describe('@repo-radar/ui public surface', () => {
  it('exports exactly the documented API', () => {
    expect(Object.keys(ui).sort()).toEqual(
      [
        'Avatar',
        'BrandMark',
        'Button',
        'COLOR_MODE',
        'COLOR_MODE_STORAGE_KEY',
        'COLOR_SCHEME_ATTRIBUTE',
        'ColorModeMenu',
        'ConfirmDialog',
        'CounterLabel',
        'EmptyState',
        'ErrorNotice',
        'GradientText',
        'IconButton',
        'LanguageDot',
        'LinearProgress',
        'Link',
        'Metric',
        'Pagination',
        'Panel',
        'RelativeTime',
        'SearchField',
        'Skeleton',
        'Snackbar',
        'Starfield',
        'ThemeProvider',
        'Tooltip',
        'VisuallyHidden',
        'formatCompactNumber',
        'formatNumber',
        'formatRelativeTime',
        'seriesColors',
        'styled',
        'theme',
        'useColorMode',
        'useNow',
      ].sort(),
    );
  });
});
