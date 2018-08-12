import React, { Component } from 'react';

import { Song, Track, Instrument, Effect } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		isPlaying: false,
		inputVolume: 100,
		inputPan: 50,
		feedback: 0.6,
		defaultEffects: [
			<Effect
				type="feedbackDelay"
				key="feedbackDelay-1"
				id="feedbackDelay-1"
				delayTime={'8n'}
				feedback={0.6}
			/>,
			<Effect type="distortion" key="distortion-2" id="distortion-2" />,
			<Effect type="freeverb" key="freeverb-3" id="freeverb-3" />,
		],
		effects: [],
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

	handleAddEffect = (effect) => {
		this.setState({
			effects: [...this.state.effects, effect],
		});
	};

	handleRemoveEffect = (id) => {
		this.setState({
			effects: this.state.effects.filter((effect) => effect.props.id !== id),
		});
	};

	render() {
		const { isPlaying, inputVolume, notes, inputPan, effects } = this.state;

		return (
			<div className="app">
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

				<h2>Track</h2>
				<div className="app__track">
					<div>
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

					<div>
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
				</div>

				<h3>Effects</h3>
				{this.state.defaultEffects.map((effect) => {
					return (
						<div className="app__track__effect" key={effect.props.id}>
							<p>
								{effect.props.type}{' '}
								{this.state.effects.some((e) => {
									return e.props.id === effect.props.id;
								}) ? (
									<button
										onClick={() => this.handleRemoveEffect(effect.props.id)}
									>
										Remove
									</button>
								) : (
									<button onClick={() => this.handleAddEffect(effect)}>
										Add
									</button>
								)}
							</p>
						</div>
					);
				})}

				<Song isPlaying={isPlaying} tempo={110}>
					{[stepsA].map((steps, i) => (
						<Track
							steps={steps}
							volume={(parseInt(inputVolume, 10) / 100) * 32 - 32}
							pan={(parseInt(inputPan, 10) / 100) * 2 - 1}
							effects={effects}
							key={i}
						>
							<Instrument type="polySynth" notes={notes} />
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

// const stepsB = [
// 	null,
// 	{
// 		note: 'C5',
// 		duration: 1,
// 		// position: 0,
// 	},
// 	null,
// 	null,
// 	null,
// 	null,
// 	{
// 		note: 'D5',
// 		duration: 1,
// 		// position: 2,
// 	},
// 	null,
// ];
