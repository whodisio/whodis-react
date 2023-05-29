import React, { ReactChild, ReactChildren, useEffect, useState } from 'react';

import { AuthenticationContext } from './AuthenticationContext';
import { AuthableTokenUpdatedEvent, authableTokenUpdatedEventStream, AuthableTokenUpdatedEventType } from './token/authableTokenUpdatedEventStream';
import { useAuthableTokenClaims } from './token/useAuthableTokenClaims';

/**
 * a hook to enable listening to token lifecycle events easily
 *
 * note
 * - we do not export this, as we do not want anyone to use this hook externally yet (may eventually deprecate, too)
 */
const useTokenLifecycleEvents = ({ onTokenForgotten }: { onTokenForgotten?: () => void }) => {
  // define what to do when we consume a token updated event
  const consumer = ({ event }: { event: AuthableTokenUpdatedEvent }): void => {
    if (event.type === AuthableTokenUpdatedEventType.FORGOT && onTokenForgotten) onTokenForgotten();
  };

  // track whether we've already subscribed once (do so in the default of a hook, since apparently those run before useEffects)
  useState(() => {
    // subscribe the auth token updated events, so we have the latest state of the token at all time
    authableTokenUpdatedEventStream.subscribe({ consumer }); // subscribe on mount; would do inside useEffect, but it runs after the other setState default hook which wipes out the token, and we need to listen to that occurance, so we need to run first; this is an unfortunate react quirk
  });

  // subscribe to token updated events event stream (in useEffect, so that its only done once)
  useEffect(() => {
    // subscribe the auth token updated events, so we have the latest state of the token at all time
    // NOTE: we actually subscribed in the useState default above, since apparently all useState defaults run before useEffects; since we need to consume the event produced by `useAuthableTokenClaims.tsx::setState(getAuthableToken...)`, we must subscribe in useState too

    // and ensure that we unsubscribe on unmount to cleanup after ourselves
    return () => authableTokenUpdatedEventStream.unsubscribe({ consumer }); // unsubscribe on unmount
  }, []); // [] -> never rerun this - only run on mount
};

/**
 * a provider component which adds and manages the whodis AuthenticationContext
 */
export const AuthenticationProvider = ({
  children,
  directoryUuid,
  clientUuid,
  listen,
}: {
  children: ReactChild | ReactChildren;

  /**
   * the whodis directory uuid under which to make requests to the whodis api
   */
  directoryUuid: string;

  /**
   * the whodis client uuid via which to make requests to the whodis api
   */
  clientUuid: string;

  /**
   * token lifecycle events that can be listened to by user
   */
  listen?: {
    /**
     * triggered whenever a token is forgotten
     *
     * for example
     * - user logged out
     * - detected token expired
     * - etc
     */
    onTokenForgotten?: () => void;
  };
}) => {
  // listen to token events
  useTokenLifecycleEvents({ onTokenForgotten: listen?.onTokenForgotten });

  // grab the claims
  const { claims } = useAuthableTokenClaims();

  // pass them to the provider
  return <AuthenticationContext.Provider value={{ claims, directoryUuid, clientUuid }}>{children}</AuthenticationContext.Provider>;
};
