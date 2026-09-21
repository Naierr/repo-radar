import type { Meta, StoryObj } from '@storybook/react-vite';

import RelativeTime from '.';

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

const agoBy = (ms: number): string => new Date(Date.now() - ms).toISOString();

const meta = {
  title: 'Data/RelativeTime',
  component: RelativeTime,
  tags: ['autodocs'],
  args: { date: agoBy(2 * DAY_MS) },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover for the exact timestamp. */
export const Default: Story = {};

/** Anything inside a minute reads as "now", in both directions. */
export const JustNow: Story = {
  args: { date: agoBy(5000) },
};

export const LongAgo: Story = {
  args: { date: agoBy(400 * DAY_MS) },
};

/** A missing or unparseable date falls back rather than rendering NaN. */
export const NoDate: Story = {
  args: { date: 'not a date', fallback: 'Never' },
};
