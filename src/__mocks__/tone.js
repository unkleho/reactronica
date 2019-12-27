// WIP Mock of Tone
// NOTE: Not sure if this is best approach

class PanVol {
  constructor(pan, volume) {
    this.volume = {
      value: volume,
    };

    this.pan = {
      value: pan,
    };
  }
}

class PolySynth {
  constructor(options) {
    // console.log(options);

    this.cleanup = jest.fn();
    this.dispose = jest.fn();
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

class Sequence {
  constructor(callback) {
    this.start = jest.fn();
    this.removeAll = jest.fn();
    this.add = jest.fn();
    this.dispose = jest.fn();
  }
}

const Transport = {
  bpm: {
    value: null,
  },
  start: jest.fn(),
  stop: jest.fn(),
};

const Tone = {
  PanVol,
  PolySynth,
  Transport,
  Sequence,
  // Master: ,
};

export default Tone;
