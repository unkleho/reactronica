declare module 'reactronica' {
  import * as React from 'react';

  export type SongProps = {
    isPlaying?: boolean;
    tempo?: number;
    swing?: number;
    subdivision?: string;
    volume?: number;
    isMuted?: boolean;
    children: React.ReactNode;
  };

  export type TrackProps = {
    isPlaying?: boolean;
    steps?: any[];
    volume?: number;
    pan?: number;
    subdivision?: string;
    effects?: React.ReactNode[];
    children: React.ReactNode;
    onStepPlay?: Function;
  };

  export type InstrumentProps = {
    type?: string;
    options?: any;
    notes?: any[];
    polyphony?: number;
    oscillator?: {
      type?: 'triangle' | 'sine' | 'square';
    };
    samples?: {
      [k: string]: string;
    };
    volume?: number;
    pan?: number;
    effectsChain?: React.ReactNode[];
    onInstrumentUpdate?: Function;
  };

  export type EffectProps = {
    type?: string;
    id?: string;
    delayTime?: string;
    feedback?: number;
    onAddToEffectsChain?: Function;
    onRemoveFromEffectsChain?: Function;
  };

  const Song: React.FunctionComponent<SongProps>;
  const Track: React.FunctionComponent<TrackProps>;
  const Instrument: React.FunctionComponent<InstrumentProps>;
  const Effect: React.FunctionComponent<EffectProps>;

  export { Song, Track, Instrument, Effect };
}
