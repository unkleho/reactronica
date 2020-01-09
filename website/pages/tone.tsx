import React, { useEffect, useRef } from 'react';
import Tone from 'tone';

import './index.css';

/**
 * Example usage of Tone JS with React
 */

const HomePage = () => {
  // Could also useState, but useRef doesn't cause re-renders when changed
  const synth = useRef();
  const reverb = useRef();
  const sequence = useRef();

  useEffect(() => {
    synth.current = new Tone.Synth(null);
    reverb.current = new Tone.Freeverb(null);
    Tone.Master.volume.value = 0;

    synth.current.chain(reverb.current, Tone.Master);

    sequence.current = new Tone.Sequence(
      (time, note) => {
        synth.current.triggerAttackRelease(note);
      },
      ['C3', 'D3', 'E3', 'F3'],
    );
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          synth.current.triggerAttackRelease('C3', '8n');
        }}
      >
        Play Sound
      </button>

      <button
        onClick={() => {
          sequence.current.start();
          Tone.Transport.start();
        }}
      >
        Play Sequence
      </button>

      <button
        onClick={() => {
          synth.current.dispose();
        }}
      >
        Remove synth
      </button>
    </div>
  );
};

export default HomePage;
