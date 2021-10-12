import React, { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';
import Tone from '../lib/tone';
import { EffectTypes } from '../types/propTypes';

export type EffectType =
  | 'autoFilter'
  | 'autoPanner'
  | 'autoWah'
  | 'bitCrusher'
  | 'distortion'
  | 'feedbackDelay'
  | 'freeverb'
  | 'panVol'
  | 'tremolo'
  | 'eq3';

export interface EffectProps {
  type?: EffectType;
  id?: string;
  delayTime?: string;
  feedback?: number;
  wet?: number;
  low?: number;
  mid?: number;
  high?: number;
  lowFrequency?: number;
  highFrequency?: number;
}

export interface EffectConsumerProps extends EffectProps {
  onAddToEffectsChain?: Function;
  onRemoveFromEffectsChain?: Function;
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
  onAddToEffectsChain,
  onRemoveFromEffectsChain,
}) => {
  const effect = useRef<{
    id: string | number;
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
  }>();

  useEffect(() => {
    // console.log('<Effect /> mount');
    // console.log(`id: ${id}`);

    if (type === 'autoFilter') {
      effect.current = new Tone.AutoFilter();
    } else if (type === 'autoPanner') {
      effect.current = new Tone.AutoPanner();
    } else if (type === 'autoWah') {
      effect.current = new Tone.AutoWah();
    } else if (type === 'bitCrusher') {
      effect.current = new Tone.BitCrusher();
      // Removed for now because delayTime has to be in ms
      // } else if (type === 'chorus') {
      //   effect.current = new Tone.Chorus();
    } else if (type === 'distortion') {
      effect.current = new Tone.Distortion(0.5);
    } else if (type === 'feedbackDelay') {
      effect.current = new Tone.FeedbackDelay(delayTime, feedback);
    } else if (type === 'freeverb') {
      effect.current = new Tone.Freeverb();
    } else if (type === 'panVol') {
      effect.current = new Tone.PanVol();
      // Needs generate()
      // } else if (type === 'reverb') {
      //   effect.current = new Tone.Reverb();
    } else if (type === 'tremolo') {
      effect.current = new Tone.Tremolo();
    } else if (type === 'eq3') {
      effect.current = new Tone.EQ3(low, mid, high);
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

  return null;
};

EffectConsumer.propTypes = {
  // @ts-ignore
  type: EffectTypes.isRequired,
  // @ts-ignore
  id: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  delayTime: PropTypes.string,
  feedback: PropTypes.number,
  wet: PropTypes.number,
  low: PropTypes.number,
  mid: PropTypes.number,
  high: PropTypes.number,
  lowFrequency: PropTypes.number,
  highFrequency: PropTypes.number,
  // <Track /> Props
  onAddToEffectsChain: PropTypes.func,
  onRemoveFromEffectsChain: PropTypes.func,
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
