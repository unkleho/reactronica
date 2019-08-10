import React, { Fragment } from 'react';
import { constants } from 'reactronica';

import * as types from '../../types';

import css from './TrackInfo.css';

const TrackInfo = ({ currentTrack, volume, pan, selectedEffect, dispatch }) => {
  return (
    <Fragment>
      <h4>Track</h4>

      {currentTrack && (
        <div className="app__track">
          <p>
            Instrument:{' '}
            <select
              onChange={(event) => {
                const selectedOption = event.target[event.target.selectedIndex];
                const type = selectedOption.getAttribute('data-type');

                dispatch({
                  type: types.UPDATE_INSTRUMENT,
                  instrumentType: type,
                });
              }}
              value={currentTrack.instrumentType}
            >
              {constants.instruments.map((instrument, i) => {
                const id = `${instrument.id}-${i}`;

                return (
                  <option
                    key={id}
                    // data-id={id}
                    data-type={instrument.id}
                    value={instrument.id}
                  >
                    {instrument.name}
                  </option>
                );
              })}
            </select>
          </p>
          <div>
            <label htmlFor="volume">Volume</label>
            <br />
            <input
              id="volume"
              type="range"
              value={currentTrack.volume}
              onChange={(event) =>
                dispatch({ type: types.SET_VOLUME, volume: event.target.value })
              }
            />
            {volume}
          </div>
          <br />
          <div>
            <label htmlFor="pan">Pan</label>
            <br />
            <input
              id="pan"
              type="range"
              value={currentTrack.pan}
              onChange={(event) =>
                dispatch({ type: types.SET_PAN, pan: event.target.value })
              }
            />
            {pan}
          </div>
          {<h4>Effects</h4>}
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (selectedEffect) {
                dispatch({
                  type: types.ADD_EFFECT,
                  effectId: selectedEffect.id,
                  effectType: selectedEffect.type,
                });

                setSelectedEffect(null);
              }
            }}
          >
            <select
              onChange={(event) => {
                const selectedOption = event.target[event.target.selectedIndex];
                const id = selectedOption.getAttribute('data-id');
                const type = selectedOption.getAttribute('data-type');

                setSelectedEffect({ id, type });
              }}
            >
              <option>None</option>
              {constants.effects.map((effect, i) => {
                const id = `${effect.id}-${i}`;

                return (
                  <option
                    key={id}
                    data-id={id}
                    data-type={effect.id}
                    selected={selectedEffect && id === selectedEffect.id}
                  >
                    {effect.name}
                  </option>
                );
              })}
            </select>{' '}
            <button type="submit">Add Effect</button>
          </form>
          {currentTrack.effects.map((effect) => {
            return (
              <div className={css.trackEffect} key={effect.id}>
                <p>
                  {effect.type}{' '}
                  <button
                    onClick={() =>
                      dispatch({ type: types.REMOVE_EFFECT, id: effect.id })
                    }
                  >
                    Remove
                  </button>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default TrackInfo;
