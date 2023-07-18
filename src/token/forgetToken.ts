import {
  authableTokenUpdatedEventStream,
  AuthableTokenUpdatedEventType,
} from './authableTokenUpdatedEventStream';
import { setTokenToStorage } from './storage/setTokenToStorage';

export const forgetToken = () => {
  setTokenToStorage({ token: null });
  authableTokenUpdatedEventStream.publish({
    event: { type: AuthableTokenUpdatedEventType.FORGOT },
  }); // report that we forgot the token
};
