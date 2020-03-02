declare module 'reactronica' {
  import * as React from 'react';

  export type SongProps = {
    isPlaying?: boolean;
    bpm?: number;
    swing?: number;
    subdivision?: string;
    volume?: number;
    isMuted?: boolean;
    children: React.ReactNode;
  };

  export type TrackProps = {
    isPlaying?: boolean;
    steps?: StepType[];
    volume?: number;
    pan?: number;
    subdivision?: string;
    effects?: React.ReactNode[];
    children: React.ReactNode;
    onStepPlay?: (stepNotes: StepNoteType[], index: number) => void;
  };

  export type StepNoteType = {
    name: string;
    duration?: number;
    velocity?: number;
  };

  export type StepType = StepNoteType | StepNoteType[] | string;

  export type InstrumentType =
    | 'amSynth'
    | 'duoSynth'
    | 'fmSynth'
    | 'membraneSynth'
    | 'metalSynth'
    | 'pluckSynth'
    | 'synth'
    | 'sampler';

  export type NoteType = {
    name: string;
    velocity: number;
  };

  export type InstrumentProps = {
    type?: InstrumentType;
    options?: any;
    notes?: NoteType[];
    polyphony?: number;
    oscillator?: {
      type: 'triangle' | 'sine' | 'square';
    };
    envelope?: {
      attack?: number;
      decay?: number;
      sustain?: number;
      release?: number;
    };
    samples?: {
      [k: string]: string;
    };
    volume?: number;
    pan?: number;
    effectsChain?: React.ReactNode[];
    onLoad?: Function;
    onInstrumentUpdate?: Function;
  };

  export type EffectProps = {
    type?: string;
    id?: string;
    delayTime?: string;
    feedback?: number;
    wet?: number;
    low?: number;
    mid?: number;
    high?: number;
    lowFrequency?: number;
    highFrequency?: number;
    onAddToEffectsChain?: Function;
    onRemoveFromEffectsChain?: Function;
  };

  // WIP, not exported yet
  type config = {
    instruments: {
      id: InstrumentType;
      name: string;
    }[];
    effects: {
      id: string;
      name: string;
    }[];
  };

  const Song: React.FunctionComponent<SongProps>;
  const Track: React.FunctionComponent<TrackProps>;
  const Instrument: React.FunctionComponent<InstrumentProps>;
  const Effect: React.FunctionComponent<EffectProps>;

  export { Song, Track, Instrument, Effect };
}
