import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { getAuthableToken } from '../token/getAuthableToken';

/**
 * used to define the value of the authorization header, based on whether a user is logged in or not
 * - if user is logged in, returns the bearer token header value
 * - if user is not logged in, returns empty-string
 * both of these values can be set as the `authorization` header - which the server will read to authenticate the user
 *
 * note: the type of authorization token that is sent will depend on the environment:
 *  - when client-side rendering, you'll find an anti-csrf token here
 *  - when server-side-rendering, you'll find the raw auth token itself here
 *
 * IMPORTANT: please make sure that this value is never logged out - as it could contain the raw auth token itself.
 */
export const getAuthorizationHeader = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}) => {
  // grab the token from storage
  const token = await getAuthableToken({ storage });
  if (!token) return ''; // if its not set, then no auth available

  // set the authorization header w/ the bearer token scheme
  return `Bearer ${token}`;
};
