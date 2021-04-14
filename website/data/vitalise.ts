import { getDuration } from '../lib/get-duration';
import { SampleFile } from '../lib/sample-utils';

export const slabSong = {
  id: 'slab',
  bpm: 85,
  clips: [
    {
      id: 'clip1',
      steps: [
        [
          {
            id: 'wonkyBeat1',
            duration: getDuration(16, 85),
          },
          // {
          //   id: 'guitarChords1',
          //   duration: getDuration(16, 85),
          // },
          {
            id: 'slimePiano1',
            duration: getDuration(4, 85),
          },
        ],
        null,
        [
          {
            id: 'sirenVox',
            duration: getDuration(12, 85),
          },
        ],
        null,
        [
          {
            id: 'slimePiano2',
            duration: getDuration(4, 85),
          },
        ],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    },
  ],
  tracks: [
    {
      id: 'slabTrack',
      clipId: 'clip1',
      sampleIds: [
        'wonkyBeat1',
        'wonkeyBeat2',
        'slimePiano1',
        'slimePiano2',
        'sirenVox',
        'guitarChords1',
      ],
    },
  ],
};

export const vitaliseSampleFiles: SampleFile[] = [
  {
    id: 'beat1',
    file: '/audio/samples/DECAP_140_drum_loop_faded_slappy_knock_bounce.wav',
  },
  {
    id: 'beat2',
    file: '/audio/samples/BTB_Drum_Loop_20_FULL_140_Cmin.wav',
  },
  {
    id: 'kalimba1',
    file: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_1.wav',
  },
  {
    id: 'kalimba2',
    file: '/audio/samples/DBC_70_lofi_melodic_kalimba_action_Cm_2.wav',
  },
  {
    id: 'soul1',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_1.wav',
  },
  {
    id: 'soul2',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_2.wav',
  },
  {
    id: 'soul3',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_3.wav',
  },
  {
    id: 'soul4',
    file:
      '/audio/samples/SOUNDDOCTRINE_therevival_melodic_loop_15_vocals_choir_ohs_ahs_gospel_soul_70_bpm_Cmin_4.wav',
  },
  {
    id: 'vox1',
    file: '/audio/samples/CPAVX_VOX_HIT_125_09.wav',
  },
  {
    id: 'strum1',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_1.wav',
  },
  {
    id: 'strum2',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_2.wav',
  },
  {
    id: 'strum5',
    file: '/audio/samples/SO_TR_120_combo_baglama_mey_guzel_Cm_5.wav',
  },
  {
    id: 'guitar1',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_1.wav',
  },
  {
    id: 'guitar2',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_2.wav',
  },
  {
    id: 'guitar3',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_3.wav',
  },
  {
    id: 'guitar4',
    file: '/audio/samples/OS_NC_140_Cm_Octagon_Guitar_4.wav',
  },
  {
    id: 'noNoVox',
    file: '/audio/samples/OS_SJ_SFX_Cm_Vocal_Adlib_No_No.wav',
  },
  {
    id: 'compassVox1',
    file: '/audio/samples/st2_kit_compass_vocal_3_loop_70_Cm.wav',
  },
  // Slab
  {
    id: 'wonkyBeat1',
    file: '/audio/samples/SO_NS_85_drum_loop_moriche_1.wav',
  },
  {
    id: 'wonkyBeat2',
    file: '/audio/samples/SO_NS_85_drum_loop_moriche_2.wav',
  },
  {
    id: 'slimePiano1',
    file: '/audio/samples/ODS_85_resampled_melody_loop_slime_Gsharpm_1.wav',
  },
  {
    id: 'slimePiano2',
    file: '/audio/samples/ODS_85_resampled_melody_loop_slime_Gsharpm_2.wav',
  },
  {
    id: 'slimePiano3',
    file: '/audio/samples/ODS_85_resampled_melody_loop_slime_Gsharpm_3.wav',
  },
  {
    id: 'slimePiano4',
    file: '/audio/samples/ODS_85_resampled_melody_loop_slime_Gsharpm_4.wav',
  },
  {
    id: 'guitarChords1',
    file:
      '/audio/samples/SC_IA_85_guitar_chords_lofi_saloon_high_6_8_time_Abmin_1.wav',
  },
  {
    id: 'guitarChords2',
    file:
      '/audio/samples/SC_IA_85_guitar_chords_lofi_saloon_high_6_8_time_Abmin_2.wav',
  },
  {
    id: 'sirenVox',
    file: '/audio/samples/BL_Gsharpm_85_BVs_Siren.wav',
  },
];
