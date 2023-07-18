import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { forgetToken } from '../token/forgetToken';

/**
 * enables forgetting the current authentication token, logging the user out
 *
 * usecases
 * - logout
 */
export const forgetAuthenticationToken = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}) => forgetToken({ storage });
