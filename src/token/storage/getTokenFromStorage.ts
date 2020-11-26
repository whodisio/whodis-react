import { getCookie } from 'simple-cookie-client';
import { isServerSideRendering } from '../../env/isServerSideRendering';
import { TOKEN_STORAGE_KEY } from './key';

/**
 * internal use only
 *
 * gets the token from storage
 * - on client side rendering, gets the token from local storage
 * - on server side rendering, gets the token from exposed cookies
 *
 * WARNING: on server side this _does_ expose the raw JWT - and care must be taken not to log it
 */
export const getTokenFromStorage = (): string | null => {
  // try to get token from local storage
  if (!isServerSideRendering()) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === 'null') return null;
    if (token) return token;
  }

  // try to get the token from a cookie (e.g., in SSR context, we'd get it exposed from a cookie) {
  const tokenCookie = getCookie({ name: 'authorization' });
  if (tokenCookie) return tokenCookie.value;

  // otherwise, we couldn't get the cookie
  return null;
};
