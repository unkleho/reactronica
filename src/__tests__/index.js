import React from 'react';
import { render } from '@testing-library/react';
import Tone from 'tone';

import { Song, Track, Instrument } from '..';

describe('Test', () => {
  it('test', () => {
    const { getAllByText } = render(<div>test</div>);

    expect(getAllByText('test')).toBeDefined();
  });

  it('should render Song', () => {
    const wrapper = render(
      <Song isPlaying={true} tempo={100}>
        <Track steps={['C3']}>
          <Instrument type="polySynth"></Instrument>
        </Track>
      </Song>,
    );

    expect(wrapper).toBeDefined();
    expect(Tone.Transport.bpm.value).toEqual(100);
    // console.log(Tone);
  });
});
