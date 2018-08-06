import React, { Component } from 'react';

import { Song, Track, Instrument } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		isPlaying: false,
		volume: 0,
		pan: 0,
	};

	handleNoteDown = (e) => {
		this.setState({
			notes: [{ name: 'C3' }],
		});
	};

	handleNoteUp = () => {
		this.setState({
			notes: [],
		});
	};

	togglePlaying = () => {
		this.setState({
			isPlaying: !this.state.isPlaying,
		});
	};

	handleVolumeClick = () => {
		this.setState({
			volume: -32,
		});
	};

	handlePanClick = () => {
		this.setState({
			pan: 1,
		});
	};

	render() {
		const { isPlaying, volume, notes, pan } = this.state;

		return (
			<div>
				<button onClick={this.togglePlaying}>Play</button>

				<button
					onMouseDown={this.handleNoteDown}
					onMouseUp={this.handleNoteUp}
					onTouchStart={this.handleNoteDown}
					onTouchEnd={this.handleNoteUp}
				>
					Play Note
				</button>

				<button onClick={this.handleVolumeClick}>change volume</button>
				<button onClick={this.handlePanClick}>change pan</button>

				<Song isPlaying={isPlaying}>
					{[stepsA, stepsB].map((steps, i) => (
						<Track steps={steps} volume={volume} pan={pan} key={i}>
							<Instrument notes={notes} />
						</Track>
					))}
				</Song>
			</div>
		);
	}
}

const stepsA = [
	{
		note: 'C3',
		duration: 1,
		// position: 0,
	},
	null,
	null,
	null,
	{
		note: 'D3',
		duration: 1,
		// position: 2,
	},
	null,
	null,
	null,
];

const stepsB = [
	null,
	{
		note: 'C5',
		duration: 1,
		// position: 0,
	},
	null,
	null,
	null,
	null,
	{
		note: 'D5',
		duration: 1,
		// position: 2,
	},
	null,
];
