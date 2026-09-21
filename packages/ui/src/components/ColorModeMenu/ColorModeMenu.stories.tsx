import type { Meta, StoryObj } from '@storybook/react-vite';

import ColorModeMenu from '.';

const meta = {
  title: 'Inputs/ColorModeMenu',
  component: ColorModeMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof ColorModeMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Light, dark or follow the system. It drives the same provider the toolbar's
 * theme switcher does, so the two agree.
 */
export const Default: Story = {};
