import { useContext } from 'react';

import { AuthenticationContext } from './AuthenticationContext';

/**
 * internal use only
 *
 * exposes the directory and client uuid from context
 */
export const useAuthenticationConfig = () => {
  // grab the data from the context
  const context = useContext(AuthenticationContext);
  if (!context)
    throw new Error(
      'AuthenticationContext was not initialized. Was the AuthenticationProvider used?',
    ); // fail fast, to help in dev - since this is an issue that would only arise in dev
  const { directoryUuid, clientUuid } = context;

  // expose it
  return { directoryUuid, clientUuid };
};
