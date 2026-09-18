import { describe, expect, it } from 'vitest';

import { buildStarShadows, createRandom } from './stars';

describe('createRandom', () => {
  it('replays the same sequence for the same seed', () => {
    const first = createRandom(42);
    const second = createRandom(42);
    const draws = Array.from({ length: 5 }, () => [first(), second()]);

    draws.forEach(([a, b]) => {
      expect(a).toBe(b);
    });
  });

  it('stays within [0, 1)', () => {
    const random = createRandom(7);
    const values = Array.from({ length: 500 }, random);

    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThan(1);
  });
});

describe('buildStarShadows', () => {
  it('places every star inside the viewport', () => {
    const stars = buildStarShadows(50, 3).split(', ');

    expect(stars).toHaveLength(50);
    stars.forEach((star) => {
      const [x, y] = star.split(' ').map((part) => Number.parseFloat(part));
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(100);
    });
  });

  it('draws a different sky for a different seed', () => {
    expect(buildStarShadows(10, 1)).not.toBe(buildStarShadows(10, 2));
  });
});
