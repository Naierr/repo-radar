/**
 * The attribute MUI toggles on `<html>` for the active colour scheme.
 * The app's `index.html` sets it before first paint, so it must stay in sync.
 */
export const COLOR_SCHEME_ATTRIBUTE = 'data-color-scheme';
export const COLOR_MODE_STORAGE_KEY = 'repo-radar:color-mode';
export const COLOR_SCHEME_STORAGE_KEY = 'repo-radar:color-scheme';

export const COLOR_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ColorMode = (typeof COLOR_MODE)[keyof typeof COLOR_MODE];
export type ResolvedColorMode = Exclude<ColorMode, typeof COLOR_MODE.SYSTEM>;
