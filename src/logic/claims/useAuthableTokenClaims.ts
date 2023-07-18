import { useState, useEffect } from 'react';
import { WhodisAuthTokenClaims } from 'whodis-client';

import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';
import { getAuthableTokenClaims } from './getAuthableTokenClaims';

export const useAuthableTokenClaims = ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}): {
  /**
   * the authable claims stored on the device
   *
   * note
   * - when `undefined`, we do not know yet whether or not the user is signed in (haven't checked device storage yet)
   * - when `null`, we know for sure that the user is not signed in
   * - these are not authenticated claims
   *    - we don't check for authenticity here because you cant trust the user's device anyway
   *    - we only check that they're authenticatable, such that unless the user is purposely manipulating the token, it is guaranteed to be authentic
   */
  claims: WhodisAuthTokenClaims | null | undefined;
} => {
  // initialize the state
  const [claims, setClaims] = useState<
    WhodisAuthTokenClaims | null | undefined
  >(undefined); // undefined until we check storage

  // define a consumer that updates the state based on the authableTokenUpdatedEventStream
  const consumer = async () => {
    setClaims(await getAuthableTokenClaims({ storage }));
  };

  // subscribe to that event stream (in useEffect, so that its only done once)
  useEffect(() => {
    // kick off checking storage for claims
    void consumer();

    // subscribe the auth token updated events, so we have the latest state of the token at all time
    storage.on.set.subscribe({ consumer }); // subscribe on mount

    // and ensure that we unsubscribe on unmount to cleanup after ourselves
    return () => {
      storage.on.set.unsubscribe({ consumer }); // unsubscribe on unmount
    };
  }, []); // [] -> never rerun this - only run on mount

  // and expose the claims
  return { claims };
};
