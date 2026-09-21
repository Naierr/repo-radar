import { describe, expect, it } from 'vitest';

import { MIN_VISIBLE_SHARE, withVisibleFloor } from './scale';

describe('withVisibleFloor', () => {
  it('lifts a value that would otherwise round to no bar', () => {
    const [largest, tiny] = withVisibleFloor([266_900, 3]);

    expect(largest).toBe(266_900);
    expect(tiny).toBe(266_900 * MIN_VISIBLE_SHARE);
    // Visible, rather than indistinguishable from having none.
    expect((tiny ?? 0) / (largest ?? 1)).toBeGreaterThan(0.01);
  });

  it('leaves zero alone — nothing is not a small something', () => {
    expect(withVisibleFloor([500, 0])).toEqual([500, 0]);
  });

  it('changes nothing when every value is already big enough', () => {
    expect(withVisibleFloor([100, 90, 80])).toEqual([100, 90, 80]);
  });

  it('copes with an empty series', () => {
    expect(withVisibleFloor([])).toEqual([]);
  });
});
