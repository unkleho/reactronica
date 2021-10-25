import React, { useState } from 'react';
import {
  Song,
  Track,
  Instrument,
  StepType,
  config,
  Effect,
  InstrumentType,
  InstrumentSamples,
} from 'reactronica';
import './App.css';

const snareSample = '/snare-top-off17.wav';
const kickSample = '/st2_kick_one_shot_low_punch_basic.wav';

const clips: {
  steps: StepType[];
  note: string;
}[] = [
  {
    steps: ['C3', null, ['G#3', 'G#2'], null],
    note: 'String notes and chords',
  },
  {
    steps: [{ name: 'F3' }, null, [{ name: 'G3' }, { name: 'G2' }], null],
    note: 'Object notes and chords',
  },
  {
    steps: [
      'C3',
      null,
      ['G#3', 'G#2'],
      null,
      { name: 'F3' },
      null,
      // TODO: Fix this type?
      [{ name: 'G3' }, 'G2'],
      null,
    ],
    note: 'More steps than others',
  },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [samples, setSamples] = useState<InstrumentSamples | null>(null);
  const [steps, setSteps] = useState(clips[0].steps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [synth, setSynth] = useState<InstrumentType>('synth');

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {clips.map((clip, i) => (
            <button onClick={() => setSteps(clip.steps)} key={i}>
              {JSON.stringify(clip.steps)}
            </button>
          ))}
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
            {samples ? 'Remove' : 'Add'} drum samples
          </button>
        </p>
        <select
          onChange={(option) => {
            console.log(option.target.value);
            setSynth(option.target.value as InstrumentType);
          }}
          value={synth}
        >
          {config.instruments.map((instrument) => (
            <option value={instrument.id} key={instrument.id}>
              {instrument.name}
            </option>
          ))}
        </select>
      </header>

      <Song isPlaying={isPlaying} bpm={70} swing={0.5}>
        <Track
          steps={steps}
          onStepPlay={(steps, i) => {
            console.log(i, steps);
            setCurrentStepIndex(i);
          }}
        >
          <Instrument type={synth}></Instrument>
          {/* <Effect type="feedbackDelay" wet={1} /> */}
        </Track>

        <Track steps={samples ? ['C3', 'D3', 'C3', 'D3'] : []}>
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
