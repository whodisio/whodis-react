import {
  EnvironmentRuntimePlatform,
  runtime,
} from '../../env/getRuntimeEnvironment';

/**
 * imports expo-secure-storage
 *
 * note
 * - this function enables whodis-react to operate in environments that dont need expo-secure-storage (e.g., react-browser)
 */
export const getNativeSecureStorage = async () => {
  // confirm that this is on the native platform
  if (runtime.platform !== EnvironmentRuntimePlatform.NATIVE)
    throw new Error(
      `was asked to getNativeSecureStorage on a non-native platform: ${runtime.platform}`,
    );

  // import it
  try {
    const SecureStore = await import('expo-secure-store');
    return SecureStore;
  } catch (error) {
    throw new Error(
      'could not import the expo-secure-store module. is it installed?',
    );
  }
};
