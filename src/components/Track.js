import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { SongContext } from './Song';
import { StepType } from '../types/propTypes';
import Tone from '../lib/tone';
import buildSequencerStep from '../lib/buildSequencerStep';

export const TrackContext = React.createContext();

const TrackConsumer = ({
  // <Song /> props
  isPlaying,
  // <Track /> props
  steps,
  volume = 0,
  pan = 0,
  subdivision = '4n',
  effects = [],
  children,
  onStepPlay,
}) => {
  const [effectsChain, setEffectsChain] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const sequencer = useRef();

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
            instruments[0].triggerAttackRelease(
              note.note,
              note.duration,
              undefined,
              note.velocity,
            );
          });

          if (typeof onStepPlay === 'function') {
            onStepPlay(step, step.index);
          }
        },
        sequencerSteps,
        subdivision,
      );

      sequencer.current.start(0);
    } else {
      if (sequencer.current) {
        sequencer.current.stop();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (sequencer.current) {
      sequencer.current.removeAll();

      sequencerSteps.forEach((note, i) => {
        sequencer.current.add(i, note);
      });
    }
  }, [steps]);

  const addToEffectsChain = (effect) => {
    // console.log('<Track />', 'addToEffectsChain');

    setEffectsChain((prevEffectsChain) => {
      return [effect, ...prevEffectsChain];
    });
  };

  const removeFromEffectsChain = (effect) => {
    // console.log('<Track />', 'removeFromEffectsChain', effect);

    setEffectsChain((prevEffectsChain) => {
      return prevEffectsChain.filter((e) => e.id !== effect.id);
    });
  };

  return (
    <TrackContext.Provider
      value={{
        updateInstruments: (newInstruments) => {
          setInstruments(newInstruments);
        },
        effectsChain, // Used by Instrument
        addToEffectsChain: addToEffectsChain,
        removeFromEffectsChain: removeFromEffectsChain,
        pan,
        volume,
      }}
    >
      {children}
      {effects}
    </TrackContext.Provider>
  );
};

TrackConsumer.propTypes = {
  // <Song /> props
  isPlaying: PropTypes.bool,
  // <Track /> props
  steps: PropTypes.arrayOf(StepType),
  volume: PropTypes.number,
  pan: PropTypes.number,
  subdivision: PropTypes.string, // react-music = resolution
  effects: PropTypes.arrayOf(PropTypes.element), // TODO: Consider accepting Tone effects signals
  onStepPlay: PropTypes.func,
};

const Track = (props) => {
  const value = React.useContext(SongContext);

  return <TrackConsumer {...value} {...props} />;
};

export default Track;
