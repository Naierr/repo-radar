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
