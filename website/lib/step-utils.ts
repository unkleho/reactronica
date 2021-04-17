import { StepNoteType } from 'reactronica';
import { TimeNote } from '../types/typescript';

export function buildSteps(
  notes: TimeNote[] = [],
  bars,
  subdivision = 16,
  notesPerBar = 4,
): StepNoteType[][] {
  // const { bars, notes } = clip;
  const totalSteps = bars * subdivision;

  // To pass ts-jest test
  // @ts-ignore
  const emptyArray = [...new Array(totalSteps)].fill(null);

  const steps = emptyArray.map((_, i) => {
    const timeKey = buildTimeKey(i, subdivision, notesPerBar);

    const result = notes
      .filter((note) => {
        return note.start === timeKey;
      })
      .map((note) => {
        return {
          name: note.name,
          duration: note.duration,
          velocity: note.velocity,
        };
      });

    if (result.length === 0) {
      return null;
    }

    return result;
  });

  return steps;
}

export function buildClip(steps, id, subdivision = 16, notesPerBar = 4) {
  const notes = steps.reduce((prev, curr, i) => {
    const timeKey = buildTimeKey(i, subdivision, notesPerBar);

    return [
      ...prev,
      ...(curr
        ? curr.map((note) => {
            return { start: timeKey, ...note };
          })
        : []),
    ];
  }, []);

  return {
    id,
    bars: 1,
    notes,
  };
}

export function convertStepsToNotes(steps, subdivision = 16, notesPerBar = 4) {
  const notes = steps.reduce((prev, curr, i) => {
    const timeKey = buildTimeKey(i, subdivision, notesPerBar);

    return [
      ...prev,
      ...(curr
        ? curr.map((note) => {
            return { start: timeKey, ...note };
          })
        : []),
    ];
  }, []);

  return notes;
}

function buildTimeKey(i, subdivision, notesPerBar) {
  const barKey = Math.ceil((i + 1) / subdivision);
  const noteKey = Math.ceil((i + 1) / notesPerBar) % notesPerBar || notesPerBar;
  const sixteenthsKey = (i % notesPerBar) + 1;
  const timeKey = `${barKey}.${noteKey}.${sixteenthsKey}`;

  return timeKey;
}
