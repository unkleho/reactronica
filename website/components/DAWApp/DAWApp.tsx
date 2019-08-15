import React from 'react';
import { Song, Track, Instrument, Effect } from 'reactronica';

import StepsEditor from '../DAWStepsEditor';
import Transport from '../DAWTransport';
import Sequencer from '../DAWSequencer';
import TrackInfo from '../DAWTrackInfo';

import * as types from '../../types';
import {
  melodyClip1,
  melodyClip2,
  beatClip1,
  beatClip2,
} from '../../sample-data';
import { buildSteps, buildClip } from '../../lib/stepUtils';

import css from './DAWApp.css';

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
  // CLIPS
  // --------------------------------------------------------------------------
  currentClipId: 'melody1',
  clips: [melodyClip1, melodyClip2, beatClip1, beatClip2],
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
      steps: [...buildSteps(melodyClip1), ...buildSteps(melodyClip2)],
      clips: [{ id: 'melody1' }, { id: 'melody2' }],
      notes: [],
      effects: [],
    },
    {
      id: 'beat',
      instrumentType: 'sampler',
      volume: 100,
      pan: 50,
      steps: [...buildSteps(beatClip1), ...buildSteps(beatClip2)],
      clips: [{ id: 'beat1' }, { id: 'beat2' }],
      notes: [],
      effects: [],
    },
  ],
};

const DAWApp = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    isPlaying,
    tempo,
    currentClipId,
    clips,
    currentTrackId,
    currentTrack,
    currentStepIndex,
    stepIndexOffset,
    currentSteps,
    tracks,
    volume,
    pan,
    notes,
  } = appSelector(state);

  const [selectedEffect, setSelectedEffect] = React.useState(null);
  React.useEffect(() => {
    setSelectedEffect(null);
  }, [currentTrackId]);

  return (
    <div className={css.dawApp}>
      <header>
        <h1>
          <span>Reactronica</span> <span>DAW Demo</span>
        </h1>

        <Transport
          isPlaying={isPlaying}
          tempo={tempo}
          dispatch={dispatch}
          className={css.transport}
        />
      </header>

      <div className={css.trackSequencer}>
        <TrackInfo
          currentTrack={currentTrack}
          volume={volume}
          pan={pan}
          selectedEffect={selectedEffect}
          dispatch={dispatch}
        />

        <Sequencer
          tracks={tracks}
          currentTrackId={currentTrackId}
          currentClipId={currentClipId}
          dispatch={dispatch}
        />
      </div>

      <StepsEditor
        defaultSteps={currentSteps}
        currentStepIndex={currentStepIndex}
        stepIndexOffset={stepIndexOffset}
        notes={notes}
        subdivision={16}
        onStepEditorClick={(steps) => {
          // WIP
          // Convert steps to clip
          const clip = buildClip(steps, currentClipId);

          dispatch({ type: types.UPDATE_CLIP, clip });
          // This should update currentSteps and track[].clips
          // dispatch({ type: types.UPDATE_CURRENT_STEPS, steps });
        }}
        onKeyboardDown={(note) =>
          dispatch({ type: types.SET_NOTES, notes: [{ name: note }] })
        }
        onKeyboardUp={() => dispatch({ type: types.SET_NOTES, notes: [] })}
      />

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
          const trackClips = track.clips.map((trackClip) => {
            return clips.find((clip) => {
              return clip.id === trackClip.id;
            });
          });

          const trackSteps = trackClips.reduce((prev, curr) => {
            return [...prev, ...buildSteps(curr)];
          }, []);

          // console.log(trackSteps);

          return (
            <Track
              steps={trackSteps}
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
                    C3: `/static/audio/drums/kick15.wav`,
                    D3: `/static/audio/drums/snare-bottom-buttend15.wav`,
                    E3: `/static/audio/drums/chh12.wav`,
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

export default DAWApp;

function appSelector(state) {
  // --------------------------------------------------------------------------
  // Current Track
  // --------------------------------------------------------------------------
  const currentTrack = state.tracks.find(
    (track) => track.id === state.currentTrackId,
  );

  // --------------------------------------------------------------------------
  // Step Index Offset
  // --------------------------------------------------------------------------
  const currentTrackIndex = currentTrack.clips.findIndex((clip) => {
    return clip.id === state.currentClipId;
  });

  const clipsBeforeCurrentClip = currentTrack.clips.filter((clip, i) => {
    if (i < currentTrackIndex) {
      return clip;
    }

    return null;
  });

  const stepIndexOffset = clipsBeforeCurrentClip.reduce((prev, curr) => {
    const bars = state.clips.find((clip) => clip.id === curr.id).bars;

    return bars * 16 + prev;
  }, 0);

  // --------------------------------------------------------------------------
  // Current Clip
  // --------------------------------------------------------------------------
  const currentClip = state.clips.find((clip) => {
    return clip.id === state.currentClipId;
  });

  // --------------------------------------------------------------------------
  // Current Steps
  // --------------------------------------------------------------------------
  const currentSteps = buildSteps(currentClip);

  return {
    ...state,
    currentTrack,
    stepIndexOffset,
    currentClip,
    currentSteps,
  };
}

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
    // CLIPS
    // ------------------------------------------------------------------------

    case types.SET_CURRENT_CLIP_ID:
      return {
        ...state,
        currentClipId: action.clipId,
      };

    case types.UPDATE_CLIP:
      return {
        ...state,
        clips: state.clips.map((clip) => {
          if (clip.id === action.clip.id) {
            return action.clip;
          }

          return clip;
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
