import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Both source-consumed packages, so the charts live beside the components
  // they are themed with.
  stories: ['../src/**/*.stories.tsx', '../../charts/src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
