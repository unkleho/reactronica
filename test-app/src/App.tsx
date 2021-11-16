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
  EffectType,
} from 'reactronica';
import './App.css';
import { useKeyPress } from './hooks';

// TODO: Test oscilator and envelopes

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
    steps: [
      { name: 'F3', velocity: 0.2 },
      null,
      [{ name: 'G3' }, { name: 'G2' }],
      null,
    ],
    note: 'Object notes/chords/velocity',
  },
  {
    steps: [
      'C3',
      null,
      ['G#3', 'G#2'],
      null,
      { name: 'F3', duration: 0.1 },
      null,
      // TODO: Fix this type?
      [{ name: 'G3' }, 'G2'],
      null,
    ],
    note: 'More steps, duration',
  },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [samples, setSamples] = useState<InstrumentSamples | null>(null);
  const [steps, setSteps] = useState(clips[0].steps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [synth, setSynth] = useState<InstrumentType>('synth');
  const [effect1, setEffect1] = useState<EffectType | ''>('');
  const [effect2, setEffect2] = useState<EffectType | ''>('');
  const [buffers, setBuffers] = useState<any[]>();

  useKeyPress(' ', undefined, (event) => {
    event.preventDefault();
    setIsPlaying(!isPlaying);
  });

  return (
    <div className="App">
      <h1>Reactronica Test Page</h1>
      <p>
        <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>{' '}
        currentStepIndex: {currentStepIndex}
      </p>
      <h2>Clips</h2>
      <p>
        {clips.map((clip, i) => (
          <button onClick={() => setSteps(clip.steps)} key={i}>
            {JSON.stringify(clip.steps)}
          </button>
        ))}
      </p>
      <h2>Synths</h2>
      <select
        onChange={(option) => {
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
      <h2>Effects</h2>
      <p>Freeverb don't work in Firefox</p>
      <select
        onChange={(option) => {
          setEffect1(option.target.value as EffectType);
        }}
        value={effect1}
      >
        {[{ id: '', name: 'None' }, ...config.effects].map((instrument) => (
          <option value={instrument.id} key={instrument.id}>
            {instrument.name}
          </option>
        ))}
      </select>{' '}
      <select
        onChange={(option) => {
          setEffect2(option.target.value as EffectType);
        }}
        value={effect2}
      >
        {[{ id: '', name: 'None' }, ...config.effects].map((instrument) => (
          <option value={instrument.id} key={instrument.id}>
            {instrument.name}
          </option>
        ))}
      </select>
      <h2>Sampler</h2>
      <p>
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
        </button>{' '}
        {JSON.stringify(buffers)}
      </p>
      <Song isPlaying={isPlaying} bpm={70} swing={0.5}>
        <Track
          steps={steps}
          onStepPlay={(steps, i) => {
            setCurrentStepIndex(i);
          }}
        >
          <Instrument type={synth}></Instrument>

          {effect1 && <Effect type={effect1} wet={1} />}
          {effect2 && <Effect type={effect2} wet={1} />}
        </Track>

        <Track steps={samples ? ['C3', 'D3', 'C3', 'D3'] : []}>
          <Instrument
            type="sampler"
            samples={samples || {}}
            onLoad={(buffers) => {
              setBuffers(buffers);
            }}
          ></Instrument>
        </Track>
      </Song>
    </div>
  );
}

export default App;
