import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';
import { NoteType } from '../types/propTypes';
import Tone from '../lib/tone';

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

	componentDidMount() {
		console.log('<Instrument />', 'mount');

		// this.Tone = require('tone'); // eslint-disable-line

		this.trackChannelBase = new Tone.PanVol(this.props.pan, this.props.volume);

		// Set up instrument
		this.initInstrument();
		this.connectInstrument(this.trackChannelBase);

		// Add this Instrument to Track Context
		this.props.updateInstruments([this.synth]);
	}

	componentDidUpdate(prevProps) {
		// -------------------------------------------------------------------------
		// VOLUME / PAN
		// -------------------------------------------------------------------------

		if (prevProps.volume !== this.props.volume) {
			console.log('volume', this.props.volume);
			this.trackChannelBase.volume.value = this.props.volume;
		}

		if (prevProps.pan !== this.props.pan) {
			console.log('pan', prevProps.pan, this.props.volume);
			this.trackChannelBase.pan.value = this.props.pan;
		}

		// -------------------------------------------------------------------------
		// CONNECT
		// -------------------------------------------------------------------------

		if (prevProps.effectsChain !== this.props.effectsChain) {
			this.updateEffectsChain(this.props.effectsChain);
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

	initInstrument = () => {
		this.synth = new Tone.PolySynth(
			this.props.polyphony,
			Tone.Synth,
			this.props.options,
		);
	};

	updateEffectsChain = (effectsChain) => {
		console.log('<Instrument />', 'updateEffectsChain', effectsChain);

		this.trackChannelBase = new Tone.PanVol(this.props.pan, this.props.volume);

		// NOTE: Using this.props.trackChannelBase causes effects to not turn off

		this.synth.disconnect();
		this.synth.chain(...[this.trackChannelBase, ...effectsChain], Tone.Master);
	};

	// Not used really
	connectInstrument = (trackChannel) => {
		console.log('<Instrument />', 'connectInstrument', trackChannel);

		if (trackChannel) {
			this.synth.disconnect();
			this.synth.chain(trackChannel, Tone.Master);
			// NOTE
			// Be careful with this syntax `.connect(trackChannel).toMaster()`
		} else {
			this.synth.disconnect();
			this.synth.toMaster();
		}
	};

	render() {
		return null;
	}
}

export default class Instrument extends Component {
	render() {
		return (
			<TrackContext.Consumer>
				{(value) => (
					<InstrumentConsumer
						updateInstruments={value.updateInstruments}
						effectsChain={value.effectsChain}
						// TODO: Implement!
						pan={value.pan}
						volume={value.volume}
						{...this.props}
					/>
				)}
			</TrackContext.Consumer>
		);
	}
}
