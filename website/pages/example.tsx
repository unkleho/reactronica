import React, { useState } from 'react';
import { Song, Track, Instrument } from 'reactronica';
import WebMidi from 'webmidi';

// import './index.scss';

const HomePage = () => {
  const [notes, setNotes] = useState([]);

  React.useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);

        const input = WebMidi.getInputByName('Keystation Mini 32');

        if (input) {
          input.addListener('noteon', 'all', (e) => {
            setNotes([{ name: `${e.note.name}${e.note.octave}` }]);
          });

          input.addListener('noteoff', 'all', (e) => {
            setNotes([]);
          });
        }
      }
    });
  }, []);

  console.log(notes);

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPlaying(!isPlaying)}>Play</button>

      <Song bpm={90} isPlaying={isPlaying} swing={1} swingSubdivision={'8n'}>
        <Track
          subdivision={'16n'}
          steps={[
            [
              {
                name: 'C3',
                duration: 0.5,
              },
            ],
            null,
            null,
            null,
            [
              {
                name: 'D3',
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
          <Instrument type={'synth'} notes={notes} />
        </Track>
      </Song>
    </div>
  );
};

export default HomePage;
