import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { installDomStubs } from '../testing';

installDomStubs();

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
