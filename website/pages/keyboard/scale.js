import { Component, Fragment } from 'react';
import withRedux from 'next-redux-wrapper';
import { bindActionCreators } from 'redux';

import App from '../../components/App';
import Keyboard from '../../components/Keyboard';
import ButtonList from '../../components/ButtonList';
import Audio from '../../components/Audio';
// import Link from '../../components/Link';
import { Router } from '../../routes';
import { initStore } from '../../lib/store';
import {
	updateScale,
	updateRole,
	toggleSequence,
} from '../../actions/keyboardActions';

import '../keyboard.css';

class HomePage extends Component {
	static getInitialProps(props) {
		const {
			query: { scale },
			// isServer,
			store,
			// pathname,
		} = props;

		store.dispatch(updateRole('scale'));

		const tonic = decodeURIComponent(scale.split('-')[0]);
		const scaleType = scale.split('-')[1];

		store.dispatch(updateScale(tonic, scaleType));
	}

	constructor() {
		super();

		this.state = {
			isPlaying: false,
			audioNotes: [], // Notes to play with <Audio />
			activeNotes: [], // Notes to highlight in <Keyboard /> (along with audioNotes)
		};
	}

	handleScaleTypeClick = (scaleType) => {
		// this.props.updateScale(this.props.tonic, scaleType.name);

		Router.pushRoute(
			`/keyboard/scale/${encodeURIComponent(this.props.tonic)}-${scaleType}`,
		);
	};

	handlePlayClick = () => {
		this.props.toggleSequence(); // Rename to togglePlayButton?
	};

	render() {
		const {
			tonic, // Make this a Note type too?
			rootName,
			keyboardNotes,
			selectedNotes, // Scale
			keys,
			// activeNotes,
			scaleType,
			scaleTypes,
			roles,
			role,
			isPlaying,
			audioNotes,
		} = this.props;

		console.log(audioNotes);

		return (
			<App>
				<Audio
					tempo={100}
					notes={this.state.audioNotes}
					steps={selectedNotes.map((note) => {
						return {
							note,
							duration: '4n',
							velocity: 1,
						};
					})}
					// steps={[{ note: 'C3', duration: '4n' }, {}, {}]}
					isPlaying={isPlaying}
					onStepStart={(step) => {
						this.setState({
							activeNotes: [...this.state.activeNotes, step.note],
						});

						const timeout = setTimeout(() => {
							this.setState({
								activeNotes: this.state.activeNotes.filter(
									(n) => n.name !== step.note.name,
								),
							});
							clearTimeout(timeout);
						}, 300);
					}}
					interval="4n"
				/>

				<div className="container container--sm">
					<header className="keyboard__header">
						<div className="keyboard__header__content">
							{role === 'scale' && (
								<Fragment>
									<h1 className="keyboard__header__title">
										<span className="keyboard__header__subtitle">Scale</span>
										{tonic} {scaleType}
									</h1>
								</Fragment>
							)}
						</div>

						<button
							className="play-button"
							onClick={this.handlePlayClick}
							dangerouslySetInnerHTML={{
								__html: this.props.isPlaying ? '&#9724;' : '&#9654;',
							}}
						/>
					</header>

					<Keyboard
						notes={keyboardNotes} // Highlighted Notes
						activeNotes={[...this.state.audioNotes, ...this.state.activeNotes]}
						selectedNotes={role !== 'chord' && selectedNotes}
						tonic={role === 'chord' ? undefined : tonic}
						rootNoteName={rootName} // Note quite working yet
						startNoteName="C3"
						endNoteName="B3"
						onNoteDown={(note) => {
							// Play note
							this.setState({
								audioNotes: [note],
							});

							this.props.updateAudioNotes([note]);
						}}
						onNoteUp={() => {
							this.setState({
								audioNotes: [],
							});
						}}
						canNotesWrap={true}
					/>
					<br />

					<h2>Tonic Note</h2>
					<ButtonList
						items={keys.map((key) => ({
							name: key.note[0], // Use 1 for minor keys
							isActive: key.note[0] === tonic || key.note[1] === tonic,
							slug: encodeURIComponent(key.note[0]),
							pitch: key.note[0], // TODO: Switch to [1] for minor scale
							onClick: () => {
								Router.pushRoute(
									`/keyboard/${role}/${encodeURIComponent(
										key.note[0],
									)}-${scaleType}`,
								);
							},
						}))}
					/>

					<h2>Scale Types</h2>
					<ButtonList
						items={scaleTypes.map((s) => ({
							name: s,
							isActive: s === scaleType,
							onClick: (item) => this.handleScaleTypeClick(item.name),
						}))}
					/>
				</div>
			</App>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateScale: bindActionCreators(updateScale, dispatch),
		toggleSequence: bindActionCreators(toggleSequence, dispatch),
	};
};

export default withRedux(
	initStore,
	(state) => ({
		...state.keyboard,
		...state.audio,
	}),
	mapDispatchToProps,
)(HomePage);
