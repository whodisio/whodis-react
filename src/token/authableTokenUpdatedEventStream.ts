import { EventStreamPubSub } from 'event-stream-pubsub';

// define the event data-type
export enum AuthableTokenUpdatedEventType {
  SAVED = 'SAVED',
  FORGOT = 'FORGOT',
}
export interface AuthableTokenUpdatedEvent {
  type: AuthableTokenUpdatedEventType;
}

// instantiate this particular stream
export const authableTokenUpdatedEventStream =
  new EventStreamPubSub<AuthableTokenUpdatedEvent>();
