import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';

class EffectConsumer extends Component {
	static propTypes = {
		delayTime: PropTypes.number,
		feedback: PropTypes.number,
		effectsChain: PropTypes.array, // effectsChain?
		updateEffectsChain: PropTypes.func,
	};

	static defaultProps = {
		delayTime: '8n',
		feedback: 0,
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line

		this.effect = new this.Tone.FeedbackDelay(
			this.props.delayTime,
			this.props.feedback,
		);

		// An array of effects in Track that this Effect belongs to
		// TODO: Use this to update new chain
		// console.log(this.props.effectsChain);

		// Update effects chain
		this.props.updateEffectsChain([this.effect]);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.feedback !== this.props.feedback) {
			this.effect.feedback.value = this.props.feedback;
		}
	}

	render() {
		return <p>Effect</p>;
	}
}

export default class Effect extends Component {
	render() {
		return (
			<TrackContext.Consumer>
				{(value) => (
					<EffectConsumer
						updateEffectsChain={value.updateEffectsChain}
						effectsChain={value.effectsChain}
						{...this.props}
					/>
				)}
			</TrackContext.Consumer>
		);
	}
}
