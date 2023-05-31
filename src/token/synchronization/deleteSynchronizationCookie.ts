import { deleteCookie, getCookie } from 'simple-cookie-client';

/**
 * delete the synchronization cookie
 *
 * usecases
 * - browser detects that the anti-csrf token is not in sync w/ auth token -> delete the sync cookie to inform server that user is logged out
 *
 * note
 * - decodes the synchronization token to extract the domain and path to correctly delete it
 */
export const deleteSynchronizationCookie = () => {
  // lookup it's current value
  const synchronizationCookie = getCookie({ name: 'synchronization' });
  if (!synchronizationCookie) return; // if it doesn't exist, nothing to delete

  // delete it
  const domain = synchronizationCookie.value.split(':')[1] as string;
  deleteCookie({ name: 'synchronization', domain, path: '/' });
};
