// Storage can be missing, full or blocked (private windows, quotas). Callers
// get "nothing stored" / "not saved" instead of an exception to handle.

export const readJson = (storage: Storage, key: string): unknown => {
  try {
    const raw = storage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
};

export const writeJson = (
  storage: Storage,
  key: string,
  value: unknown,
): boolean => {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};
