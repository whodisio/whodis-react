export enum EnvironmentRuntimePlatform {
  /**
   * an application running in a browser
   */
  BROWSER = 'BROWSER',

  /**
   * an application running in react-native
   */
  NATIVE = 'NATIVE',

  /**
   * an application running on a server
   */
  SERVER = 'SERVER',
}

export const getEnvironmentRuntime = (): {
  platform: EnvironmentRuntimePlatform;
} => {
  // if "document" is defined, then we're on the browser
  if (typeof document !== 'undefined')
    return { platform: EnvironmentRuntimePlatform.BROWSER };

  // if "navigator.product" is react native, then we're on native
  if (navigator?.product === 'ReactNative')
    return { platform: EnvironmentRuntimePlatform.NATIVE };

  // otherwise, we must be on node
  return { platform: EnvironmentRuntimePlatform.SERVER };
};

export const runtime = getEnvironmentRuntime();

console.log({ runtime });
