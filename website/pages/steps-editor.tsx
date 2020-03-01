import React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import DAWStepsEditor from '../components/DAWStepsEditor';

const Page = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [notes, setNotes] = React.useState(null);
  const [steps, setSteps] = React.useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  return (
    <div>
      <DAWStepsEditor
        defaultSteps={steps}
        startNote="C3"
        endNote="B3"
        onStepEditorClick={(steps, noteName, index) => {
          setSteps(steps);
        }}
        currentStepIndex={stepIndex}
      ></DAWStepsEditor>
      <button
        onMouseDown={() => {
          setNotes([
            {
              name: 'C3',
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
      <Song isPlaying={isPlaying}>
        <Track
          steps={steps}
          onStepPlay={(_, index) => {
            setStepIndex(index);
          }}
        >
          <Instrument
            type="sampler"
            notes={notes}
            samples={{
              C3: '/audio/ukulele/Fluke_Uke_060.wav',
              D3: '/audio/ukulele/Fluke_Uke_062.wav',
            }}
            options={{
              release: 3,
            }}
          />
        </Track>
      </Song>
    </div>
  );
};

export default Page;
