import React, { useState } from 'react';

import { Song, Track, Instrument } from 'reactronica';

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      <h1>Reactronica</h1>

      <button onClick={() => setIsPlaying(!isPlaying)}>Play</button>

      <Song isPlaying={isPlaying}>
        <Track
          steps={[
            {
              note: 'C3',
              // duration: 0.2,
            },
            null,
            null,
            null,
          ]}
        >
          <Instrument type={'polySynth'} />
        </Track>
      </Song>
    </div>
  );
};

export default HomePage;
