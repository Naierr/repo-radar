import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';

import ThemeProvider from '../components/ThemeProvider';

const noop = (): undefined => undefined;

/** jsdom lacks the browser APIs MUI relies on (media queries, resize observer). */
export const installDomStubs = (): void => {
  // `Reflect.has` because TypeScript's DOM types claim these always exist.
  if (!Reflect.has(window, 'matchMedia')) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: noop,
        removeEventListener: noop,
        addListener: noop,
        removeListener: noop,
        dispatchEvent: () => false,
      }),
    });
  }

  if (!Reflect.has(window, 'ResizeObserver')) {
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: class {
        observe = noop;
        unobserve = noop;
        disconnect = noop;
      },
    });
  }
};

/** Renders inside the real theme provider, the way the app mounts it. */
export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => render(ui, { wrapper: ThemeProvider, ...options });
