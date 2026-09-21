import { flushSync } from 'react-dom';

type StartViewTransition = (update: () => void) => unknown;

/**
 * Runs a state change as a view transition, so rows that swap places slide
 * past each other instead of teleporting — the movement is the message.
 *
 * `flushSync` is required: the browser snapshots the page before and after the
 * callback, so React must have committed by the time it returns. Where the API
 * is missing the update simply happens, which is the behaviour without it.
 */
export const useViewTransition = (): ((update: () => void) => void) => {
  return (update) => {
    const start: unknown = Reflect.get(document, 'startViewTransition');

    if (typeof start !== 'function') {
      update();
      return;
    }

    (start as StartViewTransition).call(document, () => {
      flushSync(update);
    });
  };
};
