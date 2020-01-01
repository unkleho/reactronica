// import Tone from 'tone';

// WIP Mock of Tone
// NOTE: Not sure if this is best approach

// import Tone from 'tone';

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

export const mockFunction = jest.fn();

class PolySynth {
  constructor(options) {
    // console.log(options);

    this.cleanup = jest.fn();
    this.dispose = jest.fn();
    this.chain = jest.fn();
    this.disconnect = jest.fn();
  }
}

export const sequenceMock = jest.fn();

class Sequence {
  constructor(callback, steps) {
    /**
     * Unable to mock constructor calls using mockImplementation as it is difficult to access Tone's submodule classes directly.
     * Need to manually spy on the constructor's arguments with injected mock functions.
     */
    sequenceMock(steps);
    // console.log(steps[0]);

    this.start = mockFunction;
    this.removeAll = jest.fn();
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

const MockTone = {
  PanVol,
  PolySynth,
  // This doesn't work unfortunately
  // PolySynth: jest.fn().mockImplementation(() => {
  //   return {
  //     cleanup: mockFunction,
  //     dispose: mockFunction,
  //     chain: mockFunction,
  //     disconnect: mockFunction,
  //   };
  // }),
  Transport,
  Sequence,
};

export default MockTone;
