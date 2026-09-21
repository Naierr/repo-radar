import { screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';

import { buildSnapshot, createFakeGitHubApi } from '../_support/builders';
import { preloadLazyRoutes, renderApp } from '../_support/renderApp';

const sharedLink = (names: string) => `${ROUTES.TRACKED}?add=${names}`;

const renderShared = (names: string) => {
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
    ...renderApp({ route: sharedLink(names), githubApi }),
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
});
