const MULBERRY_INCREMENT = 0x6d2b79f5;
const UINT32_RANGE = 2 ** 32;
const VIEWPORT_PERCENT = 100;

/** Seeded PRNG (mulberry32): the same sky on every render, in every test. */
export const createRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + MULBERRY_INCREMENT) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };
};

/**
 * One box-shadow per star, placed in viewport units so the sky fills any
 * screen size. Shadows without a colour take `currentColor`, which is how
 * the stars follow the colour scheme.
 */
export const buildStarShadows = (count: number, seed: number): string => {
  const random = createRandom(seed);
  return Array.from({ length: count }, () => {
    const x = (random() * VIEWPORT_PERCENT).toFixed(2);
    const y = (random() * VIEWPORT_PERCENT).toFixed(2);
    return `${x}vw ${y}vh`;
  }).join(', ');
};
