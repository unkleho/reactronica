export const effects = [
  { id: 'autoFilter', name: 'Auto filter' },
  { id: 'autoPanner', name: 'Auto panner' },
  { id: 'autoWah', name: 'Auto wah' },
  { id: 'bitCrusher', name: 'Bit crusher' },
  // { id: 'chorus', name: 'Chorus' },
  { id: 'distortion', name: 'Distortion' },
  { id: 'feedbackDelay', name: 'Feedback delay' },
  { id: 'freeverb', name: 'Freeverb' },
  { id: 'panVol', name: 'Volume/Pan' },
  // { id: 'reverb', name: 'Reverb' },
  { id: 'tremolo', name: 'Tremolo' },
];

export const instruments = [
  { id: 'AMSynth', name: 'AM synth' },
  { id: 'duoSynth', name: 'Duo synth' },
  { id: 'FMSynth', name: 'FM synth' },
  { id: 'membraneSynth', name: 'Membrane synth' },
  { id: 'monoSynth', name: 'Mono synth' },
  // { id: 'polySynth', name: 'Poly synth' },
  { id: 'sampler', name: 'Sampler' },
  { id: 'synth', name: 'Synth' },
];

const config = {
  effects,
  instruments,
};

export default config;
