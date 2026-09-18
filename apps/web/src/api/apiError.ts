import { isAxiosError } from 'axios';

import { ERROR_MESSAGES } from '@/constants/errors';
import { APP_ERROR_KIND } from '@/types/request';
import type { AppErrorKind, IAppError } from '@/types/request';

import { readHeader } from './rateLimit';

const MS_PER_SECOND = 1000;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_UNPROCESSABLE = 422;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR = 500;

export const createAppError = (
  kind: AppErrorKind,
  overrides: Partial<Omit<IAppError, 'kind'>> = {},
): IAppError => ({
  kind,
  message: ERROR_MESSAGES[kind],
  status: null,
  resetAt: null,
  ...overrides,
});

/** When GitHub says a rate limit lifts: `retry-after` wins, then `x-ratelimit-reset`. */
const getRateLimitReset = (
  headers: Readonly<Record<string, unknown>>,
  now: number,
): string | null => {
  const retryAfter = Number(readHeader(headers, 'retry-after'));
  if (!Number.isNaN(retryAfter) && retryAfter > 0) {
    return new Date(now + retryAfter * MS_PER_SECOND).toISOString();
  }
  if (readHeader(headers, 'x-ratelimit-remaining') === '0') {
    const reset = Number(readHeader(headers, 'x-ratelimit-reset'));
    return new Date(reset * MS_PER_SECOND).toISOString();
  }
  return null;
};

/** The single place a thrown request error becomes something the UI can show. */
export const normalizeApiError = (
  error: unknown,
  now: number = Date.now(),
): IAppError => {
  if (!isAxiosError(error)) return createAppError(APP_ERROR_KIND.UNKNOWN);

  const { response } = error;
  if (!response) return createAppError(APP_ERROR_KIND.NETWORK);

  const { status } = response;
  const headers = response.headers as Readonly<Record<string, unknown>>;

  if (status === HTTP_FORBIDDEN || status === HTTP_TOO_MANY_REQUESTS) {
    const resetAt = getRateLimitReset(headers, now);
    if (resetAt) {
      return createAppError(APP_ERROR_KIND.RATE_LIMITED, { status, resetAt });
    }
  }
  if (status === HTTP_NOT_FOUND) {
    return createAppError(APP_ERROR_KIND.NOT_FOUND, { status });
  }
  if (status === HTTP_UNPROCESSABLE) {
    return createAppError(APP_ERROR_KIND.VALIDATION, { status });
  }
  if (status >= HTTP_SERVER_ERROR) {
    return createAppError(APP_ERROR_KIND.SERVER, { status });
  }
  return createAppError(APP_ERROR_KIND.UNKNOWN, { status });
};
