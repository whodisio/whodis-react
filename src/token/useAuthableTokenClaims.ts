import { useState, useEffect } from 'react';

import { authableTokenUpdatedEventStream } from './authableTokenUpdatedEventStream';
import { getAuthableTokenClaims } from './getAuthableTokenClaims';

export const useAuthableTokenClaims = () => {
  // initialize the state
  const [claims, setClaims] = useState(getAuthableTokenClaims());

  // define a consumer that updates the state based on the authableTokenUpdatedEventStream
  const consumer = () => setClaims(getAuthableTokenClaims());

  // subscribe to that event stream (in useEffect, so that its only done once)
  useEffect(() => {
    authableTokenUpdatedEventStream.subscribe({ consumer }); // subscribe on mount
    return () => authableTokenUpdatedEventStream.unsubscribe({ consumer }); // unsubscribe on unmount
  }, []); // [] -> never rerun this - only run on mount

  // and expose the claims
  return { claims };
};
