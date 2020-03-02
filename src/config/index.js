export const instruments = [
  { id: 'amSynth', name: 'AM Synth', props: ['polyphony', 'oscillatorType'] },
  { id: 'duoSynth', name: 'Duo Synth', props: ['polyphony', 'oscillatorType'] },
  { id: 'fmSynth', name: 'FM Synth', props: ['polyphony', 'oscillatorType'] },
  { id: 'membraneSynth', name: 'Membrane Synth', props: [] },
  { id: 'metalSynth', name: 'Metal Synth', props: [] },
  {
    id: 'monoSynth',
    name: 'Mono Synth',
    props: ['polyphony', 'oscillatorType'],
  },
  // { id: 'noiseSynth', name: 'Noise Synth' }, // No sound, disabled for now
  { id: 'pluckSynth', name: 'Pluck Synth', props: [] },
  { id: 'sampler', name: 'Sampler', props: ['samples'] },
  { id: 'synth', name: 'Synth', props: ['polyphony', 'oscillatorType'] },
];

export const effects = [
  // --------------------------------------------------------------------------
  // Tone JS Effects
  // --------------------------------------------------------------------------
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
  // --------------------------------------------------------------------------
  // Tone JS Components
  // --------------------------------------------------------------------------
  { id: 'eq3', name: 'EQ3' },
];

const config = {
  instruments,
  effects,
};

export default config;
