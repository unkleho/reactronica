import { InstrumentProps } from 'reactronica';

// Kept in its own module, not alongside SynthControls, so that file stays a
// component-only export and remains Fast Refresh-compatible.
export const DEFAULT_INSTRUMENT_PROP_VALUES: Pick<
  InstrumentProps,
  'polyphony' | 'oscillator' | 'envelope'
> = {
  // Needs headroom above the biggest default chord (G7b9 voices 5 notes at
  // once) plus the deliberate release overlap below, or Tone's PolySynth
  // logs "Max polyphony exceeded. Note dropped." and silently drops notes.
  polyphony: 8,
  oscillator: undefined,
  // A longer decay/release than Tone's plucky default so the synth
  // sequencer's chord stabs ring out and overlap a little into the next
  // chord, rather than cutting off abruptly.
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 },
};
