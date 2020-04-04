import React, {
  useEffect,
  useRef,
  useContext,
  // useLayoutEffect
} from 'react';
import PropTypes from 'prop-types';

// import { SongContext } from './Song';
import { TrackContext } from './Track';
import {
  NoteType as PropTypeNoteType,
  InstrumentTypes,
} from '../types/propTypes';
import Tone from '../lib/tone';
import { usePrevious } from '../lib/hooks';

type NoteType = {
  name: string;
  velocity?: number;
  duration?: number | string;
  /** Use unique key to differentiate from same notes, otherwise it won't play */
  key?: string | number;
};

export type InstrumentType =
  | 'amSynth'
  | 'duoSynth'
  | 'fmSynth'
  | 'membraneSynth'
  | 'metalSynth'
  | 'monoSynth'
  | 'noiseSynth'
  | 'pluckSynth'
  | 'synth'
  | 'sampler';

export interface InstrumentProps {
  type: InstrumentType;
  notes?: NoteType[];
  /** Should deprecate */
  options?: any;
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
  mute?: boolean;
  solo?: boolean;
  onLoad?: Function;
}

interface InstrumentConsumerProps extends InstrumentProps {
  volume?: number;
  pan?: number;
  effectsChain?: React.ReactNode[];
  onInstrumentsUpdate?: Function;
}

const InstrumentConsumer: React.FC<InstrumentConsumerProps> = ({
  // <Instrument /> Props
  type = 'synth',
  options,
  polyphony = 4,
  oscillator,
  envelope,
  notes = [],
  samples,
  onLoad,
  // <Track /> Props
  volume,
  pan,
  mute,
  solo,
  effectsChain,
  onInstrumentsUpdate,
}) => {
  const instrumentRef = useRef<
    Partial<{
      curve: number;
      release: number;
      triggerAttack: Function;
      triggerAttackRelease: Function;
      triggerRelease: Function;
      add: Function;
      set: Function;
      chain: Function;
      dispose: Function;
      disconnect: Function;
    }>
  >();
  // const trackChannelBase = useRef(new Tone.PanVol(pan, volume));
  const trackChannelBase = useRef(new Tone.Channel(volume, pan));
  const prevNotes: any[] = usePrevious(notes);

  // -------------------------------------------------------------------------
  // INSTRUMENT TYPE
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (type === 'sampler') {
      instrumentRef.current = new Tone.Sampler(samples, onLoad);

      if (options && options.curve) {
        instrumentRef.current.curve = options.curve;
      }

      if (options && options.release) {
        instrumentRef.current.release = options.release;
      }
    } else if (type === 'membraneSynth') {
      instrumentRef.current = new Tone.MembraneSynth(
        buildSynthOptions({
          oscillator,
          envelope,
        }),
      );
    } else if (type === 'metalSynth') {
      instrumentRef.current = new Tone.MetalSynth();
    } else if (type === 'noiseSynth') {
      instrumentRef.current = new Tone.NoiseSynth();
    } else if (type === 'pluckSynth') {
      instrumentRef.current = new Tone.PluckSynth();
    } else {
      let synth;

      if (type === 'amSynth') {
        synth = Tone.AMSynth;
      } else if (type === 'duoSynth') {
        synth = Tone.DuoSynth;
      } else if (type === 'fmSynth') {
        synth = Tone.FMSynth;
      } else if (type === 'monoSynth') {
        synth = Tone.MonoSynth;
      } else if (type === 'synth') {
        synth = Tone.Synth;
      } else {
        synth = Tone.Synth;
      }

      /**
       * PolySynth accepts other Synth types as second param, making them
       * polyphonic. As this is a common use case, all Synths will be created
       * via PolySynth. Monophonic synths can easily be created by setting the
       * `polyphony` prop to 1.
       */
      instrumentRef.current = new Tone.PolySynth(
        polyphony,
        synth,
        buildSynthOptions({
          oscillator,
          envelope,
        }),
      );
    }

    instrumentRef.current.chain(
      ...effectsChain,
      trackChannelBase.current,
      Tone.Master,
    );

    // Add this Instrument to Track Context
    onInstrumentsUpdate([instrumentRef.current]);

    return function cleanup() {
      if (instrumentRef.current) {
        console.log('dispose');

        instrumentRef.current.dispose();
      }
    };
  }, [type, polyphony]);

  useEffect(() => {
    if (
      // TODO: Add other synth types
      type === 'synth' &&
      instrumentRef &&
      instrumentRef.current &&
      oscillator
    ) {
      instrumentRef.current.set('oscillator', oscillator);
      // console.log(oscillator);
    }
  }, [oscillator, type]);

  // -------------------------------------------------------------------------
  // VOLUME / PAN / MUTE / SOLO
  // -------------------------------------------------------------------------

  useEffect(() => {
    trackChannelBase.current.volume.value = volume;
  }, [volume]);

  useEffect(() => {
    trackChannelBase.current.pan.value = pan;
  }, [pan]);

  useEffect(() => {
    trackChannelBase.current.mute = mute;
  }, [mute]);

  useEffect(() => {
    trackChannelBase.current.solo = solo;
  }, [solo]);

  // -------------------------------------------------------------------------
  // NOTES
  // -------------------------------------------------------------------------

  /**
   NOTE: Would prefer to use useLayoutEffect as it is a little faster, but unable to test it right now
   **/
  useEffect(() => {
    // Loop through all current notes
    notes &&
      notes.forEach((note) => {
        // Check if note is playing
        const isPlaying =
          prevNotes &&
          prevNotes.filter((prevNote) => {
            // Check both note name and unique key.
            // Key helps differentiate same notes, otherwise it won't trigger
            return prevNote.name === note.name && prevNote.key === note.key;
          }).length > 0;

        // Only play note is it isn't already playing
        if (!isPlaying) {
          if (note.duration) {
            instrumentRef.current.triggerAttackRelease(
              note.name,
              note.duration,
              undefined,
              note.velocity,
            );
          } else {
            instrumentRef.current.triggerAttack(
              note.name,
              undefined,
              note.velocity,
            );
          }
        }
      });

    // Loop through all previous notes
    prevNotes &&
      prevNotes.forEach((note) => {
        // Check if note is still playing
        const isPlaying =
          notes && notes.filter((n) => n.name === note.name).length > 0;

        if (!isPlaying) {
          instrumentRef.current.triggerRelease(note.name);
        }
      });
  }, [notes, prevNotes]);

  // -------------------------------------------------------------------------
  // EFFECTS CHAIN
  // -------------------------------------------------------------------------

  useEffect(() => {
    // NOTE: Using trackChannelBase causes effects to not turn off
    instrumentRef.current.disconnect();
    instrumentRef.current.chain(
      ...effectsChain,
      trackChannelBase.current,
      Tone.Master,
    );
  }, [effectsChain]);

  // -------------------------------------------------------------------------
  // SAMPLES
  // Run whenever `samples` change, using Tone.Sampler's `add` method to load
  // more samples after initial mount
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (
      type === 'sampler' &&
      typeof onLoad === 'function' &&
      Boolean(samples)
    ) {
      // Create an array of promises from `samples`
      const loadSamplePromises = Object.keys(samples).map((key) => {
        return new Promise((resolve) => {
          const sample = samples[key];

          // Pass `resolve` to `onLoad` parameter of Tone.Sampler
          // When sample loads, this promise will resolve
          instrumentRef.current.add(key, sample, resolve);
        });
      });

      // Once all promises in array resolve, run onLoad callback
      Promise.all(loadSamplePromises).then((event) => {
        onLoad(event);
      });
    }
  }, [samples, type]);

  return null;
};

InstrumentConsumer.propTypes = {
  // <Instrument /> Props
  // @ts-ignore
  type: InstrumentTypes.isRequired,
  options: PropTypes.object,
  // @ts-ignore
  notes: PropTypes.arrayOf(PropTypeNoteType), // Currently played notes.
  polyphony: PropTypes.number,
  envelope: PropTypes.shape({
    attack: PropTypes.number,
    decay: PropTypes.number,
    sustain: PropTypes.number,
    release: PropTypes.number,
  }),
  // oscillator: PropTypes.shape({
  //   type: PropTypes.oneOf(['triangle', 'sine', 'square']),
  // }),
  // @ts-ignore
  samples: PropTypes.object,
  // trackChannel: PropTypes.object, // An instance of new this.Tone.PanVol()
  // <Track /> Props
  volume: PropTypes.number,
  pan: PropTypes.number,
  mute: PropTypes.bool,
  solo: PropTypes.bool,
  effectsChain: PropTypes.array,
  onInstrumentsUpdate: PropTypes.func,
};

const Instrument: React.FC<InstrumentProps> = ({
  type,
  options,
  notes,
  polyphony,
  oscillator,
  envelope,
  samples,
  onLoad,
}) => {
  const {
    volume,
    pan,
    mute,
    solo,
    effectsChain,
    onInstrumentsUpdate,
  } = useContext(TrackContext);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <InstrumentConsumer
      // <Instrument /> Props
      type={type}
      options={options}
      notes={notes}
      polyphony={polyphony}
      oscillator={oscillator}
      envelope={envelope}
      samples={samples}
      onLoad={onLoad}
      // <Track /> Props
      volume={volume}
      pan={pan}
      mute={mute}
      solo={solo}
      effectsChain={effectsChain}
      onInstrumentsUpdate={onInstrumentsUpdate}
    />
  );
};

/**
 * Use Instrument's flattened synth props to create options object for Tone JS
 */
const buildSynthOptions = ({ oscillator, envelope }) => {
  if (oscillator || envelope) {
    return {
      ...(envelope ? { envelope } : {}),
      ...(oscillator ? { oscillator } : {}),
    };
  }

  return undefined;
};

export default Instrument;
