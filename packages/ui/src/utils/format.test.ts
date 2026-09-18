import { describe, expect, it } from 'vitest';

import {
  formatCompactNumber,
  formatNumber,
  formatRelativeTime,
} from './format';

const NOW = new Date('2026-09-18T12:00:00Z');
const secondsAgo = (seconds: number) =>
  new Date(NOW.getTime() - seconds * 1000);

describe('formatCompactNumber', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1_000, '1k'],
    [12_345, '12.3k'],
    [1_250_000, '1.3m'],
  ])('prints %i as %s', (value, expected) => {
    expect(formatCompactNumber(value)).toBe(expected);
  });
});

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatRelativeTime', () => {
  it('says "now" for the current instant', () => {
    expect(formatRelativeTime(NOW, NOW)).toBe('now');
  });

  // A timestamp written a moment after the minute clock last ticked must not
  // read as "in 2 seconds".
  it.each([30, -30])('rounds %is either way to "now"', (seconds) => {
    expect(formatRelativeTime(secondsAgo(seconds), NOW)).toBe('now');
  });

  it.each([
    [90, '2 minutes ago'],
    [5 * 60, '5 minutes ago'],
    [3 * 60 * 60, '3 hours ago'],
    [24 * 60 * 60, 'yesterday'],
    [3 * 24 * 60 * 60, '3 days ago'],
    [21 * 24 * 60 * 60, '3 weeks ago'],
    [400 * 24 * 60 * 60, 'last year'],
  ])('picks the largest whole unit for %is ago', (seconds, expected) => {
    expect(formatRelativeTime(secondsAgo(seconds), NOW)).toBe(expected);
  });

  it('handles dates in the future', () => {
    expect(formatRelativeTime(secondsAgo(-2 * 60 * 60), NOW)).toBe(
      'in 2 hours',
    );
  });
});
