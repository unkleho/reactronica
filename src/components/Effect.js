import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';
import Tone from '../lib/tone';

class EffectConsumer extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    delayTime: PropTypes.string,
    feedback: PropTypes.number,
    addToEffectsChain: PropTypes.func,
    removeFromEffectsChain: PropTypes.func,
  };

  static defaultProps = {
    delayTime: '8n',
    feedback: 0.5,
  };

  componentDidMount() {
    console.log('<Effect /> mount');
    console.log(`id: ${this.props.id}`);

    // Tone = require('tone'); // eslint-disable-line

    if (this.props.type === 'feedbackDelay') {
      this.effect = new Tone.FeedbackDelay(
        this.props.delayTime,
        this.props.feedback,
      );
    } else if (this.props.type === 'distortion') {
      this.effect = new Tone.Distortion(0.8);
    }

    this.effect.id = this.props.id;

    // Update effects chain
    // TODO: Work out which index to insert current this.effect
    this.props.addToEffectsChain(this.effect);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.feedback !== this.props.feedback) {
      this.effect.feedback.value = this.props.feedback;
    }
  }

  componentWillUnmount() {
    console.log('<Effect /> unmount');
    this.props.removeFromEffectsChain(this.effect);
  }

  render() {
    return null;
  }
}

export default class Effect extends Component {
  render() {
    return (
      <TrackContext.Consumer>
        {(value) => (
          <EffectConsumer
            addToEffectsChain={value.addToEffectsChain}
            removeFromEffectsChain={value.removeFromEffectsChain}
            {...this.props}
          />
        )}
      </TrackContext.Consumer>
    );
  }
}
