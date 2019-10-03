import React from 'react';

import Icon from '../Icon';

import * as types from '../../types';

import css from './DAWTransport.scss';

type Props = {
  isPlaying?: boolean;
  tempo?: number;
  dispatch?: Function;
  className?: string;
};

const Transport: React.FC<Props> = ({
  isPlaying,
  tempo,
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

      <div className={css.tempo}>
        <label>{tempo} bpm</label>
        <button onClick={() => dispatch({ type: types.INCREASE_TEMPO })}>
          <Icon name="add"></Icon>
        </button>
        <button onClick={() => dispatch({ type: types.DECREASE_TEMPO })}>
          <Icon name="remove"></Icon>
        </button>
      </div>
    </div>
  );
};

export default Transport;
