import { WhodisAuthTokenStorage } from '../../domain/WhodisAuthTokenStorage';

export const saveToken = async ({
  storage,
  token,
}: {
  storage: WhodisAuthTokenStorage;
  token: string;
}) => await storage.set(token);
