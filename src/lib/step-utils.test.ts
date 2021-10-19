// import { TimeNote } from '../types/typescript';
import { getTimeKey, convertStepsToNotes } from './step-utils';

const steps = [
  // 0:0:0
  [
    // Consider changing to `note`
    { name: 'C3', duration: 0.5 },
    { name: 'G3', duration: 0.5 },
  ],
  null,
  [{ name: 'D3', duration: 0.5 }],
  null,
  // 0:1:0
  [{ name: 'E3', duration: 0.5 }],
  null,
  ['G3', 'C3'],
  null,
  // 0:2:0
  [{ name: 'A3', duration: 1 }],
  null,
  null,
  null,
  // 0:3:0
  'E3',
  null,
  null,
  [{ name: 'E3', duration: 1 }],
];

describe('Step Utilities', () => {
  describe('Convert Steps to Notes', () => {
    const notes = convertStepsToNotes(steps, 1, 16);

    expect(notes).toMatchObject([
      { time: '0:0:0', name: 'C3', duration: 0.5 },
      { time: '0:0:0', name: 'G3', duration: 0.5 },
      { time: '0:0:1', name: null },
      { time: '0:0:2', name: 'D3', duration: 0.5 },
      { time: '0:0:3', name: null },
      { time: '0:1:0', name: 'E3', duration: 0.5 },
      { time: '0:1:1', name: null },
      { time: '0:1:2', name: 'G3' },
      { time: '0:1:2', name: 'C3' },
      { time: '0:1:3', name: null },
      { time: '0:2:0', name: 'A3', duration: 1 },
      { time: '0:2:1', name: null },
      { time: '0:2:2', name: null },
      { time: '0:2:3', name: null },
      { time: '0:3:0', name: 'E3' },
      { time: '0:3:1', name: null },
      { time: '0:3:2', name: null },
      { time: '0:3:3', name: 'E3', duration: 1 },
    ]);
  });

  describe('Time Key', () => {
    it('should convert index to timeKey for 1 bar, 16 stepsPerBar', () => {
      const timeKey1 = getTimeKey(0, 1, 16);
      const timeKey2 = getTimeKey(5, 1, 16);
      const timeKey3 = getTimeKey(10, 1, 16);
      const timeKey4 = getTimeKey(12, 1, 16);

      expect(timeKey1).toEqual('0:0:0');
      expect(timeKey2).toEqual('0:1:1');
      expect(timeKey3).toEqual('0:2:2');
      expect(timeKey4).toEqual('0:3:0');
    });

    it('should convert index to timeKey for 2 bars, 8 stepsPerBar', () => {
      const timeKey1 = getTimeKey(0, 2, 8);
      const timeKey2 = getTimeKey(1, 2, 8);
      const timeKey3 = getTimeKey(4, 2, 8);
      const timeKey4 = getTimeKey(8, 2, 8);
      const timeKey5 = getTimeKey(12, 4, 8);
      const timeKey6 = getTimeKey(14, 4, 8);
      const timeKey7 = getTimeKey(15, 4, 8);

      expect(timeKey1).toEqual('0:0:0');
      expect(timeKey2).toEqual('0:0:2');
      expect(timeKey3).toEqual('0:2:0');
      expect(timeKey4).toEqual('1:0:0');
      expect(timeKey5).toEqual('1:2:0');
      expect(timeKey6).toEqual('1:3:0');
      expect(timeKey7).toEqual('1:3:2');
    });

    it('should convert index to timeKey for 4 bars, 4 stepsPerBar', () => {
      const timeKey1 = getTimeKey(0, 4, 4);
      const timeKey2 = getTimeKey(1, 4, 4);
      const timeKey3 = getTimeKey(8, 4, 4);
      const timeKey4 = getTimeKey(12, 4, 4);
      const timeKey5 = getTimeKey(14, 4, 4);

      expect(timeKey1).toEqual('0:0:0');
      expect(timeKey2).toEqual('0:1:0');
      expect(timeKey3).toEqual('2:0:0');
      expect(timeKey4).toEqual('3:0:0');
      expect(timeKey5).toEqual('3:2:0');
    });
  });
});
