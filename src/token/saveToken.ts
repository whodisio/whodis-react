import { redactSignature } from 'simple-jwt-auth';

import { isServerSideRendering } from '../env/isServerSideRendering';
import { authableTokenUpdatedEventStream, AuthableTokenUpdatedEventType } from './authableTokenUpdatedEventStream';
import { setTokenToStorage } from './storage/setTokenToStorage';

export const saveToken = ({ token }: { token: string }) => {
  // if we're on the server side, skip this request - because we can't properly persist tokens unless we're on client side (since they need to be set in auth cookie)
  if (isServerSideRendering()) return; // do nothing

  // if the token is not signature redacted, throw an error - should never occur - since if this does, its an XSS vulnerability
  if (token !== redactSignature({ token }))
    throw new Error('non-signature-redacted token was attempted to be saved by client-side javascript. should not be occurring'); // fail fast if this occurs; this should be handled by whodis-client already and never should occur

  // otherwise, set it to storage
  setTokenToStorage({ token });

  // and emit that we saved a token
  authableTokenUpdatedEventStream.publish({ event: { type: AuthableTokenUpdatedEventType.SAVED } });
};
