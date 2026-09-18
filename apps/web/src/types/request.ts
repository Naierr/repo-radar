export const REQUEST_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const APP_ERROR_KIND = {
  RATE_LIMITED: 'rate_limited',
  NOT_FOUND: 'not_found',
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  UNKNOWN: 'unknown',
} as const;

export type AppErrorKind = (typeof APP_ERROR_KIND)[keyof typeof APP_ERROR_KIND];

/** Every failure the UI can see — plain data, so it can live in the store. */
export interface IAppError {
  kind: AppErrorKind;
  message: string;
  status: number | null;
  /** When a rate limit lifts, as an ISO string. */
  resetAt: string | null;
}

export interface IRequestState {
  status: RequestStatus;
  error: IAppError | null;
}
