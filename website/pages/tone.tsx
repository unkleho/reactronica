import React, { useEffect, useRef } from 'react';
import Tone from 'tone';

// TODO: Check if we still need
// import './index.scss';

/**
 * Example usage of Tone JS with React
 */

const HomePage = () => {
  // Could also useState, but useRef doesn't cause re-renders when changed
  const synth = useRef();
  const reverb = useRef();
  const sequence = useRef();

  useEffect(() => {
    synth.current = new Tone.Synth();
    reverb.current = new Tone.Freeverb();
    Tone.Master.volume.value = 0;

    // @ts-ignore
    synth.current.chain(reverb.current, Tone.Master);
    sequence.current = new Tone.Sequence(
      (time, note) => {
        // @ts-ignore
        synth.current.triggerAttackRelease(note);
      },
      ['C3', 'D3', 'E3', 'F3'],
    );
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          if (synth && synth.current) {
            // @ts-ignore
            synth.current.triggerAttackRelease('C3', '8n');
          }
        }}
      >
        Play Sound
      </button>

      <button
        onClick={() => {
          if (sequence && sequence.current) {
            // @ts-ignore
            sequence.current.start();
            Tone.Transport.start();
          }
        }}
      >
        Play Sequence
      </button>

      <button
        onClick={() => {
          if (synth && synth.current) {
            // @ts-ignore
            synth.current.dispose();
          }
        }}
      >
        Remove synth
      </button>
    </div>
  );
};

export default HomePage;
