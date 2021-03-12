import React from 'react';
import { Song, Track, Instrument, StepNoteType } from 'reactronica';

import DAWStepsEditor from '../components/DAWStepsEditor';
import SamplerInstrument from '../components/SamplerInstrument';
import { StepIndexContext } from '../lib/contexts/StepIndexContext';

const Page = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [notes, setNotes] = React.useState(null);
  const [steps, setSteps] = React.useState<StepNoteType[][]>([
    [
      { name: 'D3', duration: 8, velocity: 1 },
      { name: 'C3', duration: 8, velocity: 0 },
      { name: 'E4', duration: 8 },
    ],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  console.log(stepIndex);

  return (
    <div>
      <StepIndexContext.Provider value={{ currentStepIndex: 0 }}>
        <DAWStepsEditor
          clipId="Melody"
          steps={steps}
          startNote="C3"
          endNote="B3"
          // onStepsChange={(steps, noteName, index) => {
          //   setSteps(steps);
          // }}

          // currentStepIndex={stepIndex}
        />
      </StepIndexContext.Provider>

      <button
        onMouseDown={() => {
          setNotes([
            {
              name: 'C3',
              duration: 1,
            },
          ]);
        }}
        onMouseUp={() => {
          setNotes(null);
        }}
      >
        Play Note
      </button>

      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
      <Song isPlaying={isPlaying} bpm={70}>
        <Track
          volume={1}
          steps={steps}
          onStepPlay={(_, index) => {
            setStepIndex(index);
          }}
        >
          <SamplerInstrument notes={notes} />
          {/* <Instrument
            type="sampler"
            notes={notes}
            samples={{
              C3: '/audio/DBC_70_lofi_melodic_kalimba_action_Cm.wav',
              D3: '/audio/DECAP_140_drum_loop_baptized_bouncy_rimshot.wav',
              E3: '/audio/OS_NC_140_Cm_Octagon_Guitar.wav',
              // C3: '/audio/ukulele/Fluke_Uke_060.wav',
              // D3: '/audio/ukulele/Fluke_Uke_062.wav',
            }}
            // options={{
            //   release: 3,
            // }}
          /> */}
        </Track>
      </Song>
    </div>
  );
};

export default Page;
