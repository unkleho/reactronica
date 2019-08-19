import React from 'react';

import DAWBeatTimeRuler from '../DAWBeatTimeRuler';
import DAWClip from '../DAWClip';

import * as types from '../../types';
import DAWPlayhead from '../DAWPlayhead';

const css = require('./DAWSequencer.css');

type Props = {
  isPlaying: Boolean;
  tempo?: number;
  tracks: Track[];
  currentClipId: string;
  currentTrackId: string;
  dispatch: Function;
  className?: string;
};

type Track = {
  id: string;
  clips: any[];
};

const Sequencer: React.FC<Props> = ({
  isPlaying,
  tempo,
  tracks = [],
  currentClipId,
  currentTrackId,
  dispatch,
  className,
}) => {
  return (
    <div className={[css.dawSequencer, className || ''].join(' ')}>
      <DAWBeatTimeRuler />

      <DAWPlayhead isPlaying={isPlaying} tempo={tempo} />

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
                <ion-icon name="trash" />
              </button>
            </div>

            <div className={css.trackClips}>
              {track.clips.map((clip) => {
                return (
                  <DAWClip
                    id={clip.id}
                    trackId={track.id}
                    isSelected={clip.id === currentClipId}
                    dispatch={dispatch}
                  />
                );
              })}
            </div>
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
