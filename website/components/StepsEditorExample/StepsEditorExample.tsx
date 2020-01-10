import * as React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import DAWStepsEditor from '../DAWStepsEditor';

// import css from './StepsEditorExample.css';

type Props = {
  className?: string;
};

const StepsEditorExample: React.FunctionComponent<Props> = ({ className }) => {
  const [currentSteps, setCurrentSteps] = React.useState([
    [{ name: 'C3' }, { name: 'E3' }, { name: 'A3' }],
    null,
    [{ name: 'C3' }, { name: 'E3' }, { name: 'G3' }, { name: 'B3' }],
    null,
    [{ name: 'C3' }, { name: 'F3' }, { name: 'A3' }],
    null,
    [{ name: 'D3' }, { name: 'G3' }, { name: 'B3' }],
    null,
  ]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      <br />
      <br />

      <DAWStepsEditor
        currentStepIndex={currentStepIndex}
        subdivision={8}
        defaultSteps={currentSteps}
        startNote="C3"
        endNote="B3"
        disableScrollIntoView={true}
        onStepEditorClick={(steps) => {
          setCurrentSteps(steps);
        }}
      ></DAWStepsEditor>

      <Song isPlaying={isPlaying}>
        <Track
          steps={currentSteps}
          onStepPlay={(_, index) => {
            setCurrentStepIndex(index);
          }}
        >
          <Instrument type="synth"></Instrument>
        </Track>
      </Song>
    </>
  );
};

export default StepsEditorExample;
