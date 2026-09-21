import { useEffect } from 'react';

import type { Decorator, Preview } from '@storybook/react-vite';

import { COLOR_MODE, ThemeProvider, useColorMode } from '../src';
import type { ColorMode } from '../src';

const MODE_GLOBAL = 'colorMode';

const toColorMode = (value: unknown): ColorMode =>
  value === COLOR_MODE.LIGHT || value === COLOR_MODE.DARK
    ? value
    : COLOR_MODE.SYSTEM;

/**
 * The theme is a provider, not a class on the root, so the toolbar drives it
 * the same way the app's own colour-mode menu does.
 */
const ModeSync: React.FC<{ mode: ColorMode; children: React.ReactNode }> = ({
  mode,
  children,
}) => {
  const { setMode } = useColorMode();

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  return children;
};

const withTheme: Decorator = (Story, context) => (
  <ThemeProvider>
    <ModeSync mode={toColorMode(context.globals[MODE_GLOBAL])}>
      <Story />
    </ModeSync>
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: { [MODE_GLOBAL]: COLOR_MODE.DARK },
  globalTypes: {
    [MODE_GLOBAL]: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: COLOR_MODE.LIGHT, icon: 'sun', title: 'Light' },
          { value: COLOR_MODE.DARK, icon: 'moon', title: 'Dark' },
          { value: COLOR_MODE.SYSTEM, icon: 'browser', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
