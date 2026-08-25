import React from 'react';
import { render } from '@testing-library/react';
import * as Tone from 'tone';

import { Song, Track, Instrument, Effect } from '..';
import {
  mockAutoFilterConstructor,
  mockAutoFilterStart,
  mockAutoPannerConstructor,
  mockAutoPannerStart,
  mockAutoWahConstructor,
  mockBitCrusherConstructor,
  mockChebyshevConstructor,
  mockDistortionConstructor,
  mockFreeverbConstructor,
  mockFrequencyShifterConstructor,
  mockJCReverbConstructor,
  mockPanVolConstructor,
  mockPhaserConstructor,
  mockPingPongDelayConstructor,
  mockPitchShiftConstructor,
  mockStereoWidenerConstructor,
  mockTremoloConstructor,
  mockTremoloStart,
  mockVibratoConstructor,
  mockPolySynthChain,
  mockChannelDispose,
} from '../__mocks__/tone';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Effect', () => {
  it('should add and remove effects from Instrument', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track
          steps={['C3']}
          // TODO: Remove need for key and id prop
          // effects={}
        >
          <Instrument type="synth" />
          <Effect type="autoFilter" id="effect-1" />
        </Track>
      </Song>,
    );

    expect(mockAutoFilterConstructor).toBeCalled();
    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-1', wet: { value: 1 }, dispose: expect.any(Function) },
      {
        dispose: mockChannelDispose,
        pan: { value: 0 },
        volume: { value: 0 },
      },
      Tone.getDestination(),
    );

    rerender(
      <Song isPlaying={true}>
        <Track
          steps={['C3']}
          // effects={
          //   <>
          //     <Effect type="autoFilter" id="effect-1" />
          //     <Effect type="autoPanner" id="effect-2" />
          //   </>
          // }
        >
          <Instrument type="synth" />
          <Effect type="autoFilter" id="effect-1" />
          <Effect type="autoPanner" id="effect-2" />
        </Track>
      </Song>,
    );

    expect(mockAutoPannerConstructor).toBeCalled();
    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-2', dispose: expect.any(Function) },
      { id: 'effect-1', wet: { value: 1 }, dispose: expect.any(Function) },
      { dispose: mockChannelDispose, pan: { value: 0 }, volume: { value: 0 } },
      Tone.getDestination(),
    );

    rerender(
      <Song isPlaying={true}>
        <Track
          steps={['C3']}
          // effects={
          //   <>
          //     <Effect type="autoPanner" id="effect-2" />
          //   </>
          // }
        >
          <Instrument type="synth" />
          <Effect type="autoPanner" id="effect-2" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-2', dispose: expect.any(Function) },
      { dispose: mockChannelDispose, pan: { value: 0 }, volume: { value: 0 } },
      Tone.getDestination(),
    );

    rerender(
      <Song isPlaying={true}>
        <Track steps={['C3']} effects={null}>
          <Instrument type="synth" />
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      {
        dispose: mockChannelDispose,
        pan: { value: 0 },
        volume: { value: 0 },
      },
      Tone.getDestination(),
    );
  });

  it('should update wet prop', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="autoFilter" id="effect-1" wet={0.5}></Effect>
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      { id: 'effect-1', wet: { value: 0.5 }, dispose: expect.any(Function) },
      { dispose: mockChannelDispose, pan: { value: 0 }, volume: { value: 0 } },
      Tone.getDestination(),
    );
  });

  it('should add EQ3 effect and then update frequency', () => {
    const { rerender } = render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="eq3" id="effect-1" low={-6} mid={3} high={1} />
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      {
        id: 'effect-1',
        low: { value: -6 },
        mid: { value: 3 },
        high: { value: 1 },
        lowFrequency: { value: 400 },
        highFrequency: { value: 2500 },
        dispose: expect.any(Function),
      },
      { dispose: mockChannelDispose, pan: { value: 0 }, volume: { value: 0 } },
      Tone.getDestination(),
    );

    rerender(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="eq3"
            id="effect-1"
            low={-3}
            mid={1}
            high={0}
            lowFrequency={100}
            highFrequency={3000}
          />
        </Track>
      </Song>,
    );

    expect(mockPolySynthChain).toHaveBeenLastCalledWith(
      {
        id: 'effect-1',
        low: { value: -3 },
        mid: { value: 1 },
        high: { value: 0 },
        lowFrequency: { value: 100 },
        highFrequency: { value: 3000 },
        dispose: expect.any(Function),
      },
      { dispose: mockChannelDispose, pan: { value: 0 }, volume: { value: 0 } },
      Tone.getDestination(),
    );
  });

  it('should start the LFO for autoFilter, autoPanner and tremolo', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="autoFilter" id="effect-1" />
          <Effect type="autoPanner" id="effect-2" />
          <Effect type="tremolo" id="effect-3" />
        </Track>
      </Song>,
    );

    expect(mockAutoFilterStart).toBeCalled();
    expect(mockAutoPannerStart).toBeCalled();
    expect(mockTremoloStart).toBeCalled();
  });

  it('should pass frequency/depth/lfoType/baseFrequency/octaves to autoFilter', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="autoFilter"
            id="effect-1"
            frequency={2}
            depth={0.8}
            lfoType="square"
            baseFrequency={100}
            octaves={4}
          />
        </Track>
      </Song>,
    );

    expect(mockAutoFilterConstructor).toHaveBeenLastCalledWith({
      frequency: 2,
      depth: 0.8,
      type: 'square',
      baseFrequency: 100,
      octaves: 4,
    });
  });

  it('should pass baseFrequency/octaves/sensitivity/Q to autoWah', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="autoWah"
            id="effect-1"
            baseFrequency={50}
            octaves={5}
            sensitivity={-20}
            Q={4}
          />
        </Track>
      </Song>,
    );

    expect(mockAutoWahConstructor).toHaveBeenLastCalledWith({
      baseFrequency: 50,
      octaves: 5,
      sensitivity: -20,
      Q: 4,
    });
  });

  it('should pass bits to bitCrusher', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="bitCrusher" id="effect-1" bits={6} />
        </Track>
      </Song>,
    );

    expect(mockBitCrusherConstructor).toHaveBeenLastCalledWith({ bits: 6 });
  });

  it('should default distortion to 0.5 when not specified', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="distortion" id="effect-1" />
        </Track>
      </Song>,
    );

    expect(mockDistortionConstructor).toHaveBeenLastCalledWith(0.5);
  });

  it('should accept a custom distortion amount', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="distortion" id="effect-1" distortion={0.9} />
        </Track>
      </Song>,
    );

    expect(mockDistortionConstructor).toHaveBeenLastCalledWith(0.9);
  });

  it('should pass roomSize/dampening to freeverb', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="freeverb"
            id="effect-1"
            roomSize={0.9}
            dampening={2000}
          />
        </Track>
      </Song>,
    );

    expect(mockFreeverbConstructor).toHaveBeenLastCalledWith({
      roomSize: 0.9,
      dampening: 2000,
    });
  });

  it('should pass pan/volume to panVol', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="panVol" id="effect-1" pan={-0.5} volume={-6} />
        </Track>
      </Song>,
    );

    expect(mockPanVolConstructor).toHaveBeenLastCalledWith({
      pan: -0.5,
      volume: -6,
    });
  });

  it('should pass frequency/depth/lfoType/spread to tremolo', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="tremolo"
            id="effect-1"
            frequency={9}
            depth={0.75}
            lfoType="triangle"
            spread={90}
          />
        </Track>
      </Song>,
    );

    expect(mockTremoloConstructor).toHaveBeenLastCalledWith({
      frequency: 9,
      depth: 0.75,
      type: 'triangle',
      spread: 90,
    });
  });

  it('should pass frequency/octaves/baseFrequency/Q/stages to phaser', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="phaser"
            id="effect-1"
            frequency={15}
            octaves={5}
            baseFrequency={1000}
            Q={8}
            stages={6}
          />
        </Track>
      </Song>,
    );

    expect(mockPhaserConstructor).toHaveBeenLastCalledWith({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
      Q: 8,
      stages: 6,
    });
  });

  it('should pass delayTime/feedback to pingPongDelay', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="pingPongDelay"
            id="effect-1"
            delayTime="4n"
            feedback={0.3}
          />
        </Track>
      </Song>,
    );

    expect(mockPingPongDelayConstructor).toHaveBeenLastCalledWith('4n', 0.3);
  });

  it('should pass frequency/depth/lfoType to vibrato', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="vibrato"
            id="effect-1"
            frequency={6}
            depth={0.2}
            lfoType="sawtooth"
          />
        </Track>
      </Song>,
    );

    expect(mockVibratoConstructor).toHaveBeenLastCalledWith({
      frequency: 6,
      depth: 0.2,
      type: 'sawtooth',
    });
  });

  it('should pass order to chebyshev', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="chebyshev" id="effect-1" order={30} />
        </Track>
      </Song>,
    );

    expect(mockChebyshevConstructor).toHaveBeenLastCalledWith(30);
  });

  it('should pass width to stereoWidener', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="stereoWidener" id="effect-1" width={0.8} />
        </Track>
      </Song>,
    );

    expect(mockStereoWidenerConstructor).toHaveBeenLastCalledWith(0.8);
  });

  it('should pass frequency to frequencyShifter', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="frequencyShifter" id="effect-1" frequency={40} />
        </Track>
      </Song>,
    );

    expect(mockFrequencyShifterConstructor).toHaveBeenLastCalledWith(40);
  });

  it('should pass pitch/windowSize/delayTime/feedback to pitchShift', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect
            type="pitchShift"
            id="effect-1"
            pitch={-12}
            windowSize={0.05}
            delayTime="16n"
            feedback={0.1}
          />
        </Track>
      </Song>,
    );

    expect(mockPitchShiftConstructor).toHaveBeenLastCalledWith({
      pitch: -12,
      windowSize: 0.05,
      delayTime: '16n',
      feedback: 0.1,
    });
  });

  it('should pass roomSize to jcReverb', () => {
    render(
      <Song isPlaying={true}>
        <Track steps={['C3']}>
          <Instrument type="synth" />
          <Effect type="jcReverb" id="effect-1" roomSize={0.6} />
        </Track>
      </Song>,
    );

    expect(mockJCReverbConstructor).toHaveBeenLastCalledWith(0.6);
  });
});
