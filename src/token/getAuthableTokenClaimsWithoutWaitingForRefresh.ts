import { getUnauthedClaims } from 'simple-jwt-auth';
import { WhodisAuthTokenClaims } from 'whodis-client';

import { getTokenFromStorage } from './storage/getTokenFromStorage';

/**
 * internal use only
 *
 * use case: you need to know the claims of the token, but need it synchronously so you can't wait for refresh
 */
export const getAuthableTokenClaimsWithoutWaitingForRefresh = () => {
  // grab the token
  const token = getTokenFromStorage();
  if (!token) return null;

  // if we reached here, then we're optimistic that the token is either not expired or will be refreshed; return the data
  const claims = getUnauthedClaims<WhodisAuthTokenClaims>({ token });
  return claims;
};
