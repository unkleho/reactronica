import React from 'react';
import { render } from '@testing-library/react';

import { Song, Track, Instrument } from '..';
import {
  mockPolySynthConstructor,
  mockPolySynthTriggerAttack,
  mockPolySynthTriggerRelease,
  mockPolySynthDispose,
  mockMembraneSynthConstructor,
  mockMembraneSynthSet,
  mockMetalSynthConstructor,
  mockMetalSynthSet,
  // mockNoiseSynthConstructor,
  mockPluckSynthConstructor,
  mockPluckSynthSet,
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
    expect(mockPolySynthConstructor).toBeCalledWith({
      maxPolyphony: 4,
      voice: 'Synth',
      options: undefined,
    });
    expect(mockPolySynthDispose).toBeCalledTimes(0);

    // @ts-ignore
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

  it('should add and remove samples from sampler Instrument', () => {
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

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 5,
      voice: 'Synth',
      options: {
        oscillator: {
          type: 'square',
        },
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

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 3,
      voice: 'Synth',
      options: {
        oscillator: {
          type: 'square',
        },
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

    expect(mockPolySynthSet).toHaveBeenLastCalledWith({
      oscillator: { type: 'sine' },
    });
  });

  it('should update oscillator live for amSynth, fmSynth and monoSynth too, not just synth', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="amSynth" oscillator={{ type: 'square' }} />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="amSynth" oscillator={{ type: 'sawtooth' }} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenLastCalledWith({
      oscillator: { type: 'sawtooth' },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="fmSynth" oscillator={{ type: 'square' }} />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="fmSynth" oscillator={{ type: 'triangle' }} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenLastCalledWith({
      oscillator: { type: 'triangle' },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="monoSynth" oscillator={{ type: 'square' }} />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="monoSynth" oscillator={{ type: 'pulse' }} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenLastCalledWith({
      oscillator: { type: 'pulse' },
    });
  });

  it('should update oscillator live for membraneSynth too', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="membraneSynth" oscillator={{ type: 'square' }} />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="membraneSynth" oscillator={{ type: 'sine' }} />
        </Track>
      </Song>,
    );

    expect(mockMembraneSynthSet).toHaveBeenLastCalledWith({
      oscillator: { type: 'sine' },
    });
  });

  it('should update envelope live for amSynth and membraneSynth', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="amSynth" envelope={{ attack: 0.01 }} />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="amSynth" envelope={{ attack: 0.5 }} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenLastCalledWith({
      envelope: { attack: 0.5 },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="membraneSynth" envelope={{ attack: 0.01 }} />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="membraneSynth" envelope={{ attack: 0.5 }} />
        </Track>
      </Song>,
    );

    expect(mockMembraneSynthSet).toHaveBeenLastCalledWith({
      envelope: { attack: 0.5 },
    });
  });

  it('should apply oscillator/envelope to both voices when constructing duoSynth', () => {
    render(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="duoSynth"
            oscillator={{ type: 'square' }}
            envelope={{ attack: 0.01 }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'DuoSynth',
      options: {
        voice0: {
          oscillator: { type: 'square' },
          envelope: { attack: 0.01 },
        },
        voice1: {
          oscillator: { type: 'square' },
          envelope: { attack: 0.01 },
        },
      },
    });
  });

  it('should update oscillator/envelope live for duoSynth on both voices', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="duoSynth"
            oscillator={{ type: 'square' }}
            envelope={{ attack: 0.01 }}
          />
        </Track>
      </Song>,
    );

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="duoSynth"
            oscillator={{ type: 'sawtooth' }}
            envelope={{ attack: 0.01 }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenCalledWith({
      voice0: { oscillator: { type: 'sawtooth' } },
      voice1: { oscillator: { type: 'sawtooth' } },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="duoSynth"
            oscillator={{ type: 'sawtooth' }}
            envelope={{ attack: 0.5 }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenLastCalledWith({
      voice0: { envelope: { attack: 0.5 } },
      voice1: { envelope: { attack: 0.5 } },
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

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'Synth',
      options: undefined,
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="amSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'AMSynth',
      options: undefined,
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="duoSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'DuoSynth',
      options: undefined,
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="fmSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'FMSynth',
      options: undefined,
    });

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

    // withDefined() always builds an options object now (even if empty),
    // so unset props no longer overwrite Tone's own defaults with undefined.
    expect(mockMetalSynthConstructor).toHaveBeenLastCalledWith({});

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="monoSynth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'MonoSynth',
      options: undefined,
    });

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

    expect(mockPluckSynthConstructor).toHaveBeenLastCalledWith({});
  });

  it('should render synth envelopes', () => {
    render(
      <Song isPlaying={true}>
        <Track>
          <Instrument type="synth" envelope={{ attack: 0.02 }} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'Synth',
      options: {
        envelope: {
          attack: 0.02,
        },
      },
    });
  });

  it('should pass filter/filterEnvelope to monoSynth on construction and live-update', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="monoSynth"
            filter={{ type: 'lowpass', frequency: 800, Q: 2 }}
            filterEnvelope={{ attack: 0.01, baseFrequency: 200, octaves: 3 }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthConstructor).toHaveBeenLastCalledWith({
      maxPolyphony: 4,
      voice: 'MonoSynth',
      options: {
        filter: { type: 'lowpass', frequency: 800, Q: 2 },
        filterEnvelope: { attack: 0.01, baseFrequency: 200, octaves: 3 },
      },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="monoSynth"
            filter={{ type: 'highpass', frequency: 1200, Q: 4 }}
            filterEnvelope={{ attack: 0.05, baseFrequency: 400, octaves: 4 }}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthSet).toHaveBeenCalledWith({
      filter: { type: 'highpass', frequency: 1200, Q: 4 },
    });
    expect(mockPolySynthSet).toHaveBeenCalledWith({
      filterEnvelope: { attack: 0.05, baseFrequency: 400, octaves: 4 },
    });
  });

  it('should pass harmonicity/modulationIndex/resonance/octaves/envelope to metalSynth on construction and live-update', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="metalSynth"
            harmonicity={3.1}
            modulationIndex={16}
            resonance={2000}
            octaves={1.2}
            envelope={{ attack: 0.002 }}
          />
        </Track>
      </Song>,
    );

    expect(mockMetalSynthConstructor).toHaveBeenLastCalledWith({
      harmonicity: 3.1,
      modulationIndex: 16,
      resonance: 2000,
      octaves: 1.2,
      envelope: { attack: 0.002 },
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="metalSynth"
            harmonicity={4}
            modulationIndex={20}
            resonance={3000}
            octaves={2}
            envelope={{ attack: 0.005 }}
          />
        </Track>
      </Song>,
    );

    expect(mockMetalSynthSet).toHaveBeenCalledWith({
      harmonicity: 4,
      modulationIndex: 20,
      resonance: 3000,
      octaves: 2,
    });
    expect(mockMetalSynthSet).toHaveBeenCalledWith({
      envelope: { attack: 0.005 },
    });
  });

  it('should pass attackNoise/dampening/resonance to pluckSynth on construction and live-update', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="pluckSynth"
            attackNoise={2}
            dampening={3000}
            resonance={0.9}
          />
        </Track>
      </Song>,
    );

    expect(mockPluckSynthConstructor).toHaveBeenLastCalledWith({
      attackNoise: 2,
      dampening: 3000,
      resonance: 0.9,
    });

    rerender(
      <Song isPlaying={true}>
        <Track>
          <Instrument
            type="pluckSynth"
            attackNoise={5}
            dampening={5000}
            resonance={0.5}
          />
        </Track>
      </Song>,
    );

    expect(mockPluckSynthSet).toHaveBeenLastCalledWith({
      attackNoise: 5,
      dampening: 5000,
      resonance: 0.5,
    });
  });
});
