import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { buildAxiosError } from '@/__tests__/_support/builders';

import { normalizeApiError } from './apiError';

const NOW = Date.parse('2026-09-18T12:00:00Z');
const NOW_SECONDS = NOW / 1000;

describe('normalizeApiError', () => {
  it('recognises a spent rate limit and when it lifts', () => {
    const reset = NOW_SECONDS + 600;
    const error = buildAxiosError(403, {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': String(reset),
    });

    expect(normalizeApiError(error, NOW)).toMatchObject({
      kind: 'rate_limited',
      status: 403,
      resetAt: new Date(reset * 1000).toISOString(),
    });
  });

  it('trusts retry-after for secondary rate limits', () => {
    const error = buildAxiosError(429, { 'retry-after': '60' });

    expect(normalizeApiError(error, NOW)).toMatchObject({
      kind: 'rate_limited',
      resetAt: new Date(NOW + 60_000).toISOString(),
    });
  });

  it('does not blame the rate limit for a 403 that has budget left', () => {
    const error = buildAxiosError(403, { 'x-ratelimit-remaining': '12' });

    expect(normalizeApiError(error, NOW)).toMatchObject({
      kind: 'unknown',
      status: 403,
      resetAt: null,
    });
  });

  it.each([
    [404, 'not_found'],
    [422, 'validation'],
    [502, 'server'],
    [418, 'unknown'],
  ])('maps a %i response to %s', (status, kind) => {
    expect(normalizeApiError(buildAxiosError(status), NOW)).toMatchObject({
      kind,
      status,
    });
  });

  it('calls a request that never got an answer a network error', () => {
    const error = new AxiosError('Network Error', AxiosError.ERR_NETWORK);

    expect(normalizeApiError(error, NOW)).toMatchObject({
      kind: 'network',
      status: null,
    });
  });

  it('does not guess at errors that did not come from a request', () => {
    expect(normalizeApiError(new TypeError('boom'), NOW).kind).toBe('unknown');
  });

  it('always carries a message the UI can show', () => {
    expect(normalizeApiError(buildAxiosError(500), NOW).message).not.toBe('');
  });
});
