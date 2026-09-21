import { describe, expect, it } from 'vitest';

import { createAppError } from '@/api/apiError';

import { describeError, isRetryable } from './describeError';

const NOW = new Date('2026-09-18T12:00:00Z');

describe('describeError', () => {
  it('adds when a spent rate limit lifts', () => {
    const error = createAppError('rate_limited', {
      resetAt: '2026-09-18T12:10:00Z',
    });

    expect(describeError(error, NOW)).toContain('in 10 minutes');
  });

  it('says the limit is back rather than reporting a reset in the past', () => {
    // The window rolled over while the error sat on the row. "It resets 2
    // minutes ago" is nonsense, and buries the fact that retrying will work.
    const error = createAppError('rate_limited', {
      resetAt: '2026-09-18T11:58:00Z',
    });

    const message = describeError(error, NOW);

    expect(message).toContain('has reset');
    expect(message).not.toContain('ago');
  });

  it('leaves other errors as they are', () => {
    const error = createAppError('network');

    expect(describeError(error, NOW)).toBe(error.message);
  });
});

describe('isRetryable', () => {
  it.each([
    ['network', true],
    ['server', true],
    ['rate_limited', true],
    ['not_found', false],
    ['validation', false],
  ] as const)('%s → %s', (kind, expected) => {
    expect(isRetryable(createAppError(kind))).toBe(expected);
  });
});
