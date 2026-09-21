import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithTheme } from '../../testing';
import ConfirmDialog from '.';

const setup = (
  props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {},
) => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  const user = userEvent.setup();

  renderWithTheme(
    <ConfirmDialog
      open
      title="Stop tracking octo/radar?"
      description="Its history goes with it."
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />,
  );

  return { onConfirm, onCancel, user };
};

describe('ConfirmDialog', () => {
  it('names itself and its consequence to assistive tech', () => {
    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Stop tracking octo/radar?',
    });
    expect(dialog).toHaveAccessibleDescription('Its history goes with it.');
  });

  it('confirms only when the confirm button is pressed', async () => {
    const { onConfirm, onCancel, user } = setup({ confirmLabel: 'Untrack' });

    await user.click(screen.getByRole('button', { name: 'Untrack' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('treats escape as cancelling, never as confirming', async () => {
    const { onConfirm, onCancel, user } = setup();

    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('opens on the safe answer, so a reflexive Enter keeps the data', () => {
    setup({ tone: 'danger', cancelLabel: 'Keep it' });

    expect(screen.getByRole('button', { name: 'Keep it' })).toHaveFocus();
  });

  it('shows supporting detail only when it is given', () => {
    setup({ details: 'This would spend 34 of 40 remaining requests.' });

    expect(
      screen.getByText('This would spend 34 of 40 remaining requests.'),
    ).toBeInTheDocument();
  });
});
