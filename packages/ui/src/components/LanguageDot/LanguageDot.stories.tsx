import type { Meta, StoryObj } from '@storybook/react-vite';

import LanguageDot from '.';

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Rust',
  'Go',
  'Python',
  'Elixir',
];

const meta = {
  title: 'Data/LanguageDot',
  component: LanguageDot,
  tags: ['autodocs'],
  args: { language: 'TypeScript' },
} satisfies Meta<typeof LanguageDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Colours come from GitHub's own language palette. */
export const AcrossLanguages: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {LANGUAGES.map((language) => (
        <LanguageDot key={language} language={language} />
      ))}
    </div>
  ),
};

/** An unknown language still gets a stable colour rather than none. */
export const Unrecognised: Story = {
  args: { language: 'Brainfuck' },
};
