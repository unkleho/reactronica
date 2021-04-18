import { buildSteps } from '../lib/step-utils';
import { melodyClip1 } from '../data/daw';

export const melodySteps = [
  [
    {
      // start: '1.1.1',
      name: 'C3',
      duration: 0.4,
    },
    {
      // start: '1.1.1',
      name: 'G3',
      duration: 0.4,
    },
  ],
  null,
  [
    {
      // start: '1.1.3',
      name: 'D3',
      duration: 0.4,
    },
  ],
  null,
  [
    {
      // start: '1.2.1',
      name: 'E3',
      duration: 0.4,
    },
  ],
  null,
  [
    {
      // start: '1.2.3',
      name: 'G3',
      duration: 0.4,
    },
  ],
  null,
  [
    {
      // start: '1.3.1',
      name: 'A3',
      duration: 0.4,
    },
  ],
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

describe('Step Utilities', () => {
  it('should convert clip notes to steps (16n) for StepsEditor and Reactronica', () => {
    const result = buildSteps(melodyClip1.notes, melodyClip1.bars, 16);
    expect(result).toEqual(melodySteps);
  });
});
