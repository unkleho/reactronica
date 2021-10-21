import React, { useState } from 'react';
import { Song, Track, Instrument } from 'reactronica';
import './App.css';

const snareSample = '/snare-top-off17.wav';
const kickSample = '/st2_kick_one_shot_low_punch_basic.wav';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [samples, setSamples] = useState<object | null>(null);
  const [steps, setSteps] = useState(['C3', null, ['G#3', 'G#2'], null]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <button onClick={() => setSteps(['C3', null, ['G#3', 'G#2'], null])}>
            ['C3', null, ['G#3', 'G#2'], null]
          </button>
          <button onClick={() => setSteps([null, null, ['G#3'], 'C3'])}>
            [null, null, ['G#3'], 'C3']
          </button>
          <button onClick={() => setSteps([null, null, ['G#3'], null, 'C3'])}>
            [null, null, ['G#3'], null, 'C3']
          </button>
        </p>
        <p>currentStepIndex: {currentStepIndex}</p>
        <p>
          <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (samples) {
                console.log('Clear samples');
                setSamples(null);
              } else {
                console.log('Add samples');
                setSamples({
                  C3: kickSample,
                  D3: snareSample,
                });
              }
            }}
          >
            {samples ? 'Remove' : 'Add'} samples
          </button>
        </p>
      </header>

      <Song isPlaying={isPlaying} bpm={90}>
        <Track
          steps={steps}
          onStepPlay={(steps, i) => {
            console.log(i, steps);
            setCurrentStepIndex(i);
          }}
        >
          <Instrument type="synth"></Instrument>
        </Track>

        {/* <Track steps={samples ? ['C3', null, 'D3', 'C3'] : []}>
          <Instrument
            type="sampler"
            samples={samples || {}}
            // onLoad={(buffers) => {
            //   console.log('loaded');
            //   console.log(buffers);
            // }}
          ></Instrument>
        </Track> */}
      </Song>
    </div>
  );
}

export default App;
