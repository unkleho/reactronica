import React, {
  useEffect,
  useRef,
  useContext,
  // useLayoutEffect
} from 'react';
// import equal from 'fast-deep-equal';

// import { SongContext } from './Song';
import { TrackContext } from './Track';
import Tone from '../lib/tone';
import { usePrevious } from '../lib/hooks';
import { MidiNote } from 'types/midi-notes';
// import { MidiNote } from '../types/midi-notes';

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

/**
 * The waveform that an am-/fm-modulated oscillator's modulator runs at.
 * Restricted to the 4 basic waveforms (rather than Tone's full
 * AllNonCustomOscillatorType) for the same reason InstrumentOscillator
 * excludes 'custom' - anything needing a `partials` array isn't exposed here.
 */
type ModulatorOscillatorType = 'sine' | 'square' | 'triangle' | 'sawtooth';

interface AmFmOscillatorParams {
  /** Ratio between the oscillator and its modulator's frequency. */
  harmonicity?: number;
  modulationType?: ModulatorOscillatorType;
}

/**
 * The basic waveforms, plus Tone.js's amplitude-modulation (am-), frequency-
 * modulation (fm-), and detuned-unison (fat-) variants of each - each
 * variant's tunable params are only assignable when `type` matches it, e.g.
 * `spread`/`count` require a 'fat...' type and won't type-check otherwise.
 * Excludes 'custom' and the fat/am/fm 'custom' variants, which need a
 * `partials` array to produce a distinct sound - not something this prop
 * exposes.
 */
export type InstrumentOscillator =
  | { type: 'sine' | 'square' | 'triangle' | 'sawtooth' }
  | { type: 'pulse'; width?: number }
  | { type: 'pwm'; modulationFrequency?: number }
  | ({
      type: 'amsine' | 'amsquare' | 'amtriangle' | 'amsawtooth';
    } & AmFmOscillatorParams)
  | ({
      type: 'fmsine' | 'fmsquare' | 'fmtriangle' | 'fmsawtooth';
      modulationIndex?: number;
    } & AmFmOscillatorParams)
  | {
      type: 'fatsine' | 'fatsquare' | 'fattriangle' | 'fatsawtooth';
      count?: number;
      spread?: number;
    };

export type InstrumentOscillatorType = InstrumentOscillator['type'];

/** monoSynth's filter type - the standard BiquadFilterNode types Tone.Filter supports. */
export type InstrumentFilterType =
  | 'lowpass'
  | 'highpass'
  | 'bandpass'
  | 'notch'
  | 'allpass'
  | 'peaking'
  | 'lowshelf'
  | 'highshelf';

/** monoSynth's filter rolloff, in dB/octave - the only slopes a BiquadFilterNode-based filter can produce. */
export type InstrumentFilterRolloff = -12 | -24 | -48 | -96;

/** Every value InstrumentFilterType allows, for config/UI code enumerating them at runtime. */
export const instrumentFilterTypes: InstrumentFilterType[] = [
  'lowpass',
  'highpass',
  'bandpass',
  'notch',
  'allpass',
  'peaking',
  'lowshelf',
  'highshelf',
];

/** Every value InstrumentFilterRolloff allows, for config/UI code enumerating them at runtime. */
export const instrumentFilterRolloffs: InstrumentFilterRolloff[] = [
  -12,
  -24,
  -48,
  -96,
];

/**
 * Every value InstrumentOscillatorType allows, for config/UI code that needs
 * to enumerate them at runtime (e.g. a waveform picker). Kept next to the
 * type it mirrors - if InstrumentOscillator's members change, update this
 * list too.
 */
export const instrumentOscillatorTypes: InstrumentOscillatorType[] = [
  'sine',
  'square',
  'triangle',
  'sawtooth',
  'pwm',
  'pulse',
  'amsine',
  'amsquare',
  'amtriangle',
  'amsawtooth',
  'fmsine',
  'fmsquare',
  'fmtriangle',
  'fmsawtooth',
  'fatsine',
  'fatsquare',
  'fattriangle',
  'fatsawtooth',
];

export interface InstrumentProps {
  type: InstrumentType;
  notes?: NoteType[];
  /** Should deprecate */
  options?: any;
  polyphony?: number;
  oscillator?: InstrumentOscillator;
  envelope?: {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
  };
  samples?: {
    [key in MidiNote]?: string;
  };
  /** monoSynth only - the filter that shapes its oscillator, modulated by filterEnvelope. */
  filter?: {
    type?: InstrumentFilterType;
    frequency?: number;
    Q?: number;
    rolloff?: InstrumentFilterRolloff;
    gain?: number;
  };
  /**
   * monoSynth only - ramps filter.frequency between filterEnvelope.baseFrequency
   * and baseFrequency * 2^octaves, the same way envelope shapes volume.
   */
  filterEnvelope?: {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    baseFrequency?: number;
    octaves?: number;
    exponent?: number;
  };
  /** metalSynth only - ratio between its oscillators' frequencies. */
  harmonicity?: number;
  /** metalSynth only - the amount of frequency modulation. */
  modulationIndex?: number;
  /**
   * metalSynth: the lower bound (Hz) of the highpass filter attached to its envelope.
   * pluckSynth: the amount of resonance/sustain of the pluck (0-1) - Tone uses the
   * same prop name for both, but the two are otherwise unrelated.
   */
  resonance?: number;
  /** metalSynth only - the highpass filter's range above resonance, in octaves. */
  octaves?: number;
  /** pluckSynth only - the amount of noise at the attack. */
  attackNoise?: number;
  /** pluckSynth only - the lowpass filter frequency (Hz) of its comb filter. */
  dampening?: number;
  mute?: boolean;
  solo?: boolean;
  /** TODO: Type properly and consider loading status */
  onLoad?: (buffers: any[]) => void;
}

interface InstrumentConsumerProps extends InstrumentProps {
  volume?: number;
  pan?: number;
  effectsChain?: React.ReactNode[];
  onInstrumentsUpdate?: Function;
}

type InstrumentInstance = Partial<{
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
}>;

/**
 * Every type that is actually built with `oscillator`/`envelope` options in
 * the construction effect below. duoSynth is included, but needs a different
 * options shape than the rest - see buildDuoSynthVoiceOptions.
 */
const SUPPORTS_LIVE_OSCILLATOR_AND_ENVELOPE_UPDATE: InstrumentType[] = [
  'amSynth',
  'duoSynth',
  'fmSynth',
  'membraneSynth',
  'monoSynth',
  'synth',
];

const InstrumentConsumer: React.FC<InstrumentConsumerProps> = ({
  // <Instrument /> Props
  type = 'synth',
  options,
  polyphony = 4,
  oscillator,
  envelope,
  filter,
  filterEnvelope,
  harmonicity,
  modulationIndex,
  resonance,
  octaves,
  attackNoise,
  dampening,
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
  const instrumentRef = useRef<InstrumentInstance>();
  // const trackChannelBase = useRef(new Tone.PanVol(pan, volume));
  // const trackChannelBase = useRef(new Tone.Channel(volume, pan));
  const trackChannelBase = useRef(null);
  const prevNotes: any[] = usePrevious(notes);

  // -------------------------------------------------------------------------
  // CHANNEL
  // TODO: Consider moving this to <Track>
  // -------------------------------------------------------------------------

  useEffect(() => {
    trackChannelBase.current = new Tone.Channel(volume, pan);

    return function cleanup() {
      if (trackChannelBase.current) {
        trackChannelBase.current.dispose();
      }
    };
    /* eslint-disable-next-line */
  }, []);

  // -------------------------------------------------------------------------
  // INSTRUMENT TYPE
  // -------------------------------------------------------------------------

  const prevType = usePrevious<InstrumentType>(type);

  useEffect(() => {
    if (type === 'sampler') {
      instrumentRef.current = (new Tone.Sampler(
        samples,
        (onLoad as unknown) as () => void,
      ) as unknown) as InstrumentInstance;

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
      instrumentRef.current = new Tone.MetalSynth(
        withDefined({
          harmonicity,
          modulationIndex,
          resonance,
          octaves,
          envelope,
        }),
      );
    } else if (type === 'noiseSynth') {
      instrumentRef.current = new Tone.NoiseSynth();
    } else if (type === 'pluckSynth') {
      instrumentRef.current = (new Tone.PluckSynth(
        withDefined({ attackNoise, dampening, resonance }),
      ) as unknown) as InstrumentInstance;
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
       * PolySynth accepts other Synth types as its `voice` option, making them
       * polyphonic. As this is a common use case, all Synths will be created
       * via PolySynth. Monophonic synths can easily be created by setting the
       * `polyphony` prop to 1.
       */
      instrumentRef.current = new Tone.PolySynth({
        maxPolyphony: polyphony,
        voice: synth,
        // `synth` (the voice class) is resolved dynamically above, so Tone's
        // PolySynth<Voice> generic can't narrow `options` to the right shape
        // per voice - duoSynth genuinely needs a different shape
        // (voice0/voice1) than the rest, which Tone's default Synth-typed
        // overload doesn't know about.
        options: (type === 'duoSynth'
          ? buildDuoSynthVoiceOptions(
              buildSynthOptions({ oscillator, envelope }),
            )
          : type === 'monoSynth'
          ? buildSynthOptions({ oscillator, envelope, filter, filterEnvelope })
          : buildSynthOptions({ oscillator, envelope })) as any,
      });
    }

    instrumentRef.current.chain(
      ...effectsChain,
      trackChannelBase.current,
      Tone.getDestination(),
    );

    // Add this Instrument to Track Context
    onInstrumentsUpdate([instrumentRef.current]);

    return function cleanup() {
      if (instrumentRef.current) {
        instrumentRef.current.dispose();
      }
    };
    /* eslint-disable-next-line */
  }, [type, polyphony]);

  useEffect(() => {
    if (
      SUPPORTS_LIVE_OSCILLATOR_AND_ENVELOPE_UPDATE.includes(type) &&
      instrumentRef &&
      instrumentRef.current &&
      oscillator
    ) {
      // Tone's real `.set()` takes a single options object, not a
      // (key, value) pair - passing them separately makes the second
      // argument silently vanish and breaks Tone's internal `Reflect.has`
      // call on what's left.
      instrumentRef.current.set(
        type === 'duoSynth'
          ? buildDuoSynthVoiceOptions({ oscillator })
          : { oscillator },
      );
      // console.log(oscillator);
    }
  }, [oscillator, type]);

  useEffect(() => {
    // metalSynth has no top-level `oscillator`, but does have `envelope` -
    // included here rather than in the shared array above, which also
    // gates the oscillator effect this one's grouped with.
    if (
      (SUPPORTS_LIVE_OSCILLATOR_AND_ENVELOPE_UPDATE.includes(type) ||
        type === 'metalSynth') &&
      instrumentRef &&
      instrumentRef.current &&
      envelope
    ) {
      instrumentRef.current.set(
        type === 'duoSynth'
          ? buildDuoSynthVoiceOptions({ envelope })
          : { envelope },
      );
    }
  }, [envelope, type]);

  useEffect(() => {
    if (type === 'monoSynth' && instrumentRef.current && filter) {
      instrumentRef.current.set({ filter });
    }
  }, [filter, type]);

  useEffect(() => {
    if (type === 'monoSynth' && instrumentRef.current && filterEnvelope) {
      instrumentRef.current.set({ filterEnvelope });
    }
  }, [filterEnvelope, type]);

  useEffect(() => {
    if (
      type === 'metalSynth' &&
      instrumentRef.current &&
      (typeof harmonicity !== 'undefined' ||
        typeof modulationIndex !== 'undefined' ||
        typeof resonance !== 'undefined' ||
        typeof octaves !== 'undefined')
    ) {
      instrumentRef.current.set(
        withDefined({ harmonicity, modulationIndex, resonance, octaves }),
      );
    }
  }, [harmonicity, modulationIndex, resonance, octaves, type]);

  useEffect(() => {
    if (
      type === 'pluckSynth' &&
      instrumentRef.current &&
      (typeof attackNoise !== 'undefined' ||
        typeof dampening !== 'undefined' ||
        typeof resonance !== 'undefined')
    ) {
      instrumentRef.current.set(
        withDefined({ attackNoise, dampening, resonance }),
      );
    }
  }, [attackNoise, dampening, resonance, type]);

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
          // NoiseSynth is unpitched - its trigger methods take no note name.
          if (type === 'noiseSynth') {
            if (note.duration) {
              instrumentRef.current.triggerAttackRelease(
                note.duration,
                undefined,
                note.velocity,
              );
            } else {
              instrumentRef.current.triggerAttack(undefined, note.velocity);
            }
          } else if (note.duration) {
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
          if (type === 'noiseSynth') {
            instrumentRef.current.triggerRelease();
          } else {
            instrumentRef.current.triggerRelease(note.name);
          }
        }
      });
  }, [notes, prevNotes, type]);

  // -------------------------------------------------------------------------
  // EFFECTS CHAIN
  // -------------------------------------------------------------------------

  useEffect(() => {
    // NOTE: Using trackChannelBase causes effects to not turn off
    instrumentRef.current.disconnect();
    instrumentRef.current.chain(
      ...effectsChain,
      trackChannelBase.current,
      Tone.getDestination(),
    );
  }, [effectsChain]);

  // -------------------------------------------------------------------------
  // SAMPLES
  // Run whenever `samples` change, using Tone.Sampler's `add` method to load
  // more samples after initial mount
  // TODO: Check if first mount, as sampler constructor has already loaded samples
  // -------------------------------------------------------------------------

  const prevSamples = usePrevious(samples);

  useEffect(() => {
    // When sampler is initiated, it already loads samples.
    // We'll use !isFirstSamplerInit to skip adding samples if sampler has been
    // initiated in this render.
    const isFirstSamplerInit = type === 'sampler' && prevType !== type;

    if (type === 'sampler' && Boolean(samples) && !isFirstSamplerInit) {
      // const isEqual = equal(samples, prevSamples);
      const prevSampleKeys = Object.keys(prevSamples);
      const sampleKeys = Object.keys(samples);

      // Samples to add
      const addSampleKeys = sampleKeys.filter(
        (key) => !prevSampleKeys.includes(key),
      );

      // Samples to remove
      // const removeSampleKeys = prevSampleKeys.filter(
      //   (key) => !sampleKeys.includes(key),
      // );

      // console.log(addSampleKeys, removeSampleKeys);

      if (addSampleKeys.length) {
        // Create an array of promises from `samples`
        const loadSamplePromises = addSampleKeys.map((key) => {
          return new Promise((resolve: (buffer: any) => void) => {
            const sample = samples[key];
            const prevSample = prevSamples ? (prevSamples as object)[key] : '';

            // Only update sample if different than before
            if (sample !== prevSample) {
              // Pass `resolve` to `onLoad` parameter of Tone.Sampler
              // When sample loads, this promise will resolve
              instrumentRef.current.add(key, sample, resolve);
            } else {
              resolve(null);
            }
          });
        });

        // Once all promises in array resolve, run onLoad callback
        Promise.all(loadSamplePromises).then((event) => {
          if (typeof onLoad === 'function') {
            onLoad(event);
          }
        });

        // TODO: Work out a way to remove samples. Below doesn't work
        // removeSampleKeys.forEach((key) => {
        //   instrumentRef.current.add(key, null);
        // });
      }
    }
    /* eslint-disable-next-line */
  }, [samples, type]);

  return null;
};

const Instrument: React.FC<InstrumentProps> = ({
  type,
  options,
  notes,
  polyphony,
  oscillator,
  envelope,
  filter,
  filterEnvelope,
  harmonicity,
  modulationIndex,
  resonance,
  octaves,
  attackNoise,
  dampening,
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
      filter={filter}
      filterEnvelope={filterEnvelope}
      harmonicity={harmonicity}
      modulationIndex={modulationIndex}
      resonance={resonance}
      octaves={octaves}
      attackNoise={attackNoise}
      dampening={dampening}
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
 * Tone's constructors apply their own defaults for any field left out of a
 * partial options object, so this strips `undefined` entries rather than
 * hardcoding a value here that might drift from Tone's actual default.
 */
function withDefined<T extends object>(fields: T): Partial<T> {
  const defined: Partial<T> = {};

  (Object.keys(fields) as (keyof T)[]).forEach((key) => {
    if (typeof fields[key] !== 'undefined') {
      defined[key] = fields[key];
    }
  });

  return defined;
}

/**
 * Use Instrument's flattened synth props to create options object for Tone JS
 */
const buildSynthOptions = ({
  oscillator,
  envelope,
  filter,
  filterEnvelope,
}: {
  oscillator?: InstrumentOscillator;
  envelope?: InstrumentProps['envelope'];
  filter?: InstrumentProps['filter'];
  filterEnvelope?: InstrumentProps['filterEnvelope'];
}) => {
  if (oscillator || envelope || filter || filterEnvelope) {
    return {
      ...(envelope ? { envelope } : {}),
      ...(oscillator ? { oscillator } : {}),
      ...(filter ? { filter } : {}),
      ...(filterEnvelope ? { filterEnvelope } : {}),
    };
  }

  return undefined;
};

/**
 * Tone.DuoSynth has no top-level `oscillator`/`envelope` field - it's built
 * from two parallel MonoSynth voices, each with their own. Since <Instrument
 * /> only exposes a single oscillator/envelope prop (not one per voice),
 * this applies the same options to both voice0 and voice1.
 */
const buildDuoSynthVoiceOptions = (voiceOptions) => {
  return voiceOptions
    ? { voice0: voiceOptions, voice1: voiceOptions }
    : undefined;
};

export default Instrument;
