// Raw colour ramps (25 → 900, 500 is the base). Components never read these:
// they go through the semantic roles in `semantic.ts`, which is what lets the
// same component render correctly in both colour schemes.

export const neutral = {
  0: '#ffffff',
  25: '#f6f8fb',
  50: '#f0f3f8',
  100: '#e5eaf2',
  200: '#d3dae5',
  300: '#b3bdcc',
  400: '#8a96aa',
  500: '#5f6b80',
  600: '#4d586c',
  700: '#364052',
  800: '#222b3b',
  900: '#121926',
  925: '#0c121d',
  950: '#070b13',
  1000: '#04070c',
} as const;

/** Brand accent — the "radar blue" that marks everything interactive. */
export const radar = {
  25: '#f4f8ff',
  50: '#e9f1ff',
  100: '#d4e3ff',
  200: '#aac8ff',
  300: '#80acff',
  400: '#5b91ff',
  500: '#3d78f2',
  600: '#2d62d8',
  700: '#244fb0',
  800: '#1f4189',
  900: '#1a3469',
} as const;

/** Secondary accent used by the night-sky glows and highlights. */
export const nebula = {
  300: '#b7a6ff',
  400: '#9c86ff',
  500: '#8067f0',
  600: '#6a4fd8',
} as const;

/** The cyan of the radar sweep. */
export const signal = {
  300: '#86e3ff',
  400: '#4fd0f7',
  500: '#20b6e2',
} as const;

export const green = {
  400: '#46d18f',
  500: '#23a26a',
  600: '#19784e',
} as const;

export const amber = {
  400: '#f4bb45',
  500: '#d99a12',
  600: '#8a5d00',
} as const;

export const red = {
  400: '#ff7a78',
  500: '#e5484d',
  600: '#c7353b',
} as const;
