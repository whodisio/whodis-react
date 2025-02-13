import { getPackageSafely } from './getPackageSafely';
import { hasPackageAccessible } from './hasPackageAvailable';

/**
 * .what = a universal utility for subscribing to screen focus events
 * .why =
 *   - uses Window api in runtime=browser
 *   - uses AppState api in runtime=native
 */
export const getUniOnScreenFocusEventStream = (): {
  subscribe: (input: { consumer: () => void | Promise<void> }) => void;
  unsubscribe: (input: { consumer: () => void | Promise<void> }) => void;
} => {
  const isRuntimeNative = hasPackageAccessible('react-native');
  console.log({ isRuntimeNative });

  // if native, use appstate api
  if (isRuntimeNative) {
    const { AppState } = getPackageSafely<{
      AppState: {
        addEventListener: (...args: [string, () => void]) => {
          remove: () => void;
        };
        removeEventListener: (...args: [string, () => void]) => void;
      };
    }>('react-native');
    let subscription: undefined | { remove: () => void } = undefined;
    return {
      subscribe: (input: { consumer: () => void | Promise<void> }) => {
        subscription = AppState.addEventListener('focus', input.consumer);
      },
      unsubscribe: () => subscription?.remove(),
    };
  }

  // else, use window api
  return {
    subscribe: (input: { consumer: () => void | Promise<void> }) =>
      globalThis.addEventListener?.('focus', input.consumer),
    unsubscribe: (input: { consumer: () => void | Promise<void> }) =>
      globalThis.removeEventListener?.('focus', input.consumer),
  };
};
