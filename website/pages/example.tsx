import React, { useState } from 'react';
import { Song, Track, Instrument } from 'reactronica';

import './index.css';

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPlaying(!isPlaying)}>Play</button>

      <Song tempo={90} isPlaying={isPlaying} swing={1} swingSubdivision={'8n'}>
        <Track
          subdivision={'16n'}
          steps={[
            [
              {
                note: 'C3',
                duration: 0.5,
              },
            ],
            null,
            null,
            null,
            [
              {
                note: 'D3',
                duration: 0.5,
              },
            ],
            null,
            null,
            null,
            // [
            //   {
            //     note: 'E3',
            //     duration: 0.5,
            //   },
            // ],
            // null,
            // null,
            // null,
            // [
            //   {
            //     note: 'F3',
            //     duration: 0.5,
            //   },
            // ],
            // null,
            // null,
            // null,
          ]}
          // onStepPlay={(step) => {
          //   // console.log(step);
          // }}
        >
          <Instrument type={'polySynth'} />
        </Track>
      </Song>
    </div>
  );
};

export default HomePage;
