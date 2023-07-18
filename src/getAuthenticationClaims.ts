import { WhodisAuthTokenClaims } from 'whodis-client';

import { getAuthableTokenClaims } from './token/getAuthableTokenClaims';

/**
 * method which returns the authentication claims of a users token, if the user has an authenticatable token
 *
 * for declarative usage - see the `useAuthenticationClaims` hook
 */
export const getAuthenticationClaims =
  async (): Promise<WhodisAuthTokenClaims | null> => {
    // grab the token
    const claims = await getAuthableTokenClaims();

    // return the authentication data
    return claims;
  };
