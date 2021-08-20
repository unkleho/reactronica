# Reactronica

[https://reactronica.com](https://reactronica.com)

React audio components for making music in the browser.

React treats UI as a function of state. This library aims to treat **_music_** as a function of state, rendering sound instead of UI. Visual components live side by side with Reactronica, sharing the same state and elegantly kept in sync.

Uses [ToneJS](https://tonejs.github.io/) under the hood. Inspired by [React Music](https://github.com/FormidableLabs/react-music).

> Warning: Highly experimental. APIs will change.

## Install

```bash
$ npm install --save reactronica
```

Note: Use React version >= 16.8 as [Hooks](https://reactjs.org/docs/hooks-intro.html) are used internally.

## Template

To get started quickly with Create React App and Reactronica, just run the command below:

```bash
$ npx create-react-app my-app --template reactronica
```

## Documentation

[https://reactronica.com](https://reactronica.com/#documentation)

### Components

- [Song](https://reactronica.com/#song)
- [Track](https://reactronica.com/#track)
- [Instrument](https://reactronica.com/#instrument)
- [Effect](https://reactronica.com/#effect)

## Demos

- [Digital Audio Workstation](https://reactronica.com/daw)
- [Music chord, scale and progression finder](https://music-toolbox.now.sh)

## Usage

```jsx
import React from 'react';
import { Song, Track, Instrument, Effect } from 'reactronica';

const Example = () => {
  return (
    // Top level component must be Song, with Tracks nested inside
    <Song bpm={90} isPlaying={true}>
      <Track
        // Array of several types
        steps={[
          // Note in string format
          'C3',
          // Object with note name and duration
          { name: 'C3', duration: 0.5 },
          { name: 'D3', duration: 0.5 },
          // Array of strings for chords
          ['C3', 'G3'],
          null,
          null,
          // Array of objects for chords
          [
            { name: 'C3', duration: 0.5 },
            { name: 'G3', duration: 0.5 },
          ],
          null,
        ]}
        volume={80}
        pan={0}
        // Callback for every tick
        onStepPlay={(step, index) => {
          console.log(step, index);
        }}
      >
        <Instrument type="synth" />
        {/* Add effects chain here */}
        <Effect type="feedbackDelay" />
        <Effect type="distortion" />
      </Track>

      <Track>
        <Instrument
          type="sampler"
          samples={{
            C3: 'path/to/kick.mp3',
            D3: 'path/to/snare.mp3',
            E3: 'path/to/hihat.mp3',
          }}
          // Add some notes here to play
          notes={[{ name: 'C3' }]}
          onLoad={(buffers) => {
            // Runs when all samples are loaded
          }}
        />
      </Track>
    </Song>
  );
};
```

## Development

```bash
# Link local version of Reactronica
$ npm link
# Start Reactronica component build watch
$ npm start
# To run website docs, in new terminal:
$ cd website
# Link local version of Reactronica to website and use React version from Reactronica
# (Otherwise you'll get a `Hooks can only be called inside the body of a function component.`)
$ npm run link
# Start up website!
$ npm start
```

## Thanks

- https://tonejs.github.io/
- https://github.com/FormidableLabs/react-music
- https://github.com/jaredpalmer/tsdx
- https://github.com/crabacus/the-open-source-drumkit for the drum sounds

## License

MIT © [unkleho](https://github.com/unkleho)
