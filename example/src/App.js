import React, { Component } from 'react';

import Reactronica from 'reactronica';

export default class App extends Component {
	state = {
		notes: [],
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

	render() {
		return (
			<div>
				<div
					onMouseDown={this.handleNoteDown}
					onMouseUp={this.handleNoteUp}
					onTouchStart={this.handleNoteDown}
					onTouchEnd={this.handleNoteUp}
				>
					Play Note
				</div>

				<Reactronica notes={this.state.notes} />
			</div>
		);
	}
}
