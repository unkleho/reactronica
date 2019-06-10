import React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import Tab from '../Tab';
import { defaultUkeGrid } from '../../constants';
import { gridToSamplerSteps } from '../../lib/tabUtils';

const TabExample = () => {
  const [grid, setGrid] = React.useState(defaultUkeGrid);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(null);

  const steps = gridToSamplerSteps(grid);

  return (
    <div>
      <Tab
        grid={grid}
        currentIndex={currentIndex}
        onUpdateGrid={(grid) => {
          setGrid(grid);
        }}
      />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      {/* ----------------------------------------------------------------- */}
      {/* AUDIO */}
      {/* ----------------------------------------------------------------- */}

      <Song isPlaying={isPlaying} tempo={90}>
        <Track
          steps={steps}
          // steps={[['C4', 'G4'], null, null, null]}
          subdivision={'8n'}
          onStepPlay={(_, i) => {
            setCurrentIndex(i);
          }}
        >
          <Instrument
            type="sampler"
            samples={{
              C4: '/audio/ukulele/Fluke_Uke_060.wav',
              'C#4': '/audio/ukulele/Fluke_Uke_061.wav',
              D4: '/audio/ukulele/Fluke_Uke_062.wav',
              'D#4': '/audio/ukulele/Fluke_Uke_063.wav',
              E4: '/audio/ukulele/Fluke_Uke_064.wav',
              F4: '/audio/ukulele/Fluke_Uke_065.wav',
              'F#4': '/audio/ukulele/Fluke_Uke_066.wav',
              G4: '/audio/ukulele/Fluke_Uke_067.wav',
              'G#4': '/audio/ukulele/Fluke_Uke_068.wav',
              A4: '/audio/ukulele/Fluke_Uke_069.wav',
              'A#4': '/audio/ukulele/Fluke_Uke_070.wav',
              B4: '/audio/ukulele/Fluke_Uke_071.wav',
              C5: '/audio/ukulele/Fluke_Uke_072.wav',
              'C#5': '/audio/ukulele/Fluke_Uke_073.wav',
              D5: '/audio/ukulele/Fluke_Uke_074.wav',
              'D#5': '/audio/ukulele/Fluke_Uke_075.wav',
              E5: '/audio/ukulele/Fluke_Uke_076.wav',
              F5: '/audio/ukulele/Fluke_Uke_077.wav',
              'F#5': '/audio/ukulele/Fluke_Uke_078.wav',
              G5: '/audio/ukulele/Fluke_Uke_079.wav',
              'G#5': '/audio/ukulele/Fluke_Uke_080.wav',
              A5: '/audio/ukulele/Fluke_Uke_081.wav',
              'A#5': '/audio/ukulele/Fluke_Uke_082.wav',
              B5: '/audio/ukulele/Fluke_Uke_083.wav',
              C6: '/audio/ukulele/Fluke_Uke_084.wav',
            }}
          />
        </Track>
      </Song>
    </div>
  );
};

export default TabExample;
