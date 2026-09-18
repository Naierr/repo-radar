import { useEffect, useRef } from 'react';

const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/**
 * Runs `onPress` when `key` is pressed anywhere on the page — unless the user
 * is typing in a field or holding a modifier. Mirrors GitHub's `/` to search.
 */
export const useShortcutKey = (
  key: string | undefined,
  onPress: () => void,
): void => {
  const onPressRef = useRef(onPress);

  useEffect(() => {
    onPressRef.current = onPress;
  });

  useEffect(() => {
    if (!key) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
      if (event.key !== key || hasModifier || isTypingTarget(event.target)) {
        return;
      }
      event.preventDefault();
      onPressRef.current();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key]);
};
