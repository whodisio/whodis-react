import { sha256 as Sha256 } from 'cross-sha256';
import { getCookie } from 'simple-cookie-client';
import { createCache } from 'simple-in-memory-cache';
import { getUnauthedClaims } from 'simple-jwt-auth';
import { WhodisAuthTokenClaims } from 'whodis-client';
import { withSimpleCaching } from 'with-simple-caching';

const toSha256 = withSimpleCaching(
  (input: string) => new Sha256().update(input).digest('hex'),
  {
    cache: createCache(), // cache the result in memory to prevent redundant computation
  },
);

/**
 * determines whether the token is synchronized across both environment's storages, to ensure consistent responses
 *
 * why?
 * - browser.localstorage.authorization and browser.cookie.authorization can get out of sync
 *   - why?
 *     - browser.localstorage is scoped to each full domain (www.ahbode.com != subdomain.ahbode.com) and per mobile in-app browser launch
 *     - browser.cookie is scoped simply per browser
 * - when the two are out of sync, sad things happen
 *   - the serverside, which reads only from browser.cookie.authorization, thinks the user is logged in
 *   - the clientside, which only has the anti-csrf-token in localstorage, can not make authenticated requests -> is effectively logged out
 *   - the serverside will not redirect the clientside to login before seeing this no longer authorized data
 *   - the clientside will subsequently break as it tries to make requests it looks like its authorized to do and get back an unauthorized response
 *   - at best, the client has a bad experience
 *   - at worst, the client saw data they were no longer authorized to see
 * - to ensure this does not happen, we can use a synchronization token that both the server and the client are allowed to see and modify
 *   - the client can whether it's anti-csrf-token in localstorage in sync with the token that the server has, by comparing the value to the token it has
 *   - the server can whether the client has been logged out, by checking if the value is now null
 */
export const isTokenSynchronized = ({ token }: { token: string }): boolean => {
  // lookup the synchronization cookie
  const synchronizationCookie = getCookie({ name: 'synchronization' });
  if (!synchronizationCookie) return false; // if no synchronization cookie, not synchronized (e.g., maybe user logged out)

  // check that the tokens are in sync
  const tokenUuidHashExpected = synchronizationCookie.value.split(':')[0];
  const tokenUuidHashFound = toSha256(
    getUnauthedClaims<WhodisAuthTokenClaims>({ token }).jti,
  );
  return tokenUuidHashExpected === tokenUuidHashFound;
};
