import {
  // gridLineToTabLine,
  fretToNote,
  noteToFret,
  gridToSamplerSteps,
  // pianoGridToRoll,
} from './tabUtils';
import { defaultUkeGrid } from '../constants';

const gridLine = [
  {
    step: 0,
    duration: 2,
    note: 'e3',
  },
  {
    step: 8,
    duration: 2,
    note: 'f3',
  },
];

it('converts gridLine to tabLine', () => {
  // expect(gridLineToTabLine(gridLine, 16)).toHaveLength(16);
});

it('converts fret (int) to note (string)', () => {
  expect(fretToNote(2, 'g3')).toEqual('a3');
  expect(fretToNote(0, 'c3')).toEqual('c3');
  expect(() => fretToNote()).toThrowError('Fret is required');
  expect(() => fretToNote(0)).toThrowError('String is required');
  expect(() => fretToNote('c')).toThrowError('Fret has to be an integer');
  expect(() => fretToNote(1, 1)).toThrowError('String has to be a string');
});

it('converts note (string) to fret (int)', () => {
  expect(noteToFret('c3', 'c3')).toEqual(0);
  expect(noteToFret('d3', 'c3')).toEqual(2);
  expect(noteToFret('d3', 'g3')).toEqual(null);
});

it('converts grid (array) to sample steps (array)', () => {
  const result = gridToSamplerSteps(defaultUkeGrid);

  expect(result).toHaveLength(16);
  expect(result).toEqual([
    { note: 'e5', duration: 2 },
    { note: 'c6', duration: 2 },
    { note: 'g5', duration: 2 },
    { note: 'e5', duration: 2 },
    { note: 'c6', duration: 2 },
    { note: 'g5', duration: 2 },
    { note: 'e5', duration: 2 },
    { note: 'g5', duration: 2 },
    { note: 'f5', duration: 2 },
    { note: 'c6', duration: 2 },
    { note: 'g5', duration: 2 },
    { note: 'f5', duration: 2 },
    { note: 'c6', duration: 2 },
    { note: 'g5', duration: 2 },
    { note: 'f5', duration: 2 },
    { note: 'g5', duration: 2 },
  ]);
});

// it('converts piano grid (array) to piano roll (array of arrays)', () => {
//   let result = [
//     [
//       {
//         duration: 2,
//         note: 'c0',
//         step: 0,
//       },
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//     ],
//     [
//       null,
//       {
//         duration: 2,
//         note: 'c#0',
//         step: 1,
//       },
//       null,
//       null,
//       null,
//       null,
//       null,
//       null,
//     ],
//   ];

//   expect(pianoGridToRoll(defaultPianoGrid, 8, 1, 0, 2)).toEqual(result);
// });
