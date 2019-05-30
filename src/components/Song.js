import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import StartAudioContext from 'startaudiocontext';

import Tone from '../lib/tone';
// import { isEqual } from '../lib/utils';

export const SongContext = React.createContext();

const Song = ({
  isPlaying = false,
  tempo = 90,
  // subdivision= '4n',
  swing = 0,
  swingSubdivision = '8n',
  children,
}) => {
  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.start();

      // iOS Web Audio API requires this library.
      StartAudioContext(Tone.context);
    } else {

      Tone.Transport.stop();
    }

  }, [isPlaying]);


  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.swing = swing;
    Tone.Transport.swingSubdivision = swingSubdivision;
  }, [tempo, swing, swingSubdivision]);

  return (
    <SongContext.Provider
      value={{
        // tracks,
        instruments: [],
        // updateTracks: this.updateTracks,
        isPlaying,
      }}
    >
      {children}
    </SongContext.Provider>
  );
}

export default Song;
