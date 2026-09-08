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
  MidiNote,
  config,
} from 'reactronica';
import './App.css';

const snareSample = '/snare-top-off17.wav';
const kickSample = '/st2_kick_one_shot_low_punch_basic.wav';

// Editable drum machine grid, driving the sampler Track below. Each lane is a
// fixed MIDI note slot; which sample (if any) is loaded at that note is
// picked per-lane via a dropdown (see `drumLaneSounds` state).
const DRUM_STEP_COUNT = 16;
const DRUM_NOTES: MidiNote[] = ['C3', 'D3'];

type DrumSoundId = 'kick' | 'snare';
const DRUM_SOUNDS: { id: DrumSoundId; label: string; sample: string }[] = [
  { id: 'kick', label: 'Kick', sample: kickSample },
  { id: 'snare', label: 'Snare', sample: snareSample },
];
const DEFAULT_DRUM_LANE_SOUNDS: (DrumSoundId | '')[] = ['kick', 'snare'];

// A basic four-on-the-floor kick with a backbeat snare, so the sequencer
// makes sound immediately rather than starting silent.
const DEFAULT_DRUM_PATTERN: boolean[][] = DRUM_NOTES.map((_, laneIndex) =>
  Array.from({ length: DRUM_STEP_COUNT }, (_, stepIndex) =>
    laneIndex === 0 ? stepIndex % 8 === 0 : stepIndex % 8 === 4,
  ),
);

// Editable synth step grid, driving its own additional synth Track below -
// same style as the drum grid above, but each lane is a note of one octave
// (rendered high to low, like a piano roll) rather than a different voice.
const SYNTH_STEP_COUNT = 16;
const SYNTH_LANES: MidiNote[] = [
  'B4',
  'A#4',
  'A4',
  'G#4',
  'G4',
  'F#4',
  'F4',
  'E4',
  'D#4',
  'D4',
  'C#4',
  'C4',
];

// A darker i-VI-iv-V turnaround in C minor - Cm7, Abmaj7, Fm7, G7(b9) - one
// chord stab per beat. The minor tonic and altered dominant (5th dropped,
// b9 added) give it more tension than a major cadence; close-position
// voicings within the single available octave, so the sequencer makes sound
// immediately rather than starting silent, and loops cleanly since the V
// resolves straight back into the i. (Eb/Ab/Bb spelled as D#/G#/A# - MidiNote
// only supports sharps.)
const DEFAULT_SYNTH_CHORDS: { step: number; notes: MidiNote[] }[] = [
  { step: 0, notes: ['C4', 'D#4', 'G4', 'A#4'] }, // Cm7 (i)
  { step: 4, notes: ['G#4', 'C4', 'D#4', 'G4'] }, // Abmaj7 (VI)
  { step: 8, notes: ['F4', 'G#4', 'C4', 'D#4'] }, // Fm7 (iv)
  { step: 12, notes: ['G4', 'B4', 'F4', 'G#4'] }, // G7(b9) (V)
];
const DEFAULT_SYNTH_PATTERN: boolean[][] = SYNTH_LANES.map((note) =>
  Array.from({ length: SYNTH_STEP_COUNT }, (_, stepIndex) =>
    DEFAULT_SYNTH_CHORDS.some(
      (chord) => chord.step === stepIndex && chord.notes.includes(note),
    ),
  ),
);

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
};

const DEFAULT_INSTRUMENT_PROP_VALUES: Pick<
  InstrumentProps,
  'polyphony' | 'oscillator' | 'envelope'
> = {
  polyphony: 4,
  oscillator: undefined,
  // A longer decay/release than Tone's plucky default so the synth
  // sequencer's chord stabs ring out and overlap a little into the next
  // chord, rather than cutting off abruptly.
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.3 },
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [drumLaneSounds, setDrumLaneSounds] = useState<(DrumSoundId | '')[]>(
    DEFAULT_DRUM_LANE_SOUNDS,
  );
  const [drumPattern, setDrumPattern] = useState<boolean[][]>(
    DEFAULT_DRUM_PATTERN,
  );
  const [drumStepIndex, setDrumStepIndex] = useState<number | null>(null);
  const [synthPattern, setSynthPattern] = useState<boolean[][]>(
    DEFAULT_SYNTH_PATTERN,
  );
  const [synthStepIndex, setSynthStepIndex] = useState<number | null>(null);
  const [synthSeqType, setSynthSeqType] = useState<InstrumentType>('synth');
  const [
    synthSeqInstrumentPropValues,
    setSynthSeqInstrumentPropValues,
  ] = useState(DEFAULT_INSTRUMENT_PROP_VALUES);
  const [synthSeqEffectType, setSynthSeqEffectType] = useState<EffectType | ''>(
    '',
  );
  const [synthSeqEffectPropValues, setSynthSeqEffectPropValues] = useState(
    DEFAULT_EFFECT_PROP_VALUES,
  );
  const [synthSeqVolume, setSynthSeqVolume] = useState(-12);
  const [synthSeqPan, setSynthSeqPan] = useState(0);
  const [drumEffectType, setDrumEffectType] = useState<EffectType | ''>('');
  const [drumEffectPropValues, setDrumEffectPropValues] = useState(
    DEFAULT_EFFECT_PROP_VALUES,
  );
  const [drumVolume, setDrumVolume] = useState(0);
  const [drumPan, setDrumPan] = useState(0);
  const [volume, setVolume] = useState(0);
  const [swing, setSwing] = useState(0);
  const [swingSubdivision, setSwingSubdivision] = useState('8n');
  const [bpm, setBpm] = useState(70);

  const drumTrackSteps: StepType[] = Array.from(
    { length: DRUM_STEP_COUNT },
    (_, stepIndex) => {
      const activeNotes = DRUM_NOTES.filter(
        (_, laneIndex) => drumPattern[laneIndex][stepIndex],
      );

      if (activeNotes.length === 0) {
        return null;
      }

      return activeNotes.length === 1 ? activeNotes[0] : activeNotes;
    },
  );

  // Only lanes with a sound picked contribute a sample - an empty lane's note
  // is left unmapped, so triggering it plays nothing.
  const drumSamples: Record<string, string> = Object.fromEntries(
    DRUM_NOTES.map((note, laneIndex) => [note, drumLaneSounds[laneIndex]])
      .filter((entry): entry is [MidiNote, DrumSoundId] => entry[1] !== '')
      .map(([note, soundId]) => [
        note,
        DRUM_SOUNDS.find((sound) => sound.id === soundId)!.sample,
      ]),
  );

  function updateDrumLaneSound(laneIndex: number, soundId: DrumSoundId | '') {
    setDrumLaneSounds((prev) =>
      prev.map((current, index) => (index === laneIndex ? soundId : current)),
    );
  }

  function toggleDrumStep(laneIndex: number, stepIndex: number) {
    setDrumPattern((prev) =>
      prev.map((lane, currentLaneIndex) =>
        currentLaneIndex === laneIndex
          ? lane.map((active, laneStepIndex) =>
              laneStepIndex === stepIndex ? !active : active,
            )
          : lane,
      ),
    );
  }

  const synthTrackSteps: StepType[] = Array.from(
    { length: SYNTH_STEP_COUNT },
    (_, stepIndex) => {
      const activeNotes = SYNTH_LANES.filter(
        (_, laneIndex) => synthPattern[laneIndex][stepIndex],
      );

      if (activeNotes.length === 0) {
        return null;
      }

      return activeNotes.length === 1 ? activeNotes[0] : activeNotes;
    },
  );

  function toggleSynthStep(laneIndex: number, stepIndex: number) {
    setSynthPattern((prev) =>
      prev.map((lane, currentLaneIndex) =>
        currentLaneIndex === laneIndex
          ? lane.map((active, laneStepIndex) =>
              laneStepIndex === stepIndex ? !active : active,
            )
          : lane,
      ),
    );
  }

  const synthSeqInstrumentConfig = config.instrumentConfigs.find(
    (instrument: InstrumentConfig) => instrument.id === synthSeqType,
  );
  const synthSeqEffectConfig = synthSeqEffectType
    ? config.effectConfigs.find(
        (effect: EffectConfig) => effect.id === synthSeqEffectType,
      )
    : undefined;

  const drumEffectConfig = drumEffectType
    ? config.effectConfigs.find(
        (effect: EffectConfig) => effect.id === drumEffectType,
      )
    : undefined;

  useEffect(() => {
    if (!isPlaying) {
      setDrumStepIndex(null);
      setSynthStepIndex(null);
    }
  }, [isPlaying]);

  // Clears a selected oscillator waveform that isn't valid for the newly
  // selected instrument (e.g. switching to amSynth while 'amsine' is picked -
  // amSynth's oscillatorTypes excludes its own am- family, see config).
  useEffect(() => {
    const validTypes = synthSeqInstrumentConfig?.oscillatorTypes;
    const currentType = synthSeqInstrumentPropValues.oscillator?.type;

    if (
      currentType &&
      validTypes &&
      !(validTypes as string[]).includes(currentType)
    ) {
      setSynthSeqInstrumentPropValues((prev) => ({
        ...prev,
        oscillator: undefined,
      }));
    }
    /* eslint-disable-next-line */
  }, [synthSeqType]);

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

  function updateSynthSeqEffectProp<Key extends keyof EffectProps>(
    key: Key,
    value: EffectProps[Key],
  ) {
    setSynthSeqEffectPropValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateDrumEffectProp<Key extends keyof EffectProps>(
    key: Key,
    value: EffectProps[Key],
  ) {
    setDrumEffectPropValues((prev) => ({ ...prev, [key]: value }));
  }

  function renderEffectPropControl(
    propName: string,
    values: typeof DEFAULT_EFFECT_PROP_VALUES,
    onChange: <Key extends keyof EffectProps>(
      key: Key,
      value: EffectProps[Key],
    ) => void,
  ) {
    const propControl = EFFECT_PROP_CONTROLS[propName];

    if (!propControl) {
      return null;
    }

    const value = values[propName as keyof typeof values];

    return (
      <label key={propName} className="flex flex-col gap-1">
        {propControl.label}
        {propControl.type === 'select' ? (
          <select
            value={value as string}
            onChange={(event) =>
              onChange(
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
              onChange(
                propName as keyof EffectProps,
                Number(event.target.value) as never,
              )
            }
          />
        )}
      </label>
    );
  }

  function renderEffectParamsPanel(
    effectConfigForType: EffectConfig | undefined,
    values: typeof DEFAULT_EFFECT_PROP_VALUES,
    onChange: <Key extends keyof EffectProps>(
      key: Key,
      value: EffectProps[Key],
    ) => void,
  ) {
    if (!effectConfigForType) {
      return null;
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 w-[90vw] max-w-240 text-base text-left">
        <p className="col-span-full m-0 font-bold capitalize">
          {effectConfigForType.name} params
        </p>
        {effectConfigForType.props.map((propName: string) =>
          renderEffectPropControl(propName, values, onChange),
        )}
      </div>
    );
  }

  function renderInstrumentParamsPanel(
    instrumentConfigForType: InstrumentConfig | undefined,
    values: typeof DEFAULT_INSTRUMENT_PROP_VALUES,
    onChange: React.Dispatch<
      React.SetStateAction<typeof DEFAULT_INSTRUMENT_PROP_VALUES>
    >,
  ) {
    if (!instrumentConfigForType) {
      return null;
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 w-[90vw] max-w-240 text-base text-left">
        <p className="col-span-full m-0 font-bold capitalize">
          {instrumentConfigForType.name} params
        </p>

        {instrumentConfigForType.props.includes('polyphony') && (
          <label className="flex flex-col gap-1">
            Polyphony
            <input
              type="range"
              min={1}
              max={16}
              step={1}
              value={values.polyphony}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  polyphony: Number(event.target.value),
                }))
              }
            />
          </label>
        )}

        {instrumentConfigForType.props.includes('oscillatorType') && (
          <label className="flex flex-col gap-1">
            Oscillator type
            <select
              value={values.oscillator?.type || ''}
              onChange={(event) =>
                onChange((prev) => ({
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
              {instrumentConfigForType.oscillatorTypes?.map(
                (oscillatorType: string) => (
                  <option key={oscillatorType} value={oscillatorType}>
                    {oscillatorType}
                  </option>
                ),
              )}
            </select>
          </label>
        )}

        {instrumentConfigForType.props.includes('envelope') && (
          <>
            {(['attack', 'decay', 'sustain', 'release'] as const).map(
              (stage) => (
                <label key={stage} className="flex flex-col gap-1">
                  Envelope {stage}
                  <input
                    type="range"
                    min={0}
                    max={stage === 'sustain' ? 1 : 2}
                    step={0.01}
                    value={values.envelope![stage]}
                    onChange={(event) =>
                      onChange((prev) => ({
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
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3 bg-[#1c1f26] border-b border-white/10 text-white text-base">
        <button type="button" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <label className="flex items-center gap-2">
          Tempo
          <input
            type="number"
            min={40}
            max={200}
            step={1}
            value={bpm}
            onChange={(event) => setBpm(Number(event.target.value))}
            className="w-[60px]"
          />
        </label>
        <label className="flex items-center gap-2">
          Volume
          <input
            type="range"
            min={-40}
            max={0}
            step={1}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="w-[120px]"
          />
        </label>
        <label className="flex items-center gap-2">
          Swing
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={swing}
            onChange={(event) => setSwing(Number(event.target.value))}
            className="w-[120px]"
          />
        </label>
        <label className="flex items-center gap-2">
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
      </div>

      <div className="px-6 py-4 bg-[#20242c] border-b border-white/10 text-white text-base">
        <div className="flex flex-col gap-2 w-[90vw] max-w-240 mx-auto">
          <p className="text-left text-sm font-bold uppercase tracking-wide text-white/60">
            Drum sequencer
          </p>
          {DRUM_NOTES.map((note, laneIndex) => (
            <div key={note} className="flex items-center gap-3">
              <select
                value={drumLaneSounds[laneIndex]}
                onChange={(event) =>
                  updateDrumLaneSound(
                    laneIndex,
                    event.target.value as DrumSoundId | '',
                  )
                }
                className="w-20 shrink-0"
              >
                <option value="">—</option>
                {DRUM_SOUNDS.map((sound) => (
                  <option key={sound.id} value={sound.id}>
                    {sound.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-1">
                {drumPattern[laneIndex].map((active, stepIndex) => (
                  <button
                    key={stepIndex}
                    type="button"
                    aria-pressed={active}
                    aria-label={`Lane ${laneIndex + 1} step ${stepIndex + 1}`}
                    onClick={() => toggleDrumStep(laneIndex, stepIndex)}
                    className={[
                      'w-6 h-6 rounded',
                      active ? 'bg-[#61dafb]' : 'bg-white/10 hover:bg-white/20',
                      stepIndex === drumStepIndex ? 'ring-2 ring-white' : '',
                      stepIndex !== 0 && stepIndex % 4 === 0 ? 'ml-2' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
            <label className="flex items-center gap-2">
              Volume
              <input
                type="range"
                min={-40}
                max={6}
                step={1}
                value={drumVolume}
                onChange={(event) => setDrumVolume(Number(event.target.value))}
                className="w-[120px]"
              />
            </label>
            <label className="flex items-center gap-2">
              Pan
              <input
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={drumPan}
                onChange={(event) => setDrumPan(Number(event.target.value))}
                className="w-[120px]"
              />
            </label>
            <label className="flex items-center gap-2">
              Effect
              <select
                value={drumEffectType}
                onChange={(event) =>
                  setDrumEffectType(event.target.value as EffectType | '')
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
          </div>

          {renderEffectParamsPanel(
            drumEffectConfig,
            drumEffectPropValues,
            updateDrumEffectProp,
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-[#20242c] border-b border-white/10 text-white text-base">
        <div className="flex flex-col gap-2 w-[90vw] max-w-240 mx-auto">
          <p className="text-left text-sm font-bold uppercase tracking-wide text-white/60">
            Synth sequencer
          </p>
          {SYNTH_LANES.map((note, laneIndex) => (
            <div key={note} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-left">{note}</span>
              <div className="flex gap-1">
                {synthPattern[laneIndex].map((active, stepIndex) => (
                  <button
                    key={stepIndex}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${note} step ${stepIndex + 1}`}
                    onClick={() => toggleSynthStep(laneIndex, stepIndex)}
                    className={[
                      'w-6 h-6 rounded',
                      active ? 'bg-[#61dafb]' : 'bg-white/10 hover:bg-white/20',
                      stepIndex === synthStepIndex ? 'ring-2 ring-white' : '',
                      stepIndex !== 0 && stepIndex % 4 === 0 ? 'ml-2' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
            <label className="flex items-center gap-2">
              Synth type
              <select
                value={synthSeqType}
                onChange={(event) =>
                  setSynthSeqType(event.target.value as InstrumentType)
                }
              >
                {synthTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              Volume
              <input
                type="range"
                min={-40}
                max={6}
                step={1}
                value={synthSeqVolume}
                onChange={(event) =>
                  setSynthSeqVolume(Number(event.target.value))
                }
                className="w-[120px]"
              />
            </label>
            <label className="flex items-center gap-2">
              Pan
              <input
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={synthSeqPan}
                onChange={(event) => setSynthSeqPan(Number(event.target.value))}
                className="w-[120px]"
              />
            </label>
            <label className="flex items-center gap-2">
              Effect
              <select
                value={synthSeqEffectType}
                onChange={(event) =>
                  setSynthSeqEffectType(event.target.value as EffectType | '')
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
          </div>

          {renderInstrumentParamsPanel(
            synthSeqInstrumentConfig,
            synthSeqInstrumentPropValues,
            setSynthSeqInstrumentPropValues,
          )}

          {renderEffectParamsPanel(
            synthSeqEffectConfig,
            synthSeqEffectPropValues,
            updateSynthSeqEffectProp,
          )}
        </div>
      </div>

      <Song
        isPlaying={isPlaying}
        bpm={bpm}
        volume={volume}
        swing={swing}
        swingSubdivision={swingSubdivision}
      >
        <Track
          steps={synthTrackSteps}
          subdivision="16n"
          volume={synthSeqVolume}
          pan={synthSeqPan}
          onStepPlay={(_stepNotes: StepNoteType[], index: number) =>
            setSynthStepIndex(index)
          }
        >
          <Instrument
            type={synthSeqType}
            {...synthSeqInstrumentPropValues}
          ></Instrument>
          {synthSeqEffectType && (
            <Effect type={synthSeqEffectType} {...synthSeqEffectPropValues} />
          )}
        </Track>

        <Track
          steps={drumTrackSteps}
          subdivision="16n"
          volume={drumVolume}
          pan={drumPan}
          onStepPlay={(_stepNotes: StepNoteType[], index: number) =>
            setDrumStepIndex(index)
          }
        >
          <Instrument type="sampler" samples={drumSamples}></Instrument>
          {drumEffectType && (
            <Effect type={drumEffectType} {...drumEffectPropValues} />
          )}
        </Track>
      </Song>
    </div>
  );
}

export default App;
