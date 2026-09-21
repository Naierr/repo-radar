import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RATE_LIMIT_RESOURCE } from '@/api/rateLimit';
import type { IRateLimit } from '@/api/rateLimit';

export interface IRateLimitState {
  core: IRateLimit | null;
  search: IRateLimit | null;
}

const initialState: IRateLimitState = { core: null, search: null };

const rateLimitSlice = createSlice({
  name: 'rateLimit',
  initialState,
  reducers: {
    rateLimitUpdated: (state, { payload }: PayloadAction<IRateLimit>) => {
      if (payload.resource === RATE_LIMIT_RESOURCE.CORE) state.core = payload;
      if (payload.resource === RATE_LIMIT_RESOURCE.SEARCH) {
        state.search = payload;
      }
    },
  },
});

export const { rateLimitUpdated } = rateLimitSlice.actions;

interface IRateLimitRoot {
  rateLimit: IRateLimitState;
}

export const selectCoreRateLimit = (state: IRateLimitRoot) =>
  state.rateLimit.core;
export const selectSearchRateLimit = (state: IRateLimitRoot) =>
  state.rateLimit.search;

/**
 * Requests left on the core budget, or null when GitHub has not told us yet
 * or the window has since reset — counts from a closed window describe a
 * budget that has already refilled, so they must not gate anything.
 */
export const selectCoreRequestsLeft = (
  state: IRateLimitRoot,
  now: number,
): number | null => {
  const core = state.rateLimit.core;
  if (!core) return null;
  return Date.parse(core.resetAt) > now ? core.remaining : null;
};

export default rateLimitSlice;
