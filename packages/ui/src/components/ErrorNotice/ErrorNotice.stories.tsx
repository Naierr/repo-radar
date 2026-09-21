import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ErrorNotice from '.';

const meta = {
  title: 'Feedback/ErrorNotice',
  component: ErrorNotice,
  tags: ['autodocs'],
  args: {
    message: 'GitHub could not be reached. Check your connection.',
    onRetry: fn(),
  },
} satisfies Meta<typeof ErrorNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Retryable: the failure might not happen again. */
export const Default: Story = {};

/** Retrying cannot help until the window resets, so no button is offered. */
export const NotRetryable: Story = {
  args: {
    message: 'GitHub\u2019s request limit is spent. It resets in 9 minutes.',
    onRetry: undefined,
  },
};

export const CustomRetryLabel: Story = {
  args: { retryLabel: 'Try again' },
};
