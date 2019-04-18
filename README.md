# Reactronica

> Warning: Highly experimental. APIs will change.

React audio components for making music in the browser. Uses [ToneJS](https://tonejs.github.io/) under the hood.

Check out the demo:
https://unkleho.github.io/reactronica/

Strongly influenced by [React Music](https://github.com/FormidableLabs/react-music).

[![NPM](https://img.shields.io/npm/v/reactronica.svg)](https://www.npmjs.com/package/reactronica)

## Install

```bash
npm install --save reactronica
```

## Usage

<!-- prettier-ignore-start -->
```jsx
import React, { Component } from 'react';

import { Song, Track, Instrument, Effect } from 'reactronica';

class Example extends Component {
  render() {
    return (
      <Song tempo={90} isPlaying={false}>
        <Track
          steps={[
            {
              note: 'C3',
              duration: 0.5,
            },
            {
              note: 'D3',
              duration: 0.5,
            },
            null,
            null,
          ]}
          effects={[
            <Effect type="feedbackDelay" />,
            <Effect type="distortion" />
          ]}
          // Callback for every tick
          onStepPlay={}
        >
          <Instrument type="polySynth" notes={[]} />
        </Track>
        <Track>
          <Instrument type="sampler" samples={{
            'C3': 'path/to/kick.mp3',
            'D3': 'path/to/snare.mp3',
            'E3': 'path/to/hihat.mp3',
          }} />
        </Track>
      </Song>
    );
  }
}
```
<!-- prettier-ignore-end -->

## Documentation

### `<Song />`

#### Props

- `tempo` (number): Speed or pace of the song. Measured in beats per minute.
- `isPlaying` (bool): Whether the song is playing or not. Defaults to `false`.

### `<Track />`

#### Props

- `steps` (array)
- `effects` (array)
- `onStepPlay` (func): Called on every tick.

### `<Instrument />`

#### Props

- `type` (string)
- `notes` (array)

## Development

```bash
# Start Reactronica component build watch
$ npm start
# To run example page, in new terminal:
$ cd example
$ npm start
```

## Thanks

- https://tonejs.github.io/
- https://github.com/FormidableLabs/react-music
- https://github.com/transitive-bullshit/create-react-library

## License

MIT © [unkleho](https://github.com/unkleho)
