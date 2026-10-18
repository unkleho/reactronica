import React, { useState, useRef, useEffect } from 'react';
import { Chord, Note, Interval, Scale } from 'tonal';
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
  InstrumentConfig,
  MidiNote,
  config,
} from 'reactronica';
import './App.css';
import { subdivisions, DEFAULT_EFFECT_PROP_VALUES } from './effectControls';
import DrumControls from './DrumControls';
import SynthControls from './SynthControls';
import { DEFAULT_INSTRUMENT_PROP_VALUES } from './instrumentDefaults';
import StepSequencer from './StepSequencer';
import ChordSlotInput from './ChordSlotInput';
import Icon from './Icon';

const snareSample = '/snare-top-off17.wav';
const kickSample = '/st2_kick_one_shot_low_punch_basic.wav';
const hatSample = '/chh2.wav';

// Every drum part shares this fixed lane layout - which sample (if any) is
// loaded at each lane is picked per-lane via a dropdown (see `laneSounds` on
// DrumPart below).
const DRUM_STEP_COUNT = 16;
const DRUM_NOTES: MidiNote[] = ['C3', 'D3', 'E3'];

type DrumSoundId = 'kick' | 'snare' | 'hat';
const DRUM_SOUNDS: { id: DrumSoundId; label: string; sample: string }[] = [
  { id: 'kick', label: 'Kick', sample: kickSample },
  { id: 'snare', label: 'Snare', sample: snareSample },
  { id: 'hat', label: 'Hat', sample: hatSample },
];
const DEFAULT_DRUM_LANE_SOUNDS: (DrumSoundId | '')[] = ['kick', 'snare', 'hat'];

// A basic four-on-the-floor kick with a backbeat snare and steady eighth-note
// hats, so the sequencer makes sound immediately rather than starting silent.
const DEFAULT_DRUM_PATTERN: boolean[][] = DRUM_NOTES.map((_, laneIndex) =>
  Array.from({ length: DRUM_STEP_COUNT }, (_, stepIndex) => {
    if (laneIndex === 0) {
      return stepIndex % 8 === 0;
    }

    if (laneIndex === 1) {
      return stepIndex % 8 === 4;
    }

    return stepIndex % 2 === 0;
  }),
);

// Every synth part shares this fixed lane layout - one octave, rendered high
// to low like a piano roll.
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

function createEmptyPattern(laneCount: number, stepCount: number): boolean[][] {
  return Array.from({ length: laneCount }, () =>
    Array.from({ length: stepCount }, () => false),
  );
}

// Sharp-only spelling to match MidiNote, indexed by Tonal's pitch chroma
// (0 = C, 1 = C#, ... 11 = B) - sidesteps flat vs sharp spelling entirely,
// since a chord like Abmaj7 comes back from Tonal as ["Ab", "C", "Eb", "G"].
const CHROMATIC_SHARP_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

// Looks up a chord symbol (e.g. "Cm7", "G7b9") via Tonal and folds its notes
// onto the synth sequencer's fixed single-octave lane layout. An unrecognised
// symbol resolves to no notes rather than throwing.
function chordSymbolToLaneNotes(symbol: string): MidiNote[] {
  return Chord.get(symbol).notes.map(
    (pitchClass) =>
      `${CHROMATIC_SHARP_NAMES[Note.chroma(pitchClass)]}4` as MidiNote,
  );
}

// Spreads a chord progression evenly across the pattern's steps - one stab
// per chord, not sustained - and loops cleanly since the last chord leads
// back into the first on repeat.
function buildChordProgressionPattern(
  chordSymbols: string[],
  stepCount: number,
): boolean[][] {
  const pattern = createEmptyPattern(SYNTH_LANES.length, stepCount);

  if (chordSymbols.length === 0) {
    return pattern;
  }

  const stepsPerChord = Math.max(
    1,
    Math.floor(stepCount / chordSymbols.length),
  );

  chordSymbols.forEach((symbol, chordIndex) => {
    const stepIndex = chordIndex * stepsPerChord;

    if (stepIndex >= stepCount) {
      return;
    }

    chordSymbolToLaneNotes(symbol).forEach((note) => {
      const laneIndex = SYNTH_LANES.indexOf(note);

      if (laneIndex !== -1) {
        pattern[laneIndex][stepIndex] = true;
      }
    });
  });

  return pattern;
}

// A darker i-VI-iv-V turnaround in C minor - the minor tonic and altered
// dominant (5th dropped, b9 added) give it more tension than a major
// cadence, and it loops cleanly since the V resolves straight back into the i.
const DEFAULT_SYNTH_CHORD_PROGRESSION = ['Cm7', 'Abmaj7', 'Fm7', 'G7b9'];
const DEFAULT_SYNTH_PATTERN: boolean[][] = buildChordProgressionPattern(
  DEFAULT_SYNTH_CHORD_PROGRESSION,
  SYNTH_STEP_COUNT,
);

// The synth sequencer is split into four chord slots (one text box each,
// above the grid) - each spanning an equal share of the steps, anchored at
// its first step.
const CHORD_SLOT_COUNT = 4;
const STEPS_PER_CHORD_SLOT = SYNTH_STEP_COUNT / CHORD_SLOT_COUNT;

function chordSlotAnchorStep(slotIndex: number): number {
  return slotIndex * STEPS_PER_CHORD_SLOT;
}

// The reverse of chordSymbolToLaneNotes - given the notes actually active in
// the sequencer (e.g. after the user toggles a step by hand), names the
// chord they form so a chord slot's input can stay in sync either way.
//
// Chord.detect treats the first note it's given as the assumed bass, so the
// same set of notes can come back as a plain chord or a slash chord purely
// based on incidental ordering - and SYNTH_LANES lists lanes high-to-low for
// display, not root-first. Sorting by actual pitch first means the note
// Chord.detect assumes is the bass really is the lowest-sounding one, which
// at least gives a consistent, principled answer (though since every chord
// here is voiced within one fixed octave, a chord's tones don't always land
// with its true root as the lowest note - so an inversion can still surface
// as an enharmonic alternative rather than the exact symbol typed in).
function detectChordLabel(notes: MidiNote[]): string {
  if (notes.length === 0) {
    return '';
  }

  const sortedByPitch = [...notes].sort(
    (a, b) => Note.midi(a)! - Note.midi(b)!,
  );
  const [bestMatch] = Chord.detect(
    sortedByPitch.map((note) => Note.pitchClass(note)),
  );

  return bestMatch ?? '';
}

// Every root, major and minor - e.g. "C", "Cm", "C#", "C#m", ... - offered by
// the header's Key select.
const KEYS = CHROMATIC_SHARP_NAMES.flatMap((root) => [root, `${root}m`]);

// A classic ii-V-I-vi turnaround, used as the seed progression for new synth
// parts when the selected key is major.
const MAJOR_KEY_PROGRESSION = ['Dm7', 'G7', 'Cmaj7', 'Am7'];

function parseKey(key: string): { root: string; isMinor: boolean } {
  const isMinor = key.endsWith('m');
  return { root: isMinor ? key.slice(0, -1) : key, isMinor };
}

// Both canonical progressions above are written in C (major/minor) - this
// transposes whichever one applies onto the selected key's root, so e.g.
// picking "Gm" yields the same darker turnaround shape a fifth up.
function progressionForKey(key: string): string[] {
  const { root, isMinor } = parseKey(key);
  const baseProgression = isMinor
    ? DEFAULT_SYNTH_CHORD_PROGRESSION
    : MAJOR_KEY_PROGRESSION;
  const interval = Interval.distance('C', root);

  return baseProgression.map((chordSymbol) =>
    Chord.transpose(chordSymbol, interval),
  );
}

// Chromas (0-11) of every note in the selected key's scale - used to
// highlight the synth sequencer's in-key lanes.
function scaleChromasForKey(key: string): Set<number> {
  const { root, isMinor } = parseKey(key);

  return new Set(
    Scale.get(`${root} ${isMinor ? 'minor' : 'major'}`).notes.map((note) =>
      Note.chroma(note),
    ),
  );
}

type PartKind = 'drum' | 'synth';

interface PartBase {
  id: string;
  name: string;
  pattern: boolean[][];
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  effectType: EffectType | '';
  effectPropValues: typeof DEFAULT_EFFECT_PROP_VALUES;
}

interface DrumPart extends PartBase {
  kind: 'drum';
  laneSounds: (DrumSoundId | '')[];
}

interface SynthPart extends PartBase {
  kind: 'synth';
  instrumentType: InstrumentType;
  instrumentPropValues: typeof DEFAULT_INSTRUMENT_PROP_VALUES;
}

type Part = DrumPart | SynthPart;

// Every Track is driven by a fixed lane layout (drum lanes or a synth
// octave), so the note->StepType folding logic is shared across kinds -
// only which lane list is passed in differs.
function computeTrackSteps(
  lanes: MidiNote[],
  pattern: boolean[][],
): StepType[] {
  const stepCount = pattern[0]?.length ?? 0;

  return Array.from({ length: stepCount }, (_, stepIndex) => {
    const activeNotes = lanes.filter(
      (_, laneIndex) => pattern[laneIndex][stepIndex],
    );

    if (activeNotes.length === 0) {
      return null;
    }

    return activeNotes.length === 1 ? activeNotes[0] : activeNotes;
  });
}

// Only lanes with a sound picked contribute a sample - an empty lane's note
// is left unmapped, so triggering it plays nothing.
function computeDrumSamples(
  laneSounds: (DrumSoundId | '')[],
): Record<string, string> {
  return Object.fromEntries(
    DRUM_NOTES.map((note, laneIndex) => [note, laneSounds[laneIndex]])
      .filter((entry): entry is [MidiNote, DrumSoundId] => entry[1] !== '')
      .map(([note, soundId]) => [
        note,
        DRUM_SOUNDS.find((sound) => sound.id === soundId)!.sample,
      ]),
  );
}

const DEFAULT_PARTS: Part[] = [
  {
    id: 'part-1',
    kind: 'drum',
    name: 'Drum 1',
    laneSounds: DEFAULT_DRUM_LANE_SOUNDS,
    pattern: DEFAULT_DRUM_PATTERN,
    volume: 0,
    pan: 0,
    muted: false,
    soloed: false,
    effectType: '',
    effectPropValues: DEFAULT_EFFECT_PROP_VALUES,
  },
  {
    id: 'part-2',
    kind: 'synth',
    name: 'Synth 1',
    pattern: DEFAULT_SYNTH_PATTERN,
    instrumentType: 'synth',
    instrumentPropValues: DEFAULT_INSTRUMENT_PROP_VALUES,
    volume: -12,
    pan: 0,
    muted: false,
    soloed: false,
    effectType: '',
    effectPropValues: DEFAULT_EFFECT_PROP_VALUES,
  },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [parts, setParts] = useState<Part[]>(DEFAULT_PARTS);
  const [selectedPartId, setSelectedPartId] = useState('part-1');
  const [stepIndexes, setStepIndexes] = useState<Record<string, number | null>>(
    {},
  );
  const [collapsedPartIds, setCollapsedPartIds] = useState<Set<string>>(
    new Set(),
  );
  const [chordSlotLabels, setChordSlotLabels] = useState<
    Record<string, string[]>
  >({ 'part-2': DEFAULT_SYNTH_CHORD_PROGRESSION });
  const nextPartNumberRef = useRef(3);

  const [volume, setVolume] = useState(0);
  const [swing, setSwing] = useState(0);
  const [swingSubdivision, setSwingSubdivision] = useState('8n');
  const [bpm, setBpm] = useState(70);
  const [songKey, setSongKey] = useState('Cm');

  function updatePart(id: string, updater: (part: Part) => Part) {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? updater(part) : part)),
    );
  }

  function addPart(kind: PartKind) {
    const id = `part-${nextPartNumberRef.current++}`;
    const countOfKind = parts.filter((part) => part.kind === kind).length;
    const name = `${kind === 'drum' ? 'Drum' : 'Synth'} ${countOfKind + 1}`;

    const newPart: Part =
      kind === 'drum'
        ? {
            id,
            kind: 'drum',
            name,
            laneSounds: DEFAULT_DRUM_LANE_SOUNDS,
            pattern: createEmptyPattern(DRUM_NOTES.length, DRUM_STEP_COUNT),
            volume: 0,
            pan: 0,
            muted: false,
            soloed: false,
            effectType: '',
            effectPropValues: DEFAULT_EFFECT_PROP_VALUES,
          }
        : {
            id,
            kind: 'synth',
            name,
            pattern: buildChordProgressionPattern(
              progressionForKey(songKey),
              SYNTH_STEP_COUNT,
            ),
            instrumentType: 'synth',
            instrumentPropValues: DEFAULT_INSTRUMENT_PROP_VALUES,
            volume: -12,
            pan: 0,
            muted: false,
            soloed: false,
            effectType: '',
            effectPropValues: DEFAULT_EFFECT_PROP_VALUES,
          };

    if (kind === 'synth') {
      setChordSlotLabels((prev) => ({
        ...prev,
        [id]: progressionForKey(songKey),
      }));
    }

    setParts((prev) => [...prev, newPart]);
    setSelectedPartId(id);
  }

  function removePart(id: string) {
    setParts((prev) => prev.filter((part) => part.id !== id));
    setStepIndexes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setChordSlotLabels((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedPartId((prev) => {
      if (prev !== id) {
        return prev;
      }

      const remaining = parts.filter((part) => part.id !== id);
      return remaining[0]?.id ?? '';
    });
  }

  // Typing a chord symbol into a slot writes its notes into the pattern at
  // that slot's anchor step - the reverse of detectChordLabel, which keeps
  // the slot's displayed text in sync when the notes change some other way
  // (manual step toggles below).
  function commitChordSlot(id: string, slotIndex: number, chordSymbol: string) {
    setChordSlotLabels((prev) => {
      const labels = [...(prev[id] ?? Array(CHORD_SLOT_COUNT).fill(''))];
      labels[slotIndex] = chordSymbol;
      return { ...prev, [id]: labels };
    });

    const laneNotes = new Set(chordSymbolToLaneNotes(chordSymbol));

    if (laneNotes.size === 0) {
      return;
    }

    const stepIndex = chordSlotAnchorStep(slotIndex);

    updatePart(id, (part) =>
      part.kind === 'synth'
        ? {
            ...part,
            pattern: part.pattern.map((lane, laneIndex) =>
              lane.map((active, currentStepIndex) =>
                currentStepIndex === stepIndex
                  ? laneNotes.has(SYNTH_LANES[laneIndex])
                  : active,
              ),
            ),
          }
        : part,
    );
  }

  function togglePartStep(id: string, laneIndex: number, stepIndex: number) {
    const part = parts.find((candidate) => candidate.id === id);

    if (!part) {
      return;
    }

    const nextPattern = part.pattern.map((lane, currentLaneIndex) =>
      currentLaneIndex === laneIndex
        ? lane.map((active, laneStepIndex) =>
            laneStepIndex === stepIndex ? !active : active,
          )
        : lane,
    );

    updatePart(id, (current) => ({ ...current, pattern: nextPattern }));

    // Only a slot's own anchor step defines its chord - toggling any other
    // step doesn't change what that slot represents, so leave every other
    // slot's label untouched (recomputing them all here would spuriously
    // re-label chords whose notes never actually changed - Chord.detect can
    // pick a different, enharmonically-equivalent name for the exact same
    // notes on every call, see detectChordLabel).
    if (part.kind !== 'synth' || stepIndex % STEPS_PER_CHORD_SLOT !== 0) {
      return;
    }

    const activeNotes = SYNTH_LANES.filter(
      (_, currentLaneIndex) => nextPattern[currentLaneIndex][stepIndex],
    );
    const slotIndex = stepIndex / STEPS_PER_CHORD_SLOT;

    setChordSlotLabels((prev) => {
      const labels = [...(prev[id] ?? Array(CHORD_SLOT_COUNT).fill(''))];
      labels[slotIndex] = detectChordLabel(activeNotes);
      return { ...prev, [id]: labels };
    });
  }

  function updateDrumLaneSound(
    id: string,
    laneIndex: number,
    soundId: DrumSoundId | '',
  ) {
    updatePart(id, (part) =>
      part.kind === 'drum'
        ? {
            ...part,
            laneSounds: part.laneSounds.map((current, index) =>
              index === laneIndex ? soundId : current,
            ),
          }
        : part,
    );
  }

  // Clears a selected oscillator waveform that isn't valid for the newly
  // selected instrument (e.g. switching to amSynth while 'amsine' is picked -
  // amSynth's oscillatorTypes excludes its own am- family, see config).
  function updateSynthPartType(id: string, instrumentType: InstrumentType) {
    updatePart(id, (part) => {
      if (part.kind !== 'synth') {
        return part;
      }

      const validTypes = config.instrumentConfigs.find(
        (instrument: InstrumentConfig) => instrument.id === instrumentType,
      )?.oscillatorTypes as string[] | undefined;
      const currentOscillatorType = part.instrumentPropValues.oscillator?.type;
      const oscillatorStillValid =
        currentOscillatorType && validTypes?.includes(currentOscillatorType);

      return {
        ...part,
        instrumentType,
        instrumentPropValues: oscillatorStillValid
          ? part.instrumentPropValues
          : { ...part.instrumentPropValues, oscillator: undefined },
      };
    });
  }

  function toggleCollapse(id: string) {
    setCollapsedPartIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function toggleMute(id: string) {
    updatePart(id, (part) => ({ ...part, muted: !part.muted }));
  }

  function toggleSolo(id: string) {
    updatePart(id, (part) => ({ ...part, soloed: !part.soloed }));
  }

  function updatePartEffectProp<Key extends keyof EffectProps>(
    id: string,
    key: Key,
    value: EffectProps[Key],
  ) {
    updatePart(id, (part) => ({
      ...part,
      effectPropValues: { ...part.effectPropValues, [key]: value },
    }));
  }

  const selectedPart = parts.find((part) => part.id === selectedPartId);
  const selectedEffectConfig = selectedPart?.effectType
    ? config.effectConfigs.find(
        (effect: EffectConfig) => effect.id === selectedPart.effectType,
      )
    : undefined;
  const selectedInstrumentConfig =
    selectedPart?.kind === 'synth'
      ? config.instrumentConfigs.find(
          (instrument: InstrumentConfig) =>
            instrument.id === selectedPart.instrumentType,
        )
      : undefined;

  const anyPartSoloed = parts.some((part) => part.soloed);

  const synthScaleChromas = scaleChromasForKey(songKey);
  const isSynthLaneInKey = (laneIndex: number) =>
    synthScaleChromas.has(Note.chroma(SYNTH_LANES[laneIndex]));

  useEffect(() => {
    if (!isPlaying) {
      setStepIndexes({});
    }
  }, [isPlaying]);

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
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3 bg-[#1c1f26] border-b border-white/10 text-white text-base">
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
        <label className="flex items-center gap-2">
          Key
          <select
            value={songKey}
            onChange={(event) => setSongKey(event.target.value)}
          >
            {KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main className="min-h-0 overflow-y-auto bg-[#282c34] text-white">
        {parts.map((part) => (
          <div
            key={part.id}
            className="px-6 py-4 bg-[#20242c] border-b border-white/10 text-base"
          >
            <div className="flex flex-col gap-2 w-[90vw] max-w-240 mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(part.id)}
                    aria-label={
                      collapsedPartIds.has(part.id)
                        ? `Expand ${part.name}`
                        : `Collapse ${part.name}`
                    }
                    className="w-4 flex items-center justify-center text-white/40 hover:text-white/80"
                  >
                    <Icon
                      name={
                        collapsedPartIds.has(part.id) ? 'expand' : 'collapse'
                      }
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMute(part.id)}
                    aria-pressed={part.muted}
                    aria-label={`Mute ${part.name}`}
                    className={[
                      'w-7 h-6 rounded flex items-center justify-center',
                      part.muted
                        ? 'bg-yellow-500 text-black'
                        : 'bg-white/10 hover:bg-white/20',
                    ].join(' ')}
                  >
                    <Icon name="mute" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSolo(part.id)}
                    aria-pressed={part.soloed}
                    aria-label={`Solo ${part.name}`}
                    className={[
                      'w-7 h-6 rounded flex items-center justify-center',
                      part.soloed
                        ? 'bg-[#61dafb] text-black'
                        : 'bg-white/10 hover:bg-white/20',
                    ].join(' ')}
                  >
                    <Icon name="solo" />
                  </button>
                  <p className="text-left text-sm font-bold uppercase tracking-wide text-white/60">
                    {part.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePart(part.id)}
                  aria-label={`Remove ${part.name}`}
                  className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white/80"
                >
                  <Icon name="remove" />
                </button>
              </div>

              {!collapsedPartIds.has(part.id) &&
                (part.kind === 'drum' ? (
                  <StepSequencer
                    pattern={part.pattern}
                    currentStepIndex={stepIndexes[part.id] ?? null}
                    onToggleStep={(laneIndex, stepIndex) =>
                      togglePartStep(part.id, laneIndex, stepIndex)
                    }
                    laneKey={(laneIndex) => DRUM_NOTES[laneIndex]}
                    ariaLabel={(laneIndex, stepIndex) =>
                      `${part.name} lane ${laneIndex + 1} step ${stepIndex + 1}`
                    }
                    renderLaneLabel={(laneIndex) => (
                      <select
                        value={part.laneSounds[laneIndex]}
                        onChange={(event) =>
                          updateDrumLaneSound(
                            part.id,
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
                    )}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {/* Matches a step row's lane-label column so the chord
                      slots below line up with the four-step groups they
                      drive. */}
                      <div className="w-20 shrink-0" />
                      <div className="flex gap-1">
                        {Array.from(
                          { length: CHORD_SLOT_COUNT },
                          (_, slotIndex) => (
                            <ChordSlotInput
                              key={slotIndex}
                              label={`Chord ${slotIndex + 1}`}
                              value={
                                chordSlotLabels[part.id]?.[slotIndex] ?? ''
                              }
                              onCommit={(chordSymbol) =>
                                commitChordSlot(part.id, slotIndex, chordSymbol)
                              }
                              className={slotIndex !== 0 ? 'ml-2' : ''}
                            />
                          ),
                        )}
                      </div>
                    </div>
                    <StepSequencer
                      pattern={part.pattern}
                      currentStepIndex={stepIndexes[part.id] ?? null}
                      onToggleStep={(laneIndex, stepIndex) =>
                        togglePartStep(part.id, laneIndex, stepIndex)
                      }
                      laneKey={(laneIndex) => SYNTH_LANES[laneIndex]}
                      ariaLabel={(laneIndex, stepIndex) =>
                        `${part.name} ${
                          SYNTH_LANES[laneIndex]
                        } step ${stepIndex + 1}`
                      }
                      isLaneInKey={isSynthLaneInKey}
                      renderLaneLabel={(laneIndex) => (
                        <span
                          className={[
                            'w-20 shrink-0 text-left',
                            isSynthLaneInKey(laneIndex) ? '' : 'text-white/30',
                          ].join(' ')}
                        >
                          {SYNTH_LANES[laneIndex]}
                        </span>
                      )}
                    />
                  </>
                ))}
            </div>
          </div>
        ))}

        <div className="px-6 py-4 flex gap-2">
          <button
            type="button"
            onClick={() => addPart('drum')}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
          >
            + Drum part
          </button>
          <button
            type="button"
            onClick={() => addPart('synth')}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
          >
            + Synth part
          </button>
        </div>
      </main>

      <footer className="min-w-0 border-t border-white/10 bg-[#1c1f26] text-white text-base">
        <div className="flex gap-2 px-6 pt-3">
          {parts.map((part) => (
            <button
              key={part.id}
              type="button"
              onClick={() => setSelectedPartId(part.id)}
              className={[
                'px-3 py-1 rounded',
                selectedPartId === part.id
                  ? 'bg-white/20 font-bold'
                  : 'bg-white/5',
              ].join(' ')}
            >
              {part.name}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-nowrap items-start gap-x-6 gap-y-2 px-6 py-3 overflow-x-auto">
          {selectedPart?.kind === 'drum' && (
            <DrumControls
              volume={selectedPart.volume}
              onVolumeChange={(value) =>
                updatePart(selectedPart.id, (part) => ({
                  ...part,
                  volume: value,
                }))
              }
              pan={selectedPart.pan}
              onPanChange={(value) =>
                updatePart(selectedPart.id, (part) => ({ ...part, pan: value }))
              }
              effectType={selectedPart.effectType}
              onEffectTypeChange={(value) =>
                updatePart(selectedPart.id, (part) => ({
                  ...part,
                  effectType: value,
                }))
              }
              effectPropValues={selectedPart.effectPropValues}
              onEffectPropChange={(key, value) =>
                updatePartEffectProp(selectedPart.id, key, value)
              }
              effectConfig={selectedEffectConfig}
            />
          )}

          {selectedPart?.kind === 'synth' && (
            <SynthControls
              synthType={selectedPart.instrumentType}
              onSynthTypeChange={(type) =>
                updateSynthPartType(selectedPart.id, type)
              }
              instrumentConfig={selectedInstrumentConfig}
              instrumentPropValues={selectedPart.instrumentPropValues}
              onInstrumentPropValuesChange={(update) =>
                updatePart(selectedPart.id, (part) => {
                  if (part.kind !== 'synth') {
                    return part;
                  }

                  const nextValues =
                    typeof update === 'function'
                      ? update(part.instrumentPropValues)
                      : update;

                  return { ...part, instrumentPropValues: nextValues };
                })
              }
              volume={selectedPart.volume}
              onVolumeChange={(value) =>
                updatePart(selectedPart.id, (part) => ({
                  ...part,
                  volume: value,
                }))
              }
              pan={selectedPart.pan}
              onPanChange={(value) =>
                updatePart(selectedPart.id, (part) => ({ ...part, pan: value }))
              }
              effectType={selectedPart.effectType}
              onEffectTypeChange={(value) =>
                updatePart(selectedPart.id, (part) => ({
                  ...part,
                  effectType: value,
                }))
              }
              effectPropValues={selectedPart.effectPropValues}
              onEffectPropChange={(key, value) =>
                updatePartEffectProp(selectedPart.id, key, value)
              }
              effectConfig={selectedEffectConfig}
            />
          )}
        </div>
      </footer>

      <Song
        isPlaying={isPlaying}
        bpm={bpm}
        volume={volume}
        swing={swing}
        swingSubdivision={swingSubdivision}
      >
        {parts.map((part) =>
          part.kind === 'drum' ? (
            <Track
              key={part.id}
              steps={computeTrackSteps(DRUM_NOTES, part.pattern)}
              subdivision="16n"
              volume={part.volume}
              pan={part.pan}
              mute={part.muted || (anyPartSoloed && !part.soloed)}
              onStepPlay={(_stepNotes: StepNoteType[], index: number) =>
                setStepIndexes((prev) => ({ ...prev, [part.id]: index }))
              }
            >
              <Instrument
                type="sampler"
                samples={computeDrumSamples(part.laneSounds)}
              ></Instrument>
              {part.effectType && (
                <Effect type={part.effectType} {...part.effectPropValues} />
              )}
            </Track>
          ) : (
            <Track
              key={part.id}
              steps={computeTrackSteps(SYNTH_LANES, part.pattern)}
              subdivision="16n"
              volume={part.volume}
              pan={part.pan}
              mute={part.muted || (anyPartSoloed && !part.soloed)}
              onStepPlay={(_stepNotes: StepNoteType[], index: number) =>
                setStepIndexes((prev) => ({ ...prev, [part.id]: index }))
              }
            >
              <Instrument
                type={part.instrumentType}
                {...part.instrumentPropValues}
              ></Instrument>
              {part.effectType && (
                <Effect type={part.effectType} {...part.effectPropValues} />
              )}
            </Track>
          ),
        )}
      </Song>
    </div>
  );
}

export default App;
