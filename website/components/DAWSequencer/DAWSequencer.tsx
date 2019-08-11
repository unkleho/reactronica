import React from 'react';

import * as types from '../../types';

const css = require('./DAWSequencer.css');

const Sequencer = ({ tracks, currentClipId, currentTrackId, dispatch }) => {
  return (
    <div className={css.dawSequencer}>
      {tracks.map((track) => {
        return (
          <div className={css.track} key={track.id}>
            <button
              className={[
                css.stepsChooserButton,
                track.id === currentTrackId ? css.stepsChooserButtonActive : '',
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

            {track.clips.map((clip) => {
              return (
                <button
                  className={[
                    css.clip,
                    clip.id === currentClipId ? css.clipCurrent : '',
                  ].join(' ')}
                  key={clip.id}
                  onClick={() => {
                    dispatch({
                      type: types.SET_CURRENT_CLIP_ID,
                      clipId: clip.id,
                    });

                    dispatch({
                      type: types.SET_CURRENT_TRACK_ID,
                      trackId: track.id,
                    });
                  }}
                >
                  {clip.id}
                </button>
              );
            })}
          </div>
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
  );
};

export default Sequencer;
