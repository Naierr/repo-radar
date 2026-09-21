import type { Meta, StoryObj } from '@storybook/react-vite';

import BrandMark from '.';

const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Brand/BrandMark',
  component: BrandMark,
  tags: ['autodocs'],
  args: { size: 'lg', animated: true, title: 'Repo Radar' },
  argTypes: { size: { control: 'inline-radio', options: SIZES } },
} satisfies Meta<typeof BrandMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every size, so the sweep and rings stay legible as it shrinks. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: 'center', display: 'flex', gap: 20 }}>
      {SIZES.map((size) => (
        <BrandMark {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

/** Still, for favicons, print, and anyone who asked for less motion. */
export const Static: Story = {
  args: { animated: false },
};

/** No accessible name when a visible wordmark already sits beside it. */
export const Decorative: Story = {
  args: { title: '' },
};
