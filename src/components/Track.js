import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SongContext } from './Song';
import { NoteType } from '../types/propTypes';

class TrackConsumer extends Component {
	static propTypes = {
		notes: PropTypes.arrayOf(NoteType), // Currently played notes.
		updateTracks: PropTypes.func,
	};

	static defaultProps = {
		notes: [],
		tracks: [],
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
		this.props.updateTracks([this.synth]);
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

export class Track extends Component {
	render() {
		return (
			<SongContext.Consumer>
				{(value) => <TrackConsumer {...value} {...this.props} />}
			</SongContext.Consumer>
		);
	}
}
