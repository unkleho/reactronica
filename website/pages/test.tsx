import React from 'react';
import { Song, Track, Instrument } from 'reactronica';
import { withApollo } from '../lib/apollo';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_SONG = gql`
  {
    songs {
      id
      clips {
        notes {
          note
        }
      }
    }
  }
`;

const HomePage = () => {
  const [notes, setNotes] = React.useState(null);

  const { loading, data } = useQuery(GET_SONG);
  console.log(loading, data);

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

export default withApollo(HomePage);
