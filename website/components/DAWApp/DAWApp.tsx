import React from 'react';
import { Song, Track, Instrument, Effect } from 'reactronica';
import Link from 'next/link';

import App from '../App';
import ReactronicaLogo from '../ReactronicaLogo';
import StepsEditor from '../DAWStepsEditor';
import Transport from '../DAWTransport';
import DAWSequencer from '../DAWSequencer';
import TrackInfo from '../DAWTrackInfo';

import * as types from '../../types';
import {
  melodyClip1,
  melodyClip2,
  beatClip1,
  beatClip2,
  vocalClip1,
  vocalClip2,
} from '../../data/daw2';
import { buildSteps, convertStepsToNotes } from '../../lib/stepUtils';
import { useKeyPress } from '../../lib/hooks';

import css from './DAWApp.scss';

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
      steps: [...buildSteps(melodyClip1), ...buildSteps(melodyClip2)],
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
      steps: [...buildSteps(beatClip1), ...buildSteps(beatClip2)],
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
      steps: [...buildSteps(vocalClip1), ...buildSteps(vocalClip2)],
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
    currentStepIndex,
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
        defaultSteps={currentSteps}
        currentStepIndex={currentStepIndex}
        stepIndexOffset={stepIndexOffset}
        // notes={notes}
        subdivision={16}
        className={css.stepsEditor}
        onStepEditorClick={(steps) => {
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

      <Song
        isPlaying={isPlaying}
        bpm={bpm}
        // swing={1}
        // swingSubdivision={'16n'}
      >
        {tracks.map((track, trackIndex) => {
          const trackClips = track.clips.map((trackClip) => {
            return clips.find((clip) => {
              return clip.id === trackClip.id;
            });
          });

          const trackSteps = trackClips.reduce((prev, curr) => {
            return [...prev, ...buildSteps(curr)];
          }, []);

          return (
            <Track
              steps={trackSteps}
              volume={(parseInt(track.volume, 10) / 100) * 32 - 32}
              pan={(parseInt(track.pan, 10) / 100) * 2 - 1}
              mute={track.mute}
              solo={track.solo}
              subdivision={'16n'}
              effects={track.effects.map((effect, i) => {
                return (
                  <Effect
                    type={effect.type}
                    key={`${effect.id}-${i}-melody`}
                    id={`${effect.id}-${i}-melody`}
                    delayTime={effect.delayTime || '16n'}
                    feedback={effect.feedback || 0.6}
                    wet={0.5}
                  />
                );
              })}
              onStepPlay={(_, index) => {
                // Improve performance by only dispatching callback for one track
                if (trackIndex === 0) {
                  dispatch({
                    type: types.SET_CURRENT_STEP_INDEX,
                    currentStepIndex: index,
                  });
                }
              }}
              key={track.id}
            >
              {track.instrumentType === 'sampler' ? (
                <Instrument
                  type={track.instrumentType}
                  samples={{
                    // C3: `/audio/drums/kick15.wav`,
                    A2: `/audio/drums/TLYKST_808_nice_A.wav`,
                    // C3: `/audio/drums/st2_kick_one_shot_low_punch_basic.wav`,
                    C3: `/audio/drums/019_Kick_A_-_MELODICDEEPHOUSE_Zenhiser.wav`,
                    // D3: `/audio/drums/snare-bottom-buttend15.wav`,
                    // D3: `/audio/drums/snare-top-off25.wav`,
                    // D3: `/audio/drums/OS_TD_Trappa_Snare.wav`,
                    D3: '/audio/drums/SOUTHSIDE_snare_og_punch.wav',
                    // D3:
                    //   '/audio/drums/ABJP_Trap_Snare_18_nice_roll_snare.wav',
                    // E3: `/audio/drums/chh2.wav`,
                    // E3: `/audio/drums/OS_TD_Randy_Hat.wav`,
                    E3: `/audio/drums/NOL_hihat_freeze.wav`,
                    // F3: `/audio/drums/snare-top-off17.wav`,
                    F3: `/audio/drums/ad3_playground_concrete_foot_stomp_02_r01.wav`,
                    G3: `/audio/drums/NOL_hihat_roll_lipstick.wav`,
                    A3: `/audio/vocals/NOL_143_vocal_chop_jacuzzi_Am.wav`,
                    B3: `/audio/vocals/fe3_kit2_futuro_intro_vocal_fx_loop_150_Am_1bar.wav`,
                    C4: `/audio/vocals/fe3_kit2_futuro_intro_vocal_fx_loop_150_Am_end.wav`,
                  }}
                  notes={track.notes}
                />
              ) : (
                <Instrument
                  type={track.instrumentType}
                  notes={track.notes}
                  polyphony={track.instrumentPolyphony}
                  oscillator={{ type: track.instrumentOscillatorType }}
                />
              )}
            </Track>
          );
        })}
      </Song>
    </App>
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
    tracks: state.tracks.map((track) => {
      return {
        ...track,
        clips: track.clips.map((trackClip) => {
          const clip = state.clips.find((clip) => clip.id === trackClip.id);

          return {
            ...trackClip,
            name: clip.name,
            notes: clip.notes,
            steps: buildSteps(clip),
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
