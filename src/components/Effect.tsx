import React, { useEffect, useContext, useRef } from 'react';

import { TrackContext } from './Track';
import Tone from '../lib/tone';

export type EffectType =
  | 'autoFilter'
  | 'autoPanner'
  | 'autoWah'
  | 'bitCrusher'
  | 'chebyshev'
  | 'distortion'
  | 'feedbackDelay'
  | 'freeverb'
  | 'frequencyShifter'
  | 'jcReverb'
  | 'panVol'
  | 'phaser'
  | 'pingPongDelay'
  | 'pitchShift'
  | 'stereoWidener'
  | 'tremolo'
  | 'vibrato'
  | 'eq3';

/**
 * The LFO waveform for autoFilter/autoPanner/tremolo. Kept to the 4 basic
 * waveforms (rather than Tone's full ToneOscillatorType) since am/fm/fat
 * modulation of a modulation source isn't a practical use case here.
 */
export type EffectLfoType = 'sine' | 'square' | 'triangle' | 'sawtooth';

export interface EffectProps {
  type?: EffectType;
  id?: string;
  delayTime?: string;
  feedback?: number;
  wet?: number;
  // eq3
  low?: number;
  mid?: number;
  high?: number;
  lowFrequency?: number;
  highFrequency?: number;
  // autoFilter, autoPanner, tremolo (LFO rate/depth/waveform)
  frequency?: number | string;
  depth?: number;
  lfoType?: EffectLfoType;
  // autoFilter, autoWah (filter sweep range)
  baseFrequency?: number | string;
  octaves?: number;
  // autoWah
  sensitivity?: number;
  Q?: number;
  // bitCrusher
  bits?: number;
  // distortion
  distortion?: number;
  // freeverb
  roomSize?: number;
  dampening?: number | string;
  // tremolo (stereo spread, in degrees)
  spread?: number;
  // panVol
  pan?: number;
  volume?: number;
  // phaser (number of allpass filter stages)
  stages?: number;
  // stereoWidener (0 = all mid, 1 = all side)
  width?: number;
  // chebyshev (waveshaping order - odd/even orders sound very different)
  order?: number;
  // pitchShift (in semitones)
  pitch?: number;
  // pitchShift (the size of the pitch-shifting window, in seconds)
  windowSize?: number;
}

export interface EffectConsumerProps extends EffectProps {
  onAddToEffectsChain?: Function;
  onRemoveFromEffectsChain?: Function;
}

type EffectInstance = {
  id?: string | number;
  // LFO-based effects (autoFilter, autoPanner, tremolo) need this called
  // once after construction or their modulation never actually runs.
  start?: () => void;
  dispose?: () => void;
  feedback?: {
    value: number;
  };
  delay?: {
    value: number;
  };
  delayTime?: {
    value: string;
  };
  wet?: {
    value: number;
  };
  low?: {
    value: number;
  };
  mid?: {
    value: number;
  };
  high?: {
    value: number;
  };
  lowFrequency?: {
    value: number;
  };
  highFrequency?: {
    value: number;
  };
  frequency?: {
    value: number | string;
  };
  depth?: {
    value: number;
  };
  // Direct getter/setter on the Tone instance, not a Param - no `.value`.
  type?: EffectLfoType;
  baseFrequency?: number | string;
  octaves?: number;
  sensitivity?: number;
  Q?: {
    value: number;
  };
  bits?: {
    value: number;
  };
  distortion?: number;
  roomSize?: {
    value: number;
  };
  dampening?: number | string;
  spread?: number;
  pan?: {
    value: number;
  };
  volume?: {
    value: number;
  };
  width?: {
    value: number;
  };
  // Direct getter/setter on the Tone instance, not a Param - no `.value`.
  order?: number;
  pitch?: number;
  windowSize?: number;
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

const EffectConsumer: React.FC<EffectConsumerProps> = ({
  type,
  id,
  delayTime = '8n',
  feedback = 0.5,
  wet = 1,
  low,
  mid,
  high,
  lowFrequency,
  highFrequency,
  frequency,
  depth,
  lfoType,
  baseFrequency,
  octaves,
  sensitivity,
  Q,
  bits,
  // Matches the value this library always hardcoded before `distortion`
  // became a settable prop, so an unset prop keeps the existing sound.
  distortion = 0.5,
  roomSize,
  dampening,
  spread,
  pan,
  volume,
  stages,
  width,
  order,
  pitch,
  windowSize,
  onAddToEffectsChain,
  onRemoveFromEffectsChain,
}) => {
  const effect = useRef<EffectInstance>();

  useEffect(() => {
    // console.log('<Effect /> mount');
    // console.log(`id: ${id}`);

    if (type === 'autoFilter') {
      effect.current = (new Tone.AutoFilter(
        withDefined({
          frequency,
          baseFrequency,
          octaves,
          depth,
          type: lfoType,
        }),
      ) as unknown) as EffectInstance;
      effect.current.start();
    } else if (type === 'autoPanner') {
      effect.current = (new Tone.AutoPanner(
        withDefined({ frequency, depth, type: lfoType }),
      ) as unknown) as EffectInstance;
      effect.current.start();
    } else if (type === 'autoWah') {
      effect.current = (new Tone.AutoWah(
        withDefined({ baseFrequency, octaves, sensitivity, Q }),
      ) as unknown) as EffectInstance;
    } else if (type === 'bitCrusher') {
      effect.current = (new Tone.BitCrusher(
        withDefined({ bits }),
      ) as unknown) as EffectInstance;
      // Removed for now because delayTime has to be in ms
      // } else if (type === 'chorus') {
      //   effect.current = new Tone.Chorus();
    } else if (type === 'distortion') {
      effect.current = (new Tone.Distortion(
        distortion,
      ) as unknown) as EffectInstance;
    } else if (type === 'feedbackDelay') {
      effect.current = (new Tone.FeedbackDelay(
        delayTime,
        feedback,
      ) as unknown) as EffectInstance;
    } else if (type === 'freeverb') {
      effect.current = (new Tone.Freeverb(
        withDefined({ roomSize, dampening }),
      ) as unknown) as EffectInstance;
    } else if (type === 'panVol') {
      effect.current = (new Tone.PanVol(
        withDefined({ pan, volume }),
      ) as unknown) as EffectInstance;
      // Needs generate()
      // } else if (type === 'reverb') {
      //   effect.current = new Tone.Reverb();
    } else if (type === 'tremolo') {
      effect.current = (new Tone.Tremolo(
        withDefined({ frequency, depth, type: lfoType, spread }),
      ) as unknown) as EffectInstance;
      effect.current.start();
    } else if (type === 'eq3') {
      effect.current = (new Tone.EQ3(
        low,
        mid,
        high,
      ) as unknown) as EffectInstance;
    } else if (type === 'phaser') {
      effect.current = (new Tone.Phaser(
        withDefined({ frequency, octaves, baseFrequency, Q, stages }),
      ) as unknown) as EffectInstance;
      // Phaser autostarts its LFO once the audio context is running -
      // unlike autoFilter/autoPanner/tremolo, no explicit start() needed.
    } else if (type === 'pingPongDelay') {
      effect.current = (new Tone.PingPongDelay(
        delayTime,
        feedback,
      ) as unknown) as EffectInstance;
    } else if (type === 'vibrato') {
      effect.current = (new Tone.Vibrato(
        withDefined({ frequency, depth, type: lfoType }),
      ) as unknown) as EffectInstance;
      // Also autostarts once the audio context is running.
    } else if (type === 'chebyshev') {
      effect.current = (new Tone.Chebyshev(order) as unknown) as EffectInstance;
    } else if (type === 'stereoWidener') {
      effect.current = (new Tone.StereoWidener(
        width,
      ) as unknown) as EffectInstance;
    } else if (type === 'frequencyShifter') {
      effect.current = (new Tone.FrequencyShifter(
        frequency,
      ) as unknown) as EffectInstance;
    } else if (type === 'pitchShift') {
      effect.current = (new Tone.PitchShift(
        withDefined({ pitch, windowSize, delayTime, feedback }),
      ) as unknown) as EffectInstance;
    } else if (type === 'jcReverb') {
      effect.current = (new Tone.JCReverb(
        roomSize,
      ) as unknown) as EffectInstance;
    }

    if (effect.current) {
      effect.current.id = id;

      // Update effects chain
      // TODO: Work out which index to insert current this.effect
      onAddToEffectsChain(effect.current);
    }

    return () => {
      // console.log('<Effect /> unmount');
      onRemoveFromEffectsChain(effect.current);

      // LFO-based effects (autoFilter, autoPanner, tremolo) leave their
      // internal clock running otherwise, even once removed from the chain.
      if (effect.current) {
        effect.current.dispose();
      }
    };
    /* eslint-disable-next-line */
  }, [type]);

  useEffect(() => {
    if (effect.current && effect.current.feedback) {
      effect.current.feedback.value = feedback;
    }
  }, [feedback]);

  useEffect(() => {
    if (effect.current && effect.current.delayTime) {
      effect.current.delayTime.value = delayTime;
    }
  }, [delayTime]);

  useEffect(() => {
    if (effect.current && effect.current.wet) {
      effect.current.wet.value = wet;
    }
  }, [wet]);

  useEffect(() => {
    if (typeof low !== 'undefined' && effect.current && effect.current.low) {
      effect.current.low.value = low;
    }
  }, [low]);

  useEffect(() => {
    if (typeof mid !== 'undefined' && effect.current && effect.current.mid) {
      effect.current.mid.value = mid;
    }
  }, [mid]);

  useEffect(() => {
    if (typeof high !== 'undefined' && effect.current && effect.current.high) {
      effect.current.high.value = high;
    }
  }, [high]);

  useEffect(() => {
    if (
      typeof lowFrequency !== 'undefined' &&
      effect.current &&
      effect.current.lowFrequency
    ) {
      effect.current.lowFrequency.value = lowFrequency;
    }
  }, [lowFrequency]);

  useEffect(() => {
    if (
      typeof highFrequency !== 'undefined' &&
      effect.current &&
      effect.current.highFrequency
    ) {
      effect.current.highFrequency.value = highFrequency;
    }
  }, [highFrequency]);

  useEffect(() => {
    if (
      typeof frequency !== 'undefined' &&
      effect.current &&
      effect.current.frequency
    ) {
      effect.current.frequency.value = frequency;
    }
  }, [frequency]);

  useEffect(() => {
    if (
      typeof depth !== 'undefined' &&
      effect.current &&
      effect.current.depth
    ) {
      effect.current.depth.value = depth;
    }
  }, [depth]);

  useEffect(() => {
    if (
      typeof lfoType !== 'undefined' &&
      effect.current &&
      effect.current.type
    ) {
      effect.current.type = lfoType;
    }
  }, [lfoType]);

  useEffect(() => {
    if (
      typeof baseFrequency !== 'undefined' &&
      effect.current &&
      typeof effect.current.baseFrequency !== 'undefined'
    ) {
      effect.current.baseFrequency = baseFrequency;
    }
  }, [baseFrequency]);

  useEffect(() => {
    if (
      typeof octaves !== 'undefined' &&
      effect.current &&
      typeof effect.current.octaves !== 'undefined'
    ) {
      effect.current.octaves = octaves;
    }
  }, [octaves]);

  useEffect(() => {
    if (
      typeof sensitivity !== 'undefined' &&
      effect.current &&
      typeof effect.current.sensitivity !== 'undefined'
    ) {
      effect.current.sensitivity = sensitivity;
    }
  }, [sensitivity]);

  useEffect(() => {
    if (typeof Q !== 'undefined' && effect.current && effect.current.Q) {
      effect.current.Q.value = Q;
    }
  }, [Q]);

  useEffect(() => {
    if (typeof bits !== 'undefined' && effect.current && effect.current.bits) {
      effect.current.bits.value = bits;
    }
  }, [bits]);

  useEffect(() => {
    if (effect.current && typeof effect.current.distortion !== 'undefined') {
      effect.current.distortion = distortion;
    }
  }, [distortion]);

  useEffect(() => {
    if (
      typeof roomSize !== 'undefined' &&
      effect.current &&
      effect.current.roomSize
    ) {
      effect.current.roomSize.value = roomSize;
    }
  }, [roomSize]);

  useEffect(() => {
    if (
      typeof dampening !== 'undefined' &&
      effect.current &&
      typeof effect.current.dampening !== 'undefined'
    ) {
      effect.current.dampening = dampening;
    }
  }, [dampening]);

  useEffect(() => {
    if (
      typeof spread !== 'undefined' &&
      effect.current &&
      typeof effect.current.spread !== 'undefined'
    ) {
      effect.current.spread = spread;
    }
  }, [spread]);

  useEffect(() => {
    if (typeof pan !== 'undefined' && effect.current && effect.current.pan) {
      effect.current.pan.value = pan;
    }
  }, [pan]);

  useEffect(() => {
    if (
      typeof volume !== 'undefined' &&
      effect.current &&
      effect.current.volume
    ) {
      effect.current.volume.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (
      typeof width !== 'undefined' &&
      effect.current &&
      effect.current.width
    ) {
      effect.current.width.value = width;
    }
  }, [width]);

  useEffect(() => {
    if (
      typeof order !== 'undefined' &&
      effect.current &&
      typeof effect.current.order !== 'undefined'
    ) {
      effect.current.order = order;
    }
  }, [order]);

  useEffect(() => {
    if (
      typeof pitch !== 'undefined' &&
      effect.current &&
      typeof effect.current.pitch !== 'undefined'
    ) {
      effect.current.pitch = pitch;
    }
  }, [pitch]);

  useEffect(() => {
    if (
      typeof windowSize !== 'undefined' &&
      effect.current &&
      typeof effect.current.windowSize !== 'undefined'
    ) {
      effect.current.windowSize = windowSize;
    }
  }, [windowSize]);

  return null;
};

const Effect: React.FC<EffectProps> = (props) => {
  const { onAddToEffectsChain, onRemoveFromEffectsChain } = useContext(
    TrackContext,
  );

  return (
    <EffectConsumer
      onAddToEffectsChain={onAddToEffectsChain}
      onRemoveFromEffectsChain={onRemoveFromEffectsChain}
      {...props}
    />
  );
};

export default Effect;
