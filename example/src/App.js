import React, { Component } from 'react';

import { Song, Track, Instrument, Effect } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		steps: stepsA,
		isPlaying: false,
		inputVolume: 100,
		inputPan: 50,
		feedback: 0.6,
		defaultEffects: [
			<Effect
				type="feedbackDelay"
				key="effect-1"
				id="effect-1"
				delayTime={'16n'}
				feedback={0.6}
			/>,
			<Effect type="distortion" key="effect-2" id="effect-2" />,
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

	handleEffectClick = () => {
		this.setState({
			// hasEffect: !this.state.hasEffect,
			effects: this.state.defaultEffects,
		});
	};

	handleRemoveEffect = (id) => {
		this.setState({
			effects: this.state.effects.filter((effect) => effect.props.id !== id),
		});
	};

	handleSequencerClick = (note, i) => {
		const steps = [...this.state.steps];

		if (steps[i] && steps[i].note === note) {
			console.log('hi');

			console.log(steps[i].note);
			steps[i] = null;
		} else {
			steps[i] = {
				note,
				duration: 0.5,
			};
		}

		this.setState({
			steps,
		});
	};

	render() {
		const {
			isPlaying,
			inputVolume,
			notes,
			inputPan,
			effects,
			steps,
		} = this.state;

		console.log(steps);

		return (
			<div className="app">
				<h1>Reactronica</h1>
				<p>React components for making music</p>

				<div className="app__sequencer">
					{['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'].map((note) => {
						return (
							<div className="app__sequencer__row">
								{[...new Array(8)].map((_, i) => {
									const isActive = steps[i] && steps[i].note === note;

									// console.log(isActive);
									return (
										<button
											className={[
												'app__sequencer__step',
												isActive ? 'app__sequencer__step--is-active' : '',
											].join(' ')}
											onClick={() => this.handleSequencerClick(note, i)}
										>
											{note} {i + 1} {isActive && 'active'}
										</button>
									);
								})}
							</div>
						);
					})}
				</div>

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

				<button onClick={this.handleEffectClick}>Add Effects</button>
				<button onClick={this.handleFeedbackClick}>Add more feedback</button>

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
				{this.state.effects.map((effect) => {
					return (
						<div className="app__track__effect" key={effect.props.id}>
							<p>
								{effect.props.type}{' '}
								<button
									onClick={() => this.handleRemoveEffect(effect.props.id)}
								>
									Remove
								</button>
							</p>
						</div>
					);
				})}

				<Song isPlaying={isPlaying} tempo={110}>
					{/* {steps.map((steps, i) => ( */}
					<Track
						steps={steps}
						volume={(parseInt(inputVolume, 10) / 100) * 32 - 32}
						pan={(parseInt(inputPan, 10) / 100) * 2 - 1}
						effects={effects}
						// key={i}
					>
						<Instrument notes={notes} />
					</Track>
					{/* ))} */}
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
