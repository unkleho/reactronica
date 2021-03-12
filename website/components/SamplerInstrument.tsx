import { Instrument } from 'reactronica';

const SamplerInstrument = ({ notes }) => {
  return (
    <Instrument
      type="synth"
      notes={notes}
      samples={{
        C3: '/audio/DBC_70_lofi_melodic_kalimba_action_Cm.wav',
        D3: '/audio/DECAP_140_drum_loop_baptized_bouncy_rimshot.wav',
        E3: '/audio/OS_NC_140_Cm_Octagon_Guitar.wav',
        // C3: '/audio/ukulele/Fluke_Uke_060.wav',
        // D3: '/audio/ukulele/Fluke_Uke_062.wav',
      }}
      // options={{
      //   release: 3,
      // }}
    />
  );
};

export default SamplerInstrument;
