import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StartAudioContext from 'startaudiocontext';

// import styles from "./styles.css";
import { NoteType, StepType } from './types/propTypes';
import { isEqual } from './lib/utils';

export default class Reactronica extends Component<Props> {
	static propTypes = {
		notes: PropTypes.arrayOf(NoteType), // Currently played notes.
		steps: PropTypes.arrayOf(StepType),
		isPlaying: PropTypes.bool,
		onStepStart: PropTypes.func,
		interval: PropTypes.string, // react-music = resolution
		tempo: PropTypes.number,
	};

	static defaultProps = {
		notes: [],
		steps: [],
		isPlaying: false,
		interval: '4n',
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line

		// iOS Web Audio API requires this library.
		StartAudioContext(this.Tone.context);

		this.synth = new this.Tone.PolySynth(6, this.Tone.Synth, {
			oscillator: {
				partials: [0, 2, 3, 4],
			},
		}).toMaster();
	}

	componentDidUpdate(prevProps) {
		// console.log(prevProps);
		// console.log(this.props);

		// NOTES
		// -------------------------------------------------------------------------

		// Loop through all current notes
		this.props.notes.forEach((note) => {
			// Check if note is playing
			const isPlaying =
				prevProps.notes.filter((n) => n.name === note.name).length > 0;

			// Only play note is it isn't already playing
			if (!isPlaying) {
				this.synth.triggerAttack(note.name);
			}
		});

		// Loop through all previous notes
		prevProps.notes.forEach((note) => {
			// Check if note is still playing
			const isPlaying =
				this.props.notes.filter((n) => n.name === note.name).length > 0;

			if (!isPlaying) {
				this.synth.triggerRelease(note.name);
			}
		});

		// STEPS
		// -------------------------------------------------------------------------

		// Start/Stop sequencer!
		if (!prevProps.isPlaying && this.props.isPlaying) {
			this.stepsToPlay = this.props.steps;

			this.seq = new this.Tone.Sequence(
				(time, step) => {
					if (step.note) {
						// Play sound
						this.synth.triggerAttackRelease(
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

	render() {
		// const { notes } = this.props;

		return (
			<div className="audio">
				<span />
			</div>
		);
	}
}
