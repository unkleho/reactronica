import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SongContext } from './Song';
import { NoteType } from '../types/propTypes';

class InstrumentConsumer extends Component {
	static propTypes = {
		notes: PropTypes.arrayOf(NoteType), // Currently played notes.
		updateInstruments: PropTypes.func,
	};

	static defaultProps = {
		notes: [],
		// tracks: [],
		instruments: [],
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line

		// Build Synth
		this.synth = new this.Tone.PolySynth(6, this.Tone.Synth, {
			oscillator: {
				partials: [0, 2, 3, 4],
			},
		}).toMaster();

		// Add this Track to Song Context
		this.props.updateInstruments([this.synth]);
	}

	componentDidUpdate(prevProps) {
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
	}

	render() {
		return <p>test</p>;
	}
}

export default class Instrument extends Component {
	render() {
		return (
			<SongContext.Consumer>
				{(value) => <InstrumentConsumer {...value} {...this.props} />}
			</SongContext.Consumer>
		);
	}
}
