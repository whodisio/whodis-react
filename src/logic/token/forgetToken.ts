import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';

export const forgetToken = async ({
  storage,
}: {
  storage: WhodisAuthTokenStorage;
}) => await storage.set(null);
