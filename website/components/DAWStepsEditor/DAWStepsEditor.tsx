import React from 'react';
import { StepNoteType } from 'reactronica';

import { midiNotes } from '../../configs/midiConfig';

import css from './DAWStepsEditor.scss';

type Props = {
  clipId?: string;
  clipName?: string;
  currentStepIndex?: number;
  stepIndexOffset?: number;
  defaultSteps: StepNoteType[][];
  subdivision?: number;
  startNote?: string;
  endNote?: string;
  disableScrollIntoView?: boolean;
  className?: string;
  onStepEditorClick?: (
    steps: StepNoteType[][],
    stepNote: StepNoteType,
    index: number,
  ) => void;
  onKeyboardDown?: Function;
  onKeyboardUp?: Function;
};

const DAWStepsEditor: React.FC<Props> = ({
  clipId,
  clipName,
  currentStepIndex,
  stepIndexOffset = 0,
  defaultSteps = [],
  subdivision = 8,
  startNote = 'C2',
  endNote = 'B4',
  disableScrollIntoView = false,
  className,
  onStepEditorClick,
  onKeyboardDown,
  onKeyboardUp,
}) => {
  const [steps, setSteps] = React.useState(defaultSteps);

  // console.log(currentStepIndex, clipId);

  // --------------------------------------------------------------------------
  // Set up refs for keyboard notes
  // Lets us get and set scroll position of stepsRef
  // --------------------------------------------------------------------------

  const keysRef = React.useRef([]);
  const stepsRef = React.useRef(null);
  const startNoteIndex = midiNotes.indexOf(startNote);
  const endNoteIndex = midiNotes.indexOf(endNote);
  const notes = midiNotes.slice(startNoteIndex, endNoteIndex + 1);

  React.useEffect(() => {
    keysRef.current = keysRef.current.slice(0, notes.length);
  }, [notes]);

  // --------------------------------------------------------------------------
  // Assign local steps
  // TODO: Check if steps are any different to defaultSteps
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    setSteps(defaultSteps);
  }, [JSON.stringify(defaultSteps)]);

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
        const currentIndex = notes.findIndex((note) => note === curr.name);
        const prevIndex = notes.findIndex((note) => note === prev.name);

        if (currentIndex < prevIndex) {
          return curr;
        }

        return prev;
      }

      return prev;
    }, null);

    if (highestStep) {
      const highestStepIndex = notes.findIndex(
        (note) => note === highestStep.name,
      );

      const highestKeyRef = keysRef.current[highestStepIndex];

      // console.log(highestStepIndex, highestKeyRef);

      if (highestKeyRef && disableScrollIntoView === false) {
        highestKeyRef.scrollIntoView();
        stepsRef.current.scrollTop = stepsRef.current.scrollTop - 32;
      }
    }
  }, [clipId]);

  if (steps.length === 0) {
    return null;
  }

  const handleStepClick = (note, index) => {
    // Append note to stepRow
    const stepRow = [...(steps[index] ? steps[index] : []), note];
    const shouldRemove =
      stepRow.filter((s) => s.name === note.name).length >= 2;
    const newStepRow = shouldRemove
      ? stepRow.filter((s) => s.name !== note.name)
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
      {clipName && (
        <div className={css.info}>
          <p>{clipName}</p>
        </div>
      )}

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
                    return step.name === note;
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
                      handleStepClick({ name: note, duration: 0.5 }, index);
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
