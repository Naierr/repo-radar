import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/test/**',
        '**/__tests__/**',
        '**/testing/**',
        '**/*.d.ts',
        '**/index.ts',
        'apps/web/src/main.tsx',
      ],
    },
  },
});
