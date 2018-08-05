import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StartAudioContext from 'startaudiocontext';

import { StepType } from '../types/propTypes';
// import { isEqual } from '../lib/utils';

export const SongContext = React.createContext();

export default class Song extends Component {
	static propTypes = {
		isPlaying: PropTypes.bool,
		tempo: PropTypes.number,
		steps: PropTypes.arrayOf(StepType),
		onStepStart: PropTypes.func,
		interval: PropTypes.string, // react-music = resolution
	};

	static defaultProps = {
		tempo: 90,
		steps: [],
		isPlaying: false,
		interval: '4n',
	};

	state = {
		tracks: [],
		instruments: [],
	};

	componentDidMount() {
		this.Tone = require('tone'); // eslint-disable-line
		this.Tone.Transport.bpm.value = this.props.tempo;

		// iOS Web Audio API requires this library.
		StartAudioContext(this.Tone.context);
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.isPlaying && this.props.isPlaying) {
			this.Tone.Transport.start();
		} else if (prevProps.isPlaying && !this.props.isPlaying) {
			this.Tone.Transport.stop();
		}
	}

	updateTracks = (tracks) => {
		this.setState({
			tracks,
		});
	};

	render() {
		const { tracks, instruments } = this.state;
		const { isPlaying } = this.props;

		return (
			<SongContext.Provider
				value={{
					tracks,
					instruments,
					updateTracks: this.updateTracks,
					isPlaying,
				}}
			>
				{this.props.children}
			</SongContext.Provider>
		);
	}
}
