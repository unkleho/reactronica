import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SongContext } from './Song';
import { StepType } from '../types/propTypes';
import { isEqual } from '../lib/utils';

class TrackConsumer extends Component {
	static propTypes = {
		steps: PropTypes.arrayOf(StepType),
		onStepStart: PropTypes.func,
		interval: PropTypes.string, // react-music = resolution
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line
	}

	componentDidUpdate(prevProps) {
		// console.log(prevProps, this.props);

		// STEPS
		// -------------------------------------------------------------------------

		// Start/Stop sequencer!
		if (!prevProps.isPlaying && this.props.isPlaying) {
			this.stepsToPlay = this.props.steps;

			this.seq = new this.Tone.Sequence(
				(time, step) => {
					if (step.note) {
						// Play sound
						this.props.instruments[0].triggerAttackRelease(
							step.note.name || step.note,
							step.duration,
							undefined,
							step.velocity,
						);
					}

					if (typeof this.props.onStepStart === 'function') {
						this.props.onStepStart(step);
					}
				},
				this.stepsToPlay,
				this.props.interval,
			);

			this.seq.start(0);
		} else if (prevProps.isPlaying && !this.props.isPlaying) {
			this.seq.stop();
		}

		// Update sequencer steps
		if (this.props.isPlaying) {
			// Deep compare prev and new steps, only update if they are different
			const doesStepsNeedUpdating = isEqual(prevProps.steps, this.props.steps);

			if (doesStepsNeedUpdating) {
				this.stepsToPlay = this.props.steps;
				this.seq.removeAll();

				this.stepsToPlay.forEach((note, i) => {
					this.seq.add(i, note);
				});
			}
		}
	}

	render() {
		return <div>{this.props.children}</div>;
	}
}

export default class Track extends Component {
	render() {
		return (
			<SongContext.Consumer>
				{(value) => <TrackConsumer {...value} {...this.props} />}
			</SongContext.Consumer>
		);
	}
}
