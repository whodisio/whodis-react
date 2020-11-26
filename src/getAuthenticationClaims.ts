import { getAuthableTokenClaims } from './token/getAuthableTokenClaims';

/**
 * method which exposes boolean of whether the user is has an authenticatable token or not
 *
 * for declarative usage - see the `useAuthenticationClaims` hook
 */
export const getAuthenticationClaims = () => {
  // grab the token
  const claims = getAuthableTokenClaims();

  // return the authentication data
  return claims;
};
