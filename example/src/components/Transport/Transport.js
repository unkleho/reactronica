import React from 'react';

import css from './Transport.module.css';

const Transport = ({ isPlaying, tempo, dispatch }) => {
  return (
    <div className={css.transport}>
      <div className={css.play}>
        <button onClick={() => dispatch({ type: 'TOGGLE_PLAYING' })}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>

      <div className={css.tempo}>
        <label>Tempo: {tempo}</label>
        <button onClick={() => dispatch({ type: 'INCREMENT_TEMPO' })}>+</button>
        <button onClick={() => dispatch({ type: 'DECREMENT_TEMPO' })}>-</button>
      </div>
    </div>
  );
};

export default Transport;
