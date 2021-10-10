import React, { useState } from 'react';
import { Song, Track, Instrument } from 'reactronica';
import './App.css';

const snareSample = '/snare-top-off17.wav';
const kickSample = '/st2_kick_one_shot_low_punch_basic.wav';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [samples, setSamples] = useState<object | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React + Reactronica!</p>
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
          steps={['C3', null, ['G3', 'E3'], null]}
          // onStepPlay={(steps) => {
          //   console.log(steps);
          // }}
        >
          <Instrument type="amSynth"></Instrument>
        </Track>

        <Track steps={samples ? ['C3', null, 'D3', 'C3'] : []}>
          <Instrument
            type="sampler"
            samples={samples || {}}
            // onLoad={(buffers) => {
            //   console.log('loaded');
            //   console.log(buffers);
            // }}
          ></Instrument>
        </Track>
      </Song>
    </div>
  );
}

export default App;
