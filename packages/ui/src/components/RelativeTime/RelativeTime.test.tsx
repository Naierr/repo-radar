import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithTheme } from '../../testing';
import RelativeTime from '.';

const NOW = new Date('2026-09-18T12:00:00Z');

describe('RelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a machine-readable time element', () => {
    const date = '2026-09-15T12:00:00Z';
    const { container } = renderWithTheme(<RelativeTime date={date} />);

    expect(container.querySelector('time')).toHaveAttribute(
      'datetime',
      new Date(date).toISOString(),
    );
    expect(screen.getByText('3 days ago')).toBeVisible();
  });

  it('falls back when the date is not a date', () => {
    renderWithTheme(<RelativeTime date="not-a-date" fallback="Unknown" />);

    expect(screen.getByText('Unknown')).toBeVisible();
  });
});
