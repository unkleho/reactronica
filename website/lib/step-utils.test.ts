import { TimeNote } from '../types/typescript';
import { buildClip, buildSteps, getTimeKey } from './step-utils';

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

  it('should convert time notes to 1 bar of steps', () => {
    const timeNotes: TimeNote[] = [
      {
        start: '1.1.1',
        name: 'C3',
      },
      {
        start: '1.1.1',
        name: 'G3',
      },
      {
        start: '1.1.4',
        name: 'G3',
      },
      {
        start: '1.2.3',
        name: 'E3',
      },
      {
        start: '1.4.4',
        name: 'E3',
      },
    ];
    const steps = buildSteps(timeNotes, 1, 16);

    expect(steps).toEqual([
      [
        {
          name: 'C3',
        },
        {
          name: 'G3',
        },
      ],
      null,
      null,
      [
        {
          name: 'G3',
        },
      ],
      null,
      null,
      [
        {
          name: 'E3',
        },
      ],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      [
        {
          name: 'E3',
        },
      ],
    ]);
  });

  it('should convert time notes to 4 bars of steps', () => {
    const timeNotes: TimeNote[] = [
      {
        start: '1.1.1',
        name: 'C3',
      },
      {
        start: '1.1.1',
        name: 'G3',
      },
      {
        start: '2.1.1',
        name: 'G3',
      },
    ];
    const steps = buildSteps(timeNotes, 4, 4);

    expect(steps).toEqual([
      [
        {
          name: 'C3',
        },
        {
          name: 'G3',
        },
      ],
      null,
      null,
      null,
      [
        {
          name: 'G3',
        },
      ],
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  it('should convert index to timeKey for 1 bar, 16 stepsPerBar', () => {
    const timeKey1 = getTimeKey(0, 1, 16);
    const timeKey2 = getTimeKey(5, 1, 16);
    const timeKey3 = getTimeKey(10, 1, 16);
    const timeKey4 = getTimeKey(12, 1, 16);

    expect(timeKey1).toEqual('1.1.1');
    expect(timeKey2).toEqual('1.2.2');
    expect(timeKey3).toEqual('1.3.3');
    expect(timeKey4).toEqual('1.4.1');
  });

  it('should convert index to timeKey for 2 bars, 8 stepsPerBar', () => {
    const timeKey1 = getTimeKey(0, 2, 8);
    const timeKey2 = getTimeKey(1, 2, 8);
    const timeKey3 = getTimeKey(4, 2, 8);
    const timeKey4 = getTimeKey(8, 2, 8);
    const timeKey5 = getTimeKey(12, 4, 8);
    const timeKey6 = getTimeKey(14, 4, 8);
    const timeKey7 = getTimeKey(15, 4, 8);

    expect(timeKey1).toEqual('1.1.1');
    expect(timeKey2).toEqual('1.1.3');
    expect(timeKey3).toEqual('1.3.1');
    expect(timeKey4).toEqual('2.1.1');
    expect(timeKey5).toEqual('2.3.1');
    expect(timeKey6).toEqual('2.4.1');
    expect(timeKey7).toEqual('2.4.3');
  });

  it('should convert index to timeKey for 4 bars, 4 stepsPerBar', () => {
    const timeKey1 = getTimeKey(0, 4, 4);
    const timeKey2 = getTimeKey(1, 4, 4);
    const timeKey3 = getTimeKey(8, 4, 4);
    const timeKey4 = getTimeKey(12, 4, 4);
    const timeKey5 = getTimeKey(14, 4, 4);

    expect(timeKey1).toEqual('1.1.1');
    expect(timeKey2).toEqual('1.2.1');
    expect(timeKey3).toEqual('3.1.1');
    expect(timeKey4).toEqual('4.1.1');
    expect(timeKey5).toEqual('4.3.1');
  });
});
