import { getAuthableTokenClaims } from './token/getAuthableTokenClaims';

/**
 * method which exposes boolean of whether the user is has an authenticatable token or not
 *
 * for declarative usage - see the `useAuthenticationClaims` hook
 */
export const getAuthenticationClaims = async () => {
  // grab the token
  const claims = await getAuthableTokenClaims();

  // return the authentication data
  return claims;
};
