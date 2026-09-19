import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithTheme } from '../../testing';
import SearchField from '.';
import type { ISearchFieldProps } from './types';

const LABEL = 'Search repositories';

const ControlledSearchField: React.FC<Partial<ISearchFieldProps>> = (props) => {
  const [value, setValue] = useState('');
  return (
    <SearchField label={LABEL} value={value} onChange={setValue} {...props} />
  );
};

describe('SearchField', () => {
  it('reports every change to its owner', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(<SearchField label={LABEL} value="" onChange={onChange} />);

    await user.type(screen.getByRole('searchbox', { name: LABEL }), 'r');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('r');
  });

  it('clears the query and keeps focus in the field', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ControlledSearchField />);
    const field = screen.getByRole('searchbox', { name: LABEL });

    await user.type(field, 'redux');
    await user.click(screen.getByRole('button', { name: /clear search/i }));

    expect(field).toHaveValue('');
    expect(field).toHaveFocus();
  });

  it('jumps to the field when the shortcut key is pressed', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ControlledSearchField shortcutKey="/" />);

    await user.keyboard('/');

    const field = screen.getByRole('searchbox', { name: LABEL });
    expect(field).toHaveFocus();
    expect(field).toHaveValue('');
  });

  it('announces the shortcut on the field itself, not on the visual key', () => {
    renderWithTheme(<ControlledSearchField shortcutKey="/" />);

    expect(screen.getByRole('searchbox', { name: LABEL })).toHaveAttribute(
      'aria-keyshortcuts',
      '/',
    );
  });

  it('leaves the shortcut alone while the user types elsewhere', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <>
        <input aria-label="Other field" />
        <ControlledSearchField shortcutKey="/" />
      </>,
    );
    const other = screen.getByRole('textbox', { name: 'Other field' });

    await user.type(other, 'a/b');

    expect(other).toHaveValue('a/b');
    expect(other).toHaveFocus();
  });

  it('shows a busy indicator instead of the clear button while loading', () => {
    renderWithTheme(
      <SearchField label={LABEL} value="react" onChange={vi.fn()} loading />,
    );

    expect(
      screen.getByRole('progressbar', { name: /searching/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /clear search/i }),
    ).not.toBeInTheDocument();
  });
});
