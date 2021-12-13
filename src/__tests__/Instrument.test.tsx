import React from 'react';
import { render } from '@testing-library/react';

import { Song, Track, Instrument } from '..';
import {
  mockPolySynthConstructor,
  mockPolySynthTriggerAttack,
  mockPolySynthTriggerRelease,
  mockPolySynthDispose,
  mockMembraneSynthConstructor,
  mockMetalSynthConstructor,
  // mockNoiseSynthConstructor,
  mockPluckSynthConstructor,
  mockSamplerConstructor,
  mockSamplerDispose,
  mockPolySynthSet,
  mockSamplerAdd,
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
    expect(mockPolySynthConstructor).toBeCalledWith(4, 'Synth', undefined);
    expect(mockPolySynthDispose).toBeCalledTimes(0);

    // @ts-ignore
    rerender(<Song isPlaying={true}></Song>);

    expect(mockPolySynthDispose).toBeCalledTimes(1);
  });

  describe('Sampler', () => {
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

    it('should add and remove samples', () => {
      const { rerender } = render(
        <Song isPlaying={true}>
          <Track steps={['C3']}>
            <Instrument
              type="sampler"
              samples={{
                C3: '../audio/file1.mp3',
              }}
            />
          </Track>
        </Song>,
      );

      rerender(
        <Song isPlaying={true}>
          <Track steps={['C3']}>
            <Instrument
              type="sampler"
              samples={{
                C3: '../audio/file1.mp3',
                D3: '../audio/file2.mp3',
              }}
            />
          </Track>
        </Song>,
      );

      // TODO: Figure out what to do in this scenario
      rerender(
        <Song isPlaying={true}>
          <Track steps={['C3']}>
            <Instrument
              type="sampler"
              samples={{
                D3: '../audio/file2.mp3',
                E3: '../audio/file3.mp3',
              }}
            />
          </Track>
        </Song>,
      );

      expect(mockSamplerAdd).toHaveBeenNthCalledWith(
        1,
        'D3',
        '../audio/file2.mp3',
        expect.any(Function),
      );
      expect(mockSamplerAdd).toHaveBeenNthCalledWith(
        2,
        'E3',
        '../audio/file3.mp3',
        expect.any(Function),
      );
    });

    it('should run onLoading on initial render', () => {
      const mockOnLoading = jest.fn();
      render(
        <Song isPlaying={true}>
          <Track steps={['C3']}>
            <Instrument
              onLoading={mockOnLoading}
              samples={{
                C3: '../audio/file1.mp3',
              }}
              type="sampler"
            />
          </Track>
        </Song>,
      );

      expect(mockOnLoading).toBeCalled();
    });

    it('should run onLoading when rerendered with new samples', () => {
      const initialSamples = {
        C3: '../audio/file1.mp3',
      };
      const updatedSamples = {
        ...initialSamples,
        D3: '../audio/file2.mp3',
      };

      const mockOnLoading = jest.fn();
      const { rerender } = render(
        <Song isPlaying={true}>
          <Track steps={['C3']}>
            <Instrument
              onLoading={mockOnLoading}
              samples={initialSamples}
              type="sampler"
            />
          </Track>
        </Song>,
      );

      rerender(
        <Song isPlaying={true}>
          <Track steps={['C3']}>
            <Instrument
              onLoading={mockOnLoading}
              samples={updatedSamples}
              type="sampler"
            />
          </Track>
        </Song>,
      );

      expect(mockOnLoading).toHaveBeenCalledTimes(2);
    });
  });

  it('should trigger and release note', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="synth" notes={[{ name: 'C3', velocity: 0.5 }]} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthTriggerAttack).toBeCalledWith(
      'C3',
      undefined, // Duration
      0.5,
    );
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

describe('Synth', () => {
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

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(5, 'Synth', {
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

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(3, 'Synth', {
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

    expect(mockPolySynthSet).toHaveBeenLastCalledWith('oscillator', {
      type: 'sine',
    });
  });

  it('should render with `synth`, `amSynth` and go through all other synth types', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="synth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(
      4,
      'Synth',
      undefined,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="amSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(
      4,
      'AMSynth',
      undefined,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="duoSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(
      4,
      'DuoSynth',
      undefined,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="fmSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(
      4,
      'FMSynth',
      undefined,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="membraneSynth" oscillator={{ type: 'triangle' }} />
        </Track>
      </Song>,
    );

    expect(mockMembraneSynthConstructor).toHaveBeenLastCalledWith({
      oscillator: {
        type: 'triangle',
      },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="metalSynth" />
        </Track>
      </Song>,
    );

    expect(mockMetalSynthConstructor).toHaveBeenLastCalledWith(undefined);

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="monoSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(
      4,
      'MonoSynth',
      undefined,
    );

    // rerender(
    //   <Song isPlaying={true}>
    //     <Track>
    //       <Instrument type="noiseSynth" />
    //     </Track>
    //   </Song>,
    // );

    // expect(mockNoiseSynthConstructor).toHaveBeenLastCalledWith(undefined);

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="pluckSynth" />
        </Track>
      </Song>,
    );

    expect(mockPluckSynthConstructor).toHaveBeenLastCalledWith(undefined);
  });

  it('should render synth envelopes', () => {
    render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="synth" envelope={{ attack: 0.02 }} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith(4, 'Synth', {
      envelope: {
        attack: 0.02,
      },
    });
  });
});
