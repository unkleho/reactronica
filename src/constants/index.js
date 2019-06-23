// NOTE: Is constants the best name for this file?

export const effects = [
  { id: 'feedbackDelay', name: 'Feedback delay' },
  { id: 'distortion', name: 'Distortion' },
  { id: 'freeverb', name: 'Freeverb' },
  { id: 'panVol', name: 'Volume/Pan' },
];

export const instruments = [
  { id: 'polySynth', name: 'Poly synth' },
  { id: 'duoSynth', name: 'Duo synth' },
  { id: 'sampler', name: 'Sampler' },
];

const constants = {
  effects,
  instruments,
};

export default constants;
