import React, { Component, PropTypes } from 'react';
// import { VelocityComponent } from 'velocity-react';

import './Tab.css';
// import TabString from '../TabString';
import { gridLinesToTab, noteToFret, fretToNote } from '../selectors';
import { instrumentConfig } from '../constants';
import { getDuration, getStringNote } from '../utils';

class Tab extends Component {
  static defaultProps = {
    grid: PropTypes.array,
    bars: PropTypes.number,
    tempo: PropTypes.number,
    resolution: PropTypes.resolution,
    instrument: PropTypes.string,
    isPlaying: PropTypes.bool,
    onUpdateGrid: PropTypes.func,
    onKeyDown: PropTypes.func,
  };

  textInputs = [];

  constructor() {
    super();

    this.state = {
      clicked: false,
    };
  }

  handleTabChange = (event, stringIndex, step) => {
    const string = instrumentConfig[this.props.instrument].strings[stringIndex];
    let note;
    if (event.target.value) {
      note = fretToNote(parseInt(event.target.value, 10), string);
    } else {
      note = null;
    }

    // console.log(note, step, stringIndex);
    let newGrid = [...this.props.grid];

    // Filter out any noteObjects with matching step (ie overwrite)
    let newGridLine = this.props.grid[stringIndex].filter((noteObject) => {
      return noteObject.step !== step;
    });

    newGridLine.push({
      note,
      duration: 1,
      step, // TODO: step could be derived from array, but this makes things easier for now.
    });

    // Replace old gridLine
    newGrid[stringIndex] = newGridLine;

    this.props.onUpdateGrid(newGrid);
  };

  handleTabKeyDown = (event, line, step) => {
    const keyCode = event.keyCode;
    const numberOfStrings = 4;
    const numberOfSteps = this.props.resolution * this.props.bars;
    let newLine, newStep, newTextInput;

    if (keyCode === 40) {
      // Down
      if (line !== numberOfStrings - 1 || step < numberOfSteps - 1) {
        // Catch end of inputs
        newLine = (line + 1) % numberOfStrings;
        newStep = line + 1 >= numberOfStrings ? step + 1 : step;

        newTextInput = this.textInputs[newLine][newStep];
        newTextInput.focus();
        event.preventDefault();
        newTextInput.select();
      }
    } else if (keyCode === 38) {
      // Up
      if (line - 1 >= 0 || step !== 0) {
        // Catch beginning of inputs
        newLine =
          line - 1 < 0 ? numberOfStrings - 1 : (line - 1) % numberOfStrings;
        newStep = line - 1 < 0 ? step - 1 : step;

        newTextInput = this.textInputs[newLine][newStep];
        newTextInput.focus();
        event.preventDefault();
        newTextInput.select();
      }
    } else if (
      keyCode === 39 &&
      event.target.selectionEnd === event.target.value.length
    ) {
      // Right
      if (step < numberOfSteps - 1 || line !== numberOfStrings - 1) {
        newLine = step + 1 >= numberOfSteps ? line + 1 : line;
        newStep = (step + 1) % numberOfSteps;
        newTextInput = this.textInputs[newLine][newStep];
        newTextInput.focus();
        event.preventDefault();
        newTextInput.select();
      }
    } else if (keyCode === 37 && event.target.selectionStart === 0) {
      // Left
      if (step - 1 >= 0 || line !== 0) {
        newLine = step - 1 < 0 ? line - 1 : line;
        newStep = step - 1 < 0 ? numberOfSteps - 1 : (step - 1) % numberOfSteps;
        newTextInput = this.textInputs[newLine][newStep];
        newTextInput.focus();
        event.preventDefault();
        newTextInput.select();
      }
    }
  };

  handleTabFocus = (event) => {
    // Only working when tabbed or using mouse
    event.target.select();
  };

  componentDidMount() {
    this.textInputs[0][0].focus();
  }

  render() {
    let tab = gridLinesToTab(
      this.props.grid,
      this.props.resolution,
      this.props.bars,
    );

    return (
      <div className="tab">
        {/* <VelocityComponent
          animation={{
            left: this.props.isPlaying ? "100%" : 0,
          }}
          duration={this.props.isPlaying ? getDuration(this.props.tempo, this.props.bars) : 0}
          loop={this.props.isPlaying && true}
          easing="linear"
        >
          <div className="playhead"></div>
        </VelocityComponent> */}

        {tab.map((tabLine, i) => {
          const stringNote = getStringNote(this.props.instrument, i);
          this.textInputs[i] = [];

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
                        onKeyDown={(event) =>
                          this.handleTabKeyDown(event, i, j)
                        }
                        onFocus={(event) => this.handleTabFocus(event)}
                        ref={(input) => {
                          this.textInputs[i][j] = input;
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
  }
}

export default Tab;
