import Button from '@mui/material/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchLg, Telescope } from '@untitledui/icons';

import EmptyState from '.';

const ICON_SIZE = 22;

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <Telescope size={ICON_SIZE} />,
    title: 'Scan GitHub for repositories',
    description:
      'Search by name, topic or language \u2014 qualifiers such as language:rust work too.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The resting state of a surface that has nothing to show yet. */
export const Default: Story = {};

/** A dead end earns exactly one way out. */
export const WithAction: Story = {
  args: {
    title: 'Your radar is empty',
    description:
      'Search GitHub and track a few repositories \u2014 their stars will show up here.',
    action: <Button variant="contained">Find repositories</Button>,
  },
};

/** A search that simply matched nothing: no action would help. */
export const NoMatches: Story = {
  args: {
    icon: <SearchLg size={ICON_SIZE} />,
    title: 'No repositories match \u201cqwertyuiop\u201d',
    description: 'Check the spelling, or try fewer or broader words.',
  },
};
