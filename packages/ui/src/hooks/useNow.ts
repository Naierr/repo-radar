import { useMemo, useSyncExternalStore } from 'react';

interface IClock {
  now: Date;
  listeners: Set<() => void>;
  timer: number;
}

/**
 * One clock per interval, shared by everything that asks for it.
 *
 * A timer started per component ticks from whenever that component mounted, so
 * two of them drift by up to a full interval — which is how the header could
 * say a limit resets in three minutes while the panel below said two. Sharing
 * the tick means every reader holds the same `Date`, so they cannot disagree.
 */
const clocks = new Map<number, IClock>();

const getClock = (intervalMs: number): IClock => {
  const existing = clocks.get(intervalMs);
  if (existing) return existing;

  const clock: IClock = { now: new Date(), listeners: new Set(), timer: 0 };
  clocks.set(intervalMs, clock);
  return clock;
};

const subscribeTo = (intervalMs: number) => (onChange: () => void) => {
  const clock = getClock(intervalMs);
  clock.listeners.add(onChange);

  clock.timer ||= window.setInterval(() => {
    clock.now = new Date();
    for (const listener of clock.listeners) listener();
  }, intervalMs);

  return () => {
    clock.listeners.delete(onChange);
    // The last reader takes the clock with it, so nothing ticks unwatched.
    if (clock.listeners.size === 0) {
      window.clearInterval(clock.timer);
      clocks.delete(intervalMs);
    }
  };
};

/** The current time, refreshed every `intervalMs` so relative labels stay true. */
export const useNow = (intervalMs: number): Date =>
  useSyncExternalStore(
    // Memoised because a new subscribe function would resubscribe — and so
    // restart the clock — on every render.
    useMemo(() => subscribeTo(intervalMs), [intervalMs]),
    () => getClock(intervalMs).now,
  );
