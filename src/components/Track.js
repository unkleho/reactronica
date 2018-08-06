import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SongContext } from './Song';
import { StepType } from '../types/propTypes';
import { isEqual } from '../lib/utils';

export const TrackContext = React.createContext();

class TrackConsumer extends Component {
	static propTypes = {
		steps: PropTypes.arrayOf(StepType),
		onStepStart: PropTypes.func,
		interval: PropTypes.string, // react-music = resolution
		volume: PropTypes.number,
		pan: PropTypes.number,
	};

	static defaultProps = {
		volume: 0,
		pan: 0,
	};

	state = {
		instruments: [],
		track: null,
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line

		// Example of chaining
		// const feedbackDelay = new this.Tone.FeedbackDelay('8n', 0.5);
		const trackChain = [
			// feedbackDelay,
			this.Tone.Master,
		];

		// Setup new track based on pan and volume component
		this.trackChannel = new this.Tone.PanVol(
			this.props.pan,
			this.props.volume,
		).chain(...trackChain);

		this.setState({
			trackChannel: this.trackChannel,
		});
	}

	componentDidUpdate(prevProps) {
		// console.log(prevProps, this.props);

		// -------------------------------------------------------------------------
		// STEPS
		// -------------------------------------------------------------------------

		// Start/Stop sequencer!
		if (!prevProps.isPlaying && this.props.isPlaying) {
			this.stepsToPlay = this.props.steps;

			this.seq = new this.Tone.Sequence(
				(time, step) => {
					if (step.note) {
						// Play sound
						this.state.instruments[0].triggerAttackRelease(
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

		// -------------------------------------------------------------------------
		// VOLUME / PAN
		// -------------------------------------------------------------------------

		if (prevProps.volume !== this.props.volume) {
			this.trackChannel.volume.value = this.props.volume;
		}

		if (prevProps.pan !== this.props.pan) {
			this.trackChannel.pan.value = this.props.pan;
		}
	}

	updateInstruments = (instruments) => {
		this.setState({
			instruments,
		});
	};

	render() {
		return (
			<TrackContext.Provider
				value={{
					updateInstruments: this.updateInstruments,
					trackChannel: this.state.trackChannel,
				}}
			>
				{this.props.children}
			</TrackContext.Provider>
		);
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
