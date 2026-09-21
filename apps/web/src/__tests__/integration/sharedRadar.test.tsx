import { screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import type { IRateLimit } from '@/api/rateLimit';
import { ROUTES } from '@/constants/routes';

import {
  buildAxiosError,
  buildSnapshot,
  createFakeGitHubApi,
} from '../_support/builders';
import { preloadLazyRoutes, renderApp } from '../_support/renderApp';

const sharedLink = (names: string) => `${ROUTES.TRACKED}?add=${names}`;

const budget = (remaining: number): { core: IRateLimit; search: null } => ({
  core: {
    resource: 'core',
    limit: 60,
    remaining,
    resetAt: new Date(Date.now() + 600_000).toISOString(),
  },
  search: null,
});

const renderShared = (names: string, remaining?: number) => {
  const githubApi = createFakeGitHubApi();
  githubApi.fetchRepoSnapshot.mockImplementation((fullName) =>
    Promise.resolve(
      buildSnapshot({
        id: fullName.length,
        name: fullName.split('/')[1] ?? '',
      }),
    ),
  );
  return {
    ...renderApp({
      route: sharedLink(names),
      githubApi,
      ...(remaining === undefined
        ? {}
        : { preloadedState: { rateLimit: budget(remaining) } }),
    }),
    githubApi,
  };
};

describe('a shared radar', () => {
  beforeAll(preloadLazyRoutes);

  it('offers the repositories rather than adding them', async () => {
    const { user, githubApi } = renderShared('octo/alpha,octo/beta');

    const dialog = await screen.findByRole('dialog', {
      name: /add 2 shared repositories/i,
    });
    expect(within(dialog).getByText('octo/alpha')).toBeInTheDocument();
    expect(within(dialog).getByText('octo/beta')).toBeInTheDocument();
    // Asking costs nothing: not a single request until the answer is yes.
    expect(githubApi.fetchRepoSnapshot).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole('button', { name: 'Add to radar' }),
    );

    expect(
      await screen.findByRole('button', { name: 'Refresh octo/alpha' }),
    ).toBeInTheDocument();
    // One request each — an imported repo arrives complete and is not refetched.
    expect(githubApi.fetchRepoSnapshot).toHaveBeenCalledTimes(2);
  });

  it('adds nothing when the invitation is declined', async () => {
    const { user, githubApi } = renderShared('octo/alpha');

    await user.click(
      within(
        await screen.findByRole('dialog', { name: /add 1 shared repository/i }),
      ).getByRole('button', { name: 'No thanks' }),
    );

    expect(githubApi.fetchRepoSnapshot).not.toHaveBeenCalled();
    expect(await screen.findByText('Your radar is empty')).toBeInTheDocument();
  });

  it('drops anything in the link that is not a repository name', async () => {
    renderShared('javascript:alert(1),octo/alpha,../../etc/passwd');

    // The link is untrusted input: only owner/name survives it.
    const dialog = await screen.findByRole('dialog', {
      name: /add 1 shared repository/i,
    });
    expect(within(dialog).getByText('octo/alpha')).toBeInTheDocument();
  });

  it('adds only what is still ticked', async () => {
    const { user, githubApi } = renderShared('octo/alpha,octo/beta');

    const dialog = await screen.findByRole('dialog', {
      name: /add 2 shared repositories/i,
    });
    await user.click(
      within(dialog).getByRole('checkbox', { name: 'octo/beta' }),
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Add to radar' }),
    );

    expect(
      await screen.findByRole('button', { name: 'Refresh octo/alpha' }),
    ).toBeInTheDocument();
    expect(githubApi.fetchRepoSnapshot).toHaveBeenCalledExactlyOnceWith(
      'octo/alpha',
    );
  });

  it('says when GitHub refused, and keeps the offer so it can be retried', async () => {
    const { user, githubApi } = renderShared('octo/alpha');
    githubApi.fetchRepoSnapshot.mockRejectedValue(buildAxiosError(403));

    const dialog = await screen.findByRole('dialog', {
      name: /add 1 shared repository/i,
    });
    await user.click(
      within(dialog).getByRole('button', { name: 'Add to radar' }),
    );

    // Silence here is the bug: a spent limit must not look like success.
    expect(
      await within(dialog).findByText(/would not return/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole('checkbox', { name: 'octo/alpha' }),
    ).toBeChecked();
  });

  it('refuses an import the remaining budget cannot cover', async () => {
    // Two repositories cost four requests; three are left.
    const { user } = renderShared('octo/alpha,octo/beta', 3);

    const dialog = await screen.findByRole('dialog', {
      name: /add 2 shared repositories/i,
    });

    expect(
      within(dialog).getByRole('button', { name: 'Add to radar' }),
    ).toBeDisabled();
    expect(
      within(dialog).getByText(/more than github will allow/i),
    ).toBeInTheDocument();

    // Dropping one brings it back within budget.
    await user.click(
      within(dialog).getByRole('checkbox', { name: 'octo/beta' }),
    );

    expect(
      within(dialog).getByRole('button', { name: 'Add to radar' }),
    ).toBeEnabled();
  });
});
