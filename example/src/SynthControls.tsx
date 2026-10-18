import React from 'react';
import {
  EffectType,
  EffectProps,
  EffectConfig,
  InstrumentType,
  InstrumentProps,
  InstrumentConfig,
} from 'reactronica';

import {
  effectTypes,
  DEFAULT_EFFECT_PROP_VALUES,
  renderEffectParamsPanel,
} from './effectControls';
import { DEFAULT_INSTRUMENT_PROP_VALUES } from './instrumentDefaults';

// Excludes 'sampler' - that type belongs to the dedicated drum sampler Track.
const synthTypes: InstrumentType[] = [
  'amSynth',
  'duoSynth',
  'fmSynth',
  'membraneSynth',
  'metalSynth',
  'monoSynth',
  'noiseSynth',
  'pluckSynth',
  'synth',
];

interface SynthControlsProps {
  synthType: InstrumentType;
  onSynthTypeChange: (value: InstrumentType) => void;
  instrumentConfig: InstrumentConfig | undefined;
  instrumentPropValues: typeof DEFAULT_INSTRUMENT_PROP_VALUES;
  onInstrumentPropValuesChange: React.Dispatch<
    React.SetStateAction<typeof DEFAULT_INSTRUMENT_PROP_VALUES>
  >;
  volume: number;
  onVolumeChange: (value: number) => void;
  pan: number;
  onPanChange: (value: number) => void;
  effectType: EffectType | '';
  onEffectTypeChange: (value: EffectType | '') => void;
  effectPropValues: typeof DEFAULT_EFFECT_PROP_VALUES;
  onEffectPropChange: <Key extends keyof EffectProps>(
    key: Key,
    value: EffectProps[Key],
  ) => void;
  effectConfig: EffectConfig | undefined;
}

function SynthControls({
  synthType,
  onSynthTypeChange,
  instrumentConfig,
  instrumentPropValues,
  onInstrumentPropValuesChange,
  volume,
  onVolumeChange,
  pan,
  onPanChange,
  effectType,
  onEffectTypeChange,
  effectPropValues,
  onEffectPropChange,
  effectConfig,
}: SynthControlsProps) {
  return (
    <>
      <div className="grid grid-rows-2 gap-2 shrink-0">
        <label className="flex items-center gap-2">
          Synth type
          <select
            value={synthType}
            onChange={(event) =>
              onSynthTypeChange(event.target.value as InstrumentType)
            }
          >
            {synthTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {instrumentConfig?.props.includes('oscillatorType') && (
          <label className="flex items-center gap-2">
            Oscillator type
            <select
              value={instrumentPropValues.oscillator?.type || ''}
              onChange={(event) =>
                onInstrumentPropValuesChange((prev) => ({
                  ...prev,
                  oscillator: event.target.value
                    ? // Cast needed since InstrumentOscillator is a
                      // discriminated union keyed on `type` with params
                      // specific to each waveform family (e.g. `count`
                      // only applies to fat* types) - not expressible
                      // from a single flat <select>.
                      ({
                        type: event.target.value,
                      } as InstrumentProps['oscillator'])
                    : undefined,
                }))
              }
            >
              <option value="">(instrument default)</option>
              {instrumentConfig?.oscillatorTypes?.map(
                (oscillatorType: string) => (
                  <option key={oscillatorType} value={oscillatorType}>
                    {oscillatorType}
                  </option>
                ),
              )}
            </select>
          </label>
        )}
      </div>

      <div className="grid grid-rows-2 gap-2 shrink-0">
        <label className="flex items-center gap-2">
          Volume
          <input
            type="range"
            min={-40}
            max={6}
            step={1}
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="w-[120px]"
          />
        </label>
        <label className="flex items-center gap-2">
          Pan
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={pan}
            onChange={(event) => onPanChange(Number(event.target.value))}
            className="w-[120px]"
          />
        </label>
      </div>

      {instrumentConfig?.props.includes('polyphony') && (
        <label className="flex items-center gap-2 shrink-0">
          Polyphony
          <input
            type="range"
            min={1}
            max={16}
            step={1}
            value={instrumentPropValues.polyphony}
            onChange={(event) =>
              onInstrumentPropValuesChange((prev) => ({
                ...prev,
                polyphony: Number(event.target.value),
              }))
            }
          />
        </label>
      )}

      {instrumentConfig?.props.includes('envelope') && (
        <>
          <div className="grid grid-rows-2 gap-2 shrink-0">
            <label className="flex items-center gap-2">
              Envelope attack
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={instrumentPropValues.envelope!.attack}
                onChange={(event) =>
                  onInstrumentPropValuesChange((prev) => ({
                    ...prev,
                    envelope: {
                      ...prev.envelope,
                      attack: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
            <label className="flex items-center gap-2">
              Envelope decay
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={instrumentPropValues.envelope!.decay}
                onChange={(event) =>
                  onInstrumentPropValuesChange((prev) => ({
                    ...prev,
                    envelope: {
                      ...prev.envelope,
                      decay: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
          </div>

          <div className="grid grid-rows-2 gap-2 shrink-0">
            <label className="flex items-center gap-2">
              Envelope sustain
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={instrumentPropValues.envelope!.sustain}
                onChange={(event) =>
                  onInstrumentPropValuesChange((prev) => ({
                    ...prev,
                    envelope: {
                      ...prev.envelope,
                      sustain: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
            <label className="flex items-center gap-2">
              Envelope release
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={instrumentPropValues.envelope!.release}
                onChange={(event) =>
                  onInstrumentPropValuesChange((prev) => ({
                    ...prev,
                    envelope: {
                      ...prev.envelope,
                      release: Number(event.target.value),
                    },
                  }))
                }
              />
            </label>
          </div>
        </>
      )}

      <label className="flex items-center gap-2 shrink-0">
        Effect
        <select
          value={effectType}
          onChange={(event) =>
            onEffectTypeChange(event.target.value as EffectType | '')
          }
        >
          <option value="">No effect</option>
          {effectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      {renderEffectParamsPanel(
        effectConfig,
        effectPropValues,
        onEffectPropChange,
      )}
    </>
  );
}

export default SynthControls;
