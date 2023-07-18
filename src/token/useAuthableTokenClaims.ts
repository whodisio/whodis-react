import { useState, useEffect } from 'react';
import { WhodisAuthTokenClaims } from 'whodis-client';

import { authableTokenUpdatedEventStream } from './authableTokenUpdatedEventStream';
import { getAuthableTokenClaims } from './getAuthableTokenClaims';

export const useAuthableTokenClaims = (): {
  /**
   * the authed claims on the device
   *
   * note
   * - undefined = we have not checked yet
   * - null = no authed claims
   */
  claims: WhodisAuthTokenClaims | null | undefined;
} => {
  // track the authed claims
  const [claims, setClaims] = useState<
    WhodisAuthTokenClaims | null | undefined
  >(undefined); // undefined until we check storage

  // define a consumer that updates the state based on the authableTokenUpdatedEventStream
  const consumer = async () => {
    const token = await getAuthableTokenClaims();
    setClaims(token);
  };

  // subscribe to that event stream (in useEffect, so that its only done once)
  useEffect(() => {
    // kick off grabbing initial state of claims
    void consumer();

    // subscribe the auth token updated events, so we have the latest state of the token at all time
    authableTokenUpdatedEventStream.subscribe({ consumer }); // subscribe on mount

    // and ensure that we unsubscribe on unmount to cleanup after ourselves
    return () => authableTokenUpdatedEventStream.unsubscribe({ consumer }); // unsubscribe on unmount
  }, []); // [] -> never rerun this - only run on mount

  // and expose the claims
  return { claims };
};
