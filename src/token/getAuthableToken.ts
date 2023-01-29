import { isTokenExpired, isTokenRefreshable } from 'whodis-client';

import { saveToken } from './saveToken';
import { getTokenFromStorage } from './storage/getTokenFromStorage';
import { refreshToken } from './refreshToken';

/**
 * internal use only
 *
 * use case: you need the token for making authenticated requests
 *
 * action: grabs the token from storage and refreshes it before responding if needed
 *
 * note: if you need a _sync_ response, see if all you really need is `getTokenData`.
 */
export const getAuthableToken = async (): Promise<string | null> => {
  // grab the token from storage
  const token = getTokenFromStorage();
  if (!token) return null;

  // extract data about the token
  const expired = isTokenExpired({ token });
  const refreshable = isTokenRefreshable({ token });
  console.log({ expired, refreshToken });

  // if token is expired and not refreshable, same thing as not having a token
  if (expired && !refreshable) return null;

  // if the token is expired and refreshable, refresh it
  if (expired && refreshable) {
    try {
      const refreshedToken = await refreshToken(); // refresh it
      saveToken({ token: refreshedToken }); // save the refreshed token for future calls
      return refreshedToken; // and give the refresh token for usage
    } catch (error) {
      console.warn('could not refresh token', { error });
      return null; // if we had an error refreshing the token, return null
    }
  }

  // otherwise, the token is not expired, so return it
  return token;
};
