import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ConfirmDialog from '.';

const meta = {
  title: 'Feedback/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    open: true,
    title: 'Refresh all 17 repositories?',
    description:
      'GitHub limits anonymous visitors, and this would use most of what is left.',
    confirmLabel: 'Refresh all',
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The cost is stated as a fact, not buried in the sentence. */
export const CostlyAction: Story = {
  args: { details: 'Spends 34 of the 40 requests left · resets in 41 minutes' },
};

/**
 * Destructive confirmations open with Cancel focused, so the reflexive Enter
 * keeps the data rather than losing it.
 */
export const Destructive: Story = {
  args: {
    tone: 'danger',
    title: 'Stop tracking reduxjs/redux-toolkit?',
    description: 'It leaves your radar and the chart immediately.',
    confirmLabel: 'Stop tracking',
    cancelLabel: 'Keep tracking',
    details: undefined,
  },
};

/** While the confirmed work runs, the dialog stays put and says so. */
export const Working: Story = {
  args: { busy: true, details: undefined },
};
