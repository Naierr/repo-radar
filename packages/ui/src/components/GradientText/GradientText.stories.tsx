import type { Meta, StoryObj } from '@storybook/react-vite';

import GradientText from '.';

const meta = {
  title: 'Brand/GradientText',
  component: GradientText,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { children: 'worth watching' },
} satisfies Meta<typeof GradientText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * How it is meant to be used: one phrase of a headline, not a paragraph. The
 * stops are per-scheme tokens, so both schemes clear WCAG AA against their own
 * canvas — there is a contrast test that fails the build otherwise.
 */
export const InAHeadline: Story = {
  render: (args) => (
    <h1 style={{ fontSize: '2.5rem', margin: 0, maxWidth: '18ch' }}>
      Find repositories <GradientText {...args} />
    </h1>
  ),
};
