import { Artist, Track } from '../src/SpotifySdk';
import {
  addUserPreferencesToPlaylist,
  CURRENT_PLAYLIST_ID,
  getAllPreferredTracks,
  getTopTracksForArtist,
  UserPreference,
} from '../src/StreamingService';
import resetAllMocks = jest.resetAllMocks;

const fixtureTestArtist1: Artist = {
  id: 'testArtistId1',
  name: 'testArtistName1',
};
const fixtureTestArtist2: Artist = {
  id: 'testArtistId2',
  name: 'testArtistName2',
};
const fixtureTopTracks: Track[] = [
  {
    id: 'testTrackId1',
    name: 'testTrackName1',
    artistId: 'testArtistId1',
  },
  {
    id: 'testTrackId2',
    name: 'testTrackName2',
    artistId: 'testArtistId1',
  },
  {
    id: 'testTrackId3',
    name: 'testTrackName3',
    artistId: 'testArtistId1',
  },
];
const fixtureUserPreferences: UserPreference[] = [
  {
    id: 1,
    name: 'testArtistName1',
  },
  {
    id: 2,
    name: 'testArtistName2',
  },
];

describe('StreamingService', () => {
  const mockAddItemsToPlaylist = jest.fn();
  const mockGetArtistTopTracks = jest.fn();
  const mockSearchArtist = jest.fn();
  const mockSpotifySdk = {
    addItemsToPlaylist: mockAddItemsToPlaylist,
    getArtistTopTracks: mockGetArtistTopTracks,
    searchArtist: mockSearchArtist,
  };
  beforeEach(() => {
    resetAllMocks();
  });
  describe('getTopTracksForArtist', () => {
    it('should return sliced Track array', async () => {
      // given
      mockSearchArtist.mockReturnValue(fixtureTestArtist1);
      mockGetArtistTopTracks.mockReturnValue(fixtureTopTracks);
      const expectedTopTracks = [fixtureTopTracks[0], fixtureTopTracks[1]];

      // when
      const topTracksForArtis = await getTopTracksForArtist(mockSpotifySdk, fixtureTestArtist1.name);

      // then
      expect(topTracksForArtis).toStrictEqual(expectedTopTracks);
      expect(mockSearchArtist).toBeCalledWith(fixtureTestArtist1.name);
      expect(mockGetArtistTopTracks).toBeCalledWith(fixtureTestArtist1);
    });
  });

  describe('getAllPreferredTracks', () => {
    it('should return top tracks for each artist', async () => {
      // given
      mockSearchArtist.mockReturnValueOnce(fixtureTestArtist1).mockReturnValueOnce(fixtureTestArtist2);
      mockGetArtistTopTracks
        .mockReturnValueOnce(fixtureTopTracks.slice(0, 2))
        .mockReturnValueOnce(fixtureTopTracks.slice(2));
      const expectedAllPreferredTracks = fixtureTopTracks;

      // when
      const allPreferredTracks = await getAllPreferredTracks(mockSpotifySdk, fixtureUserPreferences);

      // then
      expect(allPreferredTracks).toStrictEqual(expectedAllPreferredTracks);
      expect(mockSearchArtist.mock.calls[0][0]).toBe(fixtureTestArtist1.name);
      expect(mockSearchArtist.mock.calls[1][0]).toBe(fixtureTestArtist2.name);
      expect(mockGetArtistTopTracks.mock.calls[0][0]).toBe(fixtureTestArtist1);
      expect(mockGetArtistTopTracks.mock.calls[1][0]).toBe(fixtureTestArtist2);
    });
  });

  describe('addUserPreferencesToPlaylist', () => {
    it('should get all tracks and add to playlist', async () => {
      // given
      mockSearchArtist.mockReturnValueOnce(fixtureTestArtist1).mockReturnValueOnce(fixtureTestArtist2);
      mockGetArtistTopTracks
        .mockReturnValueOnce(fixtureTopTracks.slice(0, 2))
        .mockReturnValueOnce(fixtureTopTracks.slice(2));
      const expectedAllPreferredTracks = fixtureTopTracks;

      // when
      await addUserPreferencesToPlaylist(mockSpotifySdk, fixtureUserPreferences);

      // then
      expect(mockAddItemsToPlaylist.mock.calls[0][0]).toBe(CURRENT_PLAYLIST_ID);
      expect(mockAddItemsToPlaylist.mock.calls[0][1].length).toBe(expectedAllPreferredTracks.length);
      const containsAll = expectedAllPreferredTracks.every((el: Track) =>
        mockAddItemsToPlaylist.mock.calls[0][1].includes(el)
      );
      expect(containsAll).toBeTruthy();
    });
  });
});
