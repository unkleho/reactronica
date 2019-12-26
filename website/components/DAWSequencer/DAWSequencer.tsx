import React from 'react';

import DAWBeatTimeRuler from '../DAWBeatTimeRuler';
import DAWClip from '../DAWClip';
import Icon from '../Icon';

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
  const [newTrackId, setNewTrackId] = React.useState(1);

  // console.log(tracks);

  return (
    <div className={[css.dawSequencer, className || ''].join(' ')}>
      <div className={css.corner}></div>

      <DAWBeatTimeRuler className={css.ruler} />

      <DAWPlayhead
        isPlaying={isPlaying}
        tempo={tempo}
        className={css.playhead}
      />

      <div className={css.trackSummaries}>
        {tracks.map((track) => {
          const isCurrent = track.id === currentTrackId;

          return (
            <div
              className={[
                css.trackSummary,
                isCurrent ? css.trackSummaryIsCurrent : '',
              ].join(' ')}
              key={track.id}
            >
              <button
                className={[
                  css.stepsChooserButton,
                  isCurrent ? css.stepsChooserButtonIsCurrent : '',
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
                <Icon name="trash"></Icon>
              </button>
            </div>
          );
        })}

        {/* <div className={[css.trackSummary, css.trackSummaryAdd].join(' ')}> */}
        <button
          className={css.addTrackButton}
          onClick={() => {
            dispatch({
              type: types.ADD_TRACK,
              trackId: `New Track ${newTrackId}`,
            });

            setNewTrackId(newTrackId + 1);
          }}
        >
          {/* <ion-icon name="add"></ion-icon> */}
          <i className="icon ion-md-add"></i>
          &nbsp;&nbsp;Add Track
        </button>
        {/* </div> */}
      </div>

      <div className={css.clips}>
        {tracks.map((track) => {
          return (
            <div className={css.trackClips} key={track.id}>
              {track.clips.map((clip) => {
                return (
                  <DAWClip
                    id={clip.id}
                    name={clip.name}
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

        <div className={css.grid}></div>
      </div>
    </div>
  );
};

export default Sequencer;
