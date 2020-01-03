import React from 'react';
import { render } from '@testing-library/react';

import { Song, Track, Instrument } from '..';
import {
  mockPanVolConstructor,
  mockPanVolVolume,
  mockPanVolPan,
  mockPolySynthDispose,
  mockSequenceConstructor,
} from '../__mocks__/tone';

beforeEach(() => {
  jest.resetAllMocks();
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
