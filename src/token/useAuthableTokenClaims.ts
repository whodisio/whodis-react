import { useState, useEffect } from 'react';

import { authableTokenUpdatedEventStream } from './authableTokenUpdatedEventStream';
import { getAuthableTokenClaims } from './getAuthableTokenClaims';
import { getAuthableTokenClaimsWithoutWaitingForRefresh } from './getAuthableTokenClaimsWithoutWaitingForRefresh';
import { refreshTokenIfPossible } from './refreshTokenIfPossible';

export const useAuthableTokenClaims = () => {
  // initialize the state
  const [claims, setClaims] = useState(
    getAuthableTokenClaimsWithoutWaitingForRefresh(),
  );

  // define a consumer that updates the state based on the authableTokenUpdatedEventStream
  const consumer = async () => {
    const token = await getAuthableTokenClaims();
    setClaims(token);
  };

  // subscribe to that event stream (in useEffect, so that its only done once)
  useEffect(() => {
    // subscribe the auth token updated events, so we have the latest state of the token at all time
    authableTokenUpdatedEventStream.subscribe({ consumer }); // subscribe on mount

    // if there wern't any claims, then try refreshing the token if possible (that will kick off a token-updated-event which we've subscribed to, which the state will be updated by)
    if (!claims) void refreshTokenIfPossible();

    // and ensure that we unsubscribe on unmount to cleanup after ourselves
    return () => authableTokenUpdatedEventStream.unsubscribe({ consumer }); // unsubscribe on unmount
  }, []); // [] -> never rerun this - only run on mount

  // and expose the claims
  return { claims };
};
