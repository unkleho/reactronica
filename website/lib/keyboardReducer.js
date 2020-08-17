import { getKeyboardNotes } from '../lib/keyboard';
import music, { buildNoteType } from '../lib/music';

export default (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_SCALE':
			return {
				...state,
				tonic: action.tonic,
				scaleType: action.scaleType,
				// keyboardNotes: [],
				selectedNotes: music.scale(action.tonic, action.scaleType),
			};

		case 'UPDATE_CHORD':
			return {
				...state,
				rootName: action.rootName,
				chordType: action.chordType,
				keyboardNotes: music.chord(action.rootName, action.chordType),
				// selectedNotes: [],
			};

		case 'UPDATE_ROLE':
			return {
				...state,
				role: action.role,
				keyboardNotes:
					action.role === 'chord'
						? getKeyboardNotes({
								tonic: state.tonic,
								scaleType: state.scaleType,
								keys: state.keys,
								role: action.role,
							})
						: [],
			};

		case 'UPDATE_ACTIVE_NOTES':
			return {
				...state,
				activeNotes: action.activeNotes,
			};

		// TODO: Consider renaming this to ADD_ACTIVE_NOTE
		case 'HIGHLIGHT_KEY':
			return {
				...state,
				activeNotes: state.activeNotes.concat(buildNoteType(action.name)),
			};

		// TODO: Consider renaming this to REMOVE_ACTIVE_NOTE
		case 'UNHIGHLIGHT_KEY':
			return {
				...state,
				activeNotes: state.activeNotes.filter((n) => n.name !== action.name),
			};

		default:
			return {
				...state,
			};
	}
};

const initialState = {
	role: 'scale',
	roles: ['scale', 'chord', 'progression'],
	isPlaying: false,
	tonic: 'C',
	scaleType: 'major',
	rootName: 'C3',
	// scaleTypes: Scale.names(),
	// Tonal JS
	// scaleTypes: [
	// 	'major',
	// 	'harmonic minor',
	// 	'melodic minor',
	// 	'diminished',
	// 	'aeolian',
	// 	'major pentatonic',
	// 	'major blues',
	// 	'minor pentatonic',
	// 	'minor blues',
	// ],
	scaleTypes: [
		'major', // 'ionian'
		'minor', // 'aeolian'
		'harmonicminor',
		'melodicminor',
		'majorpentatonic',
		'minorpentatonic',
		'blues',
		'flamenco',
	],
	chordType: 'M',
	// chordTypes: Chord.names(),
	chordTypes: [
		'M',
		'm',
		'Maj7',
		'm7',
		'7',
		'M6',
		'm6',
		'6',
		'Msus4',
		'9',
		'M9',
		'm9',
		'o',
	],
	chordClass: 'triad',
	keyboardNotes: [], // For chords
	activeNotes: [], // For currently playing notes
	selectedNotes: [], // For scale notes
	// TODO: Consider making this a constant
	keys: [
		{
			note: ['C', 'C'],
		},
		{
			note: ['C#', 'Db'],
		},
		{
			note: ['D', 'D'],
		},
		{
			note: ['D#', 'Eb'],
		},
		{
			note: ['E', 'E'],
		},
		{
			note: ['F', 'F'],
		},
		{
			note: ['F#', 'Gb'],
		},
		{
			note: ['G', 'G'],
		},
		{
			note: ['G#', 'Ab'],
		},
		{
			note: ['A', 'A'],
		},
		{
			note: ['A#', 'Bb'],
		},
		{
			note: ['B', 'Cb'],
		},
	],
};
