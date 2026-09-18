import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from './useDebouncedValue';

const DELAY_MS = 400;

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with the value it was given', () => {
    const { result } = renderHook(() => useDebouncedValue('re', DELAY_MS));

    expect(result.current).toBe('re');
  });

  it('only lets the last value through once typing pauses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DELAY_MS),
      { initialProps: { value: 're' } },
    );

    rerender({ value: 'red' });
    act(() => {
      vi.advanceTimersByTime(DELAY_MS - 1);
    });
    rerender({ value: 'redux' });
    act(() => {
      vi.advanceTimersByTime(DELAY_MS - 1);
    });

    expect(result.current).toBe('re');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('redux');
  });
});
