export { AuthenticationProvider } from './AuthenticationProvider';
export { useAuthenticationClaims } from './useAuthenticationClaims';
export { getAuthenticationClaims } from './getAuthenticationClaims';
export {
  useConfirmationCodeChallenge,
  ChallengeGoal,
  ContactMethodType,
} from './useConfirmationCodeChallenge';
export { forgetAuthenticationToken } from './forgetAuthenticationToken';
export { getAuthorizationHeader } from './getAuthorizationHeader';
export { loadAuthenticationFromSSRReq } from './loadAuthenticationFromSSRReq';
export {
  WhodisBadRequestError,
  isWhodisBadRequestError,
  WhodisAuthGoalError,
  isWhodisAuthGoalError,
} from 'whodis-client'; // forward this, so that users only need to import `whodis-react` to get all functionality
