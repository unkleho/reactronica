export const effects = [
  { id: 'feedbackDelay', name: 'Feedback delay' },
  { id: 'distortion', name: 'Distortion' },
  { id: 'freeverb', name: 'Freeverb' },
  { id: 'panVol', name: 'Volume/Pan' },
];

export const instruments = [
  { id: 'AMSynth', name: 'AM synth' },
  { id: 'duoSynth', name: 'Duo synth' },
  { id: 'FMSynth', name: 'FM synth' },
  { id: 'membraneSynth', name: 'Membrane synth' },
  { id: 'monoSynth', name: 'Mono synth' },
  { id: 'polySynth', name: 'Poly synth' },
  { id: 'sampler', name: 'Sampler' },
  { id: 'synth', name: 'Synth' },
];

const config = {
  effects,
  instruments,
};

export default config;
