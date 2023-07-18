import React, { ReactNode } from 'react';

import { AuthenticationContext } from './AuthenticationContext';
import { useAuthableTokenClaims } from './token/useAuthableTokenClaims';

/**
 * a provider component which adds and manages the whodis AuthenticationContext
 */
export const AuthenticationProvider = ({
  children,
  directoryUuid,
  clientUuid,
}: {
  children: ReactNode;

  /**
   * the whodis directory uuid under which to make requests to the whodis api
   */
  directoryUuid: string;

  /**
   * the whodis client uuid via which to make requests to the whodis api
   */
  clientUuid: string;
}) => {
  // grab the claims
  const { claims } = useAuthableTokenClaims();

  // pass them to the provider
  return (
    <AuthenticationContext.Provider
      value={{ claims, directoryUuid, clientUuid }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
