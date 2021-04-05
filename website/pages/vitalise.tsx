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
import StepsEditorV2 from '../components/StepsEditorV2';
import { MidiNote } from '../configs/midiConfig';
import { getDuration } from '../lib/get-duration';
import { useKeyPress } from '../lib/hooks';
import {
  SampleId,
  samples,
  getSampleNote,
  transformIdStepNotes,
} from '../lib/sample-utils';

const isPlayingState = atom({
  key: 'isPlayingState',
  default: false,
});

type TrackType = {
  id: string;
  range?: [number, number];
  steps: (
    | {
        id: SampleId;
        duration: number;
        velocity: number;
      }
    | {
        name: MidiNote;
        duration: number;
        velocity: number;
      }
  )[][];
};

const tracksState = atom<TrackType[]>({
  key: 'tracksState',
  default: [
    {
      id: 'sampler',
      range: [0, 8],
      // range: [8, 16],
      steps: [
        // 0 ------------------------------------------------------------------
        [
          { id: 'guitar1', duration: getDuration(8, 70), velocity: 1 },
          { id: 'beat1', duration: getDuration(8, 70), velocity: 0.6 },
          { id: 'compassVox1', duration: getDuration(7, 70), velocity: 0.5 },
          // { id: 'soul4', duration: getDuration(1, 70), velocity: 0.8 },
          // { id: 'strum5', duration: getDuration(2, 70), velocity: 0.7 },
        ],
        null,
        [{ id: 'soul4', duration: getDuration(2, 70), velocity: 0.7 }],
        null,
        // 4 ------------------------------------------------------------------
        [{ id: 'soul4', duration: getDuration(1, 70), velocity: 0.8 }],
        null,
        [{ id: 'soul4', duration: getDuration(2, 70), velocity: 0.6 }],
        [{ id: 'strum5', duration: getDuration(2, 70), velocity: 0.7 }],
        // 8 ------------------------------------------------------------------
        [
          { id: 'guitar3', duration: getDuration(8, 70), velocity: 1 },
          // { id: 'beat2', duration: getDuration(8, 70), velocity: 1 },
          { id: 'kalimba2', duration: getDuration(8, 70), velocity: 1 },
          // { id: 'soul3', duration: getDuration(4, 70), velocity: 0.8 },
        ],
        null,
        null,
        null,
        // 12 ------------------------------------------------------------------
        [{ id: 'soul2', duration: getDuration(3, 70), velocity: 0.8 }],
        null,
        null,
        null,
      ],
    },
    {
      id: 'sub',
      steps: [
        [
          {
            name: 'C1',
            duration: getDuration(3, 70),
            velocity: 1,
          },
        ],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [
          {
            name: 'C1',
            duration: getDuration(1, 70),
            velocity: 1,
          },
        ],
        null,
        null,
        null,
        [
          {
            name: 'G#0',
            duration: getDuration(2, 70),
            velocity: 1,
          },
        ],
        null,
        null,
        null,
      ],
    },
  ],
});

const currentStepIndexState = atom({
  key: 'currentStepIndexState',
  default: 0,
});

const RecoilLivePage = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [tracks, setTracks] = useRecoilState(tracksState);
  const [currentStep, setCurrentState] = useRecoilState(currentStepIndexState);

  const trackSamples = samples.reduce((prev, curr) => {
    const note = getSampleNote(curr.id);

    return {
      ...prev,
      [note]: curr.file,
    };
  }, {});

  const sampleSteps = transformIdStepNotes(
    tracks[0].steps.slice(tracks[0].range[0], tracks[0].range[1]),
  );

  useKeyPress(
    ' ',
    () => {
      setIsPlaying(!isPlaying);
    },
    (event) => {
      event.preventDefault();
    },
  );

  React.useEffect(() => {
    window.playMusic = () => {
      setIsPlaying(true);
    };
    window.stopMusic = () => {
      setIsPlaying(false);
    };
  }, []);

  console.log(
    currentStep,
    tracks[0].steps[currentStep + tracks[0].range[0]]
      ? tracks[0].steps[currentStep + tracks[0].range[0]].map((s) => s.id)
      : null,
    tracks[1].steps[currentStep] ? 'sub' : null,
  );

  return (
    <>
      <p>{isPlaying ? 'Playing' : 'Stopped'}</p>

      <StepsEditorV2
        currentStepIndex={currentStep}
        steps={sampleSteps}
        startNote="C0"
        endNote="C2"
      />

      <Song bpm={70} isPlaying={isPlaying} volume={0}>
        {tracks.slice(0, 1).map((track) => {
          return (
            <Track
              steps={sampleSteps}
              key={track.id}
              onStepPlay={(stepNotes, index) => {
                setCurrentState(index);
              }}
            >
              <Instrument type="sampler" samples={trackSamples}></Instrument>
            </Track>
          );
        })}

        <Track steps={tracks[1].steps} key={'sub'}>
          <Instrument
            type="sampler"
            samples={{
              // C1: '/audio/samples/DECAP_808_long_midrange_distorted_C.wav',
              C1: '/audio/samples/Diginoiz_-_TDS_808_Kick_C_5.wav',
            }}
          ></Instrument>
        </Track>
      </Song>
    </>
  );
};

const RecoilPage = () => {
  return (
    <RecoilRoot>
      <RecoilLivePage />
    </RecoilRoot>
  );
};

export default RecoilPage;
