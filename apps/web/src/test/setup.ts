import '@testing-library/jest-dom/vitest';

import { installDomStubs } from '@repo-radar/ui/testing';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

// Integration tests wait on a debounce and on the lazily loaded dashboard,
// whose first import (charts included) is slow to transform under Vitest.
const ASYNC_QUERY_TIMEOUT_MS = 5000;

configure({ asyncUtilTimeout: ASYNC_QUERY_TIMEOUT_MS });
installDomStubs();

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
