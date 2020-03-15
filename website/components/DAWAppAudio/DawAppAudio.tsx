import React from 'react';
import { Song, Track, Instrument, Effect } from 'reactronica';

import { buildSteps } from '../../lib/stepUtils';
import { StepIndexContext } from '../DAWApp/DAWApp';

const DawAppAudio = ({ isPlaying, bpm, tracks, clips }) => {
  const { setCurrentStepIndex } = React.useContext(StepIndexContext);

  return (
    <Song
      isPlaying={isPlaying}
      bpm={bpm}
      // swing={1}
      // swingSubdivision={'16n'}
    >
      {tracks.map((track, trackIndex) => {
        const trackClips = track.clips.map((trackClip) => {
          return clips.find((clip) => {
            return clip.id === trackClip.id;
          });
        });

        const trackSteps = trackClips.reduce((prev, curr) => {
          return [...prev, ...buildSteps(curr)];
        }, []);

        return (
          <Track
            steps={trackSteps}
            volume={(parseInt(track.volume, 10) / 100) * 32 - 32}
            pan={(parseInt(track.pan, 10) / 100) * 2 - 1}
            mute={track.mute}
            solo={track.solo}
            subdivision={'16n'}
            effects={track.effects.map((effect, i) => {
              return (
                <Effect
                  type={effect.type}
                  key={`${effect.id}-${i}-melody`}
                  id={`${effect.id}-${i}-melody`}
                  delayTime={effect.delayTime || '16n'}
                  feedback={effect.feedback || 0.6}
                  wet={0.5}
                />
              );
            })}
            onStepPlay={(_, index) => {
              // Improve performance by only dispatching callback for one track
              if (trackIndex === 0) {
                setCurrentStepIndex(index);

                // dispatch({
                //   type: types.SET_CURRENT_STEP_INDEX,
                //   currentStepIndex: index,
                // });
              }
            }}
            key={track.id}
          >
            {track.instrumentType === 'sampler' ? (
              <Instrument
                type={track.instrumentType}
                samples={{
                  // C3: `/audio/drums/kick15.wav`,
                  A2: `/audio/drums/TLYKST_808_nice_A.wav`,
                  // C3: `/audio/drums/st2_kick_one_shot_low_punch_basic.wav`,
                  C3: `/audio/drums/019_Kick_A_-_MELODICDEEPHOUSE_Zenhiser.wav`,
                  // D3: `/audio/drums/snare-bottom-buttend15.wav`,
                  // D3: `/audio/drums/snare-top-off25.wav`,
                  // D3: `/audio/drums/OS_TD_Trappa_Snare.wav`,
                  D3: '/audio/drums/SOUTHSIDE_snare_og_punch.wav',
                  // D3:
                  //   '/audio/drums/ABJP_Trap_Snare_18_nice_roll_snare.wav',
                  // E3: `/audio/drums/chh2.wav`,
                  // E3: `/audio/drums/OS_TD_Randy_Hat.wav`,
                  E3: `/audio/drums/NOL_hihat_freeze.wav`,
                  // F3: `/audio/drums/snare-top-off17.wav`,
                  F3: `/audio/drums/ad3_playground_concrete_foot_stomp_02_r01.wav`,
                  G3: `/audio/drums/NOL_hihat_roll_lipstick.wav`,
                  A3: `/audio/vocals/NOL_143_vocal_chop_jacuzzi_Am.wav`,
                  B3: `/audio/vocals/fe3_kit2_futuro_intro_vocal_fx_loop_150_Am_1bar.wav`,
                  C4: `/audio/vocals/fe3_kit2_futuro_intro_vocal_fx_loop_150_Am_end.wav`,
                }}
                notes={track.notes}
              />
            ) : (
              <Instrument
                type={track.instrumentType}
                notes={track.notes}
                polyphony={track.instrumentPolyphony}
                oscillator={{ type: track.instrumentOscillatorType }}
              />
            )}
          </Track>
        );
      })}
    </Song>
  );
};

export default DawAppAudio;
