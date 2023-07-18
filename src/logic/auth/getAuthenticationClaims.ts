import { WhodisAuthTokenClaims } from 'whodis-client';

import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { getAuthableTokenClaims } from '../claims/getAuthableTokenClaims';

/**
 * method which returns the authentication claims of a users token, if the user has an authenticatable token
 *
 * for declarative usage - see the `useAuthenticationClaims` hook
 */
export const getAuthenticationClaims = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}): Promise<WhodisAuthTokenClaims | null> => {
  // grab the token
  const claims = await getAuthableTokenClaims({ storage });

  // return the authentication data
  return claims;
};
