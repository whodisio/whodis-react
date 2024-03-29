import * as whodis from 'whodis-client';

import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';

export const refreshToken = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}) => {
  // grab the token
  const token = await storage.get();
  if (!token) throw new Error('no token defined, can not refresh');

  // check that it _needs_ to be refreshed
  if (!whodis.isTokenExpired({ token }))
    throw new Error('token is not expired, will not refresh');

  // check that it _can_ be refreshed
  if (!whodis.isTokenRefreshable({ token }))
    throw new Error('token is not refreshable, can not refresh');

  // otherwise, refresh it
  const { token: refreshedToken } = await whodis.refreshToken({ token }); // refresh it
  if (whodis.isTokenExpired({ token: refreshedToken }))
    throw new Error(
      'refreshed token is still expired! this is a whodis problem',
    ); // sanity check the token was refreshed successfully; fail fast if not
  await storage.set(refreshedToken); // save the refreshed token for future calls
  return refreshedToken;
};
