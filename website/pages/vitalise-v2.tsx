import React from 'react';
import { Instrument, InstrumentType, Song, StepType, Track } from 'reactronica';
import {
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue,
  selectorFamily,
  selector,
  DefaultValue,
} from 'recoil';
import SessionTransport from '../components/SessionTransport';
import StepsEditorV2 from '../components/StepsEditorV2';
import { MidiNote } from '../configs/midiConfig';
import {
  emptySteps,
  slabSong,
  VitaliseClip,
  vitaliseSampleFiles,
  VitaliseSong,
  VitaliseTrack,
} from '../data/vitalise';
import { getDuration } from '../lib/get-duration';
import { useKeyPress } from '../lib/hooks';
import {
  // SampleId,
  transformIdStepNotes,
  createInstrumentSamples,
} from '../lib/sample-utils';
import { buildSteps } from '../lib/step-utils';

const isPlayingState = atom<boolean>({
  key: 'isPlayingState',
  default: false,
});

/**
 * List of songs
 */
const songsState = atom<VitaliseSong[]>({
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
const currentSongState = selector<VitaliseSong>({
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
const trackState = selectorFamily<VitaliseTrack, string>({
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

const trackClipsState = selectorFamily<VitaliseClip[], string>({
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

const currentSessionTrackIdState = atom<string>({
  key: 'currentSessionTrackIdState',
  default: 'clip',
});

const currentSessionTrackState = selector<VitaliseTrack>({
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
const currentSessionClipIdState = atom<string>({
  key: 'currentSessionClipIdState',
  default: 'clip1',
});

/**
 * Current session clip data, eg. steps
 */
const currentSessionClipState = selector<VitaliseClip>({
  key: 'currentClipState',
  get: ({ get }) => {
    const song: VitaliseSong = get(currentSongState);
    const currentClipId = get(currentSessionClipIdState);
    const currentClip = song.clips.find((clip) => clip.id === currentClipId);
    return currentClip;
  },
});

const currentStepIndexState = atom<number>({
  key: 'currentStepIndexState',
  default: 0,
});

const RecoilLivePage = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentStepIndex, setCurrentStepIndexState] = useRecoilState(
    currentStepIndexState,
  );
  const song = useRecoilValue(currentSongState);
  const { tracks, clips } = song;

  const currentSessionClip = useRecoilValue(currentSessionClipState);
  const currentSessionTrack = useRecoilValue(currentSessionTrackState);

  // TODO: For PianoRoll, move to component?
  // TODO: Move to Recoil?
  const sampleFiles = vitaliseSampleFiles.filter((sampleFile) =>
    currentSessionTrack.sampleFileIds.includes(sampleFile.id),
  );

  // TODO: Move to Recoil?
  const timeSteps = transformIdStepNotes(
    currentSessionClip?.steps,
    sampleFiles,
  );

  // TS error because Reactronica name: string, not MidiNote
  // @ts-ignore
  const currentSteps = buildSteps(timeSteps, 4, 4);

  useKeyPress(
    ' ',
    () => setIsPlaying(!isPlaying),
    (e) => e.preventDefault(),
  );

  return (
    <div className="p-8">
      <SessionTransport
        isPlaying={isPlaying}
        bpm={song.bpm}
        className="mb-2"
        onPlayClick={() => setIsPlaying(!isPlaying)}
      />

      <div className="flex mb-2 border border-black">
        {tracks.map(({ id }) => {
          return <SessionTrack trackId={id} key={id} />;
        })}
      </div>

      {/* TODO: Move to component? */}
      <StepsEditorV2
        currentStepIndex={currentStepIndex}
        steps={currentSteps}
        startNote="C0"
        endNote="C1"
        subdivision={16}
      />

      <Song bpm={song.bpm} isPlaying={isPlaying} volume={0}>
        {tracks.map((track) => {
          const { currentClipId, sampleFileIds } = track;
          const clip = clips.find((clip) => clip.id === currentClipId);

          const sampleFiles = vitaliseSampleFiles.filter((sampleFile) =>
            sampleFileIds.includes(sampleFile.id),
          );
          const timeSteps = transformIdStepNotes(clip?.steps, sampleFiles);
          // @ts-ignore
          const steps = buildSteps(timeSteps, 4, 4);
          const instrumentSamples = createInstrumentSamples(sampleFiles);

          return (
            <Track
              steps={steps?.length ? steps : emptySteps}
              key={track.id}
              onStepPlay={(stepNotes, index) => {
                setCurrentStepIndexState(index);
              }}
            >
              <Instrument
                type="sampler"
                samples={instrumentSamples}
                // TODO: Causes buffer errors for some reason
                // onLoad={(s) => {
                //   console.log(s);
                // }}
              ></Instrument>
            </Track>
          );
        })}

        {/* <Track steps={tracks[1].steps} key={'sub'}>
          <Instrument
            type="sampler"
            samples={{
              // C1: '/audio/samples/DECAP_808_long_midrange_distorted_C.wav',
              C1: '/audio/samples/Diginoiz_-_TDS_808_Kick_C_5.wav',
            }}
          ></Instrument>
        </Track> */}
      </Song>
    </div>
  );
};

const SessionTrack = ({ trackId }) => {
  const [track, setTrack] = useRecoilState(trackState(trackId));
  const [currentSessionClipId, setCurrentSessionClipId] = useRecoilState(
    currentSessionClipIdState,
  );
  const [currentSessionTrackId, setCurrentSessionTrackId] = useRecoilState(
    currentSessionTrackIdState,
  );
  const { currentClipId } = track;
  const clips = useRecoilValue(trackClipsState(trackId));

  return (
    <div className="flex-1 border-black border-r last:border-none">
      <div className="bg-grey border-black border-b-2">
        <p className="px-2 py-1 text-xs font-bold">{track.name}</p>
      </div>
      <div className="flex flex-col">
        <button
          className="px-2 py-1 bg-grey border-black border-b text-xs"
          onClick={() => {
            setTrack({
              ...track,
              currentClipId: null,
            });
          }}
        >
          Clear
        </button>

        {clips.map((clip) => {
          return (
            <button
              className={[
                'px-2 py-1 bg-grey border-black border-b last:border-none',
                'text-xs',
                clip.id === currentClipId ? 'font-bold text-secondary' : '',
              ].join(' ')}
              style={{
                fontWeight: clip.id === currentClipId ? 'bold' : 'normal',
              }}
              key={clip.id}
              onClick={() => {
                setTrack({
                  ...track,
                  currentClipId: clip.id,
                });
                setCurrentSessionClipId(clip.id);
                setCurrentSessionTrackId(trackId);
              }}
            >
              {clip.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RecoilPage = () => {
  return (
    <RecoilRoot>
      {/* Test */}
      <RecoilLivePage />
    </RecoilRoot>
  );
};

export default RecoilPage;

// type TrackType = {
//   id: string;
//   range?: [number, number];
//   steps: (
//     | {
//         id: string;
//         duration: number;
//         velocity: number;
//       }
//     | {
//         name: MidiNote;
//         duration: number;
//         velocity: number;
//       }
//   )[][];
// };

// const tracksState = atom<TrackType[]>({
//   key: 'tracksState',
//   default: [
//     {
//       id: 'sampler',
//       range: [0, 8],
//       // range: [8, 16],
//       steps: [
//         // 0 ------------------------------------------------------------------
//         [
//           { id: 'guitar1', duration: getDuration(8, 70), velocity: 1 },
//           { id: 'beat1', duration: getDuration(8, 70), velocity: 0.6 },
//           { id: 'compassVox1', duration: getDuration(7, 70), velocity: 0.5 },
//           // { id: 'soul4', duration: getDuration(1, 70), velocity: 0.8 },
//           // { id: 'strum5', duration: getDuration(2, 70), velocity: 0.7 },
//         ],
//         null,
//         [{ id: 'soul4', duration: getDuration(2, 70), velocity: 0.7 }],
//         null,
//         // 4 ------------------------------------------------------------------
//         [{ id: 'soul4', duration: getDuration(1, 70), velocity: 0.8 }],
//         null,
//         [{ id: 'soul4', duration: getDuration(2, 70), velocity: 0.6 }],
//         [{ id: 'strum5', duration: getDuration(2, 70), velocity: 0.7 }],
//         // 8 ------------------------------------------------------------------
//         [
//           { id: 'guitar3', duration: getDuration(8, 70), velocity: 1 },
//           // { id: 'beat2', duration: getDuration(8, 70), velocity: 1 },
//           { id: 'kalimba2', duration: getDuration(8, 70), velocity: 1 },
//           // { id: 'soul3', duration: getDuration(4, 70), velocity: 0.8 },
//         ],
//         null,
//         null,
//         null,
//         // 12 ------------------------------------------------------------------
//         [{ id: 'soul2', duration: getDuration(3, 70), velocity: 0.8 }],
//         null,
//         null,
//         null,
//       ],
//     },
//     {
//       id: 'sub',
//       steps: [
//         [
//           {
//             name: 'C1',
//             duration: getDuration(3, 70),
//             velocity: 1,
//           },
//         ],
//         null,
//         null,
//         null,
//         null,
//         null,
//         null,
//         null,
//         [
//           {
//             name: 'C1',
//             duration: getDuration(1, 70),
//             velocity: 1,
//           },
//         ],
//         null,
//         null,
//         null,
//         [
//           {
//             name: 'G#0',
//             duration: getDuration(2, 70),
//             velocity: 1,
//           },
//         ],
//         null,
//         null,
//         null,
//       ],
//     },
//   ],
// });
