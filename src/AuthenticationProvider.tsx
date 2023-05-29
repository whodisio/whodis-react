import React, { ReactChild, ReactChildren, useEffect } from 'react';

import { AuthenticationContext } from './AuthenticationContext';
import { AuthableTokenUpdatedEvent, authableTokenUpdatedEventStream } from './token/authableTokenUpdatedEventStream';
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
    if (onTokenForgotten) onTokenForgotten();
  };

  // subscribe to token updated events event stream (in useEffect, so that its only done once)
  useEffect(() => {
    // subscribe the auth token updated events, so we have the latest state of the token at all time
    authableTokenUpdatedEventStream.subscribe({ consumer }); // subscribe on mount

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
  // grab the claims
  const { claims } = useAuthableTokenClaims();

  // use token events
  useTokenLifecycleEvents({ onTokenForgotten: listen?.onTokenForgotten });

  // pass them to the provider
  return <AuthenticationContext.Provider value={{ claims, directoryUuid, clientUuid }}>{children}</AuthenticationContext.Provider>;
};
