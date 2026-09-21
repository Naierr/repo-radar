import type { Meta, StoryObj } from '@storybook/react-vite';

import VisuallyHidden from '.';

const meta = {
  title: 'Utilities/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Text only a screen reader gets. Sighted users read "11.2k" beside a star
 * icon; the icon means nothing announced aloud, so the unit is supplied here.
 * Inspect the DOM — the words are present, just not painted.
 */
export const NamingAnIcon: Story = {
  render: () => (
    <p style={{ margin: 0 }}>
      <VisuallyHidden>Stars: </VisuallyHidden>
      11.2k
    </p>
  ),
};
