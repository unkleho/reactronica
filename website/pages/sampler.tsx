import React from 'react';
import { Song, Track, Instrument } from 'reactronica';

const Page = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [samples, setSetSamples] = React.useState();
  const [samplesStatus, setSetSamplesStatus] = React.useState('idle');
  const [notes, setNotes] = React.useState(null);
  const [steps] = React.useState([
    { name: 'C3' },
    { name: 'C3' },
    { name: 'C3' },
    { name: 'C3' },
    { name: 'C3' },
    { name: 'C3' },
    { name: 'C3' },
    { name: 'C3' },
  ]);

  return (
    <div>
      <button
        onMouseDown={() => {
          setNotes([
            {
              name: 'C3',
              duration: 1,
            },
          ]);
        }}
        onMouseUp={() => {
          // setNotes(null);
        }}
      >
        Play Note
      </button>

      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      {/* Test samples loaded callback after mount */}
      <button
        onClick={() => {
          setSetSamplesStatus('loading');
          setSetSamples({
            C3: '/audio/ukulele/Fluke_Uke_060.wav',
            D3: '/audio/ukulele/Fluke_Uke_062.wav',
          });
        }}
      >
        Load samples: {samplesStatus}
      </button>

      <Song isPlaying={isPlaying}>
        <Track steps={steps}>
          <Instrument
            type="sampler"
            notes={notes}
            samples={samples}
            onLoad={(event) => {
              console.log(event);

              setSetSamplesStatus('loaded');
            }}
            // options={{
            //   release: 3,
            // }}
          />
        </Track>
      </Song>
    </div>
  );
};

export default Page;
