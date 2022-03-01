import { useCallback, useState } from 'react';
import { answerAuthChallenge, askAuthChallenge, ChallengeGoal, ChallengeType, ContactMethodType } from 'whodis-client';

import { saveToken } from './token/saveToken';
import { useAuthenticationConfig } from './useAuthenticationConfig';

// and re-export these two types, since they're used as inputs to a function we expose
export { ChallengeGoal, ContactMethodType } from 'whodis-client';

/**
 * hook which exposes using confirmation code challenge to authenticate
 * - supports login and signup
 * - supports email and email
 */
export const useConfirmationCodeChallenge = () => {
  // expose the client and directory uuid
  const { directoryUuid, clientUuid } = useAuthenticationConfig();

  // store the challenge uuid
  const [challengeUuid, setChallengeUuid] = useState<string | null>(null);

  // define how to ask the confirmation code challenge
  const askConfirmationCodeChallenge = useCallback(
    async ({ goal, contactMethod }: { goal: ChallengeGoal; contactMethod: { type: ContactMethodType; address: string } }) => {
      // make the request
      const { challengeUuid: newChallengeUuid } = await askAuthChallenge({
        directoryUuid,
        clientUuid,
        goal,
        contactMethod,
        type: ChallengeType.CONFIRMATION_CODE,
      });

      // now that we have the challenge, save it
      setChallengeUuid(newChallengeUuid);
    },
    [directoryUuid, clientUuid],
  );

  /**
   * answer the confirmation code challenge
   *
   * throws error if:
   * - answer was incorrect
   * - challengeUuid not defined first
   */
  const answerConfirmationCodeChallenge = useCallback(
    async ({ answer }: { answer: string }) => {
      // check that challenge is defined
      if (!challengeUuid) throw new Error('challenge must be asked for before it can be answered');

      // send the answer
      const { token } = await answerAuthChallenge({
        challengeUuid,
        challengeAnswer: answer,
      });

      // save the token if one was given for the challenge
      if (token) saveToken({ token });
    },
    [challengeUuid],
  );

  // return how to ask, answer, and whether it has been asked
  return {
    challengeHasBeenAsked: typeof challengeUuid === 'string',
    askConfirmationCodeChallenge,
    answerConfirmationCodeChallenge,
  };
};
