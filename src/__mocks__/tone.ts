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
// Tone.Channel
// ----------------------------------------------------------------------------

export const mockChannelConstructor = jest.fn();
export const mockChannelVolume = jest.fn();
export const mockChannelPan = jest.fn();
export const mockChannelDispose = jest.fn();

class Channel {
  volume;
  pan;
  dispose;

  constructor(volume, pan) {
    mockChannelConstructor(volume, pan);

    this.volume = {
      value: volume,
    };

    this.pan = {
      value: pan,
    };

    this.dispose = mockChannelDispose;
    // console.log(this.mute);

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
  triggerAttack = mockPolySynthTriggerAttack;
  triggerRelease = mockPolySynthTriggerRelease;
  dispose = mockPolySynthDispose;
  chain = mockPolySynthChain;
  set = mockPolySynthSet;
  disconnect = jest.fn();

  constructor(voice, voiceArgs) {
    mockPolySynthConstructor(voice, voiceArgs);
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
  triggerAttack = jest.fn();
  triggerRelease = jest.fn();
  dispose = jest.fn();
  chain = jest.fn();
  disconnect = jest.fn();

  constructor(options) {
    mockMembraneSynthConstructor(options);
  }
}

// ----------------------------------------------------------------------------
// Tone.MetalSynth
// ----------------------------------------------------------------------------

export const mockMetalSynthConstructor = jest.fn();

class MetalSynth {
  triggerAttack = jest.fn();
  triggerRelease = jest.fn();
  dispose = jest.fn();
  chain = jest.fn();
  disconnect = jest.fn();

  constructor(options) {
    mockMetalSynthConstructor(options);
  }
}

// ----------------------------------------------------------------------------
// Tone.NoiseSynth
// ----------------------------------------------------------------------------

export const mockNoiseSynthConstructor = jest.fn();

class NoiseSynth {
  triggerAttack = jest.fn();
  triggerRelease = jest.fn();
  dispose = jest.fn();
  chain = jest.fn();
  disconnect = jest.fn();

  constructor(options) {
    mockNoiseSynthConstructor(options);
  }
}

// ----------------------------------------------------------------------------
// Tone.PluckSynth
// ----------------------------------------------------------------------------

export const mockPluckSynthConstructor = jest.fn();

class PluckSynth {
  triggerAttack = jest.fn();
  triggerRelease = jest.fn();
  dispose = jest.fn();
  chain = jest.fn();
  disconnect = jest.fn();

  constructor(options) {
    mockPluckSynthConstructor(options);
  }
}

// ----------------------------------------------------------------------------
// Tone.Sampler
// ----------------------------------------------------------------------------

export const mockSamplerConstructor = jest.fn();
export const mockSamplerDispose = jest.fn();
export const mockSamplerAdd = jest.fn();

class Sampler {
  add = mockSamplerAdd;
  dispose = mockSamplerDispose;
  chain = jest.fn();
  disconnect = jest.fn();

  constructor(samples) {
    mockSamplerConstructor(samples);
  }
}

// ----------------------------------------------------------------------------
// Tone.AutoFilter
// ----------------------------------------------------------------------------

export const mockAutoFilterConstructor = jest.fn();
// export const mockAutoFilterWet = jest.fn();
// export const mockAutoFilterDispose = jest.fn();

class AutoFilter {
  wet = {
    value: 1,
  };
  // dispose = mockAutoFilterDispose;
  // chain = jest.fn();
  // disconnect = jest.fn();

  constructor() {
    mockAutoFilterConstructor();
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
  low;
  mid;
  high;
  lowFrequency;
  highFrequency;

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
export const mockSequenceAdd = jest.fn();
export const mockSequenceRemove = jest.fn();
export const mockSequenceRemoveAll = jest.fn();
export const mockSequenceEvents = jest.fn();

class Sequence {
  start = jest.fn();
  stop = jest.fn();
  add = mockSequenceAdd;
  remove = mockSequenceRemove;
  removeAll = mockSequenceRemoveAll;
  dispose = jest.fn();

  set events(events) {
    // console.log(events);
    mockSequenceEvents(events);
  }

  constructor(_, steps) {
    mockSequenceConstructor(steps);
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
