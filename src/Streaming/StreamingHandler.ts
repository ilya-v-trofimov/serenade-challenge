import { addUserPreferencesToPlaylist, UserPreference } from './StreamingService';
import { SpotifySdk, SpotifySdkMockService } from '../SpotifySdk';

export interface User {
  likes: UserPreference[];
}
// injecting SpotifySdk service here. To keep this exercise short, using mock service
const spotifySdk: SpotifySdk = new SpotifySdkMockService();

export const handler = async (
  user: User,
  context: Record<string, string>,
  callback: (isSuccess: boolean, message: string) => void
): Promise<void> => {
  try {
    await addUserPreferencesToPlaylist(spotifySdk, user.likes);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    callback(false, message);
    return;
  }
  callback(true, '');
};
