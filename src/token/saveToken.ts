import { redactSignature } from 'simple-jwt-auth';

import {
  EnvironmentRuntimePlatform,
  runtime,
} from '../env/getRuntimeEnvironment';
import {
  authableTokenUpdatedEventStream,
  AuthableTokenUpdatedEventType,
} from './authableTokenUpdatedEventStream';
import { setTokenToStorage } from './storage/setTokenToStorage';

export const saveToken = async ({ token }: { token: string }) => {
  // if we're on the server side, skip this request - because we can't properly persist tokens unless we're on client side (since they need to be set in auth cookie _and_ local storage)
  if (runtime.platform === EnvironmentRuntimePlatform.SERVER) return; // do nothing

  // if on browser, check that the token's signature is redacted; throw error if not, since it would be an XSS vulnerability
  if (
    runtime.platform === EnvironmentRuntimePlatform.BROWSER &&
    token !== redactSignature({ token })
  ) {
    throw new Error(
      'non-signature-redacted token was attempted to be saved by client-side javascript. should not be occurring',
    ); // fail fast if this occurs; this should be handled by whodis-client already and never should occur
  }

  // set it to storage
  await setTokenToStorage({ token });

  // and emit that we saved a token
  authableTokenUpdatedEventStream.publish({
    event: { type: AuthableTokenUpdatedEventType.SAVED },
  });
};
