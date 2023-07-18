import { exposeCookieFromReq } from 'simple-cookie-client';

/**
 * loads and exposes the cookies required for authentication from the server-side request
 * - exposes both the `authorization` and `synchronization` tokens required for secure and consistent authentication in the web environment
 * - enables isomorphically using whodis-react functions across both clientside and serverside environments
 */
export const loadAuthenticationFromSSRReq = ({
  req,
}: {
  req: { headers: { cookie?: string } };
}) => {
  exposeCookieFromReq({ name: 'authorization', req });
  exposeCookieFromReq({ name: 'synchronization', req });
};
