import React from 'react';
import { render } from '@testing-library/react';
// import { Song, Track, Instrument } from '..';

describe('Test', () => {
  it('test', () => {
    const { getAllByText } = render(<div>test</div>);

    // TODO: Need to mock Tone JS
    // const wrapper = render(
    //   <Song>
    //     <Track steps={['C3']}>
    //       <Instrument type="polySynth"></Instrument>
    //     </Track>
    //   </Song>,
    // );

    // expect(wrapper).toBeDefined();
    expect(getAllByText('test')).toBeDefined();
  });
});
