import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import { subscribeToRateLimit } from '@/api/githubClient';
import App from '@/App';
import { loadTrackedRepos } from '@/domain/trackedReposStorage';
import { routes } from '@/routes';
import { setupStore } from '@/store';
import { rateLimitUpdated } from '@/store/rateLimit';
import { createTrackedReposState } from '@/store/trackedRepos';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Repo Radar needs a #root element to mount into.');
}

const store = setupStore({
  preloadedState: {
    trackedRepos: createTrackedReposState(
      loadTrackedRepos(window.localStorage),
    ),
  },
});

subscribeToRateLimit((rateLimit) => {
  store.dispatch(rateLimitUpdated(rateLimit));
});

createRoot(container).render(
  <StrictMode>
    <App store={store} router={createBrowserRouter(routes)} />
  </StrictMode>,
);
