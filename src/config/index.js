export const effects = [
  { id: 'autoFilter', name: 'Auto Filter' },
  { id: 'autoPanner', name: 'Auto Panner' },
  { id: 'autoWah', name: 'Auto Wah' },
  { id: 'bitCrusher', name: 'Bit Crusher' },
  // { id: 'chorus', name: 'Chorus' },
  { id: 'distortion', name: 'Distortion' },
  { id: 'feedbackDelay', name: 'Feedback Delay' },
  { id: 'freeverb', name: 'Freeverb' },
  { id: 'panVol', name: 'Volume/Pan' },
  // { id: 'reverb', name: 'Reverb' },
  { id: 'tremolo', name: 'Tremolo' },
];

export const instruments = [
  { id: 'amSynth', name: 'AM Synth' },
  { id: 'duoSynth', name: 'Duo Synth' },
  { id: 'fmSynth', name: 'FM Synth' },
  { id: 'membraneSynth', name: 'Membrane Synth' },
  { id: 'metalSynth', name: 'Metal Synth' },
  { id: 'monoSynth', name: 'Mono Synth' },
  // { id: 'noiseSynth', name: 'Noise Synth' }, // No sound, disabled for now
  { id: 'pluckSynth', name: 'Pluck Synth' },
  { id: 'sampler', name: 'Sampler' },
  { id: 'synth', name: 'Synth' },
];

const config = {
  effects,
  instruments,
};

export default config;
