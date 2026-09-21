import type { Meta, StoryObj } from '@storybook/react-vite';

import CounterLabel from '.';

const meta = {
  title: 'Data/CounterLabel',
  component: CounterLabel,
  tags: ['autodocs'],
  args: { count: 12 },
} satisfies Meta<typeof CounterLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

/** Draws the eye, e.g. beside the active tab. */
export const Accent: Story = {
  args: { tone: 'accent' },
};

/** Nothing tracked yet \u2014 still rendered so the tab does not jump. */
export const Zero: Story = {
  args: { count: 0 },
};
