import React from 'react';
import { render } from '@testing-library/react';
import Tone from 'tone';

import { Song, Track, Instrument, Effect } from '..';
import {
  mockAutoFilterConstructor,
  mockPolySynthChain,
} from '../__mocks__/tone';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Effect', () => {
  it('should add and remove effects from Instrument', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track
          steps={['C3']}
          // TODO: Remove need for key and id prop
          effects={[<Effect type="autoFilter" key="effect-1" id="effect-1" />]}
        >
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockAutoFilterConstructor).toBeCalled();
    expect(mockPolySynthChain).toBeCalledWith(
      { id: 'effect-1' },
      { pan: { value: 0 }, volume: { value: 0 } },
      Tone.Master,
    );

    rerender(
      <Song isPlaying={true}>
        <Track steps={['C3']} effects={[]}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      {
        pan: { value: 0 },
        volume: { value: 0 },
      },
      Tone.Master,
    );
  });
});
