import { ThemeProvider } from '@repo-radar/ui';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import type { IAppProps } from './types';

/** Store, theme and router — created by the caller, so tests can pass their own. */
const App: React.FC<IAppProps> = ({ store, router }) => (
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
);

export default App;
