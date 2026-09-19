import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const GITHUB_API_ORIGIN = 'https://api.github.com';
const GITHUB_PROXY_PATH = '/github-api';

// Long-lived vendor chunks: shipping app code doesn't bust their cache.
// MUI X Charts is left out on purpose so it stays in the lazy dashboard chunk.
const VENDOR_CHUNKS = [
  {
    name: 'framework',
    test: /node_modules[\\/](react|react-dom|react-router|react-redux|@reduxjs|redux|immer|reselect|scheduler)[\\/]/,
  },
  {
    name: 'mui',
    test: /node_modules[\\/](@mui[\\/](?!x-)|@emotion|@popperjs|react-transition-group|stylis)/,
  },
];

export default defineConfig(({ mode }) => {
  // Deliberately not VITE_-prefixed: the token stays inside the dev server's
  // proxy and never reaches the browser bundle.
  const { GITHUB_TOKEN } = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      rolldownOptions: {
        output: { codeSplitting: { groups: VENDOR_CHUNKS } },
      },
    },
    server: {
      proxy: {
        [GITHUB_PROXY_PATH]: {
          target: GITHUB_API_ORIGIN,
          changeOrigin: true,
          rewrite: (path) => path.slice(GITHUB_PROXY_PATH.length),
          headers: GITHUB_TOKEN
            ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
            : undefined,
        },
      },
    },
    test: {
      name: 'web',
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      restoreMocks: true,
      // Integration tests wait on a debounce and on the lazily loaded dashboard,
      // whose first import (charts included) can take seconds on a busy machine
      // or a CI runner. 5 s (the default) made them flaky.
      testTimeout: 15_000,
    },
  };
});
