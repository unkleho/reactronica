import React, { Component } from 'react';

import { Song, Track } from 'reactronica';

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

				<Song
					steps={[
						{
							note: 'C3',
							// position: 0,
						},
						null,
						null,
						null,
						{
							note: 'D3',
							// position: 2,
						},
						null,
						null,
						null,
					]}
					isPlaying={this.state.isPlaying}
				>
					<Track notes={this.state.notes} />
				</Song>
			</div>
		);
	}
}
