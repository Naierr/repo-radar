import { lazy } from 'react';

// The dashboard brings the charting library with it — fetch it only when visited.
const LazyTrackedReposPage = lazy(() => import('.'));

export default LazyTrackedReposPage;
