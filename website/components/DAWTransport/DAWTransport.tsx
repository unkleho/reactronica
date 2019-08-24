import React from 'react';

import * as types from '../../types';

import css from './DAWTransport.css';

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
          <ion-icon name={isPlaying ? 'square' : 'play'} />
        </button>
      </div>

      <div className={css.tempo}>
        <label>{tempo} bpm</label>
        <button onClick={() => dispatch({ type: types.INCREASE_TEMPO })}>
          <ion-icon name="add" />
        </button>
        <button onClick={() => dispatch({ type: types.DECREASE_TEMPO })}>
          <ion-icon name="remove" />
        </button>
      </div>
    </div>
  );
};

export default Transport;
