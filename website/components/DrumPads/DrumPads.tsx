import * as React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import css from './DrumPads.css';

type Props = {
  className?: string;
};

const DrumPads: React.FunctionComponent<Props> = ({ className }) => {
  const [notes, setNotes] = React.useState(null);

  return (
    <div className={[css.drumPads, className || ''].join(' ')}>
      {[
        { note: 'C3', name: 'Kick' },
        { note: 'D3', name: 'Snare' },
        { note: 'E3', name: 'Hat' },
      ].map((pad) => (
        <button
          onMouseDown={() =>
            setNotes([
              {
                name: pad.note,
              },
            ])
          }
          onMouseUp={() => {
            setNotes(null);
          }}
          className={css.pad}
          key={pad.note}
        >
          {pad.name}
        </button>
      ))}
      <Song>
        <Track>
          <Instrument
            type="sampler"
            notes={notes}
            samples={{
              C3: '/static/audio/drums/kick15.wav',
              D3: '/static/audio/drums/snare-bottom-buttend15.wav',
              E3: '/static/audio/drums/chh12.wav',
            }}
          />
        </Track>
      </Song>
    </div>
  );
};

export default DrumPads;
