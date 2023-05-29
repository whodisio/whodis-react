import { getCookie } from 'simple-cookie-client';
import { TOKEN_STORAGE_KEY } from './key';
import { isTokenSynchronized } from '../synchronization/isTokenSynchronized';
import { isServerSideRendering } from '../../env/isServerSideRendering';
import { forgetToken } from '../forgetToken';

/**
 * internal use only
 *
 * gets the token from storage
 * - on client side rendering, gets the anti-csrf-token from local storage and checks it is still in sync w/ the token in the cookie
 * - on server side rendering, gets the token from exposed cookies
 *
 * WARNING:
 * - on server side this _does_ expose the raw JWT - and care must be taken not to log it
 */
export const getTokenFromStorage = (): string | null => {
  // handle getting the token on client-side
  if (!isServerSideRendering()) {
    // try and find the anti-csrf-token from local storage
    const antiCsrfToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!antiCsrfToken || antiCsrfToken === 'null') return null; // if no anti-csrf-token, then no token in this env

    // if one exists, check that it is still in sync with the serverside
    const synchronized = isTokenSynchronized({ token: antiCsrfToken });
    if (!synchronized) {
      forgetToken(); // forget the token, since it can not be used for authentication due to not being in sync
      return null; // and report to the caller that there is no token available
    }

    // if we reached here, that means we have a synchronized anti-csrf-token that we can use for consistent authenticated requests
    return antiCsrfToken;
  }

  // handle getting the token on server-side
  if (isServerSideRendering()) {
    // try and find the token from cookie storage
    const tokenCookie = getCookie({ name: 'authorization' });
    if (!tokenCookie) return null; // if no cookie, then no token in this env

    // if one exists, check that it is still in sync w/ the clientside
    const token = tokenCookie.value;
    const synchronized = isTokenSynchronized({ token });
    if (!synchronized) return null; // and report to the caller that there is no token available

    // if we reached here, that means we have a synchronized token that we can use for consistent authenticated request
    return token;
  }

  // otherwise, unsupported environment
  throw new Error('unexpected environment to get token from storage');
};
