# Reactronica

[https://reactronica.com](https://reactronica.com)

React audio components for making music in the browser.

React treats UI as a function of state. What if React’s declarative programming model could be applied to music as well?

This library aims to treat **_music_** as a function of state, rendering sound instead of UI. Visual components live side by side with Reactronica, sharing the same state and elegantly kept in sync.

Uses [ToneJS](https://tonejs.github.io/) under the hood. Inspired by [React Music](https://github.com/FormidableLabs/react-music).

> Warning: Highly experimental. APIs will change.

## Install

```bash
$ npm install --save reactronica tone
```

Note: Use React version >= 16.8 as [Hooks](https://reactjs.org/docs/hooks-intro.html) are used internally.

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
          doSomething(step, index);
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
        />
      </Track>
    </Song>
  );
};
```

## Development

```bash
# Start Reactronica component build watch
$ npm start
# To run example page, in new terminal:
$ cd example
# Link local version of Reactronica to example
$ npm link ../node_modules/react
# Start up!
$ npm start
# If you get a babel-eslint issue, create a .env file with SKIP_PREFLIGHT_CHECK=true in ./example
```

## Known Issues

- Tried to migrate library to Typescript, however having issues with `rollup-plugin-typescript` being too strict while bundling. (branch `jest-typescript` - 26/12/19).
- Tone installed as dependency due to `Module not found: Can't resolve 'tone' in '/Users/kcheung/Development/unkleho/reactronica/dist'` issue in `website/`. Keep as both dependency and peer for now.
- Latest Tone (13.4.9) has this issue `Cannot assign to read only property 'listener' of object '#<AudioContext>'` due to `https://stackoverflow.com/questions/55039122/why-does-tone-js-not-play-nice-in-a-svelte-component`. Tone cannot be bundled with Reactronica and has to be a peer dependency for now.
- If you get `Hooks can only be called inside the body of a function component.`, have a look at https://github.com/facebook/react/issues/14721. Try going into the examples folder and running `npm link ../node_modules/react`.

## Thanks

- https://tonejs.github.io/
- https://github.com/FormidableLabs/react-music
- https://github.com/transitive-bullshit/create-react-library
- https://github.com/crabacus/the-open-source-drumkit for the drum sounds

## License

MIT © [unkleho](https://github.com/unkleho)
