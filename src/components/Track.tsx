import React, { useState, useEffect, useRef } from 'react';

import { SongContext } from './Song';
import Tone from '../lib/tone';
import buildSequencerStep from '../lib/buildSequencerStep';
import { MidiNote } from '../types/midi-notes';

export interface StepNoteType {
  name: MidiNote;
  duration?: number | string;
  velocity?: number;
  /** Nudges the note's start time by this amount (seconds, or Tone notation
   * like '32n'). A per-note alternative to Song's global `swing` prop. */
  delay?: number | string;
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
  const onStepPlayRef = useRef(onStepPlay);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    instrumentsRef.current = instruments;
  }, [instruments]);

  useEffect(() => {
    onStepPlayRef.current = onStepPlay;
  }, [onStepPlay]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  /*
  Tone.Sequence can't easily play chords. By default, arrays within steps are flattened out and subdivided. However an array of notes is our preferred way of representing chords. To get around this, buildSequencerStep() will transform notes and put them in a notes field as an array. We can then loop through and run triggerAttackRelease() to play the note/s.
  */
  const sequencerSteps = steps.map(buildSequencerStep);

  useEffect(() => {
    // -------------------------------------------------------------------------
    // STEPS
    // -------------------------------------------------------------------------

    // Tone.Sequence's subdivision can only be set at construction time, so
    // this only (re)constructs when `subdivision` changes - not on every
    // isPlaying toggle, which instead starts/stops this same instance below.
    // instruments/onStepPlay are read through refs so this callback never
    // goes stale, even though it's only created once per subdivision.
    sequencer.current = new Tone.Sequence(
      (time, step) => {
        step.notes.forEach((note) => {
          const noteTime = note.delay
            ? time + Tone.Time(note.delay).toSeconds()
            : time;

          instrumentsRef.current.forEach((instrument) => {
            // NoiseSynth is unpitched - its triggerAttackRelease is
            // (duration, time, velocity), with no note name.
            if (instrument instanceof Tone.NoiseSynth) {
              instrument.triggerAttackRelease(
                note.duration || 0.5,
                noteTime,
                note.velocity,
              );
            } else {
              instrument.triggerAttackRelease(
                note.name,
                note.duration || 0.5,
                noteTime,
                note.velocity,
              );
            }
          });
        });

        if (typeof onStepPlayRef.current === 'function') {
          onStepPlayRef.current(step.notes, step.index);
        }
      },
      sequencerSteps,
      subdivision,
    );

    if (isPlayingRef.current) {
      sequencer.current.start(0);
    }

    return function cleanup() {
      sequencer.current.dispose();
    };
    /* eslint-disable-next-line */
  }, [subdivision]);

  useEffect(() => {
    // Start/Stop the same sequencer instance - Tone.Sequence's start()/stop()
    // are idempotent, so no need to check its current state first.
    if (!sequencer.current) {
      return;
    }

    if (isPlaying) {
      sequencer.current.start(0);
    } else {
      sequencer.current.stop();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (sequencer.current) {
      // Tone's Sequence has no add/remove/removeAll methods, so replace the
      // whole events array whenever steps change.
      sequencer.current.events = sequencerSteps;
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(sequencerSteps)]);

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
