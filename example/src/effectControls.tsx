import React from 'react';
import { EffectProps, EffectConfig, EffectType } from 'reactronica';

type RangeControl = {
  type: 'range';
  label: string;
  min: number;
  max: number;
  step: number;
};

type SelectControl = {
  type: 'select';
  label: string;
  options: string[];
};

// Shared by both the step subdivision and swing subdivision dropdowns (in
// App.tsx), and the delayTime option below.
export const subdivisions = ['4n', '8n', '16n', '8t', '16t'];

export const effectTypes: EffectType[] = [
  'autoFilter',
  'autoPanner',
  'autoWah',
  'bitCrusher',
  'distortion',
  'feedbackDelay',
  'freeverb',
  'panVol',
  'tremolo',
  'eq3',
];

/**
 * How to render each <Effect /> prop that config.effectConfigs lists as
 * applicable to a given effect type - every EffectConfigProp maps to a
 * single numeric or enum value, unlike <Instrument />'s 'envelope' and
 * 'oscillatorType', which are nested/dynamic and rendered inline in
 * SynthControls instead of through this generic map.
 */
const EFFECT_PROP_CONTROLS: Record<string, RangeControl | SelectControl> = {
  wet: { type: 'range', label: 'Wet', min: 0, max: 1, step: 0.01 },
  frequency: {
    type: 'range',
    label: 'Frequency (Hz)',
    min: 0.1,
    max: 20,
    step: 0.1,
  },
  depth: { type: 'range', label: 'Depth', min: 0, max: 1, step: 0.01 },
  lfoType: {
    type: 'select',
    label: 'LFO type',
    options: ['sine', 'square', 'triangle', 'sawtooth'],
  },
  baseFrequency: {
    type: 'range',
    label: 'Base frequency (Hz)',
    min: 20,
    max: 2000,
    step: 10,
  },
  octaves: { type: 'range', label: 'Octaves', min: 0.5, max: 8, step: 0.5 },
  sensitivity: {
    type: 'range',
    label: 'Sensitivity (dB)',
    min: -40,
    max: 0,
    step: 1,
  },
  Q: { type: 'range', label: 'Q', min: 0.1, max: 20, step: 0.1 },
  bits: { type: 'range', label: 'Bits', min: 1, max: 16, step: 1 },
  distortion: {
    type: 'range',
    label: 'Distortion',
    min: 0,
    max: 1,
    step: 0.01,
  },
  feedback: { type: 'range', label: 'Feedback', min: 0, max: 1, step: 0.01 },
  delayTime: { type: 'select', label: 'Delay time', options: subdivisions },
  roomSize: { type: 'range', label: 'Room size', min: 0, max: 1, step: 0.01 },
  dampening: {
    type: 'range',
    label: 'Dampening (Hz)',
    min: 100,
    max: 8000,
    step: 100,
  },
  spread: { type: 'range', label: 'Spread (deg)', min: 0, max: 180, step: 1 },
  pan: { type: 'range', label: 'Pan', min: -1, max: 1, step: 0.01 },
  volume: { type: 'range', label: 'Volume (dB)', min: -40, max: 6, step: 1 },
  low: { type: 'range', label: 'Low (dB)', min: -24, max: 24, step: 1 },
  mid: { type: 'range', label: 'Mid (dB)', min: -24, max: 24, step: 1 },
  high: { type: 'range', label: 'High (dB)', min: -24, max: 24, step: 1 },
  lowFrequency: {
    type: 'range',
    label: 'Low frequency (Hz)',
    min: 20,
    max: 2000,
    step: 10,
  },
  highFrequency: {
    type: 'range',
    label: 'High frequency (Hz)',
    min: 1000,
    max: 10000,
    step: 100,
  },
};

export const DEFAULT_EFFECT_PROP_VALUES: Omit<EffectProps, 'type' | 'id'> = {
  wet: 1,
  frequency: 1,
  depth: 1,
  lfoType: 'sine',
  baseFrequency: 200,
  octaves: 3,
  sensitivity: 0,
  Q: 2,
  bits: 4,
  distortion: 0.5,
  feedback: 0.5,
  delayTime: '8n',
  roomSize: 0.7,
  dampening: 3000,
  spread: 180,
  pan: 0,
  volume: 0,
  low: 0,
  mid: 0,
  high: 0,
  lowFrequency: 400,
  highFrequency: 2500,
};

export function renderEffectPropControl(
  propName: string,
  values: typeof DEFAULT_EFFECT_PROP_VALUES,
  onChange: <Key extends keyof EffectProps>(
    key: Key,
    value: EffectProps[Key],
  ) => void,
) {
  const propControl = EFFECT_PROP_CONTROLS[propName];

  if (!propControl) {
    return null;
  }

  const value = values[propName as keyof typeof values];

  return (
    <label key={propName} className="flex flex-col gap-1 shrink-0">
      {propControl.label}
      {propControl.type === 'select' ? (
        <select
          value={value as string}
          onChange={(event) =>
            onChange(propName as keyof EffectProps, event.target.value as never)
          }
        >
          {propControl.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="range"
          min={propControl.min}
          max={propControl.max}
          step={propControl.step}
          value={value as number}
          onChange={(event) =>
            onChange(
              propName as keyof EffectProps,
              Number(event.target.value) as never,
            )
          }
        />
      )}
    </label>
  );
}

export function renderEffectParamsPanel(
  effectConfigForType: EffectConfig | undefined,
  values: typeof DEFAULT_EFFECT_PROP_VALUES,
  onChange: <Key extends keyof EffectProps>(
    key: Key,
    value: EffectProps[Key],
  ) => void,
) {
  if (!effectConfigForType) {
    return null;
  }

  return (
    <>
      <span className="shrink-0 self-center text-sm font-bold uppercase tracking-wide text-white/60">
        {effectConfigForType.name}
      </span>
      {effectConfigForType.props.map((propName: string) =>
        renderEffectPropControl(propName, values, onChange),
      )}
    </>
  );
}
