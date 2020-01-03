import React from 'react';
import { render } from '@testing-library/react';

import { Song, Track, Instrument } from '..';
import {
  mockPolySynthConstructor,
  mockPolySynthTriggerAttack,
  mockPolySynthTriggerRelease,
  mockPolySynthDispose,
  mockSamplerConstructor,
  mockSamplerDispose,
} from '../__mocks__/tone';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Instrument', () => {
  it('should add and remove polySynth from Song', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toBeCalledTimes(1);
    expect(mockPolySynthConstructor).toBeCalledWith(4, undefined, {
      oscillator: { partials: [0, 2, 3, 4] },
      polyphony: 4,
    });
    expect(mockPolySynthDispose).toBeCalledTimes(0);

    rerender(<Song isPlaying={true}></Song>);

    expect(mockPolySynthDispose).toBeCalledTimes(1);
  });

  it('should add and remove sampler from Song', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument
            type="sampler"
            samples={{
              C3: '../audio/file.mp3',
            }}
          />
        </Track>
      </Song>,
    );

    expect(mockSamplerConstructor).toBeCalledWith({
      C3: '../audio/file.mp3',
    });

    rerender(<Song isPlaying={true}></Song>);

    expect(mockSamplerDispose).toBeCalledTimes(1);
  });

  it('should trigger and release note', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="polySynth" notes={[{ name: 'C3' }]} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthTriggerAttack).toBeCalledWith('C3');
    expect(mockPolySynthTriggerRelease).not.toBeCalledWith('C3');

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="polySynth" notes={[]} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthTriggerRelease).toBeCalledWith('C3');
  });
});
