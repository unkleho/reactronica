declare module 'reactronica' {
	import * as React from 'react';

	export type SongProps = {
		isPlaying: boolean;
		tempo: number;
	};

	const Song: React.FunctionComponent<SongProps>;

	export { Song };
}
