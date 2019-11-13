import React from 'react';

import { midiNotes } from '../../constants';

import css from './DAWStepsEditor.scss';

type Props = {
  clipId: string;
  clipName: string;
  currentStepIndex: number;
  stepIndexOffset: number;
  defaultSteps: any[];
  subdivision: number;
  className: string;
  onStepEditorClick: Function;
  onKeyboardDown: Function;
  onKeyboardUp: Function;
};

const DAWStepsEditor: React.FC<Props> = ({
  clipId,
  clipName,
  currentStepIndex,
  stepIndexOffset = 0,
  defaultSteps = [],
  subdivision = 8,
  className,
  onStepEditorClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  const [steps, setSteps] = React.useState(defaultSteps);

  // --------------------------------------------------------------------------
  // Set up refs for keyboard notes
  // Lets us get and set scroll position of stepsRef
  // --------------------------------------------------------------------------

  const keysRef = React.useRef([]);
  const stepsRef = React.useRef(null);
  const notes = midiNotes.slice(24, 60);

  React.useEffect(() => {
    keysRef.current = keysRef.current.slice(0, notes.length);
  }, [notes]);

  // --------------------------------------------------------------------------
  // Assign local steps
  // TODO: Check if steps are any different to defaultSteps
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    setSteps(defaultSteps);
  }, [defaultSteps]);

  // --------------------------------------------------------------------------
  // If click on new clip, work out highest key and scroll to it
  // --------------------------------------------------------------------------

  React.useEffect(() => {
    const flattenedSteps = [].concat.apply([], defaultSteps);

    // Work out highest step for scrollIntoView
    const highestStep = flattenedSteps.reduce((prev, curr) => {
      if (curr) {
        if (prev === null) {
          return curr;
        }

        // Find indexes and compare between previous highest and current
        const currentIndex = notes.findIndex((note) => note === curr.note);
        const prevIndex = notes.findIndex((note) => note === prev.note);

        if (currentIndex < prevIndex) {
          return curr;
        }

        return prev;
      }

      return prev;
    }, null);

    const highestStepIndex = notes.findIndex(
      (note) => note === highestStep.note,
    );

    const highestKeyRef = keysRef.current[highestStepIndex];

    // console.log(highestStepIndex, highestKeyRef);

    if (highestKeyRef) {
      highestKeyRef.scrollIntoView();
      stepsRef.current.scrollTop = stepsRef.current.scrollTop - 32;
    }
  }, [clipId]);

  if (steps.length === 0) {
    return null;
  }

  const handleStepClick = (note, index) => {
    // Append note to stepRow
    const stepRow = [...(steps[index] ? steps[index] : []), note];
    const shouldRemove =
      stepRow.filter((s) => s.note === note.note).length >= 2;
    const newStepRow = shouldRemove
      ? stepRow.filter((s) => s.note !== note.note)
      : stepRow;

    const newSteps = [...steps];
    newSteps[index] = newStepRow;

    setSteps(newSteps);

    if (typeof onStepEditorClick === 'function') {
      return onStepEditorClick(newSteps, note, index);
    }
  };

  const emptyArray = [...new Array(1 + subdivision)];

  return (
    <div className={[css.stepsEditor, className || ''].join(' ')}>
      <div className={css.info}>
        <p>{clipName}</p>
      </div>

      <div className={css.steps} ref={stepsRef}>
        <div className={[css.row, css.header].join(' ')}>
          {emptyArray.map((_, i) => {
            return (
              <div
                className={[
                  css.step,
                  currentStepIndex + 1 === i + stepIndexOffset
                    ? css.stepIsCurrent
                    : '',
                ].join(' ')}
                key={`header-${i}`}
                data-testid={`header`}
              >
                {i !== 0 && i + stepIndexOffset}
              </div>
            );
          })}
        </div>

        {notes.map((note, rowIndex) => {
          const isAccidental = note.includes('#');

          return (
            <div
              className={[
                css.row,
                isAccidental ? css.rowIsAccidental : '',
              ].join(' ')}
              key={note}
            >
              {emptyArray.map((_, columnIndex) => {
                const index = columnIndex - 1;

                const isCurrent =
                  steps[index] &&
                  steps[index].findIndex((step) => {
                    return step.note === note;
                  }) >= 0;

                const dataTestId = `step-button-${columnIndex - 1}-${rowIndex}${
                  isCurrent ? '-current' : ''
                }`;

                // For the first column, show playable keyboard
                if (columnIndex === 0) {
                  return (
                    <button
                      className={[css.step, css.stepKey].join(' ')}
                      onMouseDown={() => {
                        if (typeof onKeyboardDown === 'function') {
                          onKeyboardDown(note);
                        }
                      }}
                      onMouseUp={() => {
                        if (typeof onKeyboardUp === 'function') {
                          onKeyboardUp(note);
                        }
                      }}
                      key={columnIndex}
                      data-testid="keyboard-button"
                      ref={(el) => (keysRef.current[rowIndex] = el)}
                    >
                      {note}
                    </button>
                  );
                }

                return (
                  <button
                    className={[
                      css.step,
                      isCurrent ? css.stepIsCurrent : '',
                    ].join(' ')}
                    onClick={() => {
                      handleStepClick({ note, duration: 0.5 }, index);
                    }}
                    key={columnIndex}
                    data-testid={dataTestId}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DAWStepsEditor;
