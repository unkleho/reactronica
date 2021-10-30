import React, { useState, useEffect, useRef } from 'react';
// import equal from 'fast-deep-equal';

import { SongContext } from './Song';
import Tone from '../lib/tone';
// import * as Tone from 'tone';
import buildSequencerStep, { SequencerStep } from '../lib/buildSequencerStep';
// import { usePrevious } from '../lib/hooks';
import { MidiNote } from '../types/midi-notes';
// import { convertStepsToNotes } from '../lib/step-utils';

export interface StepNoteType {
  name: MidiNote | string;
  duration?: number | string;
  velocity?: number;
}

export type StepType =
  | StepNoteType
  | StepNoteType[]
  | MidiNote
  | MidiNote[]
  | string
  | string[]
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
  onStepPlay?: (stepNotes: StepType, index: number) => void;
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
  // -------------------------------------------------------------------------
  // INSTRUMENT/EFFECTS
  // -------------------------------------------------------------------------

  const [instruments, setInstruments] = useState([]);
  const [effectsChain, setEffectsChain] = useState([]);

  // TODO: Use real Tone types
  const sequencer = useRef<{
    start: Function;
    stop: Function;
    events: SequencerStep[];
    dispose: Function;
    removeAll: Function;
    loop: boolean;
  }>();
  const instrumentsRef = useRef(instruments);

  useEffect(() => {
    instrumentsRef.current = instruments;
  }, [instruments]);

  useEffect(() => {
    // Tried putting new Tone.Sequence to reuse instance, but stops looping after a while.
    // So need to put it in isPlaying useEffect.

    return function cleanup() {
      if (sequencer.current) {
        sequencer.current.dispose();
      }
    };
    /* eslint-disable-next-line */
  }, []);

  // -------------------------------------------------------------------------
  // STEPS
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (isPlaying) {
      // ----------------------------------------------------------------------
      // Tone.Sequence can't easily play chords. By default, arrays within
      // steps are flattened out and subdivided.
      // However an array of notes is our preferred way of representing chords.
      // To get around this, buildSequencerStep() will transform notes and put
      // them in a notes field as an array. We can then loop through and run
      // triggerAttackRelease() to play the note/s.
      // ----------------------------------------------------------------------

      const sequencerSteps = steps.map(buildSequencerStep);

      console.log('sequencerSteps', sequencerSteps);

      sequencer.current = new Tone.Sequence(
        (time, step: SequencerStep) => {
          step.notes.forEach((note: StepNoteType, i) => {
            instrumentsRef.current.forEach((instrument) => {
              instrument.triggerAttackRelease(
                note.name,
                note.duration || 0.5,
                // Nudge time to avoid:
                // `Start time must be strictly greater than previous start time` error
                time + i / 1000,
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

      sequencer.current.events = sequencerSteps;
      sequencer.current.loop = true;
      sequencer.current.start(0);
    } else {
      if (sequencer.current) {
        sequencer.current.stop();
      }
    }
    /* eslint-disable-next-line */
  }, [isPlaying]);

  useEffect(() => {
    if (sequencer.current) {
      const sequencerSteps = steps.map(buildSequencerStep);

      // Update new sequencer steps
      sequencer.current.events = sequencerSteps;
      sequencer.current.loop = true;
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(steps)]);

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
