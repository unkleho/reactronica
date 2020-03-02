import React from 'react';
import { Song, Track, Instrument, Effect } from 'reactronica';

const HomePage = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [low, setLow] = React.useState(0);

  return (
    <div>
      <h1>Reactronica</h1>

      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      <button
        onClick={() => {
          setLow(low === 0 ? -6 : 0);
        }}
      >
        Low {low}
      </button>

      <Song isPlaying={isPlaying}>
        <Track steps={['C3', 'G3', null, null]}>
          <Instrument type="synth" />
          <Effect type="eq3" low={low} />
        </Track>
      </Song>
    </div>
  );
};

export default HomePage;
