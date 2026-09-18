const MS_PER_SECOND = 1000;

export const RATE_LIMIT_RESOURCE = {
  CORE: 'core',
  SEARCH: 'search',
} as const;

export interface IRateLimit {
  /** Which budget the request spent: `core`, `search`, … */
  resource: string;
  limit: number;
  remaining: number;
  resetAt: string;
}

type Headers = Readonly<Record<string, unknown>>;

export const readHeader = (headers: Headers, name: string): string | null => {
  const value = headers[name];
  return typeof value === 'string' ? value : null;
};

/** Reads GitHub's `x-ratelimit-*` headers; null when a response carries none. */
export const parseRateLimit = (headers: Headers): IRateLimit | null => {
  const limit = Number(readHeader(headers, 'x-ratelimit-limit'));
  const remaining = Number(readHeader(headers, 'x-ratelimit-remaining'));
  const reset = Number(readHeader(headers, 'x-ratelimit-reset'));
  const resource = readHeader(headers, 'x-ratelimit-resource');

  if (!resource || [limit, remaining, reset].some(Number.isNaN)) return null;

  return {
    resource,
    limit,
    remaining,
    resetAt: new Date(reset * MS_PER_SECOND).toISOString(),
  };
};
