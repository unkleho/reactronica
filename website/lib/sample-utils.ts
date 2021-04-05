import { StepNoteType } from 'reactronica';
import { midiNotes } from '../configs/midiConfig';

interface Sample {
  id: string;
  // note: string;
  file: string;
}

export const samples = [
  {
    id: 'beat1',
    // note: 'C3',
    file: '/audio/samples/DECAP_140_drum_loop_faded_slappy_knock_bounce.wav',
  },
  {
    id: 'beat2',
    // note: 'C#3',
    file: '/audio/samples/BTB_Drum_Loop_20_FULL_140_Cmin.wav',
  },
  {
    id: 'kalimba1',
    // note: 'D3',
    file: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_1.wav',
  },
  {
    id: 'kalimba2',
    // note: 'D#3',
    file: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_2.wav',
  },
  {
    id: 'soul1',
    // note: 'E3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_1.wav',
  },
  {
    id: 'soul2',
    // note: 'F3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_2.wav',
  },
  {
    id: 'soul3',
    // note: 'G3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_3.wav',
  },
  {
    id: 'soul4',
    // note: 'A3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_4.wav',
  },
  {
    id: 'vox1',
    // note: 'B3',
    file: '/audio/samples/CPAVX_VOX_HIT_125_09.wav',
  },
  {
    id: 'strum1',
    // note: 'C4',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_1.wav',
  },
  {
    id: 'strum2',
    // note: 'D4',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_2.wav',
  },
  {
    id: 'strum5',
    // note: 'G4',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_5.wav',
  },
  {
    id: 'guitar1',
    // note: 'C5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_1.wav',
  },
  {
    id: 'guitar2',
    // note: 'D5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_2.wav',
  },
  {
    id: 'guitar3',
    // note: 'E5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_3.wav',
  },
  {
    id: 'guitar4',
    // note: 'F5',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_4.wav',
  },
  {
    id: 'noNoVox',
    // note: 'G5',
    file: '/audio/samples/OS_SJ_SFX_Cm_Vocal_Adlib_No_No.wav',
  },
  {
    id: 'compassVox1',
    // note: 'G#5',
    file: '/audio/samples/st2_kit_compass_vocal_3_loop_70_Cm.wav',
  },
] as const;

export type SampleId = typeof samples[number]['id'];

export function getSampleNote(id) {
  const index = samples.findIndex((s) => s.id === id);

  // console.log(index, id, midiNotes[index]);

  return midiNotes[index];
  // return samples.find((s) => s.id === id).note;
}

export function transformIdStepNotes(idStepNotes): StepNoteType[][] {
  return idStepNotes.map((stepNotes) => {
    return stepNotes
      ? stepNotes.map((stepNote) => ({
          ...stepNote,
          name: getSampleNote(stepNote.id),
        }))
      : null;
  });
}

// export const sampleLibrary = {
//   DECAP_BOUNCE_BEAT:
//     '/audio/samples/DECAP_140_drum_loop_faded_slappy_knock_bounce.wav',
//   BTB_BEAT: '/audio/samples/BTB_Drum_Loop_20_FULL_140_Cmin.wav',
//   KALIMBA1: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_1.wav',
//   KALIMBA2: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_2.wav',
//   SOUL1:
//     '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_1.wav',
//   SOUL2:
//     '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_2.wav',
//   SOUL3:
//     '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_3.wav',
//   SOUL4:
//     '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_4.wav',
//   VOX1: '/audio/samples/CPAVX_VOX_HIT_125_09.wav',
//   STRUM1: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_1.wav',
//   STRUM2: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_2.wav',
//   STRUM5: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_5.wav',
//   GUITAR1: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_1.wav',
//   GUITAR2: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_2.wav',
//   GUITAR3: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_3.wav',
//   GUITAR4: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_4.wav',
//   NOVOX: '/audio/samples/OS_SJ_SFX_Cm_Vocal_Adlib_No_No.wav',
//   COMPASS_VOX: '/audio/samples/st2_kit_compass_vocal_3_loop_70_Cm.wav',
// };

// export type SampleId = keyof typeof sampleLibrary;
