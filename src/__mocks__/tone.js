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
  volume: {
    value: 0,
  },
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

export const mockChannelConstructor = jest.fn();
export const mockChannelVolume = jest.fn();
export const mockChannelPan = jest.fn();

class Channel {
  constructor(volume, pan) {
    mockChannelConstructor(volume, pan);

    this.volume = {
      value: volume,
    };

    this.pan = {
      value: pan,
    };

    mockChannelVolume(this.volume.value);
    mockChannelPan(this.pan.value);
  }
}

// ----------------------------------------------------------------------------
// Tone.PolySynth
// ----------------------------------------------------------------------------

export const mockPolySynthConstructor = jest.fn();
export const mockPolySynthTriggerAttack = jest.fn();
export const mockPolySynthTriggerRelease = jest.fn();
export const mockPolySynthDispose = jest.fn();
export const mockPolySynthChain = jest.fn();
export const mockPolySynthSet = jest.fn();

class PolySynth {
  constructor(polyphony, voice, voiceArgs) {
    mockPolySynthConstructor(polyphony, voice, voiceArgs);

    this.triggerAttack = mockPolySynthTriggerAttack;
    this.triggerRelease = mockPolySynthTriggerRelease;
    this.dispose = mockPolySynthDispose;
    this.chain = mockPolySynthChain;
    this.set = mockPolySynthSet;
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.Synth
// ----------------------------------------------------------------------------

const Synth = 'Synth';

// ----------------------------------------------------------------------------
// Tone.AMSynth
// ----------------------------------------------------------------------------

const AMSynth = 'AMSynth';

// ----------------------------------------------------------------------------
// Tone.DuoSynth
// ----------------------------------------------------------------------------

const DuoSynth = 'DuoSynth';

// ----------------------------------------------------------------------------
// Tone.FMSynth
// ----------------------------------------------------------------------------

const FMSynth = 'FMSynth';

// ----------------------------------------------------------------------------
// Tone.MonoSynth
// ----------------------------------------------------------------------------

const MonoSynth = 'MonoSynth';

// ----------------------------------------------------------------------------
// Tone.MembraneSynth
// ----------------------------------------------------------------------------

export const mockMembraneSynthConstructor = jest.fn();

class MembraneSynth {
  constructor(options) {
    mockMembraneSynthConstructor(options);

    this.triggerAttack = jest.fn();
    this.triggerRelease = jest.fn();
    this.dispose = jest.fn();
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.MetalSynth
// ----------------------------------------------------------------------------

export const mockMetalSynthConstructor = jest.fn();

class MetalSynth {
  constructor(options) {
    mockMetalSynthConstructor(options);

    this.triggerAttack = jest.fn();
    this.triggerRelease = jest.fn();
    this.dispose = jest.fn();
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.NoiseSynth
// ----------------------------------------------------------------------------

export const mockNoiseSynthConstructor = jest.fn();

class NoiseSynth {
  constructor(options) {
    mockNoiseSynthConstructor(options);

    this.triggerAttack = jest.fn();
    this.triggerRelease = jest.fn();
    this.dispose = jest.fn();
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.PluckSynth
// ----------------------------------------------------------------------------

export const mockPluckSynthConstructor = jest.fn();

class PluckSynth {
  constructor(options) {
    mockPluckSynthConstructor(options);

    this.triggerAttack = jest.fn();
    this.triggerRelease = jest.fn();
    this.dispose = jest.fn();
    this.chain = jest.fn();
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
// export const mockAutoFilterWet = jest.fn();
// export const mockAutoFilterDispose = jest.fn();

class AutoFilter {
  constructor() {
    mockAutoFilterConstructor();

    this.wet = {
      value: 1,
    };
    // this.dispose = mockAutoFilterDispose;
    // this.chain = jest.fn();
    // this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.AutoPanner
// ----------------------------------------------------------------------------

export const mockAutoPannerConstructor = jest.fn();

class AutoPanner {
  constructor() {
    mockAutoPannerConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.EQ3
// ----------------------------------------------------------------------------

export const mockEQ3Constructor = jest.fn();

class EQ3 {
  constructor(low, mid, high) {
    mockEQ3Constructor(low, mid, high);

    this.low = {
      value: low,
    };

    this.mid = {
      value: mid,
    };

    this.high = {
      value: high,
    };

    this.lowFrequency = {
      value: 400,
    };

    this.highFrequency = {
      value: 2500,
    };
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
  Channel,
  PolySynth,
  Synth,
  AMSynth,
  DuoSynth,
  FMSynth,
  MembraneSynth,
  MetalSynth,
  MonoSynth,
  NoiseSynth,
  PluckSynth,
  Sampler,
  AutoFilter,
  AutoPanner,
  EQ3,
  Sequence,
};

export default MockTone;
