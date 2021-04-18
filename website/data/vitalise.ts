import { getDuration } from '../lib/get-duration';
import { SampleFile, IdStepNote } from '../lib/sample-utils';
import { TimeNote } from '../types/typescript';

export interface VitaliseSong {
  id: string;
  bpm: number;
  clips: VitaliseClip[];
  tracks: VitaliseTrack[];
}

export interface VitaliseClip {
  id: string;
  steps: IdStepNote[];
  stepsNew?: IdTimeNote[];
}

export interface IdTimeNote extends Omit<TimeNote, 'name'> {
  id: string;
}

export interface VitaliseTrack {
  id: string;
  currentClipId: string;
  clipIds: string[];
  sampleFileIds: string[];
}

export const slabSong: VitaliseSong = {
  id: 'slab',
  bpm: 85,
  clips: [
    {
      id: 'clip1',
      // steps: [
      //   {
      //     start: '1.1.1',
      //     id: 'slimePiano1',
      //     duration: getDuration(4, 85),
      //   },
      // ],
      stepsNew: [
        {
          start: '1.1.1',
          id: 'slimePiano1',
          duration: getDuration(4, 85),
        },
        {
          start: '1.1.1',
          id: 'slimePiano2',
          duration: getDuration(4, 85),
        },
      ],
      steps: [
        [
          {
            id: 'slimePiano1',
            duration: getDuration(4, 85),
          },
        ],
        null,
        null,
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
        [
          {
            id: 'slimePiano1',
            duration: getDuration(4, 85),
          },
        ],
        null,
        null,
        null,
        [
          {
            id: 'slimePiano2',
            duration: getDuration(4, 85),
          },
          // {
          //   id: 'junglePad',
          //   duration: getDuration(4, 85),
          // },
        ],
        null,
        null,
        null,
      ],
    },
    {
      id: 'clip2',
      steps: [
        [
          {
            id: 'guitarChords1',
            duration: getDuration(16, 85),
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
        null,
        null,
        null,
        null,
        [
          {
            id: 'rap2',
            duration: getDuration(4, 85),
            velocity: 0.3,
          },
        ],
        null,
        null,
        null,
        [
          {
            id: 'rap4',
            duration: getDuration(4, 85),
            velocity: 0.3,
          },
        ],
        null,
        null,
        null,
      ],
    },
    {
      id: 'beat1',
      steps: [
        [
          {
            id: 'wonkyBeat1',
            duration: getDuration(16, 85),
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
        null,
        null,
        null,
        null,
      ],
    },
    {
      id: 'beat2',
      steps: [
        [
          {
            id: 'wonkyBeat2',
            duration: getDuration(16, 85),
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
        null,
        null,
        null,
        null,
      ],
    },
    {
      id: 'futureVoxLoop',
      steps: [
        [
          {
            id: 'futureVoxLoop',
            duration: getDuration(8, 85),
          },
        ],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [
          {
            id: 'futureVoxLoop',
            duration: getDuration(8, 85),
          },
        ],
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
      id: 'beat',
      currentClipId: 'beat1',
      clipIds: ['beat1', 'beat2'],
      sampleFileIds: ['wonkyBeat1', 'wonkyBeat2'],
    },
    {
      id: 'clip',
      currentClipId: 'clip1',
      clipIds: ['clip1', 'clip2'],
      // clipIds: ['clip1'],
      sampleFileIds: [
        'slimePiano1',
        'slimePiano2',
        'sirenVox',
        'guitarChords1',
        'rap1',
        'rap2',
        'rap3',
        'rap4',
        'futureVoxLoop',
        'junglePad',
        'doubleVox1',
        'doubleVox2',
        'doubleVox3',
        'doubleVox4',
        'doubleVox5',
      ],
    },
    {
      id: 'futureVoxLoop',
      currentClipId: 'futureVoxLoop',
      clipIds: ['futureVoxLoop'],
      sampleFileIds: ['futureVoxLoop'],
    },
  ],
};

// export const kalimbaSong = {

// }

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
  {
    id: 'rap1',
    file: '/audio/samples/SMT_Vox_11_Yay_85_Gsharpm_1.wav',
  },
  {
    id: 'rap2',
    file: '/audio/samples/SMT_Vox_11_Yay_85_Gsharpm_2.wav',
  },
  {
    id: 'rap3',
    file: '/audio/samples/SMT_Vox_11_Yay_85_Gsharpm_3.wav',
  },
  {
    id: 'rap4',
    file: '/audio/samples/SMT_Vox_11_Yay_85_Gsharpm_4.wav',
  },
  {
    id: 'futureVoxLoop',
    file: '/audio/samples/fv_mel_85_futur_Gsharpm.wav',
  },
  {
    id: 'junglePad',
    file:
      '/audio/samples/FALTY_DL_synth_pad_loop_euphoric_junglism_85_Gsharpmin.wav',
  },
  {
    id: 'doubleVox1',
    file:
      '/audio/samples/VPI_kit2_brake_vocal_double_dry_85_gsharp_minor_1.wav',
  },
  {
    id: 'doubleVox2',
    file:
      '/audio/samples/VPI_kit2_brake_vocal_double_dry_85_gsharp_minor_2.wav',
  },
  {
    id: 'doubleVox3',
    file:
      '/audio/samples/VPI_kit2_brake_vocal_double_dry_85_gsharp_minor_3.wav',
  },
  {
    id: 'doubleVox4',
    file:
      '/audio/samples/VPI_kit2_brake_vocal_double_dry_85_gsharp_minor_4.wav',
  },
  {
    id: 'doubleVox5',
    file:
      '/audio/samples/VPI_kit2_brake_vocal_double_dry_85_gsharp_minor_5.wav',
  },
];

export const emptySteps = [
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
  null,
  null,
  null,
  null,
  null,
];
