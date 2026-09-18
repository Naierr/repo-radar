const DEFAULT_GITHUB_API_URL = 'https://api.github.com';

/** Production talks to GitHub directly; development goes through the Vite proxy. */
export const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL ?? DEFAULT_GITHUB_API_URL;
