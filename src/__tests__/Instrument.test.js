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
          <Instrument type="synth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toBeCalledTimes(1);
    expect(mockPolySynthConstructor).toBeCalledWith(4, undefined, undefined);
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
          <Instrument type="synth" notes={[{ name: 'C3' }]} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthTriggerAttack).toBeCalledWith('C3');
    expect(mockPolySynthTriggerRelease).not.toBeCalledWith('C3');

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="synth" notes={[]} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthTriggerRelease).toBeCalledWith('C3');
  });
});

describe('PolySynth', () => {
  it('should render with polyphony and oscillator props', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="synth"
            polyphony={5}
            oscillator={{ type: 'square' }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(5, undefined, {
      oscillator: {
        type: 'square',
      },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="synth"
            polyphony={3}
            oscillator={{ type: 'square' }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(3, undefined, {
      oscillator: {
        type: 'square',
      },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="synth"
            polyphony={3}
            oscillator={{ type: 'sine' }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(3, undefined, {
      oscillator: {
        type: 'sine',
      },
    });
  });
});
