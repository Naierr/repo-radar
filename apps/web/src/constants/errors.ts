import type { AppErrorKind } from '@/types/request';

export const ERROR_MESSAGES: Record<AppErrorKind, string> = {
  rate_limited: 'GitHub’s rate limit is used up for now.',
  not_found:
    'GitHub can’t find this repository — it may have been deleted or made private.',
  validation: 'GitHub couldn’t run that search. Try different words.',
  network: 'Can’t reach GitHub. Check your connection and try again.',
  server: 'GitHub is having trouble right now. Try again in a moment.',
  unknown: 'Something went wrong while talking to GitHub.',
};
