import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';

class EffectConsumer extends Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		delayTime: PropTypes.string,
		feedback: PropTypes.number,
		effectsChain: PropTypes.array, // An array of Tone JS effects
		addToEffectsChain: PropTypes.func,
	};

	static defaultProps = {
		delayTime: '8n',
		feedback: 0,
	};

	componentDidMount() {
		console.log('Effect mount');
		console.log(this.props.id);

		this.Tone = require('tone'); // eslint-disable-line

		if (this.props.type === 'feedbackDelay') {
			this.effect = new this.Tone.FeedbackDelay(
				this.props.delayTime,
				this.props.feedback,
			);
			// Assign unique id
			// Potentially used uuid
			this.effect.id = this.props.id;
		}

		// An array of effects in Track that this Effect belongs to
		// TODO: Use this to update new chain.
		// console.log(this.props.effectsChain);

		// Update effects chain
		// TODO: Work out which index to insert current this.effect
		this.props.addToEffectsChain(this.effect);
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
						addToEffectsChain={value.addToEffectsChain}
						effectsChain={value.effectsChain}
						{...this.props}
					/>
				)}
			</TrackContext.Consumer>
		);
	}
}
