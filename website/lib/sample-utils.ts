import { StepNoteType } from 'reactronica';
import { midiNotes, MidiNote } from '../configs/midiConfig';

export interface SampleFile {
  id: string;
  file: string;
}

type IdStepNote = {
  id: string;
  [key: string]: any;
};

// export type SampleId = typeof samples[number]['id'];

export function getSampleNote(id: string, sampleFiles: SampleFile[]) {
  const index = sampleFiles.findIndex((s) => s.id === id);

  return midiNotes[index];
}

export function transformIdStepNotes(
  idStepNotes: IdStepNote[][],
  sampleFiles: SampleFile[],
): StepNoteType[][] {
  return idStepNotes.map((stepNotes) => {
    return stepNotes
      ? stepNotes.map((stepNote) => ({
          ...stepNote,
          name: getSampleNote(stepNote.id, sampleFiles),
        }))
      : null;
  });
}

/**
 * Build an Instrument sample object for Reactronica, mapping samples to MIDI notes
 */
export function createInstrumentSamples(
  sampleFiles: SampleFile[],
): {
  [key in MidiNote]?: string;
} {
  return sampleFiles.reduce((prev, curr) => {
    const note = getSampleNote(curr.id, sampleFiles);

    return {
      ...prev,
      [note]: curr.file,
    };
  }, {});
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
