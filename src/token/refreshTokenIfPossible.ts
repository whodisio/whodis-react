import { getAuthableToken } from './getAuthableToken';

/**
 * refreshes the token if possible
 */
export const refreshTokenIfPossible = getAuthableToken; // note; we actually just call the `getAuthableToken` function since it refreshes the token automatically if needed
