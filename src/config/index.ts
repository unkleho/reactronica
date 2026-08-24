import { MidiNote } from '../types/midi-notes';
import {
  InstrumentType,
  InstrumentOscillatorType,
  instrumentOscillatorTypes,
} from '../components/Instrument';
import { EffectType } from '../components/Effect';

/**
 * Names of the <Instrument /> props that a given instrument type actually
 * reads, per the construction logic in components/Instrument.tsx: only the
 * PolySynth-wrapped types and MembraneSynth are built with `oscillator` and
 * `envelope`, only PolySynth-wrapped types get `polyphony`, and only Sampler
 * takes `samples`.
 */
export type InstrumentConfigProp =
  | 'polyphony'
  | 'oscillatorType'
  | 'envelope'
  | 'samples';

export interface InstrumentConfig {
  id: InstrumentType;
  name: string;
  props: InstrumentConfigProp[];
  /**
   * Which oscillator waveforms are meaningful for this instrument. Only
   * present when 'oscillatorType' is in `props`. Tone.js's own oscillator
   * field is generically typed for every synth here, so this is the full
   * set, minus one carve-out: amSynth/fmSynth drop their own am-/fm-
   * prefixed family - the synth already applies that modulation at its own
   * harmonicity/modulationIndex level, so nesting it into the carrier
   * oscillator too is redundant. duoSynth gets the full set too: Tone.DuoSynth
   * has no top-level `oscillator` field (only `voice0.oscillator`/
   * `voice1.oscillator`), so Instrument.tsx's buildDuoSynthVoiceOptions()
   * applies the same oscillator/envelope to both voices.
   */
  oscillatorTypes?: InstrumentOscillatorType[];
}

export const instrumentConfigs: InstrumentConfig[] = [
  {
    id: 'amSynth',
    name: 'AM Synth',
    props: ['polyphony', 'oscillatorType', 'envelope'],
    // Excludes the am-prefixed family - redundant nesting, since amSynth
    // already applies AM modulation to its carrier at the synth level.
    oscillatorTypes: instrumentOscillatorTypes.filter(
      (type) => !type.startsWith('am'),
    ),
  },
  {
    id: 'duoSynth',
    name: 'Duo Synth',
    props: ['polyphony', 'oscillatorType', 'envelope'],
    oscillatorTypes: instrumentOscillatorTypes,
  },
  {
    id: 'fmSynth',
    name: 'FM Synth',
    props: ['polyphony', 'oscillatorType', 'envelope'],
    // Excludes the fm-prefixed family - redundant nesting, since fmSynth
    // already applies FM modulation to its carrier at the synth level.
    oscillatorTypes: instrumentOscillatorTypes.filter(
      (type) => !type.startsWith('fm'),
    ),
  },
  {
    id: 'membraneSynth',
    name: 'Membrane Synth',
    props: ['oscillatorType', 'envelope'],
    oscillatorTypes: instrumentOscillatorTypes,
  },
  { id: 'metalSynth', name: 'Metal Synth', props: [] },
  {
    id: 'monoSynth',
    name: 'Mono Synth',
    props: ['polyphony', 'oscillatorType', 'envelope'],
    oscillatorTypes: instrumentOscillatorTypes,
  },
  // { id: 'noiseSynth', name: 'Noise Synth' }, // No sound, disabled for now
  { id: 'pluckSynth', name: 'Pluck Synth', props: [] },
  { id: 'sampler', name: 'Sampler', props: ['samples'] },
  {
    id: 'synth',
    name: 'Synth',
    props: ['polyphony', 'oscillatorType', 'envelope'],
    oscillatorTypes: instrumentOscillatorTypes,
  },
];

/**
 * Names of the <Effect /> props that a given effect type actually reads, per
 * the construction/live-update logic in components/Effect.tsx, cross-checked
 * against each Tone.js class's real fields:
 * - 'wet' applies to every Effect-derived class except panVol and eq3, which
 *   are plain audio-node components (Tone.PanVol/Tone.EQ3 extend
 *   ToneAudioNode directly, not Tone's Effect base class) with no wet/dry mix.
 * - 'frequency'/'depth'/'lfoType' are the shared LFO rate/depth/waveform,
 *   only present on the three LFO-driven effects (autoFilter, autoPanner,
 *   tremolo).
 * - 'baseFrequency'/'octaves' are the filter sweep range, shared by autoFilter
 *   and autoWah.
 */
export type EffectConfigProp =
  | 'wet'
  | 'frequency'
  | 'depth'
  | 'lfoType'
  | 'baseFrequency'
  | 'octaves'
  | 'sensitivity'
  | 'Q'
  | 'bits'
  | 'distortion'
  | 'feedback'
  | 'delayTime'
  | 'roomSize'
  | 'dampening'
  | 'spread'
  | 'pan'
  | 'volume'
  | 'low'
  | 'mid'
  | 'high'
  | 'lowFrequency'
  | 'highFrequency';

export interface EffectConfig {
  id: EffectType;
  name: string;
  props: EffectConfigProp[];
}

export const effectConfigs: EffectConfig[] = [
  // --------------------------------------------------------------------------
  // Tone JS Effects
  // --------------------------------------------------------------------------
  {
    id: 'autoFilter',
    name: 'Auto Filter',
    props: ['wet', 'frequency', 'depth', 'lfoType', 'baseFrequency', 'octaves'],
  },
  {
    id: 'autoPanner',
    name: 'Auto Panner',
    props: ['wet', 'frequency', 'depth', 'lfoType'],
  },
  {
    id: 'autoWah',
    name: 'Auto Wah',
    props: ['wet', 'baseFrequency', 'octaves', 'sensitivity', 'Q'],
  },
  { id: 'bitCrusher', name: 'Bit Crusher', props: ['wet', 'bits'] },
  // { id: 'chorus', name: 'Chorus' },
  { id: 'distortion', name: 'Distortion', props: ['wet', 'distortion'] },
  {
    id: 'feedbackDelay',
    name: 'Feedback Delay',
    props: ['wet', 'feedback', 'delayTime'],
  },
  {
    id: 'freeverb',
    name: 'Freeverb',
    props: ['wet', 'roomSize', 'dampening'],
  },
  // Tone.PanVol has no wet/dry mix - see the EffectConfigProp doc comment.
  { id: 'panVol', name: 'Volume/Pan', props: ['pan', 'volume'] },
  // { id: 'reverb', name: 'Reverb' },
  {
    id: 'tremolo',
    name: 'Tremolo',
    props: ['wet', 'frequency', 'depth', 'lfoType', 'spread'],
  },
  // --------------------------------------------------------------------------
  // Tone JS Components
  // --------------------------------------------------------------------------
  // Tone.EQ3 has no wet/dry mix - see the EffectConfigProp doc comment.
  {
    id: 'eq3',
    name: 'EQ3',
    props: ['low', 'mid', 'high', 'lowFrequency', 'highFrequency'],
  },
];

const config = {
  instrumentConfigs,
  effectConfigs,
};

export const midiNotes: MidiNote[] = [
  'C-2',
  'C#-2',
  'D-2',
  'D#-2',
  'E-2',
  'F-2',
  'F#-2',
  'G-2',
  'G#-2',
  'A-2',
  'A#-2',
  'B-2',
  'C-1',
  'C#-1',
  'D-1',
  'D#-1',
  'E-1',
  'F-1',
  'F#-1',
  'G-1',
  'G#-1',
  'A-1',
  'A#-1',
  'B-1',
  'C0',
  'C#0',
  'D0',
  'D#0',
  'E0',
  'F0',
  'F#0',
  'G0',
  'G#0',
  'A0',
  'A#0',
  'B0',
  'C1',
  'C#1',
  'D1',
  'D#1',
  'E1',
  'F1',
  'F#1',
  'G1',
  'G#1',
  'A1',
  'A#1',
  'B1',
  'C2',
  'C#2',
  'D2',
  'D#2',
  'E2',
  'F2',
  'F#2',
  'G2',
  'G#2',
  'A2',
  'A#2',
  'B2',
  'C3',
  'C#3',
  'D3',
  'D#3',
  'E3',
  'F3',
  'F#3',
  'G3',
  'G#3',
  'A3',
  'A#3',
  'B3',
  'C4',
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
  'C5',
  'C#5',
  'D5',
  'D#5',
  'E5',
  'F5',
  'F#5',
  'G5',
  'G#5',
  'A5',
  'A#5',
  'B5',
  'C6',
  'C#6',
  'D6',
  'D#6',
  'E6',
  'F6',
  'F#6',
  'G6',
  'G#6',
  'A6',
  'A#6',
  'B6',
  'C7',
  'C#7',
  'D7',
  'D#7',
  'E7',
  'F7',
  'F#7',
  'G7',
  'G#7',
  'A7',
  'A#7',
  'B7',
  'C8',
  'C#8',
  'D8',
  'D#8',
  'E8',
  'F8',
  'F#8',
  'G8',
];

export default config;
