import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithTheme } from '../../testing';
import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_SCHEME_ATTRIBUTE,
} from '../../theme/colorScheme';
import ColorModeMenu from '.';

const openMenu = async () => {
  const user = userEvent.setup();
  renderWithTheme(<ColorModeMenu />);
  await user.click(screen.getByRole('button', { name: /change theme/i }));
  return user;
};

describe('ColorModeMenu', () => {
  it('offers light, dark and system, with system selected by default', async () => {
    await openMenu();

    const options = screen.getAllByRole('menuitemradio');
    expect(options).toHaveLength(3);
    expect(
      screen.getByRole('menuitemradio', { name: /system/i }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('switches the page to dark and remembers the choice', async () => {
    const user = await openMenu();

    await user.click(screen.getByRole('menuitemradio', { name: /dark/i }));

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute(
        COLOR_SCHEME_ATTRIBUTE,
        'dark',
      );
    });
    expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
  });

  it('closes after a choice is made', async () => {
    const user = await openMenu();

    await user.click(screen.getByRole('menuitemradio', { name: /light/i }));

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
