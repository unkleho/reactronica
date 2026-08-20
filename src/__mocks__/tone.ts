// @ts-nocheck

/**
 * Tone JS Mock
 *
 * NOTE: Tone's sub-module classes are rebuilt with injected mock functions so
 * Jest can spy on them. This isn't the best option, but I was unable to mock
 * Tone's classes using mockImplementation as it is difficult to access them
 * directly.
 */

// ----------------------------------------------------------------------------
// Tone.getDestination()
// ----------------------------------------------------------------------------

const Destination = {
  volume: {
    value: 0,
  },
  mute: false,
  chain: jest.fn(),
  dispose: jest.fn(),
};

// NOTE: Deliberately not jest.fn() — tests call jest.resetAllMocks(), which
// strips implementations from jest.fn() mocks, and this needs to keep
// returning the same Destination singleton across the whole test file.
export const getDestination = () => Destination;

// ----------------------------------------------------------------------------
// Tone.getTransport()
// ----------------------------------------------------------------------------

const Transport = {
  bpm: {
    value: null,
  },
  start: jest.fn(),
  stop: jest.fn(),
};

export const getTransport = () => Transport;

// ----------------------------------------------------------------------------
// Tone.Time()
// ----------------------------------------------------------------------------

// NOTE: Real Tone.Time() converts notation strings (e.g. '32n') using the
// current tempo; that's not needed for tests, which only pass plain numbers.
export const Time = (value) => ({
  toSeconds: () => value,
});

// ----------------------------------------------------------------------------
// Tone.start()
// ----------------------------------------------------------------------------

// NOTE: Also deliberately not jest.fn(), see getDestination() above.
export const start = () => Promise.resolve();

// ----------------------------------------------------------------------------
// Tone.Channel
// ----------------------------------------------------------------------------

export const mockChannelConstructor = jest.fn();
export const mockChannelVolume = jest.fn();
export const mockChannelPan = jest.fn();
export const mockChannelDispose = jest.fn();

export class Channel {
  constructor(volume, pan) {
    mockChannelConstructor(volume, pan);

    this.volume = {
      value: volume,
    };

    this.pan = {
      value: pan,
    };

    this.dispose = mockChannelDispose;

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

export class PolySynth {
  constructor(options) {
    mockPolySynthConstructor(options);

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

export const Synth = 'Synth';

// ----------------------------------------------------------------------------
// Tone.AMSynth
// ----------------------------------------------------------------------------

export const AMSynth = 'AMSynth';

// ----------------------------------------------------------------------------
// Tone.DuoSynth
// ----------------------------------------------------------------------------

export const DuoSynth = 'DuoSynth';

// ----------------------------------------------------------------------------
// Tone.FMSynth
// ----------------------------------------------------------------------------

export const FMSynth = 'FMSynth';

// ----------------------------------------------------------------------------
// Tone.MonoSynth
// ----------------------------------------------------------------------------

export const MonoSynth = 'MonoSynth';

// ----------------------------------------------------------------------------
// Tone.MembraneSynth
// ----------------------------------------------------------------------------

export const mockMembraneSynthConstructor = jest.fn();

export class MembraneSynth {
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

export class MetalSynth {
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

export class NoiseSynth {
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

export class PluckSynth {
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
export const mockSamplerAdd = jest.fn();

export class Sampler {
  constructor(samples) {
    mockSamplerConstructor(samples);

    this.add = mockSamplerAdd;
    this.dispose = mockSamplerDispose;
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

// ----------------------------------------------------------------------------
// Tone.AutoFilter
// ----------------------------------------------------------------------------

export const mockAutoFilterConstructor = jest.fn();

export class AutoFilter {
  constructor() {
    mockAutoFilterConstructor();

    this.wet = {
      value: 1,
    };
  }
}

// ----------------------------------------------------------------------------
// Tone.AutoPanner
// ----------------------------------------------------------------------------

export const mockAutoPannerConstructor = jest.fn();

export class AutoPanner {
  constructor() {
    mockAutoPannerConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.AutoWah
// ----------------------------------------------------------------------------

export const mockAutoWahConstructor = jest.fn();

export class AutoWah {
  constructor() {
    mockAutoWahConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.BitCrusher
// ----------------------------------------------------------------------------

export const mockBitCrusherConstructor = jest.fn();

export class BitCrusher {
  constructor() {
    mockBitCrusherConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.Distortion
// ----------------------------------------------------------------------------

export const mockDistortionConstructor = jest.fn();

export class Distortion {
  constructor(distortion) {
    mockDistortionConstructor(distortion);
  }
}

// ----------------------------------------------------------------------------
// Tone.FeedbackDelay
// ----------------------------------------------------------------------------

export const mockFeedbackDelayConstructor = jest.fn();

export class FeedbackDelay {
  constructor(delayTime, feedback) {
    mockFeedbackDelayConstructor(delayTime, feedback);

    this.feedback = {
      value: feedback,
    };

    this.delayTime = {
      value: delayTime,
    };
  }
}

// ----------------------------------------------------------------------------
// Tone.Freeverb
// ----------------------------------------------------------------------------

export const mockFreeverbConstructor = jest.fn();

export class Freeverb {
  constructor() {
    mockFreeverbConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.PanVol
// ----------------------------------------------------------------------------

export const mockPanVolConstructor = jest.fn();

export class PanVol {
  constructor() {
    mockPanVolConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.Tremolo
// ----------------------------------------------------------------------------

export const mockTremoloConstructor = jest.fn();

export class Tremolo {
  constructor() {
    mockTremoloConstructor();
  }
}

// ----------------------------------------------------------------------------
// Tone.EQ3
// ----------------------------------------------------------------------------

export const mockEQ3Constructor = jest.fn();

export class EQ3 {
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
export const mockSequenceSetEvents = jest.fn();

export class Sequence {
  constructor(callback, events) {
    mockSequenceConstructor(events);

    this.start = jest.fn();
    this.stop = jest.fn();
    this.dispose = jest.fn();
    this._events = events;
  }

  get events() {
    return this._events;
  }

  set events(value) {
    this._events = value;
    mockSequenceSetEvents(value);
  }
}
