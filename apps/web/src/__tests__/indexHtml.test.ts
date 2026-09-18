import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_SCHEME_ATTRIBUTE,
  theme,
} from '@repo-radar/ui';
import { describe, expect, it } from 'vitest';

import indexHtml from '../../index.html?raw';

// index.html repeats a few design-system values so the first paint is right.
// These checks fail the moment the two drift apart.
describe('index.html', () => {
  it('reads the saved mode under the key the theme writes', () => {
    expect(indexHtml).toContain(
      `localStorage.getItem('${COLOR_MODE_STORAGE_KEY}')`,
    );
  });

  it('sets the attribute the theme switches on', () => {
    expect(indexHtml).toContain(`'${COLOR_SCHEME_ATTRIBUTE}'`);
  });

  it('paints each scheme’s canvas colour before the app loads', () => {
    const light = theme.colorSchemes.light?.palette.background.default;
    const dark = theme.colorSchemes.dark?.palette.background.default;

    expect(light).toBeDefined();
    expect(dark).toBeDefined();
    expect(indexHtml).toContain(`background: ${light ?? ''}`);
    expect(indexHtml).toContain(`background: ${dark ?? ''}`);
  });
});
