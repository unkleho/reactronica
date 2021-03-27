import { midiNotesLowerCase as midiNotes } from '../configs/midiConfig';
import { instrumentConfig } from '../configs';

/*
 * Tab Functions
 *
 */

// function getDuration(bpm, bars) {
//   return ((bars * 240) / bpm) * 1000;
// }

export function getStringNote(instrument, stringIndex) {
  return instrumentConfig[instrument].strings[stringIndex];
}

// export function gridToGridLines(grid, instrument) {
//   let result;
//
//
// }

// Converts gridLines (array of grids) to tab
export function gridLinesToTab(gridLines, resolution, bars) {
  return gridLines.map((gridLine) => {
    return gridLineToTabLine(gridLine, resolution, bars);
  });
}

// Converts gridLine (state) to tabLine (view)
export function gridLineToTabLine(gridLine, resolution, bars) {
  let result = Array(resolution * bars).fill(null);

  gridLine.forEach((noteObject, i) => {
    const { step, duration, name } = noteObject;

    // console.log(i, step, note);
    result[step] = {
      name,
      duration,
    };
  });

  return result;
}

/*
 * Piano Functions
 *
 */

// Converts grid (state) to piano roll (view)
export function pianoGridToRoll(grid, resolution, bars, skip = 0, limit = 12) {
  const notes = midiNotes.slice(skip, skip + limit);

  const result = notes.map((name) => {
    return Array(resolution * bars)
      .fill(null)
      .map((nothing, step) => {
        // Check if grid has note and step
        const gridCheck = grid.filter((noteObject) => {
          return noteObject.name === name && noteObject.step === step;
        });

        // Return noteObject if it exists
        return gridCheck[0] || null;
      });
  });

  return result;
}

/*
 * React Music Functions
 *
 */

// Converts grid to React Music synth steps
export function gridToSynthSteps(grid) {
  let result = [];

  grid.forEach((noteObject) => {
    result.push([noteObject.step, noteObject.duration, noteObject.name]);
  });

  return result;
}

// Converts grid to Reactronica sampler steps
export function gridToSamplerSteps(grid) {
  let result = Array(16).fill([]);

  grid.forEach((gridLine) => {
    gridLine.forEach((gridStep) => {
      const { step } = gridStep;

      result[step] = [
        ...(result[step] ? result[step] : []),
        ...(gridStep.name
          ? [
              {
                name: gridStep.name,
                duration: gridStep.duration,
              },
            ]
          : []),
      ];
    });
  });

  return result;
}

/*
 * Fret Functions
 *
 */

export function fretToNote(fret: number, string) {
  if (fret === undefined) {
    throw new Error('Fret is required');
  }

  if (!Number.isInteger(fret)) {
    throw new Error('Fret has to be an integer');
  }

  if (string === undefined) {
    throw new Error('String is required');
  }

  if (typeof string !== 'string') {
    throw new Error('String has to be a string');
  }

  const stringMidi = midiNotes.indexOf(string);

  return midiNotes[stringMidi + fret];
}

export function noteToFret(note, string) {
  if (note === undefined) {
    return null;
  }

  const stringMidi = midiNotes.indexOf(string);
  const noteMidi = midiNotes.indexOf(note);

  let fret = noteMidi - stringMidi;

  return fret >= 0 ? fret : null;
}

// Unused?
export function stepsToGrid(steps, bars, resolution) {
  let result = Array(resolution).fill(null);

  steps.forEach((stepArray, i) => {
    const [step, duration, note] = stepArray;

    result[step] = {
      note,
      duration,
    };
  });

  return result;
}
