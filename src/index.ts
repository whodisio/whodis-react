export { AuthenticationProvider } from './logic/auth/AuthenticationProvider';
export { useAuthenticationClaims } from './logic/auth/useAuthenticationClaims';
export { getAuthenticationClaims } from './logic/auth/getAuthenticationClaims';
export {
  useConfirmationCodeChallenge,
  ChallengeGoal,
  ContactMethodType,
} from './logic/auth/useConfirmationCodeChallenge';
export { forgetAuthenticationToken } from './logic/auth/forgetAuthenticationToken';
export { getAuthorizationHeader } from './logic/auth/getAuthorizationHeader';
export {
  WhodisBadRequestError,
  isWhodisBadRequestError,
  WhodisAuthGoalError,
  isWhodisAuthGoalError,
} from 'whodis-client'; // forward this, so that users only need to import `whodis-react` to get all functionality
export { WhodisAuthTokenStorage } from './domain/WhodisAuthTokenStorage';
