import React from 'react';

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
          <i className={`icon ion-md-${isPlaying ? 'square' : 'play'}`}></i>

          {/* <ion-icon name={isPlaying ? 'square' : 'play'} /> */}
        </button>
      </div>

      <div className={css.tempo}>
        <label>{tempo} bpm</label>
        <button onClick={() => dispatch({ type: types.INCREASE_TEMPO })}>
          {/* <ion-icon name="add" /> */}
          <i className="icon ion-md-add"></i>
        </button>
        <button onClick={() => dispatch({ type: types.DECREASE_TEMPO })}>
          <i className="icon ion-md-remove"></i>
          {/* <ion-icon name="remove" /> */}
        </button>
      </div>
    </div>
  );
};

export default Transport;
