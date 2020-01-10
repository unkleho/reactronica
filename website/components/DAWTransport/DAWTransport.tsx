import React from 'react';

import Icon from '../Icon';

import * as types from '../../types';

import css from './DAWTransport.scss';

type Props = {
  isPlaying?: boolean;
  bpm?: number;
  dispatch?: Function;
  className?: string;
};

const Transport: React.FC<Props> = ({
  isPlaying,
  bpm,
  dispatch,
  className,
}) => {
  return (
    <div className={[css.transport, className || ''].join(' ')}>
      <div className={css.play}>
        <button onClick={() => dispatch({ type: types.TOGGLE_PLAYING })}>
          <Icon name={isPlaying ? 'square' : 'play'}></Icon>
        </button>
      </div>

      <div className={css.bpm}>
        <label>{bpm} bpm</label>
        <button onClick={() => dispatch({ type: types.INCREASE_BPM })}>
          <Icon name="add"></Icon>
        </button>
        <button onClick={() => dispatch({ type: types.DECREASE_BPM })}>
          <Icon name="remove"></Icon>
        </button>
      </div>
    </div>
  );
};

export default Transport;
