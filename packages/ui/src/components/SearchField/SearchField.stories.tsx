import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import SearchField from '.';
import type { ISearchFieldProps } from './types';

/** Controlled by its owner, so the story holds the value the app would. */
const SearchFieldDemo: React.FC<ISearchFieldProps> = ({
  value: initial,
  ...props
}) => {
  const [value, setValue] = useState(initial);

  return <SearchField {...props} value={value} onChange={setValue} />;
};

const meta = {
  title: 'Inputs/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    value: '',
    label: 'Search GitHub repositories',
    placeholder: 'Search repositories \u2014 try "state management"',
    onChange: () => undefined,
  },
  render: (args) => <SearchFieldDemo {...args} />,
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The label is accessible-only: the placeholder carries the visible hint. */
export const Default: Story = {};

/** A keycap hint that disappears on focus, and hides on touch pointers. */
export const WithShortcut: Story = {
  args: { shortcutKey: '/' },
};

/** The clear button gives way to a spinner rather than shifting the layout. */
export const Loading: Story = {
  args: { value: 'redux toolkit', loading: true },
};

export const Large: Story = {
  args: { size: 'lg', shortcutKey: '/' },
};
