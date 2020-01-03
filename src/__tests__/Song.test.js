import React from 'react';
import { render } from '@testing-library/react';
import Tone from 'tone';

import { Song, Track, Instrument } from '..';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Song', () => {
  it('should render Song with tempo of 100 and then play with volume -3', () => {
    const { rerender } = render(
      <Song isPlaying={false} tempo={100} isMuted={true}>
        <Track steps={['C3']}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(Tone.Transport.bpm.value).toEqual(100);
    expect(Tone.Transport.start).toBeCalledTimes(0);
    expect(Tone.Master.volume.value).toEqual(0);
    expect(Tone.Master.mute).toEqual(true);

    rerender(
      <Song isPlaying={true} tempo={100} volume={-3} isMuted={false}>
        <Track steps={['C3']}>
          <Instrument type="polySynth" />
        </Track>
      </Song>,
    );

    expect(Tone.Transport.start).toBeCalledTimes(1);
    expect(Tone.Master.volume.value).toEqual(-3);
    expect(Tone.Master.mute).toEqual(false);
  });
});
