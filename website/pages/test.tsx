import React from 'react';
import { Song, Track, Instrument } from 'reactronica';

const HomePage = () => {
  const [notes, setNotes] = React.useState(null);

  return (
    <div>
      <h1>Reactronica</h1>

      <button
        onMouseDown={() => {
          setNotes([
            {
              name: 'C3',
            },
          ]);
        }}
        onMouseUp={() => {
          setNotes(null);
        }}
      >
        Play
      </button>
      <Song>
        <Track>
          <Instrument
            type="sampler"
            notes={notes}
            samples={{
              C3: '/static/audio/ukulele/Fluke_Uke_060.wav',
            }}
            options={{
              release: 3,
            }}
          />
        </Track>
      </Song>
    </div>
  );
};

export default HomePage;
