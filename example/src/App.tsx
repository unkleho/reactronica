import React, { useState } from 'react';
import { Song, Track, Instrument } from 'reactronica';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSamples, setHasSamples] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React + Reactronica!</p>
        <p>
          <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          <button type="button" onClick={() => setHasSamples(true)}>
            {hasSamples ? 'Remove' : 'Add'} samples
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

        <Track steps={['C3', null, 'C3', 'C3']}>
          <Instrument
            type="sampler"
            // samples={
            //   hasSamples
            //     ? {
            //         C3: '/snare-top-off17.wav',
            //       }
            //     : {}
            // }
            samples={{
              C3: '/snare-top-off17.wav',
            }}
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
