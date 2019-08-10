import React, { Fragment } from 'react';

import * as types from '../../types';

import css from './Sequencer.css';

const Sequencer = ({ tracks, currentTrackId, dispatch }) => {
  return (
    <div className={css.stepsChooser}>
      {tracks.map((track) => {
        return (
          <Fragment key={track.id}>
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
  );
};

export default Sequencer;
