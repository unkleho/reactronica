import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { SongContext } from './Song';
import { StepType } from '../types/propTypes';
import { isEqual } from '../lib/utils';
import Tone from '../lib/tone';

export const TrackContext = React.createContext();

class TrackConsumer extends Component {
  static propTypes = {
    steps: PropTypes.arrayOf(StepType),
    volume: PropTypes.number,
    pan: PropTypes.number,
    subdivision: PropTypes.string, // react-music = resolution
    effects: PropTypes.arrayOf(PropTypes.element), // TODO: Consider accepting Tone effects signals
    onStepPlay: PropTypes.func,
  };

  static defaultProps = {
    volume: 0,
    pan: 0,
    subdivision: '4n',
    effects: [],
  };

  state = {
    instruments: [],
    track: null,
    effectsChain: [], // An array of Tone effects
    trackChannelBase: null,
    trackChannel: {
      id: null,
    }, // Tone Signal
    // effectsChain2: [], // An array of Tone effects for sending to Instrument
  };

  componentDidMount() {
    // Example of chaining
    // const feedbackDelay = new Tone.FeedbackDelay('8n', 0.5);
    // this.trackChain = [
    // feedbackDelay,
    // Tone.Master,
    // ];

    // Setup new track based on pan and volume component

    // NOTE: Not used right now because of effect toggle issue
    this.setState({
      trackChannelBase: new Tone.PanVol(this.props.pan, this.props.volume),
    });
    // this.updateTrackChannelEffects();
  }

  // updateTrackChannelEffects = (effectsChain = []) => {
  // 	console.log('<Track />', 'updateTrackChannelEffects');
  // 	console.log(effectsChain);

  // 	const trackChannel = this.trackChannelBase.chain(
  // 		...effectsChain,
  // 		Tone.Master,
  // 	);
  // 	trackChannel.id = Math.random(1000);
  // 	// console.log(this.trackChannel.id);

  // 	// Set this to pass it Instrument
  // 	this.setState((prevState) => {
  // 		return {
  // 			...prevState,
  // 			trackChannel,
  // 			effectsChain2: effectsChain,
  // 		};
  // 	});
  // };

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevProps, this.props);

    // -------------------------------------------------------------------------
    // UPDATE EFFECTS
    // -------------------------------------------------------------------------

    // if (prevState.effectsChain !== this.state.effectsChain) {
    // 	this.updateTrackChannelEffects(this.state.effectsChain);
    // }

    // -------------------------------------------------------------------------
    // STEPS
    // -------------------------------------------------------------------------

    // Start/Stop sequencer!
    if (!prevProps.isPlaying && this.props.isPlaying) {
      this.stepsToPlay = this.props.steps;

      this.seq = new Tone.Sequence(
        (time, step) => {
          step.notes.forEach((note) => {
            this.state.instruments[0].triggerAttackRelease(
              note.note,
              note.duration,
              undefined,
              note.velocity,
            );
          });

          if (typeof this.props.onStepPlay === 'function') {
            this.props.onStepPlay(step, step.index);
          }
        },
        /*
         Tone.Sequence can't easily play chords. Any arrays within steps are flattened out and subdivided, however an array of notes is our preferred way of representing chords. To get around this, buildSequencerStep() will transform notes and put them in a notes field as an array. We can then loop through and run triggerAttackRelease() to play the note/s.
         */
        this.stepsToPlay.map(buildSequencerStep),
        this.props.subdivision,
      );

      this.seq.start(0);
    } else if (prevProps.isPlaying && !this.props.isPlaying) {
      this.seq.stop();
    }

    // Update sequencer steps while playing
    if (this.props.isPlaying) {
      // Deep compare prev and new steps, only update if they are different
      // const doesStepsNeedUpdating = isEqual(prevProps.steps, this.props.steps);
      const doesStepsNeedUpdating =
        JSON.stringify(prevProps.steps) !== JSON.stringify(this.props.steps);

      if (doesStepsNeedUpdating) {
        this.stepsToPlay = this.props.steps.map(buildSequencerStep);
        this.seq.removeAll();

        this.stepsToPlay.forEach((note, i) => {
          this.seq.add(i, note);
        });
      }
    }

    // -------------------------------------------------------------------------
    // VOLUME / PAN
    // -------------------------------------------------------------------------

    // Not used
    // if (prevProps.volume !== this.props.volume) {
    // 	this.state.trackChannel.volume.value = this.props.volume;
    // }

    // if (prevProps.pan !== this.props.pan) {
    // 	this.state.trackChannel.pan.value = this.props.pan;
    // }
  }

  updateInstruments = (instruments) => {
    this.setState({
      instruments,
    });
  };

  addToEffectsChain = (effect) => {
    console.log('<Track />', 'addToEffectsChain');

    // Alternative way of setting state, more robust.
    this.setState((prevState) => {
      return {
        ...prevState,
        effectsChain: [effect, ...prevState.effectsChain],
      };
    });
  };

  removeFromEffectsChain = (effect) => {
    console.log('<Track />', 'removeFromEffectsChain', effect);

    this.setState((prevState) => {
      return {
        ...prevState,
        // Filter out `effect.id`
        effectsChain: this.state.effectsChain.filter((e) => e.id !== effect.id),
      };
    });
  };

  render() {
    return (
      <TrackContext.Provider
        value={{
          effectsChain: this.state.effectsChain, // Used by Instrument
          updateInstruments: this.updateInstruments,
          addToEffectsChain: this.addToEffectsChain,
          removeFromEffectsChain: this.removeFromEffectsChain,
          pan: this.props.pan,
          volume: this.props.volume,
        }}
      >
        <Fragment>
          {this.props.children}
          {this.props.effects}
        </Fragment>
      </TrackContext.Provider>
    );
  }
}

export default class Track extends Component {
  render() {
    return (
      <SongContext.Consumer>
        {(value) => <TrackConsumer {...value} {...this.props} />}
      </SongContext.Consumer>
    );
  }
}

function buildSequencerStep(step, i) {
  if (typeof step === 'string') {
    return {
      notes: [
        {
          note: step,
        },
      ],
      index: i,
    };
  } else if (step && step.note) {
    return {
      notes: [
        {
          note: step.note,
          duration: step.duration,
          velocity: step.velocity,
        },
      ],
      index: i,
    };
  } else if (Array.isArray(step)) {
    return {
      notes: step.map((s) => {
        if (typeof s === 'string') {
          return {
            note: s,
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
