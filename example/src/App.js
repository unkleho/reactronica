import React, { Component } from 'react';

import { Song, Track, Instrument } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		isPlaying: false,
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

	render() {
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

				<Song isPlaying={this.state.isPlaying}>
					{[stepsA, stepsB].map((steps, i) => (
						<Track steps={steps} key={i}>
							<Instrument notes={this.state.notes} />
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
