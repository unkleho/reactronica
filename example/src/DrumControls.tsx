import React from 'react';
import { EffectType, EffectProps, EffectConfig } from 'reactronica';

import {
  effectTypes,
  DEFAULT_EFFECT_PROP_VALUES,
  renderEffectParamsPanel,
} from './effectControls';

interface DrumControlsProps {
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

function DrumControls({
  volume,
  onVolumeChange,
  pan,
  onPanChange,
  effectType,
  onEffectTypeChange,
  effectPropValues,
  onEffectPropChange,
  effectConfig,
}: DrumControlsProps) {
  return (
    <>
      <label className="flex items-center gap-2 shrink-0">
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
      <label className="flex items-center gap-2 shrink-0">
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

export default DrumControls;
