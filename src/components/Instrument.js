import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

import { TrackContext } from './Track';
import { NoteType } from '../types/propTypes';
import { instruments } from '../constants';
import Tone from '../lib/tone';
import { usePrevious } from '../lib/hooks';

const InstrumentConsumer = ({
  // <Instrument /> Props
  type = 'polySynth',
  options = {
    polyphony: 4,
    oscillator: {
      partials: [0, 2, 3, 4],
    },
  },
  notes = [],
  samples,
  // <Track /> Props
  volume,
  pan,
  effectsChain,
  updateInstruments,
}) => {
  const synth = useRef();
  const trackChannelBase = useRef();
  const prevNotes = usePrevious(notes);

  // -------------------------------------------------------------------------
  // INSTRUMENT TYPE
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (type === 'polySynth') {
      synth.current = new Tone.PolySynth(
        options.polyphony,
        Tone.Synth,
        options,
      );
    } else if (type === 'duoSynth') {
      synth.current = new Tone.DuoSynth(options);
    } else if (type === 'sampler') {
      synth.current = new Tone.Sampler(samples);
    }

    trackChannelBase.current = new Tone.PanVol(pan, volume);
    synth.current.chain(trackChannelBase.current, Tone.Master);

    // Add this Instrument to Track Context
    updateInstruments([synth.current]);
  }, [type]);

  // -------------------------------------------------------------------------
  // VOLUME / PAN
  // -------------------------------------------------------------------------

  useEffect(() => {
    trackChannelBase.current.volume.value = volume;
  }, [volume]);

  useEffect(() => {
    trackChannelBase.current.pan.value = pan;
  }, [pan]);

  // -------------------------------------------------------------------------
  // NOTES
  // -------------------------------------------------------------------------

  useEffect(() => {
    // Loop through all current notes
    notes.forEach((note) => {
      // Check if note is playing
      const isPlaying =
        prevNotes.filter((n) => n.name === note.name).length > 0;

      // Only play note is it isn't already playing
      if (!isPlaying) {
        synth.current.triggerAttack(note.name);
      }
    });

    // Loop through all previous notes
    prevNotes &&
      prevNotes.forEach((note) => {
        // Check if note is still playing
        const isPlaying = notes.filter((n) => n.name === note.name).length > 0;

        if (!isPlaying) {
          synth.current.triggerRelease(note.name);
        }
      });
  }, [notes]);

  // -------------------------------------------------------------------------
  // EFFECTS CHAIN
  // -------------------------------------------------------------------------

  useEffect(() => {
    // console.log('<Instrument />', 'updateEffectsChain', effectsChain);

    trackChannelBase.current = new Tone.PanVol(pan, volume);

    // NOTE: Using trackChannelBase causes effects to not turn off
    synth.current.disconnect();
    synth.current.chain(...effectsChain, trackChannelBase.current, Tone.Master);
  }, [effectsChain]);

  return null;
};

InstrumentConsumer.propTypes = {
  // <Instrument /> Props
  type: PropTypes.oneOf(instruments),
  options: PropTypes.object,
  notes: PropTypes.arrayOf(NoteType), // Currently played notes.
  samples: PropTypes.object,
  trackChannel: PropTypes.object, // An instance of new this.Tone.PanVol()
  // polyphony: PropTypes.number,
  // <Track /> Props
  volume: PropTypes.number,
  pan: PropTypes.number,
  effectsChain: PropTypes.array,
  updateInstruments: PropTypes.func,
};

const Instrument = (props) => {
  const value = useContext(TrackContext);

  return <InstrumentConsumer {...value} {...props} />;
};

export default Instrument;
