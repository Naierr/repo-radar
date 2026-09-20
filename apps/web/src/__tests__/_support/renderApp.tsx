import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';

import App from '@/App';
import { ROUTES } from '@/constants/routes';
import { routes } from '@/routes';
import { setupStore } from '@/store';
import type { RootState } from '@/store';

import { createFakeGitHubApi } from './builders';
import type { FakeGitHubApi } from './builders';

interface IRenderAppOptions {
  route?: string;
  preloadedState?: Partial<RootState>;
  githubApi?: FakeGitHubApi;
}

/**
 * Resolve the lazily loaded dashboard before a suite starts asserting.
 *
 * `TrackedReposPage` brings the charting library with it, and Vitest transforms
 * that module graph on first import — seconds of work. Left inside a test, it
 * lands in the first query's timeout and reads as a flaky failure when nothing
 * is actually wrong. Paying it once in `beforeAll` keeps the assertions
 * measuring the app instead of the module loader.
 */
export const preloadLazyRoutes = async (): Promise<void> => {
  await import('@/pages/TrackedReposPage');
};

/** The real app — store, theme, routes — talking to a scripted GitHub. */
export const renderApp = ({
  route = ROUTES.SEARCH,
  preloadedState,
  githubApi = createFakeGitHubApi(),
}: IRenderAppOptions = {}) => {
  const store = setupStore({ preloadedState, extra: { githubApi } });
  const router = createMemoryRouter(routes, { initialEntries: [route] });
  const user = userEvent.setup();

  render(<App store={store} router={router} />);

  return { store, router, user, githubApi };
};
