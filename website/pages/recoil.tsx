import React from 'react';
import { Instrument, InstrumentType, Song, StepType, Track } from 'reactronica';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  // atomFamily,
  selectorFamily,
} from 'recoil';
import { useKeyPress } from '../lib/hooks';

// TODO: Update Reactronica types to allow string duration

type Track = {
  id: string;
  steps: StepType[];
  type: InstrumentType;
  volume?: number;
  samples?: { [k: string]: string };
  // currentStepIndex: number;
};

type Clip = {
  id: string;
  // trackId: string;
  steps: StepType[];
};

const isPlayingState = atom({
  key: 'isPlayingState',
  default: false,
});

const playingClipsState = atom({
  key: 'playingClipsState',
  default: {
    beats: 'beats1',
    kalimba: 'kalimba1',
    guitar: 'guitar0',
    harp: 'harp0',
    vocal: 'vocal0',
  },
});

const defaultClips = [
  {
    id: 'beats0',
    trackId: 'beats',
    steps: [],
  },
  {
    id: 'beats1',
    trackId: 'beats',
    steps: [
      [
        {
          name: 'E3',
          duration: getDuration(8, 70),
        },
      ],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'beats2',
    trackId: 'beats',
    steps: [
      [
        {
          name: 'C3',
          duration: getDuration(8, 70),
        },
      ],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'beats3',
    trackId: 'beats',
    steps: [
      [
        {
          name: 'D3',
          duration: getDuration(8, 70),
        },
      ],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'guitar0',
    trackId: 'guitar',
    steps: [null, null, null, null, null, null, null, null],
  },
  {
    id: 'guitar1',
    trackId: 'guitar',
    steps: [
      [
        {
          name: 'C3',
          velocity: 1,
          duration: getDuration(8, 70),
        },
      ],
      null,
      null,
      null,
      [
        {
          name: 'C4',
          velocity: 0,
          duration: getDuration(6, 70),
        },
      ],
      null,
      null,
      null,
    ],
  },
  {
    id: 'kalimba0',
    trackId: 'kalimba',
    steps: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'kalimba1',
    trackId: 'kalimba',
    steps: [
      [
        {
          name: 'C3',
          duration: getDuration(16, 70),
          velocity: 1,
        },
      ],
      null,
      null,
      null,
      [
        // {
        //   name: 'C5',
        //   duration: getDuration(8, 70),
        //   velocity: 0.2,
        // },
      ],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'harp0',
    trackId: 'harp',
    steps: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'harp1',
    trackId: 'harp',
    volume: -20,
    steps: [
      {
        name: 'C3',
        duration: getDuration(16, 70),
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'vocal0',
    trackId: 'vocal',
    volume: 0,
    steps: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
  {
    id: 'vocal1',
    trackId: 'vocal',
    volume: 0,
    steps: [
      {
        name: 'C3',
        duration: getDuration(2, 70),
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
];

const clipState = selectorFamily<Clip, string>({
  key: 'clipState',
  get: (id) => () => {
    return defaultClips.find((c) => c.id === id);
  },
});

const trackClipsState = selectorFamily<Clip[], string>({
  key: 'trackClipsState',
  get: (trackId) => () => {
    return defaultClips.filter((c) => c.trackId === trackId);
  },
});

const playingClipIdState = selectorFamily<string, string>({
  key: 'playingClipIdState',
  get: (trackId) => ({ get }) => {
    return get(playingClipsState)[trackId];
  },
  set: (trackId) => ({ get, set }, newClipId) => {
    const playingClips = get(playingClipsState);
    const newPlayingClips = {
      ...playingClips,
      [trackId]: newClipId,
    };
    set(playingClipsState, newPlayingClips);
  },
});

const tracksState = selector<Track[]>({
  key: 'tracksState',
  get: ({ get }) => {
    const playingClips = get(playingClipsState);

    return [
      {
        id: 'beats',
        volume: -8,
        steps: get(clipState(playingClips.beats))?.steps,
        type: 'sampler',
        samples: {
          C3: '/audio/samples/vt2_140_drum_loop_kauket_full.wav',
          D3: '/audio/samples/DECAP_140_drum_loop_baptized_bouncy_rimshot.wav',
          E3:
            '/audio/samples/DECAP_140_drum_loop_faded_slappy_knock_bounce.wav',
        },
      },
      {
        id: 'kalimba',
        volume: -0,
        steps: get(clipState(playingClips.kalimba))?.steps,
        type: 'sampler',
        samples: {
          C3: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm.wav',
        },
      },
      // {
      //   id: 'melody',
      //   steps: [[{ name: 'C3' }], 'D3', 'Eb3', 'G3', null, null, null, null],
      //   type: 'fmSynth',
      // },
      {
        id: 'guitar',
        volume: -4,
        steps: get(clipState(playingClips.guitar))?.steps,
        type: 'sampler',
        samples: {
          C3: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar.wav',
        },
      },
      {
        id: 'harp',
        volume: -6,
        steps: get(clipState(playingClips.harp))?.steps,
        type: 'sampler',
        samples: {
          C3: '/audio/samples/SO_EH_140_harp_imona_Cm.wav',
        },
      },
      {
        id: 'vocal',
        volume: -6,
        steps: get(clipState(playingClips.vocal))?.steps,
        type: 'sampler',
        samples: {
          C3: '/audio/CPAVX_VOX_HIT_125_09.wav',
        },
      },
    ];
  },
});

function getDuration(totalBeats: number, bpm: number): number {
  return (60 / bpm) * totalBeats;
}

const trackIdsState = selector({
  key: 'trackIds',
  get: ({ get }) => get(tracksState).map((t) => t.id),
});

const singleTrackState = selectorFamily({
  key: 'singleTrack',
  get: (id: string) => ({ get }) => {
    return get(tracksState).find((t) => t.id === id);
  },
});

const currentStepIndexState = atom({
  key: 'currentStepIndexState',
  default: 0,
});

const UITrack = ({ id }) => {
  const track = useRecoilValue(singleTrackState(id));
  const clips = useRecoilValue(trackClipsState(id));

  const [playingClipId, setPlayingClipId] = useRecoilState(
    playingClipIdState(id),
  );

  // console.log('UITrack', id, playingClipId);

  return (
    <div>
      {track.id}
      <div>
        {/* <button
          style={{
            fontWeight: playingClipId === null ? 'bold' : 'normal',
          }}
          onClick={() => {
            setPlayingClipId(null);
          }}
        >
          None
        </button> */}

        {clips.map((clip) => {
          return (
            <button
              key={clip.id}
              style={{
                fontWeight: clip.id === playingClipId ? 'bold' : 'normal',
              }}
              onClick={() => {
                setPlayingClipId(clip.id);
              }}
            >
              {clip.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};

function Interface() {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  // const [tracks, setTracks] = useRecoilState(tracksState);
  const trackIds = useRecoilValue(trackIdsState);
  useKeyPress(' ', () => {
    setIsPlaying(!isPlaying);
  });

  // console.log('Interface render', trackIds);

  return (
    <>
      <Playhead />
      <p>{isPlaying ? 'Playing' : 'Stopped'}</p>

      {trackIds.map((id) => (
        <UITrack id={id} key={id}></UITrack>
      ))}
    </>
  );
}

const Playhead = () => {
  const currentStepIndex = useRecoilValue(currentStepIndexState);
  return <p>{currentStepIndex}</p>;
};

function Audio() {
  const isPlaying = useRecoilValue(isPlayingState);
  const tracks = useRecoilValue(tracksState);
  const setCurrentStepIndex = useSetRecoilState(currentStepIndexState);

  // console.log('Audio', isPlaying);

  // console.log(tracks);

  return (
    <Song isPlaying={isPlaying} bpm={70}>
      {tracks.map((track) => {
        return (
          <Track
            steps={track.steps || []}
            volume={track.volume}
            onStepPlay={(_, index) => {
              setCurrentStepIndex(index);
            }}
            key={track.id}
          >
            <Instrument type={track.type} samples={track.samples}></Instrument>
          </Track>
        );
      })}
    </Song>
  );
}

const RecoilPage = () => {
  return (
    <RecoilRoot>
      <Interface></Interface>
      <Audio></Audio>
    </RecoilRoot>
  );
};

export default RecoilPage;
