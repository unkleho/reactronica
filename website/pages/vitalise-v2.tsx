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

const currentStepIndexState = atom<number>({
  key: 'currentStepIndexState',
  default: 0,
});

const RecoilLivePage = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentStep, setCurrentState] = useRecoilState(currentStepIndexState);
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
  const sampleSteps = transformIdStepNotes(
    currentSessionClip?.steps,
    sampleFiles,
  );

  const timeSteps = transformIdStepNotes(
    currentSessionClip?.stepsNew,
    sampleFiles,
  );

  // TS error because Reactronica name: string, not MidiNote
  // @ts-ignore
  const newSteps = buildSteps(timeSteps, 4, 4);

  console.log(newSteps);

  useKeyPress(
    ' ',
    () => setIsPlaying(!isPlaying),
    (e) => e.preventDefault(),
  );

  return (
    <>
      <p>{isPlaying ? 'Playing' : 'Stopped'}</p>
      <p>{song.bpm}</p>

      <div>
        {tracks.map(({ id }) => {
          return <SessionTrack trackId={id} key={id} />;
        })}
      </div>

      {/* TODO: Move to component? */}
      <StepsEditorV2
        currentStepIndex={currentStep}
        steps={sampleSteps}
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
          const steps = transformIdStepNotes(clip?.steps, sampleFiles);
          const instrumentSamples = createInstrumentSamples(sampleFiles);

          return (
            <Track
              steps={steps?.length ? steps : emptySteps}
              key={track.id}
              onStepPlay={(stepNotes, index) => {
                setCurrentState(index);
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
    </>
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

  return (
    <div>
      <p>{track.id}</p>
      <div>
        <button
          onClick={() => {
            setTrack({
              ...track,
              currentClipId: null,
            });
          }}
        >
          Clear
        </button>

        {track.clipIds.map((clipId) => {
          return (
            <button
              onClick={() => {
                setTrack({
                  ...track,
                  currentClipId: clipId,
                });
                setCurrentSessionClipId(clipId);
                setCurrentSessionTrackId(trackId);
              }}
              style={{
                fontWeight: clipId === currentClipId ? 'bold' : 'normal',
              }}
              key={clipId}
            >
              {clipId}
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
