import React, { ReactChild, ReactChildren } from 'react';

import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { useAuthableTokenClaims } from '../claims/useAuthableTokenClaims';
import { AuthenticationContext } from './AuthenticationContext';

/**
 * a provider component which adds and manages the whodis AuthenticationContext
 */
export const AuthenticationProvider = ({
  children,
  storage,
  directoryUuid,
  clientUuid,
  override,
}: {
  children: ReactChild | ReactChildren;

  /**
   * the storage in which to store the whodis auth token
   *
   * note
   * - this is what enables this library to be used for both `react-browser` and `react-native`
   */
  storage: WhodisAuthTokenStorage;

  /**
   * the whodis directory uuid under which to make requests to the whodis api
   */
  directoryUuid: string;

  /**
   * the whodis client uuid via which to make requests to the whodis api
   */
  clientUuid: string;

  /**
   * overrides to apply to requests for advanced usecases
   */
  override?: {
    hostname?: string;
  };
}) => {
  // grab the claims
  const { claims } = useAuthableTokenClaims({ storage });

  // pass them to the provider
  return (
    <AuthenticationContext.Provider
      value={{ claims, directoryUuid, clientUuid, override }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
