import { atom, selector, selectorFamily } from 'recoil';
import { slabSong, VitaliseClip, VitaliseSong, VitaliseTrack } from './data';

export const isPlayingState = atom<boolean>({
  key: 'isPlayingState',
  default: false,
});

export const currentStepIndexState = atom<number>({
  key: 'currentStepIndexState',
  default: 0,
});

/**
 * List of songs
 */
export const songsState = atom<VitaliseSong[]>({
  key: 'songsState',
  default: [slabSong],
});

/**
 * Current song ID
 */
const currentSongIdState = atom<string>({
  key: 'currentSongIdState',
  default: 'slab',
});

/**
 * Current song data
 */
export const currentSongState = selector<VitaliseSong>({
  key: 'currentSongState',
  get: ({ get }) => {
    const songs: VitaliseSong[] = get(songsState);
    const songId = get(currentSongIdState);
    return songs.find((song) => song.id === songId);
  },
  set: ({ set, get }, newSong) => {
    const songId = get(currentSongIdState);

    set(songsState, (prevSongs) => {
      return prevSongs.map((prevSong) => {
        if (prevSong.id === songId) {
          return newSong;
        }

        return prevSong;
      });
    });
  },
});

/**
 * Tracks of current song
 */
export const trackState = selectorFamily<VitaliseTrack, string>({
  key: 'trackState',
  get: (trackId) => ({ get }) => {
    const song = get(currentSongState);
    const { tracks } = song;
    return tracks.find((track) => track.id === trackId);
  },
  set: (trackId) => ({ set }, newTrack) => {
    set(currentSongState, (prevSong) => {
      return {
        ...prevSong,
        tracks: prevSong.tracks.map((prevTrack) => {
          return prevTrack.id === trackId ? newTrack : prevTrack;
        }),
      };
    });
  },
});

export const trackClipsState = selectorFamily<VitaliseClip[], string>({
  key: 'trackClipsState',
  get: (trackId) => ({ get }) => {
    const song = get(currentSongState);
    const track = get(trackState(trackId));
    const clips = song.clips.filter((clip) => {
      return track.clipIds.includes(clip.id);
    });

    return clips;
  },
});

export const currentSessionTrackIdState = atom<string>({
  key: 'currentSessionTrackIdState',
  default: 'clip',
});

export const currentSessionTrackState = selector<VitaliseTrack>({
  key: 'currentSessionTrackState',
  get: ({ get }) => {
    const song: VitaliseSong = get(currentSongState);
    const { tracks } = song;
    const currentSessionTrackId = get(currentSessionTrackIdState);
    const currentSessionTrack = tracks.find(
      (track) => track.id === currentSessionTrackId,
    );

    return currentSessionTrack;
  },
});

/**
 * ID of current clip shown in session view
 */
export const currentSessionClipIdState = atom<string>({
  key: 'currentSessionClipIdState',
  default: 'clip1',
});

/**
 * Current session clip data, eg. steps
 */
export const currentSessionClipState = selector<VitaliseClip>({
  key: 'currentClipState',
  get: ({ get }) => {
    const song: VitaliseSong = get(currentSongState);
    const currentClipId = get(currentSessionClipIdState);
    const currentClip = song.clips.find((clip) => clip.id === currentClipId);
    return currentClip;
  },
});
