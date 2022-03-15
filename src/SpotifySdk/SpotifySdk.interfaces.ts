export interface Artist {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  name: string;
  artistId: string;
}

export interface SpotifySdk {
  searchArtist: (name: string) => Promise<Artist | null>;
  getArtistTopTracks: (artist: Artist) => Promise<Track[]>;
  addItemsToPlaylist: (playlistId: string, tracks: Track[]) => Promise<Track[]>;
}
