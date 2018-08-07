import React, { Component } from 'react';

import { Song, Track, Instrument, Effect } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		isPlaying: false,
		volume: 0,
		pan: 0,
		hasEffect: false,
		feedback: 0.2,
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

	handleEffectClick = () => {
		this.setState({
			hasEffect: true,
		});
	};

	handleFeedbackClick = () => {
		this.setState({
			feedback: 0.7,
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
				<button onClick={this.handleEffectClick}>Add effect</button>
				<button onClick={this.handleFeedbackClick}>Add more feedback</button>

				<Song isPlaying={isPlaying}>
					{[stepsA, stepsB].map((steps, i) => (
						<Track
							steps={steps}
							volume={volume}
							pan={pan}
							effects={
								this.state.hasEffect
									? [
											<Effect
												key="effect-1"
												delayTime={'16n'}
												feedback={this.state.feedback}
											/>,
											// <Effect key="effect-2" />,
									  ]
									: []
							}
							key={i}
						>
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
