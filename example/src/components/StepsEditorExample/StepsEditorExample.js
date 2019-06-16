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
  // Rename to clips?
  stepsGroup: {
    melodySteps: buildSteps(melodyClip),
    beatSteps: buildSteps(beatClip),
  },
  currentStepsName: 'melodySteps',
  // Highlighted step that follows the music
  currentStepIndex: null,
  // --------------------------------------------------------------------------
  // TRACK
  // --------------------------------------------------------------------------
  volume: 100,
  pan: 50,
  notes: [],
  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  feedback: 0.6,
  defaultEffects: [
    <Effect
      type="feedbackDelay"
      key="effect-1"
      id="effect-1"
      delayTime={'16n'}
      feedback={0.6}
    />,
    <Effect type="distortion" key="effect-2" id="effect-2" />,
  ],
  effects: [],
};

const StepsEditorExample = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    isPlaying,
    tempo,
    stepsGroup,
    currentStepsName,
    currentStepIndex,
    volume,
    pan,
    notes,
    effects,
  } = state;

  const currentSteps = stepsGroup[currentStepsName];

  return (
    <div className={css.stepsEditorExample}>
      <div className={css.stepsChooser}>
        {['melody', 'beat'].map((name) => {
          return (
            <button
              className={[
                css.stepsChooserButton,
                `${name}Steps` === currentStepsName
                  ? css.stepsChooserButtonActive
                  : '',
              ].join(' ')}
              onClick={() =>
                dispatch({
                  type: types.SET_CURRENT_STEPS_NAME,
                  name: `${name}Steps`,
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
      <button onClick={() => dispatch({ type: types.ADD_MORE_FEEDBACK })}>
        Add more feedback
      </button>

      <h4>Track</h4>
      <div className="app__track">
        <div>
          <label htmlFor="volume">Volume</label>
          <br />
          <input
            id="volume"
            type="range"
            value={volume}
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
            value={pan}
            onChange={(event) =>
              dispatch({ type: types.SET_PAN, pan: event.target.value })
            }
          />
          {pan}
        </div>
      </div>

      {effects.length > 0 && <h4>Effects</h4>}
      {effects.map((effect) => {
        return (
          <div className={css.trackEffect} key={effect.props.id}>
            <p>
              {effect.props.type}{' '}
              <button
                onClick={() =>
                  dispatch({ type: types.REMOVE_EFFECT, id: effect.props.id })
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
          steps={stepsGroup.melodySteps}
          volume={(parseInt(volume, 10) / 100) * 32 - 32}
          pan={(parseInt(pan, 10) / 100) * 2 - 1}
          subdivision={'16n'}
          effects={effects}
          onStepPlay={(step) =>
            dispatch({
              type: types.SET_CURRENT_STEP_INDEX,
              currentStepIndex: step.index,
            })
          }
        >
          <Instrument type="polySynth" notes={notes} />
        </Track>

        <Track steps={stepsGroup.beatSteps} subdivision={'16n'}>
          <Instrument
            type="sampler"
            samples={{
              C3: '/audio/drums/kick15.wav',
              D3: '/audio/drums/snare-bottom-buttend15.wav',
              E3: '/audio/drums/chh12.wav',
            }}
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
        stepsGroup: {
          ...state.stepsGroup,
          [state.currentStepsName]: steps,
        },
      };

    case types.SET_CURRENT_STEPS_NAME:
      return {
        ...state,
        currentStepsName: action.name,
      };

    case types.SET_NOTES:
      return {
        ...state,
        notes: action.notes,
      };

    case types.ADD_EFFECTS:
      return {
        ...state,
        effects: state.defaultEffects,
      };

    case types.REMOVE_EFFECT:
      return {
        ...state,
        effects: state.effects.filter(
          (effect) => effect.props.id !== action.id,
        ),
      };

    case types.ADD_MORE_FEEDBACK:
      return {
        ...state,
        feedback: 0.9,
      };

    case types.SET_VOLUME:
      return {
        ...state,
        volume: action.volume,
      };

    case types.SET_PAN:
      return {
        ...state,
        pan: action.pan,
      };

    default:
      throw new Error();
  }
}
