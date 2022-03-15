/* eslint-disable */
import { Artist, SpotifySdk, Track } from './SpotifySdk.interfaces';

export class SpotifySdkMockService implements SpotifySdk {
  addItemsToPlaylist(playlistId: string, tracks: Track[]): Promise<Track[]> {
    return Promise.resolve([]);
  }

  getArtistTopTracks(artist: Artist): Promise<Track[]> {
    return Promise.resolve([]);
  }

  searchArtist(name: string): Promise<Artist | null> {
    return Promise.resolve(null);
  }
}
