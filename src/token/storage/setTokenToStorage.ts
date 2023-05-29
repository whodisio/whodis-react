import { TOKEN_STORAGE_KEY } from './key';
import { isServerSideRendering } from '../../env/isServerSideRendering';
import { deleteSynchronizationCookie } from '../synchronization/deleteSynchronizationCookie';

export const setTokenToStorage = ({ token }: { token: string | null }) => {
  // ensure that we only try to set tokens on client side; tokens can only be properly set on client side - where the cookie is properly set for the user and the anti-csrf token is set in localstorage
  if (isServerSideRendering()) throw new Error('attempted to set token on server side'); // fail fast, as this should never occur and is a problem with our code if it does

  // set the value of the token into local storage
  localStorage.setItem(TOKEN_STORAGE_KEY, token ?? 'null');

  // and, if the token was being removed, wipe out the synchronization cookie too, so the server-side will be aware of this too
  if (token === null) deleteSynchronizationCookie();
};
