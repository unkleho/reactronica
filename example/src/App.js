import React, { Component } from 'react';

import { Song, Track, Instrument, Effect } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		isPlaying: false,
		inputVolume: 100,
		inputPan: 50,
		hasEffect: false,
		feedback: 0.6,
		effects: [
			<Effect
				type="feedbackDelay"
				key="effect-1"
				id="effect-1"
				delayTime={'16n'}
				feedback={0.6}
			/>,
			<Effect type="distortion" key="effect-2" id="effect-2" />,
		],
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

	handleEffectClick = () => {
		this.setState({
			hasEffect: !this.state.hasEffect,
		});
	};

	handleFeedbackClick = () => {
		this.setState({
			feedback: 0.9,
		});
	};

	handleVolumeRange = (event) => {
		this.setState({
			inputVolume: event.target.value,
		});
	};

	handlePanRange = (event) => {
		this.setState({
			inputPan: event.target.value,
		});
	};

	handleRemoveOneEffect = () => {
		this.setState({
			effects: this.state.effects.slice(1),
		});
	};

	render() {
		const {
			isPlaying,
			inputVolume,
			notes,
			inputPan,
			effects,
			hasEffect,
		} = this.state;

		return (
			<div>
				<h1>Reactronica</h1>
				<p>React components for making music</p>

				<button onClick={this.togglePlaying}>
					{isPlaying ? 'Stop' : 'Play'}
				</button>

				<button
					onMouseDown={this.handleNoteDown}
					onMouseUp={this.handleNoteUp}
					onTouchStart={this.handleNoteDown}
					onTouchEnd={this.handleNoteUp}
				>
					Play Note
				</button>

				<button onClick={this.handleEffectClick}>Toggle Effect</button>
				<button onClick={this.handleFeedbackClick}>Add more feedback</button>
				<button onClick={this.handleRemoveOneEffect}>Remove one effect</button>

				<br />
				<br />

				<div className="">
					<label htmlFor="volume">Volume</label>
					<br />
					<input
						id="volume"
						type="range"
						value={inputVolume}
						onChange={this.handleVolumeRange}
					/>
					{inputVolume}
				</div>

				<br />

				<div className="">
					<label htmlFor="pan">Pan</label>
					<br />
					<input
						id="pan"
						type="range"
						value={inputPan}
						onChange={this.handlePanRange}
					/>
					{inputPan}
				</div>

				<Song isPlaying={isPlaying} tempo={110}>
					{[stepsA].map((steps, i) => (
						<Track
							steps={steps}
							volume={(parseInt(inputVolume, 10) / 100) * 32 - 32}
							pan={(parseInt(inputPan, 10) / 100) * 2 - 1}
							effects={hasEffect ? effects : []}
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
		duration: 0.5,
	},
	{
		note: 'D3',
		duration: 0.5,
	},
	{
		note: 'E3',
		duration: 0.5,
	},
	{
		note: 'G3',
		duration: 0.5,
	},
	{
		note: 'A3',
		duration: 1,
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
