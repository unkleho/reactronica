import React from 'react';
import { render } from '@testing-library/react';
import * as Tone from 'tone';

import { Song, Track, Instrument } from '..';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Song', () => {
  it('should render Song with bpm of 100 and then play with volume -3', () => {
    const { rerender } = render(
      <Song isPlaying={false} bpm={100} isMuted={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
        </Track>
      </Song>,
    );

    expect(Tone.getTransport().bpm.value).toEqual(100);
    expect(Tone.getTransport().start).toBeCalledTimes(0);
    expect(Tone.getDestination().volume.value).toEqual(0);
    expect(Tone.getDestination().mute).toEqual(true);

    rerender(
      <Song isPlaying={true} bpm={100} volume={-3} isMuted={false}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
        </Track>
      </Song>,
    );

    expect(Tone.getTransport().start).toBeCalledTimes(1);
    expect(Tone.getDestination().volume.value).toEqual(-3);
    expect(Tone.getDestination().mute).toEqual(false);
  });
});
