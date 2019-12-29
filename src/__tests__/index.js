import React from 'react';
import { render } from '@testing-library/react';
import Tone from 'tone';

import { Song, Track, Instrument } from '..';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Song', () => {
  it('should render Song with tempo of 100 and play', () => {
    const { rerender } = render(
      <Song isPlaying={false} tempo={100}>
        <Track steps={['C3']}>
          <Instrument type="polySynth"></Instrument>
        </Track>
      </Song>,
    );

    expect(Tone.Transport.bpm.value).toEqual(100);
    expect(Tone.Transport.start).toBeCalledTimes(0);

    rerender(
      <Song isPlaying={true} tempo={100}>
        <Track steps={['C3']}>
          <Instrument type="polySynth"></Instrument>
        </Track>
      </Song>,
    );

    expect(Tone.Transport.start).toBeCalledTimes(1);
  });
});

describe('Track', () => {
  it('should render Track', () => {
    const { rerender } = render(
      <Song isPlaying={false} tempo={100}>
        <Track steps={['C3']}>
          <Instrument type="polySynth"></Instrument>
        </Track>
      </Song>,
    );

    console.log(rerender);

    expect(Tone.Transport.bpm.value).toEqual(100);
    expect(Tone.Transport.start).toBeCalledTimes(0);
  });
});
