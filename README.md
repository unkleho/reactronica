# Reactronica

> Warning: Highly experimental. APIs will change.

React components for making music. Uses ToneJS under the hood.

Strongly influenced by [React Music](https://github.com/FormidableLabs/react-music).

Check out the demo - [http://unkleho.github.io/reactronica](http://unkleho.github.io/reactronica).

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
        >
          <Instrument type="polySynth" notes={[]} />
        </Track>
      </Song>
    );
  }
}
```
<!-- prettier-ignore-end -->

## Known Bugs

- If multiple effects are added, effects don't update unless they are removed in the order they are added. Could be an issue with `[...prevState.effects, effect]`.

## Thanks

- https://tonejs.github.io/
- https://github.com/FormidableLabs/react-music
- https://github.com/transitive-bullshit/create-react-library

## License

MIT © [unkleho](https://github.com/unkleho)
