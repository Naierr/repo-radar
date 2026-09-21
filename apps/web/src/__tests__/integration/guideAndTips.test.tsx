import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderApp } from '../_support/renderApp';

describe('helping the user', () => {
  it('reaches the guide from the header on any page', async () => {
    const { user } = renderApp();

    await user.click(
      screen.getByRole('link', { name: 'How to use Repo Radar' }),
    );

    expect(
      await screen.findByRole('heading', {
        name: /how to get the most out of repo radar/i,
      }),
    ).toBeInTheDocument();
  });

  it('warns that GitHub search ignores the owner, where it will be read', () => {
    renderApp();

    // The tip sits under the search box, not buried in the guide: this is the
    // surprise that sends people away thinking the app is broken.
    expect(
      screen.getByText(/searches names, descriptions and topics — not owners/i),
    ).toBeInTheDocument();
  });

  it('puts an example into the box so a tip can be tried, not just read', async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole('button', { name: 'user:mattpocock' }));

    expect(
      screen.getByRole('searchbox', { name: 'Search GitHub repositories' }),
    ).toHaveValue('user:mattpocock');
  });
});
