import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import StartAudioContext from 'startaudiocontext';

import Tone from '../lib/tone';

type SongContextProps = {
  isPlaying: boolean;
};

export const SongContext = React.createContext<SongContextProps>({
  isPlaying: false,
});

export type SongProps = {
  isPlaying?: boolean;
  bpm?: number;
  swing?: number;
  subdivision?: string;
  swingSubdivision?: string;
  volume?: number;
  isMuted?: boolean;
  children: React.ReactNode;
};

const Song: React.FC<SongProps> = ({
  isPlaying = false,
  bpm = 90,
  // subdivision = '4n',
  swing = 0,
  swingSubdivision = '8n',
  volume = 0,
  isMuted = false,
  children,
}) => {
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.swing = swing;
    Tone.Transport.swingSubdivision = swingSubdivision;
  }, [bpm, swing, swingSubdivision]);

  useEffect(() => {
    if (isPlaying) {
      // Hack to get Tone to NOT use same settings from another instance
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.swing = swing;
      Tone.Transport.swingSubdivision = swingSubdivision;

      Tone.Transport.start();

      // iOS Web Audio API requires this library.
      StartAudioContext(Tone.context);
    } else {
      Tone.Transport.stop();
    }
  }, [isPlaying]);

  useEffect(() => {
    Tone.Master.volume.value = volume;
  }, [volume]);

  useEffect(() => {
    Tone.Master.mute = isMuted;
  }, [isMuted]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <SongContext.Provider
      value={{
        isPlaying,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

Song.propTypes = {
  isPlaying: PropTypes.bool,
  bpm: PropTypes.number,
  swing: PropTypes.number,
  swingSubdivision: PropTypes.oneOf(['8n']),
  children: PropTypes.node,
};

export default Song;
