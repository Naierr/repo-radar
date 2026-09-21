import type { Meta, StoryObj } from '@storybook/react-vite';

import BarChart from '.';

const REPOS = [
  { id: '1', label: 'reduxjs/redux-toolkit', value: 11223 },
  { id: '2', label: 'mui/material-ui', value: 96410 },
  { id: '3', label: 'vitejs/vite', value: 74032 },
  { id: '4', label: 'microsoft/TypeScript', value: 104988 },
  { id: '5', label: 'facebook/react', value: 240117 },
];

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    data: REPOS,
    title: 'Stars per tracked repository',
    valueLabel: 'Stars',
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Horizontal, because repository names are long and reading them rotated is
 * work. Every bar is also a row of a visually hidden data table, so the chart
 * is answerable without seeing it.
 */
export const Default: Story = {};

/** Long names are truncated rather than allowed to squeeze the plot. */
export const LongNames: Story = {
  args: {
    data: [
      {
        id: '1',
        label: 'an-organisation-with-a-long-name/and-a-longer-repository-name',
        value: 4210,
      },
      ...REPOS.slice(0, 2),
    ],
  },
};

export const SingleRepository: Story = {
  args: { data: [REPOS[0]!] },
};

export const Loading: Story = {
  args: { loading: true },
};

/** Nothing tracked yet: the chart says so rather than drawing empty axes. */
export const Empty: Story = {
  args: { data: [], emptyMessage: 'Track a repository to see its stars here.' },
};
