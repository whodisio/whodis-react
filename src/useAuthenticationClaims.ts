import { useContext } from 'react';

import { AuthenticationContext } from './AuthenticationContext';

/**
 * react hook which exposes the unauthenticated claims of the users authenticatable token
 *
 * for imperative usage - see the `getAuthentication` method
 */
export const useAuthenticationClaims = () => {
  // grab the token from the context
  const context = useContext(AuthenticationContext);
  if (!context)
    throw new Error(
      'AuthenticationContext was not initialized. Was the AuthenticationProvider used?',
    ); // fail fast, to help in dev - since this is an issue that would only arise in dev
  const { claims } = context;

  // expose the public contract
  return claims;
};
