import React, { useState, useEffect } from 'react';
import {
  Song,
  Track,
  Instrument,
  Effect,
  StepType,
  EffectType,
  InstrumentType,
  MidiNote,
} from 'reactronica';
import './App.css';

const snareSample = '/snare-top-off17.wav';
const kickSample = '/st2_kick_one_shot_low_punch_basic.wav';

// Expands each step into two 16th-note slots (the second a rest), so a
// pattern written for an 8th-note grid keeps its original real-world length
// once the default subdivision moves to 16n.
function expandToRests(steps: StepType[]): StepType[] {
  return steps.reduce<StepType[]>((acc, step) => [...acc, step, null], []);
}

const stepPatterns: StepType[][] = [
  // Dark chords: Cm - Ab - Fm - G, a i-VI-iv-V cadence in C minor. The G
  // major triad (with its raised 7th, B) pulls back toward Cm without ever
  // landing somewhere comfortable. (Ab/Eb spelled as G#/D# - MidiNote only
  // supports sharps.)
  expandToRests([
    ['C3', 'D#3', 'G3'],
    null,
    ['G#2', 'C3', 'D#3'],
    null,
    ['F2', 'G#2', 'C3'],
    null,
    ['G2', 'B2', 'D3'],
    null,
  ]),
  // Dark arpeggio: a Cm(maj7) broken chord, up and down. The major 7th (B)
  // against the minor 3rd (D#) is what keeps it unresolved rather than sad.
  // Each note is doubled into two 16th-note slots (instead of padded with a
  // rest like the chords above) so it keeps the same real-world length while
  // still landing a real note on every 16th - that's what gives 16th-note
  // swing something to actually shift. Duration is half a 16th note so the
  // doubled notes stay short and plucky rather than blurring together.
  (['C3', 'D#3', 'G3', 'B3', 'C4', 'B3', 'G3', 'D#3'] as MidiNote[])
    .flatMap((name) => [name, name])
    .map((name) => ({
      name,
      duration: '32n',
    })),
];

const samplerPatternSteps = expandToRests([
  'C3',
  null,
  'D3',
  ['C3', { name: 'A#0' }],
]);

const effectTypes: EffectType[] = [
  'autoFilter',
  'autoPanner',
  'autoWah',
  'bitCrusher',
  'distortion',
  'feedbackDelay',
  'freeverb',
  'panVol',
  'tremolo',
  'eq3',
];

// Shared by both the step subdivision and swing subdivision dropdowns.
const subdivisions = ['4n', '8n', '16n', '8t', '16t'];

// Excludes 'sampler' - that type belongs to the dedicated sampler Track below.
const synthTypes: InstrumentType[] = [
  'amSynth',
  'duoSynth',
  'fmSynth',
  'membraneSynth',
  'metalSynth',
  'monoSynth',
  'noiseSynth',
  'pluckSynth',
  'synth',
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [samples, setSamples] = useState<object | null>(null);
  const [patternIndex, setPatternIndex] = useState(0);
  const [effectType, setEffectType] = useState<EffectType | ''>('');
  const [synthType, setSynthType] = useState<InstrumentType>('amSynth');
  const [volume, setVolume] = useState(0);
  const [swing, setSwing] = useState(0);
  const [swingSubdivision, setSwingSubdivision] = useState('8n');
  const [subdivision, setSubdivision] = useState('16n');
  const [bpm, setBpm] = useState(70);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') {
        return;
      }

      // Don't hijack Space while the user is focused on a control that
      // uses it natively (typing, adjusting a slider/select, etc).
      const target = event.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target.tagName)) {
        return;
      }

      event.preventDefault();
      setIsPlaying((playing) => !playing);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          <button
            type="button"
            onClick={() =>
              setPatternIndex((index) => (index + 1) % stepPatterns.length)
            }
          >
            Toggle pattern
          </button>
          <select
            value={synthType}
            onChange={(event) =>
              setSynthType(event.target.value as InstrumentType)
            }
          >
            {synthTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={effectType}
            onChange={(event) =>
              setEffectType(event.target.value as EffectType | '')
            }
          >
            <option value="">No effect</option>
            {effectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label>
            Tempo
            <input
              type="number"
              min={40}
              max={200}
              step={1}
              value={bpm}
              onChange={(event) => setBpm(Number(event.target.value))}
            />
          </label>
          <label>
            Volume
            <input
              type="range"
              min={-40}
              max={0}
              step={1}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
          </label>
          <label>
            Swing
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={swing}
              onChange={(event) => setSwing(Number(event.target.value))}
            />
          </label>
          <label>
            Swing subdivision
            <select
              value={swingSubdivision}
              onChange={(event) => setSwingSubdivision(event.target.value)}
            >
              {subdivisions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            Subdivision
            <select
              value={subdivision}
              onChange={(event) => setSubdivision(event.target.value)}
            >
              {subdivisions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </p>
      </header>

      <Song
        isPlaying={isPlaying}
        bpm={bpm}
        volume={volume}
        swing={swing}
        swingSubdivision={swingSubdivision}
      >
        <Track
          steps={stepPatterns[patternIndex]}
          subdivision={subdivision}
          // onStepPlay={(steps) => {
          //   console.log(steps);
          // }}
        >
          <Instrument
            type={synthType}
            // Tone's default envelope release is 1s - a voice only frees up
            // for reuse once it's fully silent, so at the arpeggio's pace
            // (a note every ~0.1s) the default polyphony gets exhausted and
            // notes get silently dropped. A short release fixes that and
            // also suits the plucky duration set on the arpeggio notes.
            envelope={{ release: 0.1 }}
          ></Instrument>
          {effectType && <Effect type={effectType} />}
        </Track>

        <Track
          steps={samples ? samplerPatternSteps : []}
          subdivision={subdivision}
        >
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
