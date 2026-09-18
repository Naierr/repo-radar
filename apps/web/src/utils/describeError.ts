import { formatRelativeTime } from '@repo-radar/ui';

import { APP_ERROR_KIND } from '@/types/request';
import type { IAppError } from '@/types/request';

/** The error's message, plus when the rate limit lifts if that is the problem. */
export const describeError = (error: IAppError, now: Date): string =>
  error.kind === APP_ERROR_KIND.RATE_LIMITED && error.resetAt
    ? `${error.message} It resets ${formatRelativeTime(new Date(error.resetAt), now)}.`
    : error.message;

/** Retrying can't bring back a missing repository or fix a rejected query. */
export const isRetryable = (error: IAppError): boolean =>
  error.kind !== APP_ERROR_KIND.NOT_FOUND &&
  error.kind !== APP_ERROR_KIND.VALIDATION;
