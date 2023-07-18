import { EventStream } from 'event-stream-pubsub';

export interface WhodisAuthTokenStorage {
  get: () => Promise<string | null>;
  set: (token: string | null) => Promise<void>;
  on: {
    set: Omit<EventStream<undefined>, 'publish'>;
    get: Omit<EventStream<undefined>, 'publish'>;
  };
}
