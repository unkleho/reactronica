import React from 'react';
import { Song, Track, Instrument, Effect } from 'reactronica';

import StepsEditor from '../StepsEditor';
import Transport from '../Transport';
import * as types from '../../types';
import { melodyClip, beatClip } from '../../sample-data';
import { buildSteps } from '../../lib/stepUtils';

import css from './StepsEditorExample.module.css';

const initialState = {
  // --------------------------------------------------------------------------
  // TRANSPORT

  // --------------------------------------------------------------------------
  isPlaying: false,
  tempo: 70,
  // --------------------------------------------------------------------------
  // STEPS
  // --------------------------------------------------------------------------
  // Highlighted step that follows the music
  currentStepIndex: null,
  // --------------------------------------------------------------------------
  // TRACK
  // --------------------------------------------------------------------------
  currentTrackName: 'melody',
  tracks: {
    melody: {
      volume: 100,
      pan: 50,
      steps: buildSteps(melodyClip),
      notes: [],
      effects: [],
    },
    beat: {
      volume: 100,
      pan: 50,
      steps: buildSteps(beatClip),
      notes: [],
      effects: [],
    },
  },
  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  // feedback: 0.6,
  // defaultEffects: [
  //   <Effect
  //     type="feedbackDelay"
  //     key="effect-1"
  //     id="effect-1"
  //     delayTime={'16n'}
  //     feedback={0.6}
  //   />,
  //   <Effect type="distortion" key="effect-2" id="effect-2" />,
  // ],
  // effects: [],
};

const StepsEditorExample = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    isPlaying,
    tempo,
    currentTrackName,
    currentStepIndex,
    tracks,
    volume,
    pan,
    notes,
  } = state;

  // console.log(tracks.beat);

  const currentTrack = tracks[currentTrackName];
  const currentSteps = currentTrack.steps;

  return (
    <div className={css.stepsEditorExample}>
      <div className={css.stepsChooser}>
        {['melody', 'beat'].map((name) => {
          return (
            <button
              className={[
                css.stepsChooserButton,
                name === currentTrackName ? css.stepsChooserButtonActive : '',
              ].join(' ')}
              onClick={() =>
                dispatch({
                  type: types.SET_CURRENT_TRACK_NAME,
                  name,
                })
              }
              key={name}
            >
              {name}
            </button>
          );
        })}
      </div>

      <StepsEditor
        defaultSteps={currentSteps}
        currentStepIndex={currentStepIndex}
        notes={notes}
        subdivision={16}
        onStepEditorClick={(steps) =>
          dispatch({ type: types.UPDATE_CURRENT_STEPS, steps })
        }
        onKeyboardDown={(note) =>
          dispatch({ type: types.SET_NOTES, notes: [{ name: note }] })
        }
        onKeyboardUp={() => dispatch({ type: types.SET_NOTES, notes: [] })}
      />

      <Transport isPlaying={isPlaying} tempo={tempo} dispatch={dispatch} />

      <button onClick={() => dispatch({ type: types.ADD_EFFECTS })}>
        Add Effects
      </button>
      {/* WIP */}
      {/* <button onClick={() => dispatch({ type: types.ADD_MORE_FEEDBACK })}>
        Add more feedback
      </button> */}

      <h4>Track</h4>
      <div className="app__track">
        <div>
          <label htmlFor="volume">Volume</label>
          <br />
          <input
            id="volume"
            type="range"
            value={currentTrack.volume}
            onChange={(event) =>
              dispatch({ type: types.SET_VOLUME, volume: event.target.value })
            }
          />
          {volume}
        </div>

        <br />

        <div>
          <label htmlFor="pan">Pan</label>
          <br />
          <input
            id="pan"
            type="range"
            value={currentTrack.pan}
            onChange={(event) =>
              dispatch({ type: types.SET_PAN, pan: event.target.value })
            }
          />
          {pan}
        </div>
      </div>

      {currentTrack.effects.length > 0 && <h4>Effects</h4>}
      {currentTrack.effects.map((effect) => {
        return (
          <div className={css.trackEffect} key={effect.id}>
            <p>
              {effect.type}{' '}
              <button
                onClick={() =>
                  dispatch({ type: types.REMOVE_EFFECT, id: effect.id })
                }
              >
                Remove
              </button>
            </p>
          </div>
        );
      })}

      {/* ----------------------------------------------------------------- */}
      {/* AUDIO */}
      {/* ----------------------------------------------------------------- */}

      <Song
        isPlaying={isPlaying}
        tempo={tempo}
        swing={1}
        swingSubdivision={'8n'}
      >
        <Track
          steps={tracks.melody.steps}
          volume={(parseInt(tracks.melody.volume, 10) / 100) * 32 - 32}
          pan={(parseInt(tracks.melody.pan, 10) / 100) * 2 - 1}
          subdivision={'16n'}
          effects={tracks.melody.effects.map((effect, i) => {
            return (
              <Effect
                type={effect.type}
                key={`${effect.id}-${i}-melody`}
                id={`${effect.id}-${i}-melody`}
                delayTime={effect.delayTime || '16n'}
                feedback={effect.feedback || 0.6}
              />
            );
          })}
          onStepPlay={(step) =>
            dispatch({
              type: types.SET_CURRENT_STEP_INDEX,
              currentStepIndex: step.index,
            })
          }
        >
          <Instrument type="polySynth" notes={tracks.melody.notes} />
        </Track>

        <Track
          steps={tracks.beat.steps}
          volume={(parseInt(tracks.beat.volume, 10) / 100) * 32 - 32}
          pan={(parseInt(tracks.beat.pan, 10) / 100) * 2 - 1}
          subdivision={'16n'}
          effects={tracks.beat.effects.map((effect, i) => {
            return (
              <Effect
                type={effect.type}
                key={`${effect.id}-${i}-beat`}
                id={`${effect.id}-${i}-beat`}
                delayTime={effect.delayTime || '16n'}
                feedback={effect.feedback || 0.6}
              />
            );
          })}
        >
          <Instrument
            type="sampler"
            samples={{
              C3: `${process.env.PUBLIC_URL}/audio/drums/kick15.wav`,
              D3: `${
                process.env.PUBLIC_URL
              }/audio/drums/snare-bottom-buttend15.wav`,
              E3: `${process.env.PUBLIC_URL}/audio/drums/chh12.wav`,
            }}
            notes={tracks.beat.notes}
          />
        </Track>
      </Song>
    </div>
  );
};

export default StepsEditorExample;

function reducer(state, action) {
  switch (action.type) {
    case types.TOGGLE_PLAYING:
      return { ...state, isPlaying: !state.isPlaying };

    case types.INCREASE_TEMPO:
      return { ...state, tempo: state.tempo + 1 };

    case types.DECREASE_TEMPO:
      return { ...state, tempo: state.tempo - 1 };

    case types.SET_CURRENT_STEP_INDEX:
      return { ...state, currentStepIndex: action.currentStepIndex };

    case types.UPDATE_CURRENT_STEPS:
      const { steps } = action;

      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            steps,
          },
        },
      };

    case types.SET_CURRENT_TRACK_NAME:
      return {
        ...state,
        currentTrackName: action.name,
      };

    case types.SET_NOTES:
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            notes: action.notes,
          },
        },
      };

    case types.ADD_EFFECTS:
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            effects: [
              {
                id: 'effect-1',
                type: 'feedbackDelay',
              },
              {
                id: 'effect-2',
                type: 'distortion',
              },
            ],
          },
        },
      };

    case types.REMOVE_EFFECT:
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            effects: state.tracks[state.currentTrackName].effects.filter(
              (effect) => effect.id !== action.id,
            ),
          },
        },
      };

    case types.ADD_MORE_FEEDBACK:
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            feedback: 0.9,
          },
        },
      };

    case types.SET_VOLUME:
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            volume: action.volume,
          },
        },
      };

    case types.SET_PAN:
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [state.currentTrackName]: {
            ...state.tracks[state.currentTrackName],
            pan: action.pan,
          },
        },
      };

    default:
      throw new Error();
  }
}
