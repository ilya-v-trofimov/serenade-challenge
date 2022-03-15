import _ from 'lodash';
import { SpotifySdk, Track } from './SpotifySdk';

export const TOP_TRACKS_MAX_NUMBER = 2;
export const CURRENT_PLAYLIST_ID = 'current_playlist_id';

export interface UserPreference {
  id: number;
  name: string;
}

export const getTopTracksForArtist = async (spotifySdk: SpotifySdk, artistName: string): Promise<Track[]> => {
  const spotifyArtist = await spotifySdk.searchArtist(artistName);
  if (!spotifyArtist) {
    throw new Error(`Could not find an artist with name ${artistName}`);
  }
  const artistTopTracks = await spotifySdk.getArtistTopTracks(spotifyArtist);
  return artistTopTracks.slice(0, TOP_TRACKS_MAX_NUMBER);
};

export const getAllPreferredTracks = async (
  spotifySdk: SpotifySdk,
  userPreferences: UserPreference[]
): Promise<Track[]> => {
  const tracksArrays = await Promise.all(
    userPreferences.map((pref: UserPreference) => getTopTracksForArtist(spotifySdk, pref.name))
  );
  return tracksArrays.flat();
};

export const addUserPreferencesToPlaylist = async (spotifySdk: SpotifySdk, userPreferences: UserPreference[]) => {
  const preferredTracks = await getAllPreferredTracks(spotifySdk, userPreferences);
  const shuffledTracks = _.shuffle(preferredTracks);
  await spotifySdk.addItemsToPlaylist(CURRENT_PLAYLIST_ID, shuffledTracks);
};
