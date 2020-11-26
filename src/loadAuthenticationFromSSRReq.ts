import { exposeCookieFromReq } from 'simple-cookie-client';

/**
 * used in server side rendering (SSR) environments to load the auth token from the server's request payload
 *
 * makes it so that you can use the same auth-related code seamlessly (i.e., isomorphically) and securely across client-side-rendering and server-side-rendering
 *
 * required because in server-side-rendering environments, the auth token will not be found in local-storage (it does not exist) and can not be found from the browsers cookie manager (since we're not in the browser)
 */
export const loadAuthenticationFromSSRReq = ({ req }: { req: { headers: { cookie?: string } } }) =>
  exposeCookieFromReq({ name: 'authorization', req });
