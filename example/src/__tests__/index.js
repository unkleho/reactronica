import { buildSteps } from '../lib/stepUtils';
import { melodyClip } from '../sample-data';

export const melodySteps = [
  {
    start: '1.1.1',
    note: 'C3',
    duration: 0.5,
  },
  null,
  {
    start: '1.1.3',
    note: 'D3',
    duration: 0.5,
  },
  null,
  {
    start: '1.2.1',
    note: 'E3',
    duration: 0.5,
  },
  null,
  {
    start: '1.2.3',
    note: 'G3',
    duration: 0.5,
  },
  null,
  {
    start: '1.3.1',
    note: 'A3',
    duration: 0.5,
  },
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
    const result = buildSteps(melodyClip, 16);
    expect(result).toEqual(melodySteps);
  });
});
