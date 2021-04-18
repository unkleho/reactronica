import React from 'react';
import Link from 'next/link';

import App from '../App';
import ReactronicaLogo from '../ReactronicaLogo';
import StepsEditor from '../DAWStepsEditor';
import Transport from '../DAWTransport';
import DAWSequencer from '../DAWSequencer';
import TrackInfo from '../DAWTrackInfo';
import DawAppAudio from '../DAWAppAudio';

import * as types from '../../types';
import {
  melodyClip1,
  melodyClip2,
  beatClip1,
  beatClip2,
  vocalClip1,
  vocalClip2,
} from '../../data/daw2';
import { buildSteps, convertStepsToNotes } from '../../lib/step-utils';
import { useKeyPress } from '../../lib/hooks';
import { StepIndexContext } from '../../lib/contexts/StepIndexContext';

import css from './DAWApp.module.scss';

const initialState = {
  // --------------------------------------------------------------------------
  // TRANSPORT
  // --------------------------------------------------------------------------
  isPlaying: false,
  bpm: 75,
  // --------------------------------------------------------------------------
  // STEPS
  // --------------------------------------------------------------------------
  // Highlighted step that follows the music
  currentStepIndex: null,
  // --------------------------------------------------------------------------
  // CLIPS
  // --------------------------------------------------------------------------
  currentClipId: 'melody1',
  clips: [
    melodyClip1,
    melodyClip2,
    beatClip1,
    beatClip2,
    vocalClip1,
    vocalClip2,
  ],
  // --------------------------------------------------------------------------
  // TRACK
  // --------------------------------------------------------------------------
  currentTrackId: 'melody',
  tracks: [
    {
      id: 'melody',
      // TODO: Convert to instrument object?
      instrumentType: 'amSynth',
      instrumentPolyphony: 4,
      instrumentOscillatorType: 'triangle',
      volume: 70,
      pan: 50,
      mute: false,
      solo: false,
      steps: [
        ...buildSteps(melodyClip1.notes, melodyClip1.bars, 16),
        ...buildSteps(melodyClip2.notes, melodyClip2.bars, 16),
      ],
      clips: [{ id: 'melody1' }, { id: 'melody2' }],
      notes: [],
      effects: [
        {
          type: 'autoWah',
          id: 'autoWah-1',
        },
      ],
    },
    {
      id: 'beat',
      instrumentType: 'sampler',
      volume: 100,
      pan: 50,
      mute: false,
      solo: false,
      steps: [
        ...buildSteps(beatClip1.notes, beatClip1.bars, 16),
        ...buildSteps(beatClip2.notes, beatClip2.bars, 16),
      ],
      clips: [{ id: 'beat1' }, { id: 'beat2' }],
      notes: [],
      effects: [],
    },
    {
      id: 'vocal',
      instrumentType: 'sampler',
      volume: 100,
      pan: 50,
      mute: false,
      solo: false,
      steps: [
        ...buildSteps(vocalClip1.notes, vocalClip1.bars, 16),
        ...buildSteps(vocalClip2.notes, vocalClip2.bars, 16),
      ],
      clips: [{ id: 'vocalClip1' }, { id: 'vocalClip2' }],
      notes: [],
      effects: [],
    },
  ],
};

const DAWApp = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    isPlaying,
    bpm,
    currentClip,
    currentClipId,
    clips,
    currentTrackId,
    currentTrack,
    // currentStepIndex,
    stepIndexOffset,
    currentSteps,
    tracks,
    volume,
    pan,
    // notes,
  } = appSelector(state);

  // console.log(bpm, currentStepIndex);
  // const currentStepIndex = 0;

  useKeyPress(' ', () => {
    dispatch({ type: types.TOGGLE_PLAYING });
  });

  return (
    <App className={css.dawApp}>
      <header className={css.header}>
        <ReactronicaLogo subText="DAW Demo" className={css.logo} />

        <Transport
          isPlaying={isPlaying}
          bpm={bpm}
          dispatch={dispatch}
          className={css.transport}
        />

        <ul className={css.menu}>
          <li>
            <Link href="/">
              <a>Docs</a>
            </Link>
          </li>
          <li>
            <a href="https://twitter.com/unkleho">@unkleho</a>
          </li>
        </ul>
      </header>

      <TrackInfo
        currentTrack={currentTrack}
        volume={volume}
        pan={pan}
        // selectedEffect={selectedEffect}
        dispatch={dispatch}
        className={css.trackInfo}
      />

      <div className={css.trackSequencer}>
        <DAWSequencer
          isPlaying={isPlaying}
          bpm={bpm}
          tracks={tracks}
          currentTrackId={currentTrackId}
          currentClipId={currentClipId}
          dispatch={dispatch}
        />
      </div>

      <StepsEditor
        clipId={currentClip.id}
        clipName={currentClip.name}
        steps={currentSteps}
        stepIndexOffset={stepIndexOffset}
        subdivision={16}
        className={css.stepsEditor}
        onStepEditorChange={(steps) => {
          const notes = convertStepsToNotes(steps);

          dispatch({
            type: types.UPDATE_CLIP,
            clip: {
              ...currentClip,
              notes,
            },
          });

          // This should update currentSteps and track[].clips?
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

      <DawAppAudio
        isPlaying={isPlaying}
        bpm={bpm}
        tracks={tracks}
        clips={clips}
      />
    </App>
  );
};

// Ensure DAWApp doesn't rerender if it doesn't need to
const MemoDAWApp = React.memo(DAWApp);

const DAWAppContainer = () => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState();

  return (
    <StepIndexContext.Provider
      value={{
        currentStepIndex,
        setCurrentStepIndex,
      }}
    >
      <MemoDAWApp />
    </StepIndexContext.Provider>
  );
};

export default DAWAppContainer;

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
  const currentSteps = buildSteps(currentClip.notes, currentClip.bars, 16);

  return {
    ...state,
    tracks: state.tracks.map((track) => {
      return {
        ...track,
        clips: track.clips.map((trackClip) => {
          const clip = state.clips.find((clip) => clip.id === trackClip.id);

          return {
            ...trackClip,
            name: clip.name,
            notes: clip.notes,
            steps: buildSteps(clip.notes, clip.bars, 16),
          };
        }),
      };
    }),
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

    case types.INCREASE_BPM:
      return { ...state, bpm: state.bpm + 1 };

    case types.DECREASE_BPM:
      return { ...state, bpm: state.bpm - 1 };

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
            id: action.trackId,
            instrumentType: 'polySynth',
            volume: 60,
            pan: 50,
            notes: [],
            effects: [],
            clips: [{ id: `${action.trackId}1` }, { id: `${action.trackId}2` }],
          },
        ],
        clips: [
          ...state.clips,
          {
            id: `${action.trackId}1`,
            name: 'New Clip 1',
            bars: 1,
            notes: [],
          },
          {
            id: `${action.trackId}2`,
            name: 'New Clip 2',
            bars: 1,
            notes: [],
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

    case types.SET_INSTRUMENT_POLYPHONY:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === action.trackId) {
            return {
              ...track,
              instrumentPolyphony: action.instrumentPolyphony,
            };
          }

          return track;
        }),
      };

    case types.SET_INSTRUMENT_OSCILLATOR_TYPE:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === action.trackId) {
            return {
              ...track,
              instrumentOscillatorType: action.oscillatorType,
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

    case types.TOGGLE_TRACK_MUTE:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === action.trackId) {
            return {
              ...track,
              mute: !track.mute,
            };
          }

          return track;
        }),
      };

    case types.TOGGLE_TRACK_SOLO:
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id === action.trackId) {
            return {
              ...track,
              solo: !track.solo,
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
