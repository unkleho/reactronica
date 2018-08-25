import React, { Component } from 'react';

import { Song, Track, Instrument, Effect } from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
		melodySteps: stepsA,
		beatSteps: stepsB,
		currentStepsName: 'melodySteps',
		activeStepIndex: null,
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
			effects: this.state.defaultEffects,
		});
	};

	handleRemoveEffect = (id) => {
		this.setState({
			effects: this.state.effects.filter((effect) => effect.props.id !== id),
		});
	};

	handleSequencerClick = (note, i, currentStepsName) => {
		console.log(currentStepsName);

		const steps = [...this.state[currentStepsName]];

		if (steps[i] && steps[i].note === note) {
			// Clear step
			steps[i] = null;
		} else {
			// Assign step
			steps[i] = {
				note,
				duration: 0.5,
			};
		}

		this.setState({
			[currentStepsName]: steps,
		});
	};

	handleStepPlay = (step) => {
		this.setState({
			activeStepIndex: step.index,
		});
	};

	handleStepsChooserClick = (name) => {
		this.setState({
			currentStepsName: name,
		});
	};

	handleKeyboardDown = (note) => {
		this.setState({
			notes: [{ name: note }],
		});
	};

	handleKeyboardUp = () => {
		this.setState({
			notes: [],
		});
	};

	render() {
		const {
			isPlaying,
			inputVolume,
			notes,
			inputPan,
			effects,
			melodySteps,
			beatSteps,
			activeStepIndex,
			currentStepsName,
		} = this.state;

		return (
			<div className="app">
				<h1>Reactronica</h1>
				<p>React audio components for making music in the browser.</p>

				<p>
					Check out the repo:
					<br />
					<a href="https://github.com/unkleho/reactronica">
						https://github.com/unkleho/reactronica
					</a>
				</p>

				<br />

				<div className="app__steps-chooser">
					{['melody', 'beat'].map((name) => {
						return (
							<button
								className={[
									'app__steps-chooser__button',
									`${name}Steps` === currentStepsName
										? 'app__steps-chooser__button--is-active'
										: '',
								].join(' ')}
								onClick={() => this.handleStepsChooserClick(`${name}Steps`)}
								key={name}
							>
								{name}
							</button>
						);
					})}
				</div>

				<div className="app__sequencer">
					<div className="app__sequencer__row">
						{[...new Array(9)].map((_, i) => {
							return (
								<div
									className={[
										'app__sequencer__step',
										activeStepIndex + 1 === i
											? 'app__sequencer__step--is-active'
											: '',
									].join(' ')}
									key={`header-${i}`}
								>
									{i !== 0 && i}
								</div>
							);
						})}
					</div>

					{['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'].map((note) => {
						const steps = this.state[currentStepsName];

						return (
							<div className="app__sequencer__row" key={note}>
								{[...new Array(9)].map((_, i) => {
									const index = i - 1;
									const isActive = steps[index] && steps[index].note === note;

									// For the first column, show playable keyboard
									if (i === 0) {
										return (
											<button
												className={['app__sequencer__step'].join(' ')}
												onMouseDown={() => this.handleKeyboardDown(note)}
												onMouseUp={() => this.handleKeyboardUp(note)}
											>
												{note}
											</button>
										);
									}

									return (
										<button
											className={[
												'app__sequencer__step',
												isActive ? 'app__sequencer__step--is-active' : '',
											].join(' ')}
											onClick={() => {
												return this.handleSequencerClick(
													note,
													index,
													currentStepsName,
												);
											}}
											key={i}
										/>
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
					<Track
						steps={melodySteps}
						volume={(parseInt(inputVolume, 10) / 100) * 32 - 32}
						pan={(parseInt(inputPan, 10) / 100) * 2 - 1}
						effects={effects}
						onStepPlay={this.handleStepPlay}
					>
						<Instrument notes={notes} />
					</Track>

					<Track steps={beatSteps}>
						<Instrument
							type="sampler"
							samples={{
								C3: '/samples/BD_Blofeld_014.wav',
								D3: '/samples/SD_Blofeld_03.wav',
								E3: '/samples/HH_Blofeld_004.wav',
							}}
						/>
					</Track>
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
	{
		note: 'C3',
		duration: 1,
	},
	null,
	{
		note: 'D3',
		duration: 1,
	},
	null,
	{
		note: 'C3',
		duration: 1,
	},
	{
		note: 'E3',
		duration: 1,
	},
	{
		note: 'D3',
		duration: 1,
	},
	{
		note: 'E3',
		duration: 1,
	},
];
