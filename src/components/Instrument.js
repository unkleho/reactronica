import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';
import { NoteType } from '../types/propTypes';

class InstrumentConsumer extends Component {
	static propTypes = {
		notes: PropTypes.arrayOf(NoteType), // Currently played notes.
		polyphony: PropTypes.number,
		options: PropTypes.object,
		// An instance of new this.Tone.PanVol()
		trackChannel: PropTypes.object,
		updateInstruments: PropTypes.func,
	};

	static defaultProps = {
		notes: [],
		instruments: [],
		polyphony: 4,
		options: {
			oscillator: {
				partials: [0, 2, 3, 4],
			},
		},
		trackChannel: null,
	};

	initInstrument() {
		this.synth = new this.Tone.PolySynth(
			this.props.polyphony,
			this.Tone.Synth,
			this.props.options,
		);
	}

	connectInstrument(trackChannel) {
		console.log('<Instrument />', 'connectInstrument', trackChannel);

		if (trackChannel) {
			this.synth.disconnect();
			this.synth.connect(trackChannel);
		} else {
			this.synth.disconnect();
			this.synth.toMaster();
		}
	}

	componentDidMount() {
		console.log('<Instrument />', 'mount');

		this.Tone = require('tone'); // eslint-disable-line

		// Set up instrument
		this.initInstrument();
		this.connectInstrument();

		// Add this Instrument to Track Context
		this.props.updateInstruments([this.synth]);
	}

	componentDidUpdate(prevProps) {
		// -------------------------------------------------------------------------
		// CONNECT
		// -------------------------------------------------------------------------

		if (prevProps.trackChannel !== this.props.trackChannel) {
			// Connect or disconnect instrument to new trackChannel
			console.log('<Instrument />', 'connectInstrument');

			this.connectInstrument(this.props.trackChannel);
		}

		if (prevProps.effectsChain !== this.props.effectsChain) {
			this.connectInstrument(this.props.trackChannel);
		}

		// -------------------------------------------------------------------------
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
			<TrackContext.Consumer>
				{(value) => (
					<InstrumentConsumer
						updateInstruments={value.updateInstruments}
						trackChannel={value.trackChannel}
						effectsChain={value.effectsChain}
						{...this.props}
					/>
				)}
			</TrackContext.Consumer>
		);
	}
}
