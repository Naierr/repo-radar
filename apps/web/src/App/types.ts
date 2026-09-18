import type { createBrowserRouter } from 'react-router';

import type { AppStore } from '@/store';

export interface IAppProps {
  store: AppStore;
  router: ReturnType<typeof createBrowserRouter>;
}
