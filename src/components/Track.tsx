import React, { useState, useEffect, useRef } from 'react';

import { SongContext } from './Song';
import Tone from '../lib/tone';
import buildSequencerStep from '../lib/buildSequencerStep';
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
    dispose: Function;
    events: unknown[];
  }>();
  const instrumentsRef = useRef(instruments);

  useEffect(() => {
    instrumentsRef.current = instruments;
  }, [instruments]);

  /*
  Tone.Sequence can't easily play chords. By default, arrays within steps are flattened out and subdivided. However an array of notes is our preferred way of representing chords. To get around this, buildSequencerStep() will transform notes and put them in a notes field as an array. We can then loop through and run triggerAttackRelease() to play the note/s.
  */
  const sequencerSteps = steps.map(buildSequencerStep);

  useEffect(() => {
    // -------------------------------------------------------------------------
    // STEPS
    // -------------------------------------------------------------------------

    // Start/Stop sequencer!
    if (isPlaying) {
      sequencer.current = new Tone.Sequence(
        (time, step) => {
          step.notes.forEach((note) => {
            instrumentsRef.current.forEach((instrument) => {
              instrument.triggerAttackRelease(
                note.name,
                note.duration || 0.5,
                time,
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
      // Tone's Sequence has no add/remove/removeAll methods, so replace the
      // whole events array whenever steps change.
      sequencer.current.events = sequencerSteps;
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
