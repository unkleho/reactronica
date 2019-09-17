import * as React from 'react';

import * as types from '../../types';
import { Step } from '../../types/typescript';

import css from './DAWClip.scss';

type Props = {
  id: string;
  steps: Step[];
  bars: number;
  trackId: string;
  isSelected?: boolean;
  className?: string;
  dispatch: Function;
};

const DAWClip: React.FunctionComponent<Props> = ({
  id,
  steps,
  trackId,
  isSelected = false,
  className,
  dispatch,
}) => {
  // console.log(steps);
  return (
    <div
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
      {[
        'C3',
        'C#3',
        'D3',
        'D#3',
        'E3',
        'F3',
        'F#3',
        'G3',
        'G#3',
        'A3',
        'A#3',
        'B3',
      ].map((note, rowIndex) => {
        const isAccidental = note.includes('#');

        return (
          <div
            className={[css.row, isAccidental ? css.rowIsAccidental : ''].join(
              ' ',
            )}
            key={note}
          >
            {[...new Array(steps.length)].map((_, index) => {
              const isCurrent =
                steps[index] &&
                steps[index].findIndex((step) => {
                  return step.note === note;
                }) >= 0;

              return (
                <div
                  className={[
                    css.step,
                    isCurrent ? css.stepIsCurrent : '',
                  ].join(' ')}
                  key={index}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  // return <div className={[css.dawClip, className || ''].join(' ')}></div>;
};

export default DAWClip;
