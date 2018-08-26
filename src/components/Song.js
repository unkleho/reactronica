import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StartAudioContext from 'startaudiocontext';

import Tone from '../lib/tone';
// import { isEqual } from '../lib/utils';

export const SongContext = React.createContext();

export default class Song extends Component {
	static propTypes = {
		isPlaying: PropTypes.bool,
		tempo: PropTypes.number,
		// subdivision: PropTypes.string, // react-music = resolution
		swing: PropTypes.number,
		swingSubdivision: PropTypes.string,
		onStepStart: PropTypes.func,
	};

	static defaultProps = {
		isPlaying: false,
		tempo: 90,
		// subdivision: '4n',
		swing: 0,
		swingSubdivision: '8n',
	};

	state = {
		tracks: [],
		instruments: [],
	};

	componentDidMount() {
		Tone.Transport.bpm.value = this.props.tempo;
		Tone.Transport.swing = this.props.swing;
		Tone.Transport.swingSubdivision = this.props.swingSubdivision;

		// iOS Web Audio API requires this library.
		StartAudioContext(Tone.context);
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.isPlaying && this.props.isPlaying) {
			Tone.Transport.start();
		} else if (prevProps.isPlaying && !this.props.isPlaying) {
			Tone.Transport.stop();
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
