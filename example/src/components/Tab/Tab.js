import React from 'react';

import {
  gridLinesToTab,
  getStringNote,
  noteToFret,
  fretToNote,
} from '../../lib/tabUtils';
import { instrumentConfig } from '../../constants';

import './Tab.css';

const Tab = ({
  grid = [],
  resolution = 8,
  bars = 2,
  instrument = 'ukulele',
  className,
  onUpdateGrid,
}) => {
  const tab = gridLinesToTab(grid, resolution, bars);
  let textInputs = [];

  const handleTabChange = (event, stringIndex, step) => {
    const string = instrumentConfig[instrument].strings[stringIndex];
    let note;
    if (event.target.value) {
      note = fretToNote(parseInt(event.target.value, 10), string);
    } else {
      note = null;
    }

    // console.log(note, step, stringIndex);
    let newGrid = [...grid];

    // Filter out any noteObjects with matching step (ie overwrite)
    let newGridLine = grid[stringIndex].filter((noteObject) => {
      return noteObject.step !== step;
    });

    newGridLine.push({
      note,
      duration: 1,
      step, // TODO: step could be derived from array, but this makes things easier for now.
    });

    // Replace old gridLine
    newGrid[stringIndex] = newGridLine;

    if (typeof onUpdateGrid === 'function') {
      onUpdateGrid(newGrid);
    }
  };

  return (
    <div className={['tab', className || ''].join(' ')}>
      {tab.map((tabLine, i) => {
        const stringNote = getStringNote(instrument, i);
        textInputs[i] = [];

        return (
          <div
            className="tab__line"
            key={`string${i}`}
            data-testid={`tabLines`}
          >
            <div className="tab__line__line" />
            {/*<div>{stringNote}</div>*/}

            <div className="tab__line__steps">
              {tabLine.map((step, j) => {
                const note = step && step.note ? step.note : undefined;
                const fret = noteToFret(note, stringNote);

                return (
                  <div
                    key={`step${j}`}
                    className="tab__step"
                    data-testid={'tabSteps'}
                  >
                    <input
                      type="text"
                      value={fret === null ? '' : fret}
                      onChange={(event) => handleTabChange(event, i, j)}
                      // onKeyDown={(event) => this.handleTabKeyDown(event, i, j)}
                      // onFocus={(event) => this.handleTabFocus(event)}
                      ref={(input) => {
                        textInputs[i][j] = input;
                      }}
                      data-testid={`tabStepInput-${i}-${j}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tab;
