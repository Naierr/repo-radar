export const TRACKED_REPOS_STORAGE_KEY = 'repo-radar:tracked-repos';
export const TRACKED_REPOS_SCHEMA_VERSION = 1;

/** Stats older than this are refreshed when the dashboard opens. */
export const STALE_AFTER_MS = 10 * 60 * 1000;
/** Bursts of changes (e.g. refresh all) are written to storage once. */
export const PERSIST_DEBOUNCE_MS = 300;
