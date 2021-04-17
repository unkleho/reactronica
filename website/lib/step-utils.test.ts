import { buildClip } from './step-utils';

const steps = [
  [
    {
      note: 'C3',
      duration: 0.5,
    },
    {
      note: 'G3',
      duration: 0.5,
    },
  ],
  null,
  [
    {
      note: 'D3',
      duration: 0.5,
    },
  ],
  null,
  [
    {
      note: 'E3',
      duration: 0.5,
    },
  ],
  null,
  [
    {
      note: 'G3',
      duration: 0.5,
    },
  ],
  null,
  [
    {
      note: 'A3',
      duration: 0.5,
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
  it('should convert steps to clip', () => {
    const clip = buildClip(steps, 'test');

    expect(clip).toEqual({
      id: 'test',
      bars: 1,
      notes: [
        {
          start: '1.1.1',
          note: 'C3',
          duration: 0.5,
        },
        {
          start: '1.1.1',
          note: 'G3',
          duration: 0.5,
        },
        {
          start: '1.1.3',
          note: 'D3',
          duration: 0.5,
        },
        {
          start: '1.2.1',
          note: 'E3',
          duration: 0.5,
        },
        {
          start: '1.2.3',
          note: 'G3',
          duration: 0.5,
        },
        {
          start: '1.3.1',
          note: 'A3',
          duration: 0.5,
        },
      ],
    });
  });
});
