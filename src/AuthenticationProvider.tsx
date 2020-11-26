import React, { ReactChild, ReactChildren } from 'react';

import { AuthenticationContext } from './AuthenticationContext';
import { useAuthableTokenClaims } from './token/useAuthableTokenClaims';

export const AuthenticationProvider = ({
  children,
  directoryUuid,
  clientUuid,
}: {
  children: ReactChild | ReactChildren;
  directoryUuid: string;
  clientUuid: string;
}) => {
  const { claims } = useAuthableTokenClaims();
  return <AuthenticationContext.Provider value={{ claims, directoryUuid, clientUuid }}>{children}</AuthenticationContext.Provider>;
};
