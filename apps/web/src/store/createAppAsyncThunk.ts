import { createAsyncThunk } from '@reduxjs/toolkit';

import type { IAppError } from '@/types/request';

import type { AppDispatch, IThunkExtra, RootState } from './index';

/** Every thunk knows the state, the injected API and its error shape. */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: IThunkExtra;
  rejectValue: IAppError;
}>();
