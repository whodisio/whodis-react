import { createContext } from 'react';
import { WhodisAuthTokenClaims } from 'whodis-client';

interface AuthenticationContextState {
  claims: WhodisAuthTokenClaims | null | undefined;
  directoryUuid: string;
  clientUuid: string;
  override?: {
    hostname?: string;
  };
}

export const AuthenticationContext =
  createContext<AuthenticationContextState | null>(null);
