import React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import DAWStepsEditor from '../components/DAWStepsEditor';

const Page = () => {
  const [notes, setNotes] = React.useState(null);

  return (
    <div>
      <DAWStepsEditor
        defaultSteps={[
          [
            {
              name: 'C3',
            },
          ],
          null,
        ]}
      ></DAWStepsEditor>
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

export default Page;
