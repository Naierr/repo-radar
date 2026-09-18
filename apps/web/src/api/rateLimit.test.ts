import { describe, expect, it } from 'vitest';

import { parseRateLimit } from './rateLimit';

describe('parseRateLimit', () => {
  it('reads the budget GitHub reports on a response', () => {
    expect(
      parseRateLimit({
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '57',
        'x-ratelimit-reset': '1789000000',
        'x-ratelimit-resource': 'core',
      }),
    ).toEqual({
      resource: 'core',
      limit: 60,
      remaining: 57,
      resetAt: new Date(1789000000 * 1000).toISOString(),
    });
  });

  it('returns null when a response carries no budget', () => {
    expect(parseRateLimit({ 'content-type': 'application/json' })).toBeNull();
  });

  it('returns null for malformed numbers', () => {
    expect(
      parseRateLimit({
        'x-ratelimit-limit': 'sixty',
        'x-ratelimit-remaining': '57',
        'x-ratelimit-reset': '1789000000',
        'x-ratelimit-resource': 'core',
      }),
    ).toBeNull();
  });
});
