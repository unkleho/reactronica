import React from 'react';
import { config } from 'reactronica';

import Select from '../Select';
import Icon from '../Icon';

import * as types from '../../types';

import css from './DAWTrackInfo.module.scss';

type Props = {
  currentTrack?: {
    id: string;
    instrumentType: string;
    instrumentPolyphony: number;
    instrumentOscillatorType: 'triangle' | 'sine' | 'square';
    volume: number;
    pan: number;
    effects: any[];
  };
  volume?: number;
  pan?: number;
  // selectedEffect?: {};
  dispatch?: Function;
  className?: string;
};

const TrackInfo: React.FC<Props> = ({
  currentTrack,
  volume,
  pan,
  // selectedEffect,
  dispatch,
  className,
}) => {
  const [selectedEffect, setSelectedEffect] = React.useState(null);

  const instrumentConfig = config.instruments.find((instrument) => {
    return instrument.id === currentTrack.instrumentType;
  });

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={[css.trackInfo, className || ''].join(' ')}>
      <h2>Track</h2>
      <p className={css.name}>{currentTrack.id}</p>

      <h3>Instrument</h3>
      <Select
        value={currentTrack.instrumentType}
        options={config.instruments.map((instrument) => {
          return {
            label: instrument.name,
            value: instrument.id,
          };
        })}
        onChange={(selectedOption) => {
          // const selectedOption = event.target[event.target.selectedIndex];
          // const type = selectedOption.getAttribute('data-type');

          dispatch({
            type: types.UPDATE_INSTRUMENT,
            instrumentType: selectedOption.value,
          });
        }}
      />

      {instrumentConfig &&
        instrumentConfig.props &&
        instrumentConfig.props.includes('oscillatorType') && (
          <>
            <h3>Oscillator Type</h3>
            <Select
              value={currentTrack.instrumentOscillatorType}
              options={[
                { label: 'Triangle', value: 'triangle' },
                { label: 'Sine', value: 'sine' },
                { label: 'Square', value: 'square' },
              ]}
              onChange={(selectedOption) => {
                dispatch({
                  type: types.SET_INSTRUMENT_OSCILLATOR_TYPE,
                  trackId: currentTrack.id,
                  oscillatorType: selectedOption.value,
                });
              }}
            />
          </>
        )}

      {instrumentConfig &&
        instrumentConfig.props &&
        instrumentConfig.props.includes('polyphony') && (
          <>
            <h3>Polyphony</h3>
            <Select
              value={currentTrack.instrumentPolyphony}
              options={[...Array(6)].map((_, i) => {
                return {
                  label: i,
                  value: i,
                };
              })}
              onChange={(selectedOption) => {
                dispatch({
                  type: types.SET_INSTRUMENT_POLYPHONY,
                  trackId: currentTrack.id,
                  instrumentPolyphony: selectedOption.value,
                });
              }}
            />
          </>
        )}

      <h3>
        <label htmlFor="volume">Volume</label>
      </h3>
      <input
        id="volume"
        type="range"
        value={currentTrack.volume}
        onChange={(event) =>
          dispatch({ type: types.SET_VOLUME, volume: event.target.value })
        }
      />
      {volume}

      <h3>
        <label htmlFor="pan">Pan</label>
      </h3>
      <input
        id="pan"
        type="range"
        value={currentTrack.pan}
        onChange={(event) =>
          dispatch({ type: types.SET_PAN, pan: event.target.value })
        }
      />
      {pan}

      <h3>Effects</h3>
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
        <Select
          value={selectedEffect ? selectedEffect.id : null}
          options={[
            {
              label: 'None',
              value: null,
            },
            ...config.effects.map((effect) => {
              return {
                label: effect.name,
                value: effect.id,
              };
            }),
          ]}
          onChange={(selectedOption) => {
            const id = selectedOption.value;
            const type = selectedOption.value;

            setSelectedEffect({ id, type });
          }}
        />
        {/* <select
          onChange={(event) => {
            const selectedOption = event.target[event.target.selectedIndex];
            const id = selectedOption.getAttribute('data-id');
            const type = selectedOption.getAttribute('data-type');

            setSelectedEffect({ id, type });
          }}
        >
          <option>None</option>
          {config.effects.map((effect, i) => {
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
        </select> */}
        <br />
        <button type="submit">
          <Icon name="add"></Icon>
          &nbsp;&nbsp;Add Effect
        </button>
      </form>

      <br />

      {currentTrack.effects.map((effect) => {
        return (
          <div className={css.effect} key={effect.id}>
            <p>{effect.type}</p>
            <button
              onClick={() =>
                dispatch({ type: types.REMOVE_EFFECT, id: effect.id })
              }
            >
              <ion-icon name="remove" />
              &nbsp;&nbsp;Remove
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TrackInfo;
