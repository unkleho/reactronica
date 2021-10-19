import { StepNoteType, StepType } from '../components/Track';
import { MidiNote } from 'types/midi-notes';
// import { MidiNote } from 'tone/build/esm/core/type/Units';
// import { TimeNote } from '../types/typescript';

export type StepsPerBar = 4 | 8 | 16;
export type SequencerStep = {
  notes: StepNoteType[];
  index: number;
};

// export type TimeKey = `${number}:${number}:${number}`;

export interface TimeNote {
  time: string;
  // end?: string;
  name: string;
  duration?: number | string;
  velocity?: number;
}

/**
 * Convert Reactronica steps to `TimeNotes`
 */
export function convertStepsToNotes(
  steps: StepType[] = [],
  bars: number,
  stepsPerBar: StepsPerBar,
): TimeNote[] {
  const normalisedSteps = steps.map(normaliseStep);

  const notes = normalisedSteps.reduce((prev, curr, i) => {
    const timeKey = getTimeKey(i, bars, stepsPerBar);

    return [
      ...prev,
      ...(curr
        ? curr.notes.map((note) => {
            return { time: timeKey, index: curr.index, ...note };
          })
        : []),
    ];
  }, []);

  return notes as TimeNote[];
}

/**
 * Normalise step making it easier to manipulate
 */
export default function normaliseStep(
  step: StepType,
  i: number,
): SequencerStep {
  if (typeof step === 'string') {
    return {
      notes: [
        {
          name: step as MidiNote,
        },
      ],
      index: i,
    };
  } else if (step && (step as StepNoteType).name) {
    return {
      notes: [
        {
          name: (step as StepNoteType).name,
          duration: (step as StepNoteType).duration,
          velocity: (step as StepNoteType).velocity,
        },
      ],
      index: i,
    };
  } else if (Array.isArray(step)) {
    return {
      notes: (step as Array<StepNoteType | MidiNote>).map((s) => {
        if (typeof s === 'string') {
          return {
            name: s,
          };
        }

        return s;
      }),
      index: i,
    };
  }

  return {
    notes: [
      // If no notes, send empty note
      {
        name: null,
      },
    ],
    index: i,
  };
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
  const barKey = Math.floor(index / stepsPerBar);

  let noteKey;
  let sixteenthsKey;

  if (stepsPerBar === 4) {
    noteKey = index % notesPerBar;
    sixteenthsKey = 0;
  } else if (stepsPerBar === 8) {
    // Halve index and get whole number. Mod by stepsPerBar, then mod by notesPerBar
    noteKey = (Math.floor(index / 2) % stepsPerBar) % notesPerBar;
    // Check odd or even
    sixteenthsKey = index % 2 ? 2 : 0;
  } else if (stepsPerBar === 16) {
    noteKey = Math.floor(((index / totalSteps) * stepsPerBar) / notesPerBar);
    sixteenthsKey = index % notesPerBar;
  }

  const timeKey = `${barKey}:${noteKey}:${sixteenthsKey}`;

  return timeKey;
}
