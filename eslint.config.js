import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['**/dist', '**/coverage', '**/storybook-static']),

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['**/*.tsx'],
    extends: [
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.configs.recommended,
    ],
  },

  // ── House rules ──
  {
    rules: {
      'no-console': 'error',
      // `interface X extends Pick<…> {}` keeps the I-prefixed props convention
      // while deriving the shape, so it can't drift from its source.
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      'max-lines': [
        'warn',
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
    },
  },

  // The design system is the only door to MUI — the app never imports it directly.
  {
    files: ['apps/web/src/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*', '@emotion/*'],
              message:
                'Import UI from @repo-radar/ui (or charts from @repo-radar/charts).',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/test/**', '**/testing/**'],
    rules: {
      'max-lines': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // Stories export story objects beside their component, which is exactly what
  // Fast Refresh warns about and exactly how CSF is written.
  {
    files: ['**/*.stories.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'max-lines': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  {
    files: ['**/*.{js,cjs,mjs}', '**/*.config.ts'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },

  // Storybook's own configuration: build tooling that happens to render React.
  {
    files: ['**/.storybook/*.{ts,tsx}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  prettier,
);
