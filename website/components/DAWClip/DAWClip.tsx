import * as React from 'react';

import * as types from '../../types';

import css from './DAWClip.css';

type Props = {
  id: string;
  trackId: string;
  isSelected?: boolean;
  className?: string;
  dispatch: Function;
};

const DAWClip: React.FunctionComponent<Props> = ({
  id,
  trackId,
  isSelected = false,
  className,
  dispatch,
}) => {
  return (
    <button
      className={[
        css.dawClip,
        isSelected ? css.clipCurrent : '',
        className || '',
      ].join(' ')}
      onClick={() => {
        dispatch({
          type: types.SET_CURRENT_CLIP_ID,
          clipId: id,
        });

        dispatch({
          type: types.SET_CURRENT_TRACK_ID,
          trackId,
        });
      }}
    >
      {id}
    </button>
  );

  // return <div className={[css.dawClip, className || ''].join(' ')}></div>;
};

export default DAWClip;
