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
import { getDuration } from '../lib/get-duration';
import { useKeyPress } from '../lib/hooks';

const isPlayingState = atom({
  key: 'isPlayingState',
  default: false,
});

const samples = [
  {
    id: 'beat1',
    note: 'C3',
    file: '/audio/samples/DECAP_140_drum_loop_faded_slappy_knock_bounce.wav',
  },
  {
    id: 'kalimba1',
    note: 'D3',
    file: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_1.wav',
  },
  {
    id: 'kalimba2',
    note: 'D#3',
    file: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_2.wav',
  },
  {
    id: 'soul1',
    note: 'E3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_1.wav',
  },
  {
    id: 'soul2',
    note: 'F3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_2.wav',
  },
  {
    id: 'soul3',
    note: 'G3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_3.wav',
  },
  {
    id: 'soul4',
    note: 'A3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_4.wav',
  },
  {
    id: 'vox1',
    note: 'B3',
    file: '/audio/samples/CPAVX_VOX_HIT_125_09.wav',
  },
  {
    id: 'strum1',
    note: 'C4',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_1.wav',
  },
  {
    id: 'strum2',
    note: 'D4',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_2.wav',
  },
  {
    id: 'strum5',
    note: 'G4',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_5.wav',
  },
  {
    id: 'guitar1',
    note: 'C5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_1.wav',
  },
  {
    id: 'guitar2',
    note: 'D5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_2.wav',
  },
  {
    id: 'guitar3',
    note: 'E5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_3.wav',
  },
  {
    id: 'guitar4',
    note: 'F5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_4.wav',
  },
];

function getSampleNote(id) {
  return samples.find((s) => s.id === id).note;
}

const tracksState = atom({
  key: 'tracksState',
  default: [
    {
      id: 'sampler',
      // range: [0, 8],
      range: [8, 16],
      steps: [
        // 1 ------------------------------------------------------------------
        [
          { id: 'beat1', duration: getDuration(8, 70), velocity: 1 },
          { id: 'kalimba2', duration: getDuration(8, 70), velocity: 1 },
          { id: 'guitar3', duration: getDuration(8, 70), velocity: 1 },
          { id: 'soul3', duration: getDuration(4, 70), velocity: 0.8 },
        ],
        null,
        null,
        null,
        // 3 ------------------------------------------------------------------
        [{ id: 'soul2', duration: getDuration(3, 70), velocity: 0.8 }],
        null,
        null,
        null,
        // 5 ------------------------------------------------------------------
        [
          { id: 'beat1', duration: getDuration(8, 70), velocity: 1 },
          { id: 'guitar1', duration: getDuration(8, 70), velocity: 1 },
          { id: 'soul4', duration: getDuration(1, 70), velocity: 0.8 },
          { id: 'strum5', duration: getDuration(2, 70), velocity: 0.7 },
        ],
        null,
        [{ id: 'soul4', duration: getDuration(2, 70), velocity: 0.7 }],
        null,
        // 7 ------------------------------------------------------------------
        [{ id: 'soul4', duration: getDuration(1, 70), velocity: 0.8 }],
        null,
        [
          { id: 'soul4', duration: getDuration(2, 70), velocity: 0.6 },
          // { id: 'strum2', duration: getDuration(2, 70), velocity: 0.7 },
        ],
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
    return {
      ...prev,
      [curr.note]: curr.file,
    };
  }, {});

  useKeyPress(' ', () => {
    setIsPlaying(!isPlaying);
  });

  return (
    <>
      <p>{isPlaying ? 'Playing' : 'Stopped'}</p>
      <p>{currentStep}</p>
      <Song bpm={70} isPlaying={isPlaying} volume={0}>
        {tracks.slice(0, 1).map((track) => {
          return (
            <Track
              steps={track.steps
                .slice(track.range[0], track.range[1])
                .map((stepNotes) => {
                  return stepNotes
                    ? stepNotes.map((stepNote) => ({
                        ...stepNote,
                        name: getSampleNote(stepNote.id),
                      }))
                    : null;
                })}
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
