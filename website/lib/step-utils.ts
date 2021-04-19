import { StepNoteType, StepType } from 'reactronica';
import { TimeNote } from '../types/typescript';

export type StepsPerBar = 4 | 8 | 16;

/**
 * Build an array of steps from TimeNotes using the `start` `timeKey` value.
 */
export function buildSteps(
  notes: TimeNote[] = [],
  bars: number,
  stepsPerBar: StepsPerBar = 4,
): StepNoteType[][] {
  // const { bars, notes } = clip;
  // const totalSteps = bars * subdivision;
  const totalSteps = bars * stepsPerBar;

  // To pass ts-jest test
  // @ts-ignore
  const emptyArray = [...new Array(totalSteps)].fill(null);

  const steps = emptyArray.map((_, i) => {
    // const timeKey = buildTimeKey(i, subdivision, notesPerBar);
    const timeKey = getTimeKey(i, bars, stepsPerBar);

    const result = notes
      .filter((note) => {
        return note.start === timeKey;
      })
      .map((note) => {
        const { name, start, ...rest } = note;

        return {
          name: note.name,
          ...rest,
          // duration: note.duration,
          // velocity: note.velocity,
        };
      });

    if (result.length === 0) {
      return null;
    }

    return result;
  });

  return steps;
}

export function buildClip(steps, id, bars = 1, stepsPerBar: StepsPerBar = 16) {
  const notes = steps.reduce((prev, curr, i) => {
    const timeKey = getTimeKey(i, bars, stepsPerBar);

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

/**
 * Convert Reactronica steps to `TimeNotes`
 */
export function convertStepsToNotes(
  steps: StepNoteType[][],
  bars: number,
  stepsPerBar: StepsPerBar,
): TimeNote[] {
  const notes = steps.reduce((prev, curr, i) => {
    const timeKey = getTimeKey(i, bars, stepsPerBar);

    return [
      ...prev,
      ...(curr
        ? curr.map((note) => {
            return { start: timeKey, ...note };
          })
        : []),
    ];
  }, []);

  return notes as TimeNote[];
}

/**
 * Converts an index to bars:notes:sixteenths format based on `bars` and `stepsPerBar`
 */
export function getTimeKey(
  index: number,
  bars: number,
  stepsPerBar: StepsPerBar,
  /** Default to 4/4 time */
  notesPerBar: number = 4,
): string {
  const totalSteps = bars * stepsPerBar;
  const barKey = Math.ceil((index + 1) / stepsPerBar);

  let noteKey;
  let sixteenthsKey;

  if (stepsPerBar === 4) {
    noteKey = (index % notesPerBar) + 1;
    sixteenthsKey = 1;
  } else if (stepsPerBar === 8) {
    // Halve index and get whole number. Mod by stepsPerBar, then mod by notesPerBar
    noteKey = ((Math.floor(index / 2) % stepsPerBar) % notesPerBar) + 1;
    // Check odd or even
    sixteenthsKey = index % 2 ? 3 : 1;
  } else if (stepsPerBar === 16) {
    noteKey = Math.floor(
      ((index / totalSteps) * stepsPerBar) / notesPerBar + 1,
    );
    sixteenthsKey = (index % notesPerBar) + 1;
  }

  const timeKey = `${barKey}.${noteKey}.${sixteenthsKey}`;

  return timeKey;
}
