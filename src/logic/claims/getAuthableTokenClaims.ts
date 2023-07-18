import { getUnauthedClaims } from 'simple-jwt-auth';
import { WhodisAuthTokenClaims } from 'whodis-client';

import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { getAuthableToken } from '../token/getAuthableToken';

/**
 * internal use only
 *
 * use case: you need to know the claims of the token
 */
export const getAuthableTokenClaims = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}) => {
  // grab the token
  const token = await getAuthableToken({ storage });
  if (!token) return null;

  // if we reached here, then we're optimistic that the token is either not expired or will be refreshed; return the data
  const claims = getUnauthedClaims<WhodisAuthTokenClaims>({ token });
  return claims;
};
