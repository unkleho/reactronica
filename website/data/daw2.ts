// Melody clip with notes that will need to have buildSteps() run on it.

const melodyNoteLength = '4n';
export const melodyClip1 = {
  id: 'melody1',
  name: 'Melody 1',
  bars: 1,
  notes: [
    // Am
    {
      start: '1.1.1',
      name: 'A2',
      duration: melodyNoteLength,
    },
    {
      start: '1.1.1',
      name: 'C3',
      duration: melodyNoteLength,
    },
    {
      start: '1.1.1',
      name: 'E3',
      duration: melodyNoteLength,
    },
    // Am
    {
      start: '1.2.1',
      name: 'A3',
      duration: melodyNoteLength,
    },
    {
      start: '1.2.1',
      name: 'C3',
      duration: melodyNoteLength,
    },
    {
      start: '1.2.1',
      name: 'E3',
      duration: melodyNoteLength,
    },
    // Am
    {
      start: '1.3.1',
      name: 'A3',
      duration: melodyNoteLength,
    },
    {
      start: '1.3.1',
      name: 'C3',
      duration: melodyNoteLength,
    },
    {
      start: '1.3.1',
      name: 'E3',
      duration: melodyNoteLength,
    },
    // Am
    {
      start: '1.4.1',
      name: 'A3',
      duration: melodyNoteLength,
    },
    {
      start: '1.4.1',
      name: 'C3',
      duration: melodyNoteLength,
    },
    {
      start: '1.4.1',
      name: 'E3',
      duration: melodyNoteLength,
    },

    {
      start: '1.3.1',
      name: 'C4',
      duration: melodyNoteLength,
    },
    {
      start: '1.4.1',
      name: 'C4',
      duration: melodyNoteLength,
    },
  ],
};

export const melodyClip2 = {
  id: 'melody2',
  name: 'Melody 2',
  bars: 1,
  notes: [
    // Bm
    {
      start: '1.1.1',
      name: 'B3',
      duration: melodyNoteLength,
    },
    {
      start: '1.1.1',
      name: 'D3',
      duration: melodyNoteLength,
    },
    {
      start: '1.1.1',
      name: 'F3',
      duration: melodyNoteLength,
    },

    // Bm
    {
      start: '1.2.1',
      name: 'B3',
      duration: melodyNoteLength,
    },
    {
      start: '1.2.1',
      name: 'D3',
      duration: melodyNoteLength,
    },
    {
      start: '1.2.1',
      name: 'F3',
      duration: melodyNoteLength,
    },

    // Dm
    {
      start: '1.3.1',
      name: 'D3',
      duration: melodyNoteLength,
    },
    {
      start: '1.3.1',
      name: 'F3',
      duration: melodyNoteLength,
    },
    {
      start: '1.3.1',
      name: 'A3',
      duration: melodyNoteLength,
    },

    // Dm
    {
      start: '1.4.1',
      name: 'D3',
      duration: melodyNoteLength,
    },
    {
      start: '1.4.1',
      name: 'F3',
      duration: melodyNoteLength,
    },
    {
      start: '1.4.1',
      name: 'B3',
      duration: melodyNoteLength,
    },

    // {
    //   start: '1.1.1',
    //   name: 'B4',
    //   duration: 0.4,
    // },
    // {
    //   start: '1.2.1',
    //   name: 'B4',
    //   duration: 0.4,
    // },
  ],
};

// Beat clip with notes that will need to have buildSteps() run on it.
const hatVelocity = 0.15;
export const beatClip1 = {
  id: 'beat1',
  name: 'Beat 1',
  bars: 1,
  notes: [
    {
      start: '1.1.1',
      name: 'C3',
      duration: 0.5,
    },
    // Sub
    {
      start: '1.1.1',
      name: 'A2',
      duration: '2n',
      velocity: 0.4,
    },
    {
      start: '1.1.1',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.1.2',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.1.3',
      name: 'G3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.1.4',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.2.1',
      name: 'D3',
      velocity: 0.4,
      duration: 0.5,
    },
    {
      start: '1.2.1',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.2.2',
      name: 'C3',
      velocity: 0.8,
      duration: 0.5,
    },
    {
      start: '1.2.3',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.3.1',
      name: 'C3',
      duration: 0.5,
    },
    {
      start: '1.3.3',
      name: 'C3',
      duration: 0.5,
    },
    {
      start: '1.3.1',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    // Triplet hat
    {
      start: '1.3.2',
      name: 'G3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.4.1',
      name: 'D3',
      velocity: 0.4,
      duration: 0.5,
    },
    {
      start: '1.4.3',
      name: 'F3',
      velocity: 0.2,
      duration: 0.5,
    },
    {
      start: '1.4.3',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.4.4',
      name: 'F3',
      duration: 0.5,
      velocity: 0.5,
    },
  ],
};

export const beatClip2 = {
  id: 'beat2',
  name: 'Beat 2',
  bars: 1,
  notes: [
    {
      start: '1.1.1',
      name: 'C3',
      duration: 0.5,
    },
    // Sub
    {
      start: '1.1.1',
      name: 'F2',
      duration: '2n',
      velocity: 0.4,
    },
    //
    {
      start: '1.1.1',
      name: 'G3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.1.2',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.1.3',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.1.4',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.2.1',
      name: 'D3',
      velocity: 0.4,
      duration: 0.5,
    },
    {
      start: '1.2.1',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.2.3',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.3.1',
      name: 'C3',
      duration: 0.5,
    },
    {
      start: '1.3.3',
      name: 'C3',
      duration: 0.5,
    },
    // Triplet hat
    {
      start: '1.3.2',
      name: 'G3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    // {
    //   start: '1.3.1',
    //   name: 'E3',
    //   velocity: hatVelocity,
    //   duration: 0.5,
    // },
    {
      start: '1.3.1',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    {
      start: '1.4.1',
      name: 'D3',
      velocity: 0.4,
      duration: 0.5,
    },
    {
      start: '1.4.3',
      name: 'E3',
      velocity: hatVelocity,
      duration: 0.5,
    },
    // {
    //   start: '1.4.4',
    //   name: 'E3',
    //   velocity: hatVelocity,
    //   duration: 0.5,
    // },
    {
      start: '1.4.4',
      name: 'F3',
      duration: 0.5,
      velocity: 0.5,
    },
  ],
};

// Vocals
export const vocalClip1 = {
  id: 'vocalClip1',
  name: 'Vocal 1',
  bars: 1,
  notes: [
    {
      start: '1.3.3',
      name: 'B3',
      duration: '2n',
      velocity: 0.7,
    },
  ],
};

export const vocalClip2 = {
  id: 'vocalClip2',
  name: 'Vocal 2',
  bars: 1,
  notes: [
    {
      start: '1.3.3',
      name: 'B3',
      duration: '4n',
      velocity: 0.7,
    },
  ],
};
