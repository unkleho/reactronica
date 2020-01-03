import React from 'react';
import { render } from '@testing-library/react';
import Tone from 'tone';

import { Song, Track, Instrument, Effect } from '..';
import {
  mockAutoFilterConstructor,
  mockAutoPannerConstructor,
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
          effects={<Effect type="autoFilter" id="effect-1" />}
        >
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockAutoFilterConstructor).toBeCalled();
    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-1' },
      { pan: { value: 0 }, volume: { value: 0 } },
      Tone.Master,
    );

    rerender(
      <Song isPlaying={true}>
        <Track
          steps={['C3']}
          effects={
            <>
              <Effect type="autoFilter" id="effect-1" />
              <Effect type="autoPanner" id="effect-2" />
            </>
          }
        >
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockAutoPannerConstructor).toBeCalled();
    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-2' },
      { id: 'effect-1' },
      { pan: { value: 0 }, volume: { value: 0 } },
      Tone.Master,
    );

    rerender(
      <Song isPlaying={true}>
        <Track
          steps={['C3']}
          effects={
            <>
              <Effect type="autoPanner" id="effect-2" />
            </>
          }
        >
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-2' },
      { pan: { value: 0 }, volume: { value: 0 } },
      Tone.Master,
    );

    rerender(
      <Song isPlaying={true}>
        <Track steps={['C3']} effects={null}>
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
