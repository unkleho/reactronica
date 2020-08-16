import teoria from 'teoria';

export default {
	scale: (tonic, scaleType) => {
		return teoria
			.note(tonic.toLowerCase())
			.scale(scaleType)
			.notes()
			.map((note) => buildNoteTypeFromTeoria(note));
	},
	chord: (rootName, chordType) => {
		return teoria
			.note(rootName.toLowerCase())
			.chord(chordType)
			.notes()
			.map((note) => buildNoteTypeFromTeoria(note));
	},
	note: (name) => {
		return teoria.note(name);
	},
};

export const buildNoteType = (noteName) => {
	return buildNoteTypeFromTeoria(teoria.note(noteName));
};

export const buildNoteTypeFromTeoria = (teoriaNote) => {
	const noteName = teoriaNote.name().toUpperCase() + teoriaNote.accidental();

	return {
		name: teoriaNote.scientific(),
		pitch: noteName,
		octave: teoriaNote.octave(),
		accidental: teoriaNote.accidental(),
		midi: teoriaNote.midi(),
	};
};

// Returns a chord that fits in the chosen key.
export const getChordTypeInScale = (tonic, scaleType, root, chordClass) => {
	// Work out scale degree
	const scale = teoria.note(tonic).scale(scaleType);
	const scaleDegree = teoria
		.note(getNoteFromScale(root, scaleType))
		.scaleDegree(scale);

	return progressionTable[chordClass][scaleType][scaleDegree - 1];
};

export const getChordsInProgression = (
	tonic,
	scaleType,
	chordClass,
	octave = 3,
) => {
	const scale = teoria.note(`${tonic}${octave}`).scale(scaleType);

	const chords = scale.notes().map((note, i) => {
		return note.chord(progressionTable[chordClass][scaleType][i]);
	});

	return chords.map((chord, i) => {
		const quality = chord.quality();

		// console.log(chord);
		// console.log(chord.root);
		// console.log(chord.simple());

		return {
			name: chord.name, // eg. CM, CMaj7
			roman: romanTable[quality][i],
			quality,
			chordType: chord.symbol,
			root: buildNoteTypeFromTeoria(chord.root),
			notes: chord.notes().map((note) => buildNoteTypeFromTeoria(note)),
		};
	});
};

export const progressionTable = {
	triad: {
		major: ['M', 'm', 'm', 'M', 'M', 'm', 'o'],
		minor: ['m', 'o', 'M', 'm', 'm', 'M', 'M'],
	},
	seventh: {
		major: ['Maj7', 'm7', 'm7', 'Maj7', '7', 'm7', 'ø7'],
		minor: ['m7', 'ø7', 'Maj7', 'm7', 'dom7', 'Maj7', 'dom7'],
	},
};

export const romanTable = {
	major: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
	minor: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'],
	diminished: ['i°', 'ii°', 'iii°', 'iv°', 'v°', 'vi°', 'vii°'],
	dominant: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
	'half-diminished': ['i⦰', 'ii⦰', 'iii⦰', 'iv⦰', 'v⦰', 'vi⦰', 'vii⦰'],
};

// Switch between # and b depending on scale.
const getNoteFromScale = (note, scaleType) => {
	if (scaleType === 'minor') {
		if (note === 'C#') {
			return 'Db';
		} else if (note === 'D#') {
			return 'Eb';
		} else if (note === 'F#') {
			return 'Gb';
		} else if (note === 'G#') {
			return 'Ab';
		} else if (note === 'A#') {
			return 'Bb';
		}

		return note;
	}

	return note;
};

// Map chord slugs to nice names
export const chordMap = {
	M: {
		name: 'Major',
		description: 'Happy and simple',
	},
	m: {
		name: 'Minor',
		description: 'Sad or serious',
	},
	Maj7: {
		name: 'Major 7th',
		description: 'Thoughtful and soft',
	},
	m7: {
		name: 'Minor 7th',
		description: 'Moody or contemplative',
	},
	7: {
		name: 'Dominant 7th',
		description: 'Strong, powerful and adventurous',
	},
	M6: {
		name: 'Major 6th',
		description: 'Fun and playful',
	},
	m6: {
		name: 'Minor 6th',
		description: 'Dark and mysterious',
	},
	6: {
		name: 'Dominant 6th',
	},
	Msus4: {
		name: 'Sus 4th',
		description: 'Majestic and proud',
	},
	M9: {
		name: 'Major 9th',
		description: 'Energetic and full of life',
	},
	m9: {
		name: 'Minor 9th',
	},
	9: {
		name: 'Dominant 9th',
	},
	o: {
		name: 'Diminished',
		description: 'Dark and edgy',
	},
	ø7: {
		name: 'Half-diminished 7th',
		description: 'Darker and edgier',
	},
};
