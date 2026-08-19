import React, { useEffect } from 'react';

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
  children?: React.ReactNode;
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
    document.body.addEventListener(
      'click',
      () => {
        // iOS Web Audio API requires a user gesture to start the context.
        Tone.start();
      },
      {
        once: true,
      },
    );
  }, []);

  useEffect(() => {
    const transport = Tone.getTransport();

    transport.bpm.value = bpm;
    transport.swing = swing;
    transport.swingSubdivision = swingSubdivision;
  }, [bpm, swing, swingSubdivision]);

  useEffect(() => {
    const transport = Tone.getTransport();

    if (isPlaying) {
      // Hack to get Tone to NOT use same settings from another instance
      transport.bpm.value = bpm;
      transport.swing = swing;
      transport.swingSubdivision = swingSubdivision;

      transport.start();
    } else {
      transport.stop();
    }
    /* eslint-disable-next-line */
  }, [isPlaying]);

  useEffect(() => {
    Tone.getDestination().volume.value = volume;
  }, [volume]);

  useEffect(() => {
    Tone.getDestination().mute = isMuted;
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

export default Song;
