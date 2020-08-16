import { Component } from 'react';
// import PropTypes from 'prop-types';
import teoria from 'teoria';

import css from './Keyboard.scss';
// import { NoteType } from '../../types/propTypes';
import { buildNoteTypeFromTeoria } from '../../lib/music-tools/music';

class Keyboard extends Component {
  // static propTypes = {
  //   notes: PropTypes.arrayOf(NoteType), // Highlighted notes
  //   activeNotes: PropTypes.arrayOf(NoteType), // Currently played notes
  //   selectedNotes: PropTypes.arrayOf(NoteType), // Eg. Chords in a scale
  //   tonic: PropTypes.string,
  //   rootNoteName: PropTypes.string,
  //   startNoteName: PropTypes.string,
  //   totalNotes: PropTypes.number,
  //   onNoteDown: PropTypes.func,
  //   onNoteUp: PropTypes.func,
  //   canNotesWrap: PropTypes.bool,
  // };

  handleNoteDown(note) {
    if (typeof this.props.onNoteDown === 'function') {
      this.props.onNoteDown(note);
    }
  }

  handleNoteUp(note) {
    if (typeof this.props.onNoteUp === 'function') {
      this.props.onNoteUp(note);
    }
  }

  checkInArray = (array, item, totalNotes) => {
    if (array.length > 0) {
      return (
        array.filter((a) => {
          const isMatch = a.midi === item.midi;

          if (this.props.canNotesWrap) {
            return isMatch || a.midi - totalNotes === item.midi;
          }
        }).length > 0
      );
    }

    return false;
  };

  render() {
    const {
      notes = [],
      activeNotes = [],
      selectedNotes = [],
      tonic,
      rootNoteName = 'C3',
      startNoteName = 'C3',
      totalNotes = 12,
    } = this.props;

    // Work out total notes by converting start and end notes to MIDI
    const startMidi = teoria.note(startNoteName).midi();

    // Build keyboardNotes by converting back from MIDI to notation and
    // returning an array of Note objects.
    const keyboardNotes = [...Array(totalNotes)].map((empty, i) => {
      const note = teoria.note.fromMIDI(startMidi + i);

      return buildNoteTypeFromTeoria(note);
    });

    // Work out width of white keys
    const totalWhiteKeys = keyboardNotes.filter((keyboardNote) => {
      return !keyboardNote.accidental;
    }).length;

    const totalBlackKeys = keyboardNotes.filter((keyboardNote) => {
      return keyboardNote.accidental;
    }).length;

    // console.log(totalWhiteKeys, totalBlackKeys, totalNotes);
    //
    return (
      <div className={css.keyboard}>
        {keyboardNotes.map((note) => {
          // Highlight matching notes (Chords)
          const isHighlighted = this.checkInArray(notes, note, totalNotes);

          // Check if current note is in activeNotes array
          const isActive = this.checkInArray(activeNotes, note, totalNotes);

          // Check if current note is selected (Scales)
          const isSelected = this.checkInArray(selectedNotes, note, totalNotes);

          // Add octave indicator for out of bounds notes
          const isWrappedNote =
            activeNotes.filter((activeNote) => {
              return activeNote.midi - totalNotes === note.midi;
            }).length > 0 ||
            notes.filter((n) => {
              return n.midi - totalNotes === note.midi;
            }).length > 0;

          const isRoot =
            note.name === rootNoteName ||
            note.pitch === rootNoteName ||
            note.pitch === accidentalsTable[rootNoteName] ||
            note.pitch === accidentalsTable[rootNoteName.slice(0, -1)];
          // This is a bit dodgey, but need to enforce octave in rootNoteName maybe? Otherwise we need to check both eg. C#, C#3

          // console.log(rootNoteName);
          const width = `${(note.accidental
            ? (1 / totalBlackKeys) * 0.55
            : 1 / totalWhiteKeys) * 100}`;

          return (
            <div
              className={`${css['keyboard__note']}
              ${isActive ? css['keyboard__note--active'] : ''}
              ${isSelected ? css['keyboard__note--selected'] : ''}
              ${note.accidental ? css['keyboard__note--black-key'] : ''}
              ${isHighlighted ? css['keyboard__note--highlight'] : ''}
              ${isRoot ? css['keyboard__note--root'] : ''}
              ${
                note.pitch === tonic || note.pitch === accidentalsTable[tonic]
                  ? css['keyboard__note--tonic']
                  : ''
              }
            `}
              style={{
                width: `${width}%`,
                margin: note.accidental ? `0 -${width / 2}%` : '0',
              }}
              onTouchStart={() => this.handleNoteDown(note)}
              onTouchEnd={() => this.handleNoteUp(note)}
              onMouseDown={() => this.handleNoteDown(note)}
              onMouseUp={() => this.handleNoteUp(note)}
              key={`keyboard__note-${note.name}`}
            >
              {isWrappedNote && (
                <span className={css['keyboard__note__wrapped']}>+</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

// Bloody hell, there are two ways to describe black keys!
const accidentalsTable = {
  'C#': 'Db',
  Db: 'C#',
  'D#': 'Eb',
  Eb: 'D#',
  'F#': 'Gb',
  Gb: 'F#',
  'G#': 'Ab',
  Ab: 'G#',
  'A#': 'Bb',
  Bb: 'A#',
};

export default Keyboard;
