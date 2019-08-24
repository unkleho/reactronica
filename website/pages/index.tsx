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
          <Instrument notes={notes} />
        </Track>
      </Song>
    </div>
  );
};

export default HomePage;
