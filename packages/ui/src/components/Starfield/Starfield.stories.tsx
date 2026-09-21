import type { Meta, StoryObj } from '@storybook/react-vite';

import Starfield from '.';

const meta = {
  title: 'Brand/Starfield',
  component: Starfield,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Starfield>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The night sky behind every page: three depths of stars twinkling on their own
 * clocks, a nebula, and a radar sweep. Entirely decorative and hidden from
 * assistive tech, and it stops moving under `prefers-reduced-motion`.
 * Switch the toolbar's theme — the colours are tokens, not fixed values.
 */
export const Default: Story = {
  render: () => (
    <div style={{ height: '70vh', position: 'relative' }}>
      <Starfield />
    </div>
  ),
};
