import { forgetToken } from './token/forgetToken';

/**
 * enables forgetting the current authentication token, logging the user out
 *
 * usecases
 * - logout
 */
export const forgetAuthenticationToken = async () => forgetToken();
