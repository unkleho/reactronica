import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

// import { SongContext } from './Song';
import { TrackContext } from './Track';
import { NoteType, InstrumentTypes } from '../types/propTypes';
// import { instruments } from '../constants';
import Tone from '../lib/tone';
import { usePrevious } from '../lib/hooks';

const InstrumentConsumer = ({
  // <Song /> Props
  // Tone,
  // <Instrument /> Props
  type = 'polySynth',
  options = {
    polyphony: 4,
    oscillator: {
      partials: [0, 2, 3, 4],
    },
    // release,
    // curve,
  },
  notes = [],
  samples,
  // <Track /> Props
  volume,
  pan,
  effectsChain,
  onInstrumentsUpdate,
}) => {
  const synth = useRef();
  const trackChannelBase = useRef(new Tone.PanVol(pan, volume));
  const prevNotes = usePrevious(notes);

  // -------------------------------------------------------------------------
  // INSTRUMENT TYPE
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (type === 'AMSynth') {
      synth.current = new Tone.AMSynth(options);
    } else if (type === 'duoSynth') {
      synth.current = new Tone.DuoSynth(options);
    } else if (type === 'FMSynth') {
      synth.current = new Tone.FMSynth(options);
    } else if (type === 'membraneSynth') {
      synth.current = new Tone.MembraneSynth(options);
    } else if (type === 'monoSynth') {
      synth.current = new Tone.MonoSynth(options);
    } else if (type === 'polySynth') {
      synth.current = new Tone.PolySynth(
        options.polyphony,
        Tone.Synth,
        options,
      );
    } else if (type === 'sampler') {
      synth.current = new Tone.Sampler(samples);

      if (options.curve) {
        synth.current.curve = options.curve;
      }

      if (options.release) {
        synth.current.release = options.release;
      }
    } else if (type === 'synth') {
      synth.current = new Tone.Synth(options);
    }

    synth.current.chain(...effectsChain, trackChannelBase.current, Tone.Master);

    // Add this Instrument to Track Context
    onInstrumentsUpdate([synth.current]);

    return function cleanup() {
      if (synth.current) {
        synth.current.dispose();
      }
    };
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
    notes &&
      notes.forEach((note) => {
        // Check if note is playing
        const isPlaying =
          prevNotes && prevNotes.filter((n) => n.name === note.name).length > 0;

        // Only play note is it isn't already playing
        if (!isPlaying) {
          synth.current.triggerAttack(note.name);
        }
      });

    // Loop through all previous notes
    prevNotes &&
      prevNotes.forEach((note) => {
        // Check if note is still playing
        const isPlaying =
          notes && notes.filter((n) => n.name === note.name).length > 0;

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

    // trackChannelBase.current = new Tone.PanVol(pan, volume);

    // NOTE: Using trackChannelBase causes effects to not turn off
    synth.current.disconnect();
    synth.current.chain(...effectsChain, trackChannelBase.current, Tone.Master);
  }, [effectsChain]);

  return null;
};

InstrumentConsumer.propTypes = {
  // <Instrument /> Props
  type: InstrumentTypes.isRequired,
  options: PropTypes.object,
  notes: PropTypes.arrayOf(NoteType), // Currently played notes.
  samples: PropTypes.object,
  trackChannel: PropTypes.object, // An instance of new this.Tone.PanVol()
  // polyphony: PropTypes.number,
  // <Track /> Props
  volume: PropTypes.number,
  pan: PropTypes.number,
  effectsChain: PropTypes.array,
  onInstrumentsUpdate: PropTypes.func,
};

const Instrument = (props) => {
  const value = useContext(TrackContext);
  // const { Tone } = useContext(SongContext);

  if (typeof window === 'undefined') {
    return null;
  }

  return <InstrumentConsumer {...value} {...props} />;
};

export default Instrument;
