import React, { Fragment } from 'react';
import { Song, Track, Instrument, Effect, constants } from 'reactronica';

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
  currentTrackId: 'melody',
  tracks: [
    {
      id: 'melody',
      instrumentType: 'polySynth',
      volume: 100,
      pan: 50,
      steps: buildSteps(melodyClip),
      sequences: [],
      notes: [],
      effects: [],
    },
    {
      id: 'beat',
      instrumentType: 'sampler',
      volume: 100,
      pan: 50,
      steps: buildSteps(beatClip),
      sequences: [],
      notes: [],
      effects: [],
    },
  ],
  clips: [melodyClip, beatClip],
};

const StepsEditorExample = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    isPlaying,
    tempo,
    currentTrackId,
    currentStepIndex,
    tracks,
    volume,
    pan,
    notes,
  } = state;
  const [selectedEffect, setSelectedEffect] = React.useState(null);
  React.useEffect(() => {
    setSelectedEffect(null);
  }, [currentTrackId]);

  const currentTrack = tracks.find((track) => track.id === currentTrackId);
  const currentSteps = currentTrack ? currentTrack.steps : [];

  return (
    <div className={css.stepsEditorExample}>
      <div className={css.stepsChooser}>
        {tracks.map((track) => {
          return (
            <Fragment key={track.id}>
              <button
                className={[
                  css.stepsChooserButton,
                  track.id === currentTrackId
                    ? css.stepsChooserButtonActive
                    : '',
                ].join(' ')}
                onClick={() =>
                  dispatch({
                    type: types.SET_CURRENT_TRACK_ID,
                    trackId: track.id,
                  })
                }
              >
                {track.id}
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: types.REMOVE_TRACK,
                    trackId: track.id,
                  });
                }}
              >
                Remove
              </button>
            </Fragment>
          );
        })}

        <button
          onClick={() => {
            dispatch({
              type: types.ADD_TRACK,
              trackId: 'test',
            });
          }}
        >
          Add
        </button>
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

      <h4>Track</h4>

      {currentTrack && (
        <div className="app__track">
          <p>
            Instrument:{' '}
            <select
              onChange={(event) => {
                const selectedOption = event.target[event.target.selectedIndex];
                const type = selectedOption.getAttribute('data-type');

                dispatch({
                  type: types.UPDATE_INSTRUMENT,
                  instrumentType: type,
                });
              }}
              value={currentTrack.instrumentType}
            >
              {constants.instruments.map((instrument, i) => {
                const id = `${instrument.id}-${i}`;

                return (
                  <option
                    key={id}
                    // data-id={id}
                    data-type={instrument.id}
                    value={instrument.id}
                  >
                    {instrument.name}
                  </option>
                );
              })}
            </select>
          </p>
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
          {<h4>Effects</h4>}
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (selectedEffect) {
                dispatch({
                  type: types.ADD_EFFECT,
                  effectId: selectedEffect.id,
                  effectType: selectedEffect.type,
                });

                setSelectedEffect(null);
              }
            }}
          >
            <select
              onChange={(event) => {
                const selectedOption = event.target[event.target.selectedIndex];
                const id = selectedOption.getAttribute('data-id');
                const type = selectedOption.getAttribute('data-type');

                setSelectedEffect({ id, type });
              }}
            >
              <option>None</option>
              {constants.effects.map((effect, i) => {
                const id = `${effect.id}-${i}`;

                return (
                  <option
                    key={id}
                    data-id={id}
                    data-type={effect.id}
                    selected={selectedEffect && id === selectedEffect.id}
                  >
                    {effect.name}
                  </option>
                );
              })}
            </select>{' '}
            <button type="submit">Add Effect</button>
          </form>
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
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* AUDIO */}
      {/* ----------------------------------------------------------------- */}

      <Song
        isPlaying={isPlaying}
        tempo={tempo}
        swing={1}
        swingSubdivision={'8n'}
      >
        {tracks.map((track) => {
          return (
            <Track
              steps={track.steps}
              volume={(parseInt(track.volume, 10) / 100) * 32 - 32}
              pan={(parseInt(track.pan, 10) / 100) * 2 - 1}
              subdivision={'16n'}
              effects={track.effects.map((effect, i) => {
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
              key={track.id}
            >
              {track.instrumentType === 'sampler' ? (
                <Instrument
                  type={track.instrumentType}
                  samples={{
                    C3: `${process.env.PUBLIC_URL}/audio/drums/kick15.wav`,
                    D3: `${
                      process.env.PUBLIC_URL
                    }/audio/drums/snare-bottom-buttend15.wav`,
                    E3: `${process.env.PUBLIC_URL}/audio/drums/chh12.wav`,
                  }}
                  notes={track.notes}
                />
              ) : (
                <Instrument type={track.instrumentType} notes={track.notes} />
              )}
            </Track>
          );
        })}
      </Song>
    </div>
  );
};

export default StepsEditorExample;

function reducer(state, action) {
  switch (action.type) {
    // ------------------------------------------------------------------------
    // TRANSPORT
    // ------------------------------------------------------------------------

    case types.TOGGLE_PLAYING:
      return { ...state, isPlaying: !state.isPlaying };

    case types.INCREASE_TEMPO:
      return { ...state, tempo: state.tempo + 1 };

    case types.DECREASE_TEMPO:
      return { ...state, tempo: state.tempo - 1 };

    // ------------------------------------------------------------------------
    // STEPS / NOTES
    // ------------------------------------------------------------------------

    case types.SET_CURRENT_STEP_INDEX:
      return { ...state, currentStepIndex: action.currentStepIndex };

    case types.UPDATE_CURRENT_STEPS:
      const { steps } = action;

      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              steps,
            };
          }

          return track;
        }),
        // tracks: {
        //   ...state.tracks,
        //   [state.currentTrackId]: {
        //     ...state.tracks[state.currentTrackId],
        //     steps,
        //   },
        // },
      };

    case types.SET_NOTES:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              notes: action.notes,
            };
          }

          return track;
        }),
      };

    // ------------------------------------------------------------------------
    // TRACKS
    // ------------------------------------------------------------------------

    case types.SET_CURRENT_TRACK_ID:
      return {
        ...state,
        currentTrackId: action.trackId,
      };

    case types.ADD_TRACK: {
      return {
        ...state,
        tracks: [
          ...state.tracks,
          {
            id: 'newTrack',
            instrumentType: 'polySynth',
            volume: 100,
            pan: 50,
            steps: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            // steps: buildSteps(melodyClip),
            notes: [],
            effects: [],
          },
        ],
      };
    }

    case types.REMOVE_TRACK: {
      const tracks = state.tracks.filter(
        (track) => track.id !== action.trackId,
      );

      return {
        ...state,
        tracks,
        // Current track may be removed, so we reset the current track
        currentTrackId: tracks.length > 0 ? tracks[0].id : null,
      };
    }

    case types.UPDATE_INSTRUMENT:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              instrumentType: action.instrumentType,
            };
          }

          return track;
        }),
      };

    case types.SET_VOLUME:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              volume: action.volume,
            };
          }

          return track;
        }),
      };

    case types.SET_PAN:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              pan: action.pan,
            };
          }

          return track;
        }),
      };

    // ------------------------------------------------------------------------
    // EFFECTS
    // ------------------------------------------------------------------------

    case types.ADD_EFFECT:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              effects: [
                ...track.effects,
                {
                  id: action.effectId,
                  type: action.effectType,
                },
              ],
            };
          }

          return track;
        }),
      };

    case types.REMOVE_EFFECT:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === state.currentTrackId) {
            return {
              ...track,
              effects: track.effects.filter(
                (effect) => effect.id !== action.id,
              ),
            };
          }

          return track;
        }),
      };

    default:
      throw new Error();
  }
}
