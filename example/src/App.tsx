import React, { useState, useEffect } from 'react';
import {
  Song,
  Track,
  Instrument,
  Effect,
  StepType,
  StepNoteType,
  EffectType,
  EffectProps,
  EffectConfig,
  InstrumentType,
  InstrumentProps,
  InstrumentConfig,
  InstrumentFilterType,
  InstrumentFilterRolloff,
  instrumentFilterTypes,
  instrumentFilterRolloffs,
  MidiNote,
  config,
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

// Dark chords: Cm - Ab - Fm - G, a i-VI-iv-V cadence in C minor. The G major
// triad (with its raised 7th, B) pulls back toward Cm without ever landing
// somewhere comfortable. (Ab/Eb spelled as G#/D# - MidiNote only supports
// sharps.)
const chordSteps = expandToRests([
  ['C3', 'D#3', 'G3'],
  null,
  ['G#2', 'C3', 'D#3'],
  null,
  ['F2', 'G#2', 'C3'],
  null,
  ['G2', 'B2', 'D3'],
  null,
]);

// Dark arpeggio: a Cm(maj7) broken chord, up and down. The major 7th (B)
// against the minor 3rd (D#) is what keeps it unresolved rather than sad.
// Each note is doubled into two 16th-note slots (instead of padded with a
// rest like the chords above) so it keeps the same real-world length while
// still landing a real note on every 16th - that's what gives 16th-note
// swing something to actually shift. Duration is half a 16th note so the
// doubled notes stay short and plucky rather than blurring together.
//
// When manualDelay is on, the off-beat (second) note of each doubled pair
// gets a `delay` instead - a per-note alternative to Song's global `swing`
// prop, so it can be compared against (or combined with) the swing slider.
function buildArpeggioSteps(manualDelay: boolean) {
  return (['C3', 'D#3', 'G3', 'B3', 'C4', 'B3', 'G3', 'D#3'] as MidiNote[])
    .flatMap((name) => [name, name])
    .map((name, index) => ({
      name,
      duration: '32n',
      ...(manualDelay && index % 2 === 1 ? { delay: '64n' } : {}),
    }));
}

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
  'chebyshev',
  'distortion',
  'feedbackDelay',
  'freeverb',
  'frequencyShifter',
  'jcReverb',
  'panVol',
  'phaser',
  'pingPongDelay',
  'pitchShift',
  'stereoWidener',
  'tremolo',
  'vibrato',
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

type RangeControl = {
  type: 'range';
  label: string;
  min: number;
  max: number;
  step: number;
};

type SelectControl = {
  type: 'select';
  label: string;
  options: string[];
};

/**
 * How to render each <Effect /> prop that config.effectConfigs lists as
 * applicable to a given effect type - every EffectConfigProp maps to a
 * single numeric or enum value, unlike <Instrument />'s 'envelope' and
 * 'oscillatorType', which are nested/dynamic and rendered inline below
 * instead of through this generic map.
 */
const EFFECT_PROP_CONTROLS: Record<string, RangeControl | SelectControl> = {
  wet: { type: 'range', label: 'Wet', min: 0, max: 1, step: 0.01 },
  frequency: {
    type: 'range',
    label: 'Frequency (Hz)',
    min: 0.1,
    max: 20,
    step: 0.1,
  },
  depth: { type: 'range', label: 'Depth', min: 0, max: 1, step: 0.01 },
  lfoType: {
    type: 'select',
    label: 'LFO type',
    options: ['sine', 'square', 'triangle', 'sawtooth'],
  },
  baseFrequency: {
    type: 'range',
    label: 'Base frequency (Hz)',
    min: 20,
    max: 2000,
    step: 10,
  },
  octaves: { type: 'range', label: 'Octaves', min: 0.5, max: 8, step: 0.5 },
  sensitivity: {
    type: 'range',
    label: 'Sensitivity (dB)',
    min: -40,
    max: 0,
    step: 1,
  },
  Q: { type: 'range', label: 'Q', min: 0.1, max: 20, step: 0.1 },
  bits: { type: 'range', label: 'Bits', min: 1, max: 16, step: 1 },
  distortion: {
    type: 'range',
    label: 'Distortion',
    min: 0,
    max: 1,
    step: 0.01,
  },
  feedback: { type: 'range', label: 'Feedback', min: 0, max: 1, step: 0.01 },
  delayTime: { type: 'select', label: 'Delay time', options: subdivisions },
  roomSize: { type: 'range', label: 'Room size', min: 0, max: 1, step: 0.01 },
  dampening: {
    type: 'range',
    label: 'Dampening (Hz)',
    min: 100,
    max: 8000,
    step: 100,
  },
  spread: { type: 'range', label: 'Spread (deg)', min: 0, max: 180, step: 1 },
  pan: { type: 'range', label: 'Pan', min: -1, max: 1, step: 0.01 },
  volume: { type: 'range', label: 'Volume (dB)', min: -40, max: 6, step: 1 },
  low: { type: 'range', label: 'Low (dB)', min: -24, max: 24, step: 1 },
  mid: { type: 'range', label: 'Mid (dB)', min: -24, max: 24, step: 1 },
  high: { type: 'range', label: 'High (dB)', min: -24, max: 24, step: 1 },
  lowFrequency: {
    type: 'range',
    label: 'Low frequency (Hz)',
    min: 20,
    max: 2000,
    step: 10,
  },
  highFrequency: {
    type: 'range',
    label: 'High frequency (Hz)',
    min: 1000,
    max: 10000,
    step: 100,
  },
  stages: { type: 'range', label: 'Stages', min: 1, max: 24, step: 1 },
  width: { type: 'range', label: 'Width', min: 0, max: 1, step: 0.01 },
  order: { type: 'range', label: 'Order', min: 1, max: 100, step: 1 },
  pitch: {
    type: 'range',
    label: 'Pitch (semitones)',
    min: -24,
    max: 24,
    step: 1,
  },
  windowSize: {
    type: 'range',
    label: 'Window size (s)',
    min: 0.01,
    max: 0.1,
    step: 0.01,
  },
};

const DEFAULT_EFFECT_PROP_VALUES: Omit<EffectProps, 'type' | 'id'> = {
  wet: 1,
  frequency: 1,
  depth: 1,
  lfoType: 'sine',
  baseFrequency: 200,
  octaves: 3,
  sensitivity: 0,
  Q: 2,
  bits: 4,
  distortion: 0.5,
  feedback: 0.5,
  delayTime: '8n',
  roomSize: 0.7,
  dampening: 3000,
  spread: 180,
  pan: 0,
  volume: 0,
  low: 0,
  mid: 0,
  high: 0,
  lowFrequency: 400,
  highFrequency: 2500,
  stages: 10,
  width: 0.5,
  // Tone's own default (1) means "no change" for Chebyshev - a higher
  // order so the effect is actually audible as soon as it's selected.
  order: 50,
  pitch: 0,
  windowSize: 0.1,
};

const DEFAULT_INSTRUMENT_PROP_VALUES: Pick<
  InstrumentProps,
  | 'polyphony'
  | 'oscillator'
  | 'envelope'
  | 'filter'
  | 'filterEnvelope'
  | 'harmonicity'
  | 'modulationIndex'
  | 'resonance'
  | 'octaves'
  | 'attackNoise'
  | 'dampening'
> = {
  polyphony: 4,
  oscillator: undefined,
  // Tone's default release is 1s - a voice only frees up for reuse once
  // it's fully silent, so at the arpeggio's pace (a note every ~0.1s) the
  // default polyphony gets exhausted and notes get silently dropped. This
  // short release fixes that and suits the plucky arpeggio note duration -
  // moved here (from a hardcoded prop) now that envelope is user-adjustable.
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 },
  filter: undefined,
  filterEnvelope: undefined,
  // Matches Tone.MetalSynth's own defaults, so selecting it sounds the same
  // as before these became adjustable.
  harmonicity: 5.1,
  modulationIndex: 32,
  // resonance means something different for metalSynth (a filter cutoff in
  // Hz) vs pluckSynth (a 0-1 sustain amount) - this starting value matches
  // metalSynth's own default; switching synthType resets it, see below.
  resonance: 4000,
  octaves: 1.5,
  attackNoise: 1,
  dampening: 4000,
};

/**
 * How to render each simple scalar <Instrument /> prop - config.instrumentConfigs
 * lists which of these apply to a given instrument type. 'filter'/'filterEnvelope'
 * are nested/dynamic like 'envelope'/'oscillatorType', and rendered inline
 * instead of through this map.
 */
const INSTRUMENT_PROP_CONTROLS: Record<string, RangeControl> = {
  harmonicity: {
    type: 'range',
    label: 'Harmonicity',
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  modulationIndex: {
    type: 'range',
    label: 'Modulation index',
    min: 1,
    max: 50,
    step: 1,
  },
  octaves: { type: 'range', label: 'Octaves', min: 0.1, max: 4, step: 0.1 },
  attackNoise: {
    type: 'range',
    label: 'Attack noise',
    min: 0.1,
    max: 20,
    step: 0.1,
  },
  dampening: {
    type: 'range',
    label: 'Dampening (Hz)',
    min: 0,
    max: 7000,
    step: 100,
  },
};

/**
 * resonance's own control isn't in the static map above - metalSynth reads it
 * as a filter cutoff in Hz, pluckSynth as a 0-1 sustain amount, so the slider's
 * range has to follow whichever instrument is currently selected.
 */
function getResonanceControl(synthType: InstrumentType): RangeControl {
  return synthType === 'pluckSynth'
    ? { type: 'range', label: 'Resonance', min: 0, max: 1, step: 0.01 }
    : {
        type: 'range',
        label: 'Resonance (Hz)',
        min: 100,
        max: 7000,
        step: 100,
      };
}

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
  const [manualDelay, setManualDelay] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [instrumentPropValues, setInstrumentPropValues] = useState(
    DEFAULT_INSTRUMENT_PROP_VALUES,
  );
  const [effectPropValues, setEffectPropValues] = useState(
    DEFAULT_EFFECT_PROP_VALUES,
  );

  const stepPatterns: StepType[][] = [
    chordSteps,
    buildArpeggioSteps(manualDelay),
  ];

  const instrumentConfig = config.instrumentConfigs.find(
    (instrument: InstrumentConfig) => instrument.id === synthType,
  );
  const effectConfig = effectType
    ? config.effectConfigs.find(
        (effect: EffectConfig) => effect.id === effectType,
      )
    : undefined;

  useEffect(() => {
    if (!isPlaying) {
      setCurrentStepIndex(null);
    }
  }, [isPlaying]);

  // Clears a selected oscillator waveform that isn't valid for the newly
  // selected instrument (e.g. switching to amSynth while 'amsine' is picked -
  // amSynth's oscillatorTypes excludes its own am- family, see config).
  useEffect(() => {
    const validTypes = instrumentConfig?.oscillatorTypes;
    const currentType = instrumentPropValues.oscillator?.type;

    if (
      currentType &&
      validTypes &&
      !(validTypes as string[]).includes(currentType)
    ) {
      setInstrumentPropValues((prev) => ({ ...prev, oscillator: undefined }));
    }
    /* eslint-disable-next-line */
  }, [synthType]);

  // resonance has a wildly different valid range depending on the type -
  // reset it to a sensible starting point for whichever one was just
  // selected, instead of carrying over a value from the other range.
  useEffect(() => {
    if (synthType === 'metalSynth') {
      setInstrumentPropValues((prev) => ({ ...prev, resonance: 4000 }));
    } else if (synthType === 'pluckSynth') {
      setInstrumentPropValues((prev) => ({ ...prev, resonance: 0.7 }));
    }
  }, [synthType]);

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

  function updateEffectProp<Key extends keyof EffectProps>(
    key: Key,
    value: EffectProps[Key],
  ) {
    setEffectPropValues((prev) => ({ ...prev, [key]: value }));
  }

  function renderEffectPropControl(propName: string) {
    const propControl = EFFECT_PROP_CONTROLS[propName];

    if (!propControl) {
      return null;
    }

    const value = effectPropValues[propName as keyof typeof effectPropValues];

    return (
      <label key={propName}>
        {propControl.label}
        {propControl.type === 'select' ? (
          <select
            value={value as string}
            onChange={(event) =>
              updateEffectProp(
                propName as keyof EffectProps,
                event.target.value as never,
              )
            }
          >
            {propControl.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="range"
            min={propControl.min}
            max={propControl.max}
            step={propControl.step}
            value={value as number}
            onChange={(event) =>
              updateEffectProp(
                propName as keyof EffectProps,
                Number(event.target.value) as never,
              )
            }
          />
        )}
      </label>
    );
  }

  function updateInstrumentProp<Key extends keyof InstrumentProps>(
    key: Key,
    value: InstrumentProps[Key],
  ) {
    setInstrumentPropValues((prev) => ({ ...prev, [key]: value }));
  }

  function renderInstrumentPropControl(propName: string) {
    const propControl =
      propName === 'resonance'
        ? getResonanceControl(synthType)
        : INSTRUMENT_PROP_CONTROLS[propName];

    if (!propControl) {
      return null;
    }

    const value =
      instrumentPropValues[propName as keyof typeof instrumentPropValues];

    return (
      <label key={propName}>
        {propControl.label}
        <input
          type="range"
          min={propControl.min}
          max={propControl.max}
          step={propControl.step}
          value={value as number}
          onChange={(event) =>
            updateInstrumentProp(
              propName as keyof InstrumentProps,
              Number(event.target.value) as never,
            )
          }
        />
      </label>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React + Reactronica!</p>
        <div className="controls">
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
          <label>
            Synth type
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
          </label>
          <label>
            Effect
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
          </label>
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
            Manual delay (arpeggio, per-note)
            <input
              type="checkbox"
              checked={manualDelay}
              onChange={(event) => setManualDelay(event.target.checked)}
            />
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
        </div>

        {instrumentConfig && (
          <div className="controls">
            <p className="controls-heading">{instrumentConfig.name} params</p>

            {instrumentConfig.props.includes('polyphony') && (
              <label>
                Polyphony
                <input
                  type="range"
                  min={1}
                  max={16}
                  step={1}
                  value={instrumentPropValues.polyphony}
                  onChange={(event) =>
                    setInstrumentPropValues((prev) => ({
                      ...prev,
                      polyphony: Number(event.target.value),
                    }))
                  }
                />
              </label>
            )}

            {instrumentConfig.props.includes('oscillatorType') && (
              <label>
                Oscillator type
                <select
                  value={instrumentPropValues.oscillator?.type || ''}
                  onChange={(event) =>
                    setInstrumentPropValues((prev) => ({
                      ...prev,
                      oscillator: event.target.value
                        ? // Cast needed since InstrumentOscillator is a
                          // discriminated union keyed on `type` with params
                          // specific to each waveform family (e.g. `count`
                          // only applies to fat* types) - not expressible
                          // from a single flat <select>.
                          ({
                            type: event.target.value,
                          } as InstrumentProps['oscillator'])
                        : undefined,
                    }))
                  }
                >
                  <option value="">(instrument default)</option>
                  {instrumentConfig.oscillatorTypes?.map(
                    (oscillatorType: string) => (
                      <option key={oscillatorType} value={oscillatorType}>
                        {oscillatorType}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}

            {instrumentConfig.props.includes('envelope') && (
              <>
                {(['attack', 'decay', 'sustain', 'release'] as const).map(
                  (stage) => (
                    <label key={stage}>
                      Envelope {stage}
                      <input
                        type="range"
                        min={0}
                        max={stage === 'sustain' ? 1 : 2}
                        step={0.01}
                        value={instrumentPropValues.envelope![stage]}
                        onChange={(event) =>
                          setInstrumentPropValues((prev) => ({
                            ...prev,
                            envelope: {
                              ...prev.envelope,
                              [stage]: Number(event.target.value),
                            },
                          }))
                        }
                      />
                    </label>
                  ),
                )}
              </>
            )}

            {instrumentConfig.props.includes('filter') && (
              <>
                <label>
                  Filter type
                  <select
                    value={instrumentPropValues.filter?.type || ''}
                    onChange={(event) =>
                      setInstrumentPropValues((prev) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          type:
                            (event.target.value as InstrumentFilterType) ||
                            undefined,
                        },
                      }))
                    }
                  >
                    <option value="">(instrument default)</option>
                    {instrumentFilterTypes.map((filterType) => (
                      <option key={filterType} value={filterType}>
                        {filterType}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Filter frequency (Hz)
                  <input
                    type="range"
                    min={20}
                    max={5000}
                    step={10}
                    value={instrumentPropValues.filter?.frequency ?? 350}
                    onChange={(event) =>
                      setInstrumentPropValues((prev) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          frequency: Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>
                <label>
                  Filter Q
                  <input
                    type="range"
                    min={0.1}
                    max={20}
                    step={0.1}
                    value={instrumentPropValues.filter?.Q ?? 1}
                    onChange={(event) =>
                      setInstrumentPropValues((prev) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          Q: Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>
                <label>
                  Filter rolloff (dB/oct)
                  <select
                    value={instrumentPropValues.filter?.rolloff ?? -12}
                    onChange={(event) =>
                      setInstrumentPropValues((prev) => ({
                        ...prev,
                        filter: {
                          ...prev.filter,
                          rolloff: Number(
                            event.target.value,
                          ) as InstrumentFilterRolloff,
                        },
                      }))
                    }
                  >
                    {instrumentFilterRolloffs.map((rolloff) => (
                      <option key={rolloff} value={rolloff}>
                        {rolloff}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {instrumentConfig.props.includes('filterEnvelope') && (
              <>
                {(['attack', 'decay', 'sustain', 'release'] as const).map(
                  (stage) => (
                    <label key={`filterEnvelope-${stage}`}>
                      Filter envelope {stage}
                      <input
                        type="range"
                        min={0}
                        max={stage === 'sustain' ? 1 : 2}
                        step={0.01}
                        value={
                          instrumentPropValues.filterEnvelope?.[stage] ?? 0
                        }
                        onChange={(event) =>
                          setInstrumentPropValues((prev) => ({
                            ...prev,
                            filterEnvelope: {
                              ...prev.filterEnvelope,
                              [stage]: Number(event.target.value),
                            },
                          }))
                        }
                      />
                    </label>
                  ),
                )}
                <label>
                  Filter envelope base frequency (Hz)
                  <input
                    type="range"
                    min={20}
                    max={2000}
                    step={10}
                    value={
                      instrumentPropValues.filterEnvelope?.baseFrequency ?? 200
                    }
                    onChange={(event) =>
                      setInstrumentPropValues((prev) => ({
                        ...prev,
                        filterEnvelope: {
                          ...prev.filterEnvelope,
                          baseFrequency: Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>
                <label>
                  Filter envelope octaves
                  <input
                    type="range"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={instrumentPropValues.filterEnvelope?.octaves ?? 4}
                    onChange={(event) =>
                      setInstrumentPropValues((prev) => ({
                        ...prev,
                        filterEnvelope: {
                          ...prev.filterEnvelope,
                          octaves: Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>
              </>
            )}

            {instrumentConfig.props.map((propName: string) =>
              renderInstrumentPropControl(propName),
            )}
          </div>
        )}

        {effectConfig && (
          <div className="controls">
            <p className="controls-heading">{effectConfig.name} params</p>
            {effectConfig.props.map((propName: string) =>
              renderEffectPropControl(propName),
            )}
          </div>
        )}

        <div className="step-indicator">
          {stepPatterns[patternIndex].map((step, index) => (
            <span
              key={index}
              className={[
                'step-dot',
                step === null && 'step-dot--rest',
                index === currentStepIndex && 'step-dot--active',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          ))}
        </div>
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
          onStepPlay={(_stepNotes: StepNoteType[], index: number) =>
            setCurrentStepIndex(index)
          }
        >
          <Instrument type={synthType} {...instrumentPropValues}></Instrument>
          {effectType && <Effect type={effectType} {...effectPropValues} />}
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
