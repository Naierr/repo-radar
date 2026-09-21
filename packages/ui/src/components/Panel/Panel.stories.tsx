import Button from '@mui/material/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Panel from '.';

const meta = {
  title: 'Surfaces/Panel',
  component: Panel,
  tags: ['autodocs'],
  args: {
    title: 'Stars per repository',
    description: 'Every tracked repository, most-starred first.',
    children: <p style={{ margin: 0 }}>Anything can go in the body.</p>,
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A header without the supporting line, for tighter places. */
export const TitleOnly: Story = {
  args: { description: undefined },
};

/** Controls sit on the right of the header rather than inside the body. */
export const WithActions: Story = {
  args: {
    actions: (
      <Button size="small" variant="outlined">
        Refresh all
      </Button>
    ),
  },
};

/** Edge-to-edge content such as a list supplies its own padding. */
export const EdgeToEdge: Story = {
  args: {
    disablePadding: true,
    description: undefined,
    children: (
      <ul style={{ margin: 0, padding: '12px 20px' }}>
        <li>reduxjs/redux-toolkit</li>
        <li>mui/material-ui</li>
      </ul>
    ),
  },
};
