import React from 'react';
import { Instrument, InstrumentType, Song, StepType, Track } from 'reactronica';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  atomFamily,
} from 'recoil';
import { useKeyPress } from '../lib/hooks';

const isPlayingState = atom({
  key: 'isPlayingState', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

type Track = {
  id: string;
  steps: StepType[];
  type: InstrumentType;
  samples?: { [k: string]: string };
  // currentStepIndex: number;
};

const tracksState = atom({
  key: 'tracksState',
  default: [
    // {
    //   id: 'melody',
    //   steps: ['C3', 'D3', 'Eb3', 'G3'],
    //   type: 'synth',
    // },
    {
      id: 'samples',
      steps: [
        [
          {
            name: 'D3',
            duration: '1n',
          },
        ],
        null,
        null,
        null,
      ],
      type: 'sampler',
      samples: {
        C3: '/audio/DBC_70_lofi_melodic_kalimba_action_Cm.wav',
        D3: '/audio/DECAP_140_drum_loop_baptized_bouncy_rimshot.wav',
        E3: '/audio/OS_NC_140_Cm_Octagon_Guitar.wav',
      },
    },
    {
      id: 'kalimba',
      steps: [
        [
          {
            name: 'C3',
            // TODO: Update Reactronica types to allow string duration
            // TODO: Build duration function
            duration: getDuration(8, 70),
            velocity: 1,
          },
          {
            name: 'C5',
            duration: getDuration(8, 70),
            velocity: 0.3,
          },
        ],
        null,
        null,
        null,
        [
          {
            name: 'C1',
            duration: getDuration(4, 70),
            velocity: 0.5,
          },
        ],
        null,
        null,
        null,
      ],
      type: 'sampler',
      samples: {
        C3: '/audio/DBC_70_lofi_melodic_kalimba_action_Cm.wav',
      },
    },
  ] as Track[],
});

function getDuration(totalBeats: number, bpm: number): number {
  return (60 / bpm) * totalBeats;
}

// const myAtomFamily = atomFamily({
//   key: 'myAtomFamily',
//   default: (param) => param,
// });

const currentStepIndexState = atom({
  key: 'currentStepIndexState',
  default: 0,
});

// const charCountState = selector({
//   key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//   get: ({ get }) => {
//     const text = get(textState);

//     return text.length;
//   },
// });

function Interface() {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const currentStepIndex = useRecoilValue(currentStepIndexState);
  useKeyPress(' ', () => {
    setIsPlaying(!isPlaying);
  });

  return (
    <>
      <p>{currentStepIndex}</p>
      <p>{isPlaying ? 'Playing' : 'Stopped'}</p>
    </>
  );
}

function Audio() {
  const isPlaying = useRecoilValue(isPlayingState);
  const tracks = useRecoilValue(tracksState);
  const setCurrentStepIndex = useSetRecoilState(currentStepIndexState);

  console.log('Audio');

  return (
    <Song isPlaying={isPlaying} bpm={70}>
      {tracks.map((track) => {
        return (
          <Track
            steps={track.steps}
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
