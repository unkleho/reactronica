import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StartAudioContext from 'startaudiocontext';

import { NoteType, StepType } from '../types/propTypes';
import { isEqual } from '../lib/utils';

export const SongContext = React.createContext();

export class Song extends Component {
	static propTypes = {
		notes: PropTypes.arrayOf(NoteType), // Currently played notes.
		steps: PropTypes.arrayOf(StepType),
		isPlaying: PropTypes.bool,
		onStepStart: PropTypes.func,
		interval: PropTypes.string, // react-music = resolution
		tempo: PropTypes.number,
	};

	static defaultProps = {
		tempo: 90,
		steps: [],
		isPlaying: false,
		interval: '4n',
	};

	state = {
		tracks: [],
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line

		// iOS Web Audio API requires this library.
		StartAudioContext(this.Tone.context);
	}

	componentDidUpdate(prevProps) {
		// console.log(prevProps, this.props);

		// STEPS
		// -------------------------------------------------------------------------

		// Start/Stop sequencer!
		if (!prevProps.isPlaying && this.props.isPlaying) {
			this.stepsToPlay = this.props.steps;

			console.log(this.props.steps);

			this.seq = new this.Tone.Sequence(
				(time, step) => {
					if (step.note) {
						// Play sound
						this.state.tracks[0].triggerAttackRelease(
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

			this.Tone.Transport.bpm.value = this.props.tempo;
			this.Tone.Transport.start();
			this.seq.start(0);
		} else if (prevProps.isPlaying && !this.props.isPlaying) {
			this.Tone.Transport.stop();
			this.seq.stop();
		}

		// Update sequencer
		if (this.props.isPlaying) {
			// Deep compare prev and new steps, only update if they are different
			const isStepsNeedUpdating = isEqual(prevProps.steps, this.props.steps);

			if (isStepsNeedUpdating) {
				this.stepsToPlay = this.props.steps;
				this.seq.removeAll();

				this.stepsToPlay.forEach((note, i) => {
					this.seq.add(i, note);
				});
			}
		}
	}

	updateTracks = (tracks) => {
		this.setState({
			tracks,
		});
	};

	render() {
		const { tracks } = this.state;
		console.log(tracks);

		return (
			<SongContext.Provider value={{ tracks, updateTracks: this.updateTracks }}>
				{this.props.children}
			</SongContext.Provider>
		);
	}
}
