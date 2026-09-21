import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircle, Star01 } from '@untitledui/icons';

import Metric from '.';

const ICON_SIZE = 15;

const meta = {
  title: 'Data/Metric',
  component: Metric,
  tags: ['autodocs'],
  args: {
    icon: <Star01 size={ICON_SIZE} />,
    label: 'Stars',
    children: '11.2k',
    tooltip: '11,223',
  },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The glanceable value; the exact one waits on hover. */
export const Default: Story = {};

export const OpenIssues: Story = {
  args: {
    icon: <AlertCircle size={ICON_SIZE} />,
    label: 'Open issues',
    children: '275',
    tooltip: '275 (GitHub counts open pull requests too)',
  },
};

/** Holds the row's shape while a refresh is in flight. */
export const Loading: Story = {
  args: { loading: true },
};
