import React, { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';
import Tone from '../lib/tone';
import { effects } from '../constants';

const EffectConsumer = ({
  type,
  id,
  // options,
  delayTime = '8n',
  feedback = 0.5,
  onAddToEffectsChain,
  onRemoveFromEffectsChain,
}) => {
  const effect = useRef();

  useEffect(() => {
    // console.log('<Effect /> mount');
    // console.log(`id: ${id}`);

    if (type === 'feedbackDelay') {
      effect.current = new Tone.FeedbackDelay(delayTime, feedback);
    } else if (type === 'distortion') {
      effect.current = new Tone.Distortion(0.5);
    } else if (type === 'freeverb') {
      effect.current = new Tone.Freeverb();
    } else if (type === 'panVol') {
      effect.current = new Tone.PanVol();
    }

    effect.current.id = id;

    // Update effects chain
    // TODO: Work out which index to insert current this.effect
    onAddToEffectsChain(effect.current);

    return () => {
      // console.log('<Effect /> unmount');
      onRemoveFromEffectsChain(effect.current);
    };
  }, [type]);

  useEffect(() => {
    if (effect.current.feedback) {
      effect.current.feedback.value = feedback;
    }
  }, [feedback]);

  useEffect(() => {
    if (effect.current.delayTime) {
      effect.current.delayTime.value = delayTime;
    }
  }, [delayTime]);

  return null;
};

EffectConsumer.propTypes = {
  type: PropTypes.oneOf(effects).isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.object,
  delayTime: PropTypes.string,
  feedback: PropTypes.number,
  onAddToEffectsChain: PropTypes.func,
  onRemoveFromEffectsChain: PropTypes.func,
};

const Effect = (props) => {
  const value = useContext(TrackContext);

  return <EffectConsumer {...value} {...props} />;
};

export default Effect;
