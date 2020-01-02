import React from 'react';
import { render } from '@testing-library/react';
import Tone from 'tone';

import { Song, Track, Instrument, Effect } from '..';
import {
  mockPanVolConstructor,
  mockPanVolVolume,
  mockPanVolPan,
  mockPolySynthConstructor,
  mockPolySynthDispose,
  mockSamplerConstructor,
  mockSamplerDispose,
  mockAutoFilterConstructor,
  mockSequenceConstructor,
  mockPolySynthChain,
} from '../__mocks__/tone';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Song', () => {
  it('should render Song with tempo of 100 and then play', () => {
    const { rerender } = render(
      <Song isPlaying={false} tempo={100}>
        <Track steps={['C3']}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(Tone.Transport.bpm.value).toEqual(100);
    expect(Tone.Transport.start).toBeCalledTimes(0);

    rerender(
      <Song isPlaying={true} tempo={100}>
        <Track steps={['C3']}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(Tone.Transport.start).toBeCalledTimes(1);
  });
});

describe('Track', () => {
  it('should render Track with steps, pan and volume props', () => {
    const { rerender } = render(
      <Song isPlaying={false} tempo={100}>
        <Track steps={['C3', null]} pan={2} volume={-6}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockPanVolConstructor).toBeCalledWith(2, -6);

    rerender(
      <Song isPlaying={true} tempo={100}>
        <Track
          steps={['C3', null, [{ note: 'C3' }, { note: 'G3' }]]}
          pan={0}
          volume={0}
        >
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockPanVolVolume).toBeCalledWith(0);
    expect(mockPanVolPan).toBeCalledWith(0);
    expect(mockSequenceConstructor).toBeCalledWith([
      { index: 0, notes: [{ note: 'C3' }] },
      { index: 1, notes: [] },
      { index: 2, notes: [{ note: 'C3' }, { note: 'G3' }] },
    ]);
  });

  it('should remove Track from song', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(mockPanVolConstructor).toBeCalledWith(0, 0);
    expect(mockPolySynthDispose).toBeCalledTimes(0);

    rerender(<Song isPlaying={true}></Song>);

    expect(mockPolySynthDispose).toBeCalledTimes(1);
  });
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
