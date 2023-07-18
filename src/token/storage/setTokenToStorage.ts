import {
  EnvironmentRuntimePlatform,
  runtime,
} from '../../env/getRuntimeEnvironment';
import { deleteSynchronizationCookie } from '../synchronization/deleteSynchronizationCookie';
import { getNativeSecureStorage } from './getNativeSecureStorage';
import { TOKEN_STORAGE_KEY } from './key';

export const setTokenToStorage = async ({
  token,
}: {
  token: string | null;
}): Promise<void> => {
  // const runtime =
  console.log({ runtime });

  // fail fast if attempting to set token on serverside, since this should never be attempted - tokens can only be persisted on a user's device (browser or native)
  if (runtime.platform === EnvironmentRuntimePlatform.SERVER)
    throw new Error(
      'attempted to set token on server, not a user device. why?',
    );

  // set the value of the token in browser
  if (runtime.platform === EnvironmentRuntimePlatform.BROWSER) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token ?? 'null');
    if (token === null) deleteSynchronizationCookie(); // and, if the token was being removed, wipe out the synchronization cookie too, so the server-side will be aware of this too
    return;
  }

  // set the value of the token on native
  if (runtime.platform === EnvironmentRuntimePlatform.NATIVE) {
    const { setItemAsync } = await getNativeSecureStorage();
    await setItemAsync(TOKEN_STORAGE_KEY, token ?? 'null');
    return;
  }

  // otherwise, unsupported runtime platform
  throw new Error('unexpected environment to set token into storage');
};
