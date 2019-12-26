declare module 'reactronica' {
	import * as React from 'react';

	export type SongProps = {
		isPlaying: boolean;
		tempo: number;
	};

	const Song: React.FunctionComponent<SongProps>;
	const Track: React.FunctionComponent;
	const Instrument: React.FunctionComponent;
	const Effect: React.FunctionComponent;

	export { Song, Track, Instrument, Effect };
}
