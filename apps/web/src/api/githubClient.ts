import axios, { isAxiosError } from 'axios';
import type { AxiosResponse } from 'axios';

import { GITHUB_API_URL } from '@/config/env';

import { GITHUB_API_VERSION, REQUEST_TIMEOUT_MS } from './constants';
import { parseRateLimit } from './rateLimit';
import type { IRateLimit } from './rateLimit';

export const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
  },
});

// ── Rate-limit reporting ──
// Every response says how much of GitHub's budget is left. The client stays
// store-agnostic: whoever cares subscribes (the app wires it to Redux).

type RateLimitListener = (rateLimit: IRateLimit) => void;

const rateLimitListeners = new Set<RateLimitListener>();

export const subscribeToRateLimit = (
  listener: RateLimitListener,
): (() => void) => {
  rateLimitListeners.add(listener);
  return () => {
    rateLimitListeners.delete(listener);
  };
};

const reportRateLimit = (response: AxiosResponse | undefined): void => {
  if (!response) return;
  const rateLimit = parseRateLimit(response.headers);
  if (!rateLimit) return;
  rateLimitListeners.forEach((listener) => {
    listener(rateLimit);
  });
};

githubClient.interceptors.response.use(
  (response) => {
    reportRateLimit(response);
    return response;
  },
  (error: unknown) => {
    if (isAxiosError(error)) reportRateLimit(error.response);
    throw error;
  },
);
