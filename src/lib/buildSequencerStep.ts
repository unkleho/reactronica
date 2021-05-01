import { StepNoteType, StepType } from 'components/Track';
import { MidiNote } from '../types/midi-notes';

export type SequencerStep = {
  notes: StepNoteType[];
  index: number;
};

export default function buildSequencerStep(step: StepType, i): SequencerStep {
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
      notes: step.map((s) => {
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
    notes: [],
    index: i,
  };
}
