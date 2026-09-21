import { formatRelativeTime } from '@repo-radar/ui';

import { APP_ERROR_KIND } from '@/types/request';
import type { IAppError } from '@/types/request';

/** The error's message, plus when the rate limit lifts if that is the problem. */
export const describeError = (error: IAppError, now: Date): string => {
  if (error.kind !== APP_ERROR_KIND.RATE_LIMITED || !error.resetAt) {
    return error.message;
  }

  // The window has rolled over since this failed, so the budget is already
  // back. Reporting a reset in the past — "it resets 2 minutes ago" — reads as
  // nonsense and hides the one thing worth knowing: it will work now.
  const resetAt = new Date(error.resetAt);
  if (resetAt <= now) return 'GitHub’s rate limit has reset. Try again.';

  return `${error.message} It resets ${formatRelativeTime(resetAt, now)}.`;
};

/** Retrying can't bring back a missing repository or fix a rejected query. */
export const isRetryable = (error: IAppError): boolean =>
  error.kind !== APP_ERROR_KIND.NOT_FOUND &&
  error.kind !== APP_ERROR_KIND.VALIDATION;
