export { default as Song, SongProps } from './components/Song';
export {
  default as Track,
  TrackProps,
  StepNoteType,
  StepType,
} from './components/Track';
export {
  default as Instrument,
  InstrumentProps,
  InstrumentType,
  InstrumentOscillator,
  InstrumentOscillatorType,
  instrumentOscillatorTypes,
  InstrumentFilterType,
  InstrumentFilterRolloff,
  instrumentFilterTypes,
  instrumentFilterRolloffs,
} from './components/Instrument';
export {
  default as Effect,
  EffectProps,
  EffectType,
  EffectLfoType,
} from './components/Effect';

export {
  default as config,
  midiNotes,
  InstrumentConfig,
  InstrumentConfigProp,
  EffectConfig,
  EffectConfigProp,
} from './config';
export { MidiNote } from './types/midi-notes';
