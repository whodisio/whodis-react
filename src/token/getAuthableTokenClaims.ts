import { getUnauthedClaims } from 'simple-jwt-auth';
import { isTokenExpired, isTokenRefreshable, WhodisAuthTokenClaims } from 'whodis-client';

import { getTokenFromStorage } from './storage/getTokenFromStorage';
import { refreshToken } from './refreshToken';

/**
 * internal use only
 *
 * use case: you need to know the claims of the token
 */
export const getAuthableTokenClaims = () => {
  // grab the token
  const token = getTokenFromStorage();
  if (!token) return null;

  // extract data about the token
  const expired = isTokenExpired({ token });
  const refreshable = isTokenRefreshable({ token });

  // if its expired and not refreshable, its as good as not existing
  if (expired && !refreshable) return null;

  // if its expired and _is_ refreshable, we should kick off refreshing - but dont wait for it. just be optimistic that it works
  if (expired && refreshable) refreshToken(); // NOTE: we dont wait for the promise to resolve, we just kick it off

  // if we reached here, then we're optimistic that the token is either not expired or will be refreshed; return the data
  const claims = getUnauthedClaims<WhodisAuthTokenClaims>({ token });
  return claims;
};
