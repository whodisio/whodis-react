import { isTokenExpired, isTokenRefreshable } from 'whodis-client';

import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { refreshToken } from './refreshToken';

/**
 * internal use only
 *
 * usecase:
 * - you need the token for making authenticated requests
 *
 * action:
 * - grabs the token from storage and refreshes it before responding if needed
 *
 * note:
 * - if you need a _sync_ response, see if all you really need is `getTokenData`.
 */
export const getAuthableToken = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}): Promise<string | null> => {
  // grab the token from storage
  const token = await storage.get();
  if (!token) return null;

  // extract data about the token
  const expired = isTokenExpired({ token });
  const refreshable = isTokenRefreshable({ token });

  // if token is not expired, return it
  if (!expired) return token;

  // if not refreshable, same thing as not having a token
  if (!refreshable) return null;

  // if expired but refreshable, refresh it
  try {
    const refreshedToken = await refreshToken({ storage }); // refresh it
    await storage.set(refreshedToken); // save the refreshed token for future calls
    return refreshedToken; // and give the refresh token for usage
  } catch (error) {
    console.warn('could not refresh token', { error });
    return null; // if we had an error refreshing the token, return null
  }
};
