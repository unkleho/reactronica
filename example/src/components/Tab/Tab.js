import React from 'react';

import { gridLinesToTab, getStringNote, noteToFret } from '../../lib/tabUtils';

const Tab = ({
  grid = [],
  resolution = 8,
  bars = 2,
  instrument,
  className,
}) => {
  const tab = gridLinesToTab(grid, resolution, bars);
  let textInputs = [];

  return (
    <div className={['tab', className || ''].join(' ')}>
      {tab.map((tabLine, i) => {
        const stringNote = getStringNote(instrument, i);
        textInputs[i] = [];

        return (
          <div className="tab__line" key={`string${i}`}>
            <div className="tab__line__line" />
            {/*<div>{stringNote}</div>*/}

            <div className="tab__line__steps">
              {tabLine.map((step, j) => {
                const note = step && step.note ? step.note : undefined;
                const fret = noteToFret(note, stringNote);

                return (
                  <div key={`step${j}`} className="tab__step">
                    <input
                      type="text"
                      value={fret === null ? '' : fret}
                      onChange={(event) => this.handleTabChange(event, i, j)}
                      // onKeyDown={(event) => this.handleTabKeyDown(event, i, j)}
                      // onFocus={(event) => this.handleTabFocus(event)}
                      ref={(input) => {
                        textInputs[i][j] = input;
                      }}
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
