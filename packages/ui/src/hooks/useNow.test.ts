import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useNow } from './useNow';

const INTERVAL = 30_000;

afterEach(() => {
  vi.useRealTimers();
});

describe('useNow', () => {
  it('hands every reader the same instant', () => {
    vi.useFakeTimers();
    const first = renderHook(() => useNow(INTERVAL));
    // Mounted a moment later — the old per-component timer would have made
    // this one tick on its own schedule, and drift.
    vi.advanceTimersByTime(INTERVAL / 2);
    const second = renderHook(() => useNow(INTERVAL));

    expect(second.result.current).toBe(first.result.current);

    act(() => {
      vi.advanceTimersByTime(INTERVAL);
    });

    expect(second.result.current).toBe(first.result.current);
  });

  it('moves forward on each interval', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useNow(INTERVAL));
    const before = result.current;

    act(() => {
      vi.advanceTimersByTime(INTERVAL);
    });

    expect(result.current.getTime()).toBeGreaterThan(before.getTime());
  });

  it('stops ticking once nothing is watching', () => {
    vi.useFakeTimers();
    const clear = vi.spyOn(window, 'clearInterval');
    const { unmount } = renderHook(() => useNow(INTERVAL));

    unmount();

    expect(clear).toHaveBeenCalled();
  });
});
