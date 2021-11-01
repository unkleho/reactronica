import React, { useState } from 'react';
import { Song, Track, Instrument } from 'reactronica';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  return (
    <div className="App">
      <h1>Reactronica Example</h1>
      <p>
        <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>{' '}
        currentStepIndex: {currentStepIndex}
      </p>
      <Song isPlaying={isPlaying} bpm={70}>
        <Track
          steps={[
            'C3',
            null,
            ['G#3', 'G#2'],
            null,
            { name: 'F3' },
            null,
            [{ name: 'G3' }, { name: 'G2' }],
            null,
          ]}
          onStepPlay={(steps, i) => {
            setCurrentStepIndex(i);
          }}
        >
          <Instrument type={'synth'}></Instrument>
        </Track>

        <Track steps={['C3', 'D3', 'C3', 'D3']}>
          <Instrument
            type="sampler"
            samples={{
              C3: 'st2_kick_one_shot_low_punch_basic.wav',
              D3: 'snare-top-off17.wav',
            }}
            onLoad={(buffers) => {
              console.log('Samples loaded');
            }}
          ></Instrument>
        </Track>
      </Song>
    </div>
  );
}

export default App;
