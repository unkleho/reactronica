import React from 'react';

import * as types from '../../types';

import css from './DAWTransport.css';

const Transport = ({ isPlaying, tempo, dispatch }) => {
  return (
    <div className={css.transport}>
      <div className={css.play}>
        <button onClick={() => dispatch({ type: types.TOGGLE_PLAYING })}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>

      <div className={css.tempo}>
        <label>Tempo: {tempo}</label>
        <button onClick={() => dispatch({ type: types.INCREASE_TEMPO })}>
          +
        </button>
        <button onClick={() => dispatch({ type: types.DECREASE_TEMPO })}>
          -
        </button>
      </div>
    </div>
  );
};

export default Transport;
