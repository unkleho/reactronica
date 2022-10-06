import React, { useState, useEffect, useRef } from 'react';
import equal from 'fast-deep-equal';

import { SongContext } from './Song';
import Tone from '../lib/tone';
import buildSequencerStep, { SequencerStep } from '../lib/buildSequencerStep';
import { usePrevious } from '../lib/hooks';
import { MidiNote } from '../types/midi-notes';

export interface StepNoteType {
  name: MidiNote;
  duration?: number | string;
  velocity?: number;
}

export type StepType =
  | StepNoteType
  | StepNoteType[]
  | MidiNote
  | MidiNote[]
  | (StepNoteType | MidiNote)[]
  | null;

export interface TrackProps {
  steps?: StepType[];
  volume?: number;
  pan?: number;
  mute?: boolean;
  solo?: boolean;
  subdivision?: string;
  effects?: React.ReactNode[];
  children: React.ReactNode;
  onStepPlay?: (stepNotes: StepNoteType[], index: number) => void;
}

export interface TrackConsumerProps extends TrackProps {
  isPlaying: boolean;
}

export const TrackContext = React.createContext({
  volume: 0,
  pan: 0,
  mute: false,
  solo: false,
  effectsChain: null,
  onInstrumentsUpdate: null,
  onAddToEffectsChain: null,
  onRemoveFromEffectsChain: null,
});

const TrackConsumer: React.FC<TrackConsumerProps> = ({
  // <Song /> props
  isPlaying,
  // <Track /> props
  steps = [],
  volume = 0,
  pan = 0,
  mute,
  solo,
  subdivision = '4n',
  effects = [],
  children,
  onStepPlay,
}) => {
  const [effectsChain, setEffectsChain] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const sequencer = useRef<{
    start: Function;
    stop: Function;
    remove: Function;
    add: Function;
    dispose: Function;
    removeAll: Function;
  }>();
  const instrumentsRef = useRef(instruments);

  useEffect(() => {
    instrumentsRef.current = instruments;
  }, [instruments]);

  /*
  Tone.Sequence can't easily play chords. By default, arrays within steps are flattened out and subdivided. However an array of notes is our preferred way of representing chords. To get around this, buildSequencerStep() will transform notes and put them in a notes field as an array. We can then loop through and run triggerAttackRelease() to play the note/s.
  */
  const sequencerSteps = steps.map(buildSequencerStep);
  const prevSequencerSteps: SequencerStep[] = usePrevious(sequencerSteps);

  useEffect(() => {
    // -------------------------------------------------------------------------
    // STEPS
    // -------------------------------------------------------------------------

    // Start/Stop sequencer!
    if (isPlaying) {
      sequencer.current = new Tone.Sequence(
        (_, step) => {
          step.notes.forEach((note) => {
            instrumentsRef.current.forEach((instrument) => {
              instrument.triggerAttackRelease(
                note.name,
                note.duration || 0.5,
                undefined,
                note.velocity,
              );
            });
          });

          if (typeof onStepPlay === 'function') {
            onStepPlay(step.notes, step.index);
          }
        },
        sequencerSteps,
        subdivision,
      );

      sequencer.current?.start(0);
    } else {
      if (sequencer.current) {
        sequencer.current.stop();
      }
    }
    /* eslint-disable-next-line */
  }, [isPlaying]);

  useEffect(() => {
    if (sequencer.current) {
      if (prevSequencerSteps?.length === sequencerSteps.length) {
        // When steps length is the same, update steps in a more efficient way
        sequencerSteps.forEach((step, i) => {
          const isEqual = equal(
            sequencerSteps[i].notes,
            prevSequencerSteps && prevSequencerSteps[i]
              ? prevSequencerSteps[i].notes
              : [],
          );

          if (!isEqual) {
            sequencer.current?.remove(i);
            sequencer.current?.add(i, step);
          }
        });
      } else {
        // When new steps are less or more then prev, remove all and add new steps
        sequencer.current.removeAll();
        sequencerSteps.forEach((step, i) => {
          sequencer.current.add(i, step);
        });
      }
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(sequencerSteps)]);

  useEffect(() => {
    return function cleanup() {
      if (sequencer.current) {
        sequencer.current.dispose();
      }
    };
  }, []);

  const handleAddToEffectsChain = (effect) => {
    // console.log('<Track />', 'onAddToEffectsChain');

    setEffectsChain((prevEffectsChain) => {
      return [effect, ...prevEffectsChain];
    });
  };

  const handleRemoveFromEffectsChain = (effect) => {
    // console.log('<Track />', 'onRemoveFromEffectsChain', effect);

    setEffectsChain((prevEffectsChain) => {
      return prevEffectsChain.filter((e) => e.id !== effect.id);
    });
  };

  const handleInstrumentsUpdate = (newInstruments) => {
    setInstruments(newInstruments);
  };

  return (
    <TrackContext.Provider
      value={{
        effectsChain, // Used by Instrument
        pan,
        volume,
        mute,
        solo,
        onInstrumentsUpdate: handleInstrumentsUpdate,
        onAddToEffectsChain: handleAddToEffectsChain,
        onRemoveFromEffectsChain: handleRemoveFromEffectsChain,
      }}
    >
      {children}
      {effects}
    </TrackContext.Provider>
  );
};

const Track: React.FC<TrackProps> = (props) => {
  const { isPlaying } = React.useContext(SongContext);

  if (typeof window === 'undefined') {
    return null;
  }

  return <TrackConsumer isPlaying={isPlaying} {...props} />;
};

export default Track;
