import * as React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import DAWStepsEditor from '../DAWStepsEditor';

// import css from './StepsEditorExample.css';

type Props = {
  className?: string;
};

const StepsEditorExample: React.FunctionComponent<Props> = ({ className }) => {
  const [currentSteps, setCurrentSteps] = React.useState([
    [{ note: 'C3' }, { note: 'E3' }, { note: 'A3' }],
    null,
    [{ note: 'C3' }, { note: 'E3' }, { note: 'G3' }, { note: 'B3' }],
    null,
    [{ note: 'C3' }, { note: 'F3' }, { note: 'A3' }],
    null,
    [{ note: 'D3' }, { note: 'G3' }, { note: 'B3' }],
    null,
  ]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      <DAWStepsEditor
        currentStepIndex={currentStepIndex}
        subdivision={8}
        defaultSteps={currentSteps}
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
          <Instrument type="polySynth"></Instrument>
        </Track>
      </Song>
    </>
  );
  // return (
  //   <div className={[css.stepsEditorExample, className || ''].join(' ')}></div>
  // );
};

export default StepsEditorExample;
