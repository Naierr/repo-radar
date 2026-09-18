import '@testing-library/jest-dom/vitest';

import { installDomStubs } from '@repo-radar/ui/testing';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

installDomStubs();

afterEach(() => {
  cleanup();
});
