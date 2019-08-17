import React from 'react';

import * as types from '../../types';

const css = require('./DAWSequencer.css');

type Props = {
  tracks: Track[];
  currentClipId: string;
  currentTrackId: string;
  dispatch: Function;
  className: string;
};

type Track = {
  id: string;
  clips: any[];
};

const Sequencer: React.FC<Props> = ({
  tracks = [],
  currentClipId,
  currentTrackId,
  dispatch,
  className,
}) => {
  return (
    <div className={[css.dawSequencer, className || ''].join(' ')}>
      {tracks.map((track) => {
        return (
          <div className={css.track} key={track.id}>
            <div className={css.trackSummary}>
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
            </div>

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

      <div className={css.track}>
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
    </div>
  );
};

export default Sequencer;
