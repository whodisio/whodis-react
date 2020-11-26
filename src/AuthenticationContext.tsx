import { createContext } from 'react';
import { WhodisAuthTokenClaims } from 'whodis-client';

interface AuthenticationContextState {
  claims: WhodisAuthTokenClaims | null;
  directoryUuid: string;
  clientUuid: string;
}

export const AuthenticationContext = createContext<AuthenticationContextState | null>(null);
