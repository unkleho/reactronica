import React from 'react';
import { config } from 'reactronica';

import Select from '../Select';

import * as types from '../../types';

import css from './DAWTrackInfo.scss';

type Props = {
  currentTrack?: {
    id: string;
    instrumentType: string;
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
  // React.useEffect(() => {
  //   setSelectedEffect(null);
  // }, [currentTrackId]);

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
      {/* <select
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
        {config.instruments.map((instrument) => {
          return (
            <option
              key={instrument.id}
              data-type={instrument.id}
              value={instrument.id}
            >
              {instrument.name}
            </option>
          );
        })}
      </select> */}

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
          <ion-icon name="add" />
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
