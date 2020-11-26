import { useState } from 'react';
import { answerAuthChallenge, askAuthChallenge } from 'whodis-client';
import { ChallengeGoal, ChallengeType, ContactMethodType } from 'whodis-client/dist/askAuthChallenge';

import { saveToken } from './token/saveToken';
import { useAuthenticationConfig } from './useAuthenticationConfig';

export const useConfirmationCodeChallenge = () => {
  // expose the client and directory uuid
  const { directoryUuid, clientUuid } = useAuthenticationConfig();

  // store the challenge uuid
  const [challengeUuid, setChallengeUuid] = useState<string | null>(null);

  // define how to ask the confirmation code challenge
  const askConfirmationCodeChallenge = async ({
    goal,
    contactMethod,
  }: {
    goal: ChallengeGoal;
    contactMethod: { type: ContactMethodType; address: string };
  }) => {
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
  };

  /**
   * answer the confirmation code challenge
   *
   * throws error if:
   * - answer was incorrect
   * - challengeUuid not defined first
   */
  const answerConfirmationCodeChallenge = async ({ answer }: { answer: string }) => {
    // check that challenge is defined
    if (!challengeUuid) throw new Error('challenge must be asked for before it can be answered');

    // send the answer
    const { token } = await answerAuthChallenge({
      challengeUuid,
      challengeAnswer: answer,
    });

    // save the token if was correct
    saveToken({ token });
  };

  // return how to ask, answer, and whether it has been asked
  return {
    challengeHasBeenAsked: typeof challengeUuid === 'string',
    askConfirmationCodeChallenge,
    answerConfirmationCodeChallenge,
  };
};
