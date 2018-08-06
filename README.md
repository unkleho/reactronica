# Reactronica

> React components for making music

[![NPM](https://img.shields.io/npm/v/reactronica.svg)](https://www.npmjs.com/package/reactronica)

## Install

```bash
npm install --save reactronica
```

## Usage

```jsx
import React, { Component } from 'react';

import Song, { Track, Instrument } from 'reactronica';

class Example extends Component {
	render() {
		return (
			<Song tempo={90} isPlaying={false} volume={100}>
				<Track name="Beats" steps={[]} volume={100} effects={[]}>
					<Instrument type="sampler" options={options} notes={[]}>
						<Effect />
					</Instrument>
					<Effect />
				</Track>
				<Track name="Melody" steps={[]} effects={[]}>
					<Instrument type="synth" options={options} notes={[]} />
				</Track>
			</Song>
		);
	}
}
```

## Thanks

https://github.com/transitive-bullshit/create-react-library

## License

MIT © [unkleho](https://github.com/unkleho)
