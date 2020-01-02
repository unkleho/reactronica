/**
 * Tone JS Mock
 *
 * NOTE: Tone's sub-module classes are rebuilt with injected mock functions so
 * Jest can spy on them. This isn't the best option, but I was unable to mock
 * Tone's classes using mockImplementation as it is difficult to access them
 * directly.
 */

// ----------------------------------------------------------------------------
// Tone.Master
// ----------------------------------------------------------------------------

const Master = {
  volume: 0,
  mute: false,
  chain: jest.fn(),
  dispose: jest.fn(),
};

// ----------------------------------------------------------------------------
// Tone.Transport
// ----------------------------------------------------------------------------

const Transport = {
  bpm: {
    value: null,
  },
  start: jest.fn(),
  stop: jest.fn(),
};

// ----------------------------------------------------------------------------
// Tone.PanVol
// ----------------------------------------------------------------------------

export const mockPanVolConstructor = jest.fn();
export const mockPanVolVolume = jest.fn();
export const mockPanVolPan = jest.fn();

class PanVol {
  constructor(pan, volume) {
    mockPanVolConstructor(pan, volume);

    this.volume = {
      value: volume,
    };

    this.pan = {
      value: pan,
    };

    mockPanVolVolume(this.volume.value);
    mockPanVolPan(this.pan.value);
  }
}

// ----------------------------------------------------------------------------
// Tone.PolySynth
// ----------------------------------------------------------------------------

export const mockPolySynthConstructor = jest.fn();
export const mockPolySynthDispose = jest.fn();
export const mockPolySynthChain = jest.fn();

class PolySynth {
  constructor(polyphony, voice, voiceArgs) {
    mockPolySynthConstructor(polyphony, voice, voiceArgs);

    this.dispose = mockPolySynthDispose;
    this.chain = mockPolySynthChain;
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.Sampler
// ----------------------------------------------------------------------------

export const mockSamplerConstructor = jest.fn();
export const mockSamplerDispose = jest.fn();

class Sampler {
  constructor(samples) {
    mockSamplerConstructor(samples);

    this.dispose = mockSamplerDispose;
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.AutoFilter
// ----------------------------------------------------------------------------

export const mockAutoFilterConstructor = jest.fn();
// export const mockAutoFilterDispose = jest.fn();

class AutoFilter {
  constructor() {
    mockAutoFilterConstructor();

    // this.dispose = mockAutoFilterDispose;
    // this.chain = jest.fn();
    // this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.Sequence
// ----------------------------------------------------------------------------

export const mockSequenceConstructor = jest.fn();

class Sequence {
  constructor(callback, steps) {
    mockSequenceConstructor(steps);

    this.start = jest.fn();
    this.stop = jest.fn();
    this.add = jest.fn();
    this.removeAll = jest.fn();
    this.dispose = jest.fn();
  }
}

const MockTone = {
  Master,
  Transport,
  PanVol,
  PolySynth,
  Sampler,
  AutoFilter,
  Sequence,
};

export default MockTone;
