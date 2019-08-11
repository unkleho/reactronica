import React from 'react';

import * as types from '../../types';

import css from './DAWSequencer.css';

const Sequencer = ({ tracks, currentTrackId, dispatch }) => {
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
