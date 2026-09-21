import type { RouteObject } from 'react-router';

import { ROUTES } from '@/constants/routes';
import AppLayout from '@/layouts/AppLayout';
import GuidePage from '@/pages/GuidePage';
import NotFoundPage from '@/pages/NotFoundPage';
import SearchPage from '@/pages/SearchPage';
import LazyTrackedReposPage from '@/pages/TrackedReposPage/lazy';

export const routes: RouteObject[] = [
  {
    path: ROUTES.SEARCH,
    element: <AppLayout />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: ROUTES.TRACKED, element: <LazyTrackedReposPage /> },
      { path: ROUTES.GUIDE, element: <GuidePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
