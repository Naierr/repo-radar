import type { Meta, StoryObj } from '@storybook/react-vite';

import Sparkline from '.';

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  args: {
    values: [100, 104, 103, 111, 118, 117, 126],
    label: 'Stars since tracking began',
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Shape only — the exact figure lives beside it as a number. */
export const Rising: Story = {};

export const Falling: Story = {
  args: { values: [126, 120, 119, 111, 108, 100] },
};

/** A flat run has a zero range; it is drawn down the middle rather than at NaN. */
export const Unchanged: Story = {
  args: { values: [42, 42, 42, 42] },
};

/** One reading is a dot, not a trend, so nothing is drawn. */
export const TooEarly: Story = {
  args: { values: [42] },
};
