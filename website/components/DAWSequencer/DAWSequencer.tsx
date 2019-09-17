import React from 'react';

import DAWBeatTimeRuler from '../DAWBeatTimeRuler';
import DAWClip from '../DAWClip';

import * as types from '../../types';
import DAWPlayhead from '../DAWPlayhead';

import { Clip } from '../../types/typescript';

const css = require('./DAWSequencer.scss');

type Props = {
  isPlaying: boolean;
  tempo?: number;
  tracks: Track[];
  // clips: Clip[];
  currentClipId: string;
  currentTrackId: string;
  dispatch: Function;
  className?: string;
};

type Track = {
  id: string;
  clips: Clip[];
  // clips: {
  //   id: string;
  // }[];
};

const Sequencer: React.FC<Props> = ({
  isPlaying,
  tempo,
  tracks = [],
  // clips = [],
  currentClipId,
  currentTrackId,
  dispatch,
  className,
}) => {
  return (
    <div className={[css.dawSequencer, className || ''].join(' ')}>
      <div className={css.corner}></div>

      <DAWBeatTimeRuler className={css.ruler} />

      <DAWPlayhead isPlaying={isPlaying} tempo={tempo} />

      <div className={css.trackSummaries}>
        {tracks.map((track) => {
          return (
            // <div className={css.track} key={track.id}>
            <div className={css.trackSummary} key={track.id}>
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
                className={css.removeButton}
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
            // </div>
          );
        })}
      </div>

      <div className={css.clips}>
        {tracks.map((track) => {
          return (
            <div className={css.trackClips} key={track.id}>
              {track.clips.map((clip) => {
                return (
                  <DAWClip
                    id={clip.id}
                    steps={clip.steps}
                    bars={clip.bars}
                    trackId={track.id}
                    isSelected={clip.id === currentClipId}
                    dispatch={dispatch}
                    key={clip.id}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* <div className={css.track}>
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
      </div> */}
    </div>
  );
};

export default Sequencer;
